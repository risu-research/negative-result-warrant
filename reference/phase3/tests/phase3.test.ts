import assert from "node:assert/strict";
import test from "node:test";
import {
  assessVerificationRequest,
  composeNegativeEvidence,
  evaluateObservation,
} from "../frozen/phase2.1/src/index.ts";
import {
  ALGOLIA_REAL_SOURCE_META_KEY,
  FIXED_MATCHING_CONTROLS,
  algoliaSourceInstance,
  authorityContextIdForCredential,
  canonicalJsonBytes,
  createAlgoliaRealSourceEvidence,
  credentialBinding,
  decodeAlgoliaRealSourceEvidence,
  executeFallbackIfNoAlgoliaMatch,
  normalizeAlgoliaHttpExchange,
  runOfficialAlgoliaMcpRoundTrip,
  type AlgoliaHttpExchangeCapture,
  type ReceiverValidatedAlgoliaRealSourceEvidence,
} from "../src/index.ts";

const applicationId = "latency";
const index = "bestbuy";
const credential = "public-test-search-key";
const query = "risu-nrw-test-token";

function bytes(value: unknown): Uint8Array {
  return new TextEncoder().encode(JSON.stringify(value));
}

function capture(input: {
  body?: unknown;
  rawBody?: Uint8Array;
  response?: unknown;
  rawResponse?: Uint8Array;
  status?: number;
  contentType?: string;
  applicationHeader?: string;
  url?: string;
  observationId?: string;
} = {}): AlgoliaHttpExchangeCapture {
  const binding = credentialBinding(credential);
  const appHeader = input.applicationHeader ?? applicationId;
  return {
    sourceInstance: algoliaSourceInstance(applicationId),
    authorityContextId: authorityContextIdForCredential(credential),
    observationId: input.observationId ?? "synthetic-http-observation",
    request: {
      method: "POST",
      url: input.url ?? `https://${applicationId}-dsn.algolia.net/1/indexes/${index}/query`,
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "x-algolia-application-id": appHeader,
        "x-algolia-api-key": `sha256:${binding.digest}`,
      },
      applicationIdHeader: appHeader,
      credentialBinding: binding,
      bodyBytes: input.rawBody ?? bytes(input.body ?? {
        query,
        ...FIXED_MATCHING_CONTROLS,
      }),
      sentAt: "2026-08-13T00:00:00.000Z",
    },
    response: {
      status: input.status ?? 200,
      finalUrl: `https://${applicationId}-dsn.algolia.net/1/indexes/${index}/query`,
      headers: { "content-type": input.contentType ?? "application/json; charset=utf-8", "x-test": "complete" },
      contentType: input.contentType ?? "application/json; charset=utf-8",
      bodyBytes: input.rawResponse ?? bytes(input.response ?? {
        nbHits: 0,
        exhaustive: { nbHits: true, rulesMatch: true },
        indexUsed: index,
        hits: [],
        preservedResponseField: { nested: true },
      }),
      receivedAt: "2026-08-13T00:00:00.010Z",
    },
  };
}

const expected = {
  applicationId,
  index,
  credentialFingerprint: credentialBinding(credential).digest,
};

test("normalization preserves every request parameter and derives path/index from URL", () => {
  const body = {
    query,
    ...FIXED_MATCHING_CONTROLS,
    analytics: false,
    optionalWords: ["alpha", "beta"],
  };
  const normalized = normalizeAlgoliaHttpExchange(capture({ body }), expected);
  assert.ok(normalized);
  assert.equal(normalized.normalizedRequest.path, `/1/indexes/${index}/query`);
  assert.equal(normalized.normalizedRequest.index, index);
  for (const [key, value] of Object.entries(body)) {
    assert.deepEqual(normalized.normalizedRequest[key], value);
  }
  assert.deepEqual(normalized.normalizedResponse.preservedResponseField, { nested: true });
  assert.notEqual(
    normalized.receipt.request.bodyBinding.digest,
    normalized.receipt.normalized.requestBinding.digest,
  );
});

test("an unexpected search parameter is preserved, never silently dropped", () => {
  const normalized = normalizeAlgoliaHttpExchange(capture({
    body: { query, ...FIXED_MATCHING_CONTROLS, unexpectedSearchParameter: { exact: [1, 2, 3] } },
  }), expected);
  assert.ok(normalized);
  assert.deepEqual(normalized.normalizedRequest.unexpectedSearchParameter, { exact: [1, 2, 3] });
});

test("body path/index conflicts fail closed", () => {
  assert.equal(normalizeAlgoliaHttpExchange(capture({
    body: { query, ...FIXED_MATCHING_CONTROLS, path: "/forged" },
  }), expected), undefined);
  assert.equal(normalizeAlgoliaHttpExchange(capture({
    body: { query, ...FIXED_MATCHING_CONTROLS, index: "forged" },
  }), expected), undefined);
});

test("application header and URL index changes fail closed", () => {
  assert.equal(normalizeAlgoliaHttpExchange(capture({ applicationHeader: "other-app" }), expected), undefined);
  assert.equal(normalizeAlgoliaHttpExchange(capture({
    url: `https://${applicationId}-dsn.algolia.net/1/indexes/other-index/query`,
  }), expected), undefined);
});

test("invalid response JSON, non-success status, and incompatible content type reject", () => {
  assert.equal(normalizeAlgoliaHttpExchange(capture({ rawResponse: new TextEncoder().encode("{") }), expected), undefined);
  assert.equal(normalizeAlgoliaHttpExchange(capture({ status: 429 }), expected), undefined);
  assert.equal(normalizeAlgoliaHttpExchange(capture({ contentType: "text/plain" }), expected), undefined);
});

test("canonical profile bytes tolerate object key order while raw bindings remain distinct", () => {
  const left = normalizeAlgoliaHttpExchange(capture({ rawBody: bytes({ query, ...FIXED_MATCHING_CONTROLS }) }), expected);
  const right = normalizeAlgoliaHttpExchange(capture({ rawBody: bytes({ enableRules: false, query, typoTolerance: false, enableABTest: false }) }), expected);
  assert.ok(left && right);
  assert.deepEqual(left.normalizedRequestBytes, right.normalizedRequestBytes);
  assert.notEqual(left.receipt.request.bodyBinding.digest, right.receipt.request.bodyBinding.digest);
  assert.deepEqual(left.normalizedResponseBytes, canonicalJsonBytes(left.normalizedResponse));
});

function evidenceFixture(): {
  rawOuter: unknown;
  validated: ReceiverValidatedAlgoliaRealSourceEvidence;
  ordinary: NonNullable<ReturnType<typeof normalizeAlgoliaHttpExchange>>;
  verification: NonNullable<ReturnType<typeof normalizeAlgoliaHttpExchange>>;
} {
  const ordinary = normalizeAlgoliaHttpExchange(capture({ observationId: "ordinary" }), expected)!;
  const verification = normalizeAlgoliaHttpExchange(capture({
    observationId: "verification",
    body: { query, ...FIXED_MATCHING_CONTROLS, getRankingInfo: true },
  }), expected)!;
  const result = evaluateObservation(verification.observation);
  assert.equal(result.verdict, "WARRANTED_ZERO");
  const comparison = assessVerificationRequest({
    profile: "algolia-search",
    originalRequest: ordinary.normalizedRequest,
    verificationRequest: verification.normalizedRequest,
    originalAuthorityContextId: ordinary.receipt.authorityContextId,
    verificationAuthorityContextId: verification.receipt.authorityContextId,
  });
  assert.equal(comparison.preservation, "PRESERVING");
  assert.equal(comparison.acquisition, "SAFE_STRENGTHENING_AVAILABLE");
  const bound = composeNegativeEvidence({
    originalObservation: ordinary.observation,
    verificationObservation: verification.observation,
    verificationResult: result,
  });
  assert.ok(bound);
  const rawOuter: unknown = JSON.parse(JSON.stringify(createAlgoliaRealSourceEvidence(verification.receipt, bound)));
  const validated = decodeAlgoliaRealSourceEvidence(rawOuter, expected);
  assert.ok(validated);
  return { rawOuter, validated, ordinary, verification };
}

test("ordinary UNKNOWN blocks; validated action-derived exact premise executes once", () => {
  const fixture = evidenceFixture();
  assert.equal(evaluateObservation(fixture.ordinary.observation).verdict, "UNKNOWN");
  let effects = 0;
  const first = executeFallbackIfNoAlgoliaMatch({
    applicationId, index, query, credential,
    effect: () => { effects += 1; },
  });
  assert.equal(first.verdict, "BLOCK");
  assert.equal(effects, 0);
  const verified = executeFallbackIfNoAlgoliaMatch({
    applicationId, index, query, credential,
    evidence: fixture.validated,
    effect: () => { effects += 1; },
  });
  assert.equal(verified.verdict, "PASS");
  assert.equal(effects, 1);
});

test("outer decoder rejects source, authority, bindings, and nested-warrant mutations", () => {
  const fixture = evidenceFixture();
  for (const mutate of [
    (value: any) => { value.sourceInstance.applicationId = "other-app"; },
    (value: any) => { value.authorityContextId = "algolia-search-key-sha256:" + "0".repeat(64); },
    (value: any) => { value.credentialBinding.digest = "0".repeat(64); },
    (value: any) => { value.verificationCapture.normalizedRequestBinding.digest = "0".repeat(64); },
    (value: any) => { value.verificationCapture.normalizedResponseBinding.digest = "0".repeat(64); },
    (value: any) => { value.boundEvidence.sourceWarrant.observationBinding.response.digest = "0".repeat(64); },
  ]) {
    const copy = JSON.parse(JSON.stringify(fixture.rawOuter));
    mutate(copy);
    assert.equal(decodeAlgoliaRealSourceEvidence(copy, expected), undefined);
  }
});

test("action derives changed query/index/effective scope and blocks mismatches", () => {
  const fixture = evidenceFixture();
  let effects = 0;
  for (const changed of [
    { applicationId, index, query: `${query}-changed`, credential },
    { applicationId, index: "other-index", query, credential },
    { applicationId: "other-app", index, query, credential },
    { applicationId, index, query, credential: `${credential}-changed` },
  ]) {
    assert.equal(executeFallbackIfNoAlgoliaMatch({
      ...changed,
      evidence: fixture.validated,
      effect: () => { effects += 1; },
    }).verdict, "BLOCK");
  }
  const effectiveCopy: any = JSON.parse(JSON.stringify(fixture.rawOuter));
  const different = "bestbuy-replica";
  effectiveCopy.boundEvidence.proposition.sourceScopeIdentity = `algolia:/1/indexes/bestbuy/query:requested=bestbuy:effective=${different}`;
  effectiveCopy.boundEvidence.sourceWarrant.proposition.sourceScopeIdentity = effectiveCopy.boundEvidence.proposition.sourceScopeIdentity;
  effectiveCopy.boundEvidence.sourceWarrant.scope.effectiveIndex = different;
  const effectiveEvidence = decodeAlgoliaRealSourceEvidence(effectiveCopy, expected);
  assert.ok(effectiveEvidence);
  assert.equal(executeFallbackIfNoAlgoliaMatch({
    applicationId, index, query, credential,
    evidence: effectiveEvidence,
    effect: () => { effects += 1; },
  }).verdict, "BLOCK");
  assert.equal(effects, 0);
});

test("MCP transport removes local trust; outer then nested decode restores it", async () => {
  const fixture = evidenceFixture();
  const roundTrip = await runOfficialAlgoliaMcpRoundTrip(fixture.rawOuter);
  assert.equal(roundTrip.protocolEra, "modern");
  assert.equal(roundTrip.negotiatedProtocolVersion, "2026-07-28");
  const transported: unknown = roundTrip.publicResult._meta?.[ALGOLIA_REAL_SOURCE_META_KEY];
  assert.ok(transported);
  let effects = 0;
  assert.equal(executeFallbackIfNoAlgoliaMatch({
    applicationId, index, query, credential,
    evidence: transported as ReceiverValidatedAlgoliaRealSourceEvidence,
    effect: () => { effects += 1; },
  }).verdict, "BLOCK");
  const decoded = decodeAlgoliaRealSourceEvidence(transported, expected);
  assert.ok(decoded);
  assert.equal(executeFallbackIfNoAlgoliaMatch({
    applicationId, index, query, credential,
    evidence: decoded,
    effect: () => { effects += 1; },
  }).verdict, "PASS");
  assert.equal(effects, 1);
});
