import { createHash } from "node:crypto";
import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { basename, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  assessVerificationRequest,
  composeNegativeEvidence,
  evaluateObservation,
} from "../frozen/phase2.1/src/index.ts";
import { stableJson } from "../frozen/phase2.1/src/proposition.ts";
import {
  ALGOLIA_REAL_SOURCE_META_KEY,
  createAlgoliaRealSourceEvidence,
  credentialBinding,
  decodeAlgoliaRealSourceEvidence,
  executeFallbackIfNoAlgoliaMatch,
  normalizeAlgoliaHttpExchange,
  runOfficialAlgoliaMcpRoundTrip,
  captureRealAlgoliaExchange,
  type AlgoliaHttpExchangeCapture,
  type ReceiverValidatedAlgoliaRealSourceEvidence,
} from "../src/index.ts";

type JsonRecord = Record<string, unknown>;
const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const activeRun = readFileSync(join(root, "ACTIVE-RUN.txt"), "utf8").trim();
const runDir = resolve(root, activeRun);
if (!runDir.startsWith(join(root, "evidence", "real", "algolia") + "/")) {
  throw new Error("ACTIVE-RUN.txt points outside the evidence tree.");
}
const experiment = JSON.parse(readFileSync(join(runDir, "experiment.json"), "utf8")) as any;
const apiKey = process.env.ALGOLIA_PUBLIC_SEARCH_KEY;
if (apiKey === undefined || apiKey.length === 0) throw new Error("ALGOLIA_PUBLIC_SEARCH_KEY is required.");
if (credentialBinding(apiKey).digest !== experiment.credential.fingerprintSha256) {
  throw new Error("The supplied credential does not match the precommitted public credential fingerprint.");
}
for (const forbidden of ["ordinary-response-body.raw", "verification-response-body.raw", "final-action-result.json"]) {
  if (existsSync(join(runDir, forbidden))) throw new Error("This immutable real run has already started.");
}

const writeExclusive = (name: string, value: string | Uint8Array) => {
  writeFileSync(join(runDir, name), value, { flag: "wx" });
};
const writeJson = (name: string, value: unknown) => writeExclusive(name, `${JSON.stringify(value, null, 2)}\n`);
const bodyBinding = (bytes: Uint8Array) => ({
  algorithm: "SHA-256",
  representation: "exact-http-body-bytes",
  digest: createHash("sha256").update(bytes).digest("hex"),
  byteLength: bytes.byteLength,
});
const captureJson = (capture: AlgoliaHttpExchangeCapture) => {
  const url = new URL(capture.request.url);
  return {
    sourceInstance: capture.sourceInstance,
    authorityContextId: capture.authorityContextId,
    observationId: capture.observationId,
    request: {
      method: capture.request.method,
      url: capture.request.url,
      origin: url.origin,
      pathname: url.pathname,
      queryString: url.search,
      headers: capture.request.headers,
      applicationIdHeader: capture.request.applicationIdHeader,
      credentialBinding: capture.request.credentialBinding,
      bodyBinding: bodyBinding(capture.request.bodyBytes),
      sentAt: capture.request.sentAt,
    },
    response: {
      status: capture.response.status,
      finalUrl: capture.response.finalUrl,
      headers: capture.response.headers,
      contentType: capture.response.contentType,
      bodyBinding: bodyBinding(capture.response.bodyBytes),
      receivedAt: capture.response.receivedAt,
    },
  };
};

const applicationId = experiment.source.applicationId as string;
const index = experiment.source.index as string;
const query = experiment.query.token as string;
const endpoint = experiment.source.endpoint as string;
const ordinaryBytes = new TextEncoder().encode(experiment.requests.ordinary.bodyUtf8 as string);
const verificationBytes = new TextEncoder().encode(experiment.requests.verification.bodyUtf8 as string);
if (bodyBinding(ordinaryBytes).digest !== experiment.requests.ordinary.bodyBinding.digest
  || bodyBinding(verificationBytes).digest !== experiment.requests.verification.bodyBinding.digest) {
  throw new Error("Precommitted request-body binding mismatch.");
}

writeExclusive("ordinary-request-body.raw", ordinaryBytes);
let ordinaryCapture: AlgoliaHttpExchangeCapture;
try {
  ordinaryCapture = await captureRealAlgoliaExchange({
    applicationId,
    credential: apiKey,
    url: endpoint,
    observationId: `${experiment.runId}-ordinary`,
    bodyBytes: ordinaryBytes,
  });
} catch (error) {
  writeJson("network-failure.json", {
    stage: "ordinary",
    errorClass: error instanceof Error ? error.name : "UnknownError",
    message: error instanceof Error ? error.message.replaceAll(apiKey, "[REDACTED]") : "unknown",
  });
  throw error;
}
writeExclusive("ordinary-response-body.raw", ordinaryCapture.response.bodyBytes);
writeJson("ordinary-response-headers.json", ordinaryCapture.response.headers);
writeJson("ordinary-capture.json", captureJson(ordinaryCapture));

writeExclusive("verification-request-body.raw", verificationBytes);
let verificationCapture: AlgoliaHttpExchangeCapture;
try {
  verificationCapture = await captureRealAlgoliaExchange({
    applicationId,
    credential: apiKey,
    url: endpoint,
    observationId: `${experiment.runId}-verification`,
    bodyBytes: verificationBytes,
  });
} catch (error) {
  writeJson("network-failure.json", {
    stage: "verification",
    errorClass: error instanceof Error ? error.name : "UnknownError",
    message: error instanceof Error ? error.message.replaceAll(apiKey, "[REDACTED]") : "unknown",
  });
  throw error;
}
writeExclusive("verification-response-body.raw", verificationCapture.response.bodyBytes);
writeJson("verification-response-headers.json", verificationCapture.response.headers);
writeJson("verification-capture.json", captureJson(verificationCapture));

const normalizerExpected = {
  applicationId,
  index,
  credentialFingerprint: experiment.credential.fingerprintSha256 as string,
};
const ordinary = normalizeAlgoliaHttpExchange(ordinaryCapture, normalizerExpected);
const verification = normalizeAlgoliaHttpExchange(verificationCapture, normalizerExpected);
if (ordinary !== undefined) {
  writeExclusive("ordinary-normalized-request.json", ordinary.normalizedRequestBytes);
  writeExclusive("ordinary-normalized-response.json", ordinary.normalizedResponseBytes);
  writeJson("ordinary-normalization-receipt.json", ordinary.receipt);
}
if (verification !== undefined) {
  writeExclusive("verification-normalized-request.json", verification.normalizedRequestBytes);
  writeExclusive("verification-normalized-response.json", verification.normalizedResponseBytes);
  writeJson("verification-normalization-receipt.json", verification.receipt);
}

const resultQ = ordinary === undefined ? undefined : evaluateObservation(ordinary.observation);
const resultQPrime = verification === undefined ? undefined : evaluateObservation(verification.observation);
writeJson("evaluator-results.json", {
  ordinaryNormalization: ordinary === undefined ? "REJECT" : "ACCEPT",
  verificationNormalization: verification === undefined ? "REJECT" : "ACCEPT",
  ordinary: resultQ,
  verification: resultQPrime,
});

let firstEffects = 0;
const firstAction = executeFallbackIfNoAlgoliaMatch({
  applicationId,
  index,
  query,
  credential: apiKey,
  effect: () => { firstEffects += 1; },
});

const comparison = ordinary === undefined || verification === undefined
  ? undefined
  : assessVerificationRequest({
      profile: "algolia-search",
      originalRequest: ordinary.normalizedRequest,
      verificationRequest: verification.normalizedRequest,
      originalAuthorityContextId: ordinary.receipt.authorityContextId,
      verificationAuthorityContextId: verification.receipt.authorityContextId,
    });
writeJson("proposition-comparison.json", comparison ?? { result: "UNAVAILABLE" });

const bound = ordinary !== undefined
  && verification !== undefined
  && resultQPrime?.verdict === "WARRANTED_ZERO"
  ? composeNegativeEvidence({
      originalObservation: ordinary.observation,
      verificationObservation: verification.observation,
      verificationResult: resultQPrime,
    })
  : undefined;
let rawOuter: unknown;
if (bound !== undefined && verification !== undefined) {
  writeJson("bound-evidence.json", bound);
  rawOuter = JSON.parse(JSON.stringify(createAlgoliaRealSourceEvidence(verification.receipt, bound)));
  writeJson("real-source-negative-evidence.json", rawOuter);
}

const realMcp = await runOfficialAlgoliaMcpRoundTrip(rawOuter ?? resultQPrime ?? resultQ);
writeJson("mcp-public-result.json", realMcp.publicResult);
writeJson("mcp-raw-http.json", realMcp.rawHttp);
const transported: unknown = realMcp.publicResult._meta?.[ALGOLIA_REAL_SOURCE_META_KEY];
const decoded = decodeAlgoliaRealSourceEvidence(transported, normalizerExpected);
let verifiedEffects = 0;
const verifiedAction = executeFallbackIfNoAlgoliaMatch({
  applicationId,
  index,
  query,
  credential: apiKey,
  ...(decoded === undefined ? {} : { evidence: decoded }),
  effect: () => { verifiedEffects += 1; },
});

const attacks: Array<{ id: string; result: "BLOCK"; effects: number }> = [];
const recordAttack = (id: string, result: string, effects: number) => {
  if (result !== "BLOCK" || effects !== 0) throw new Error(`Adversarial control failed: ${id}`);
  attacks.push({ id, result: "BLOCK", effects });
};
const actionAttack = (
  id: string,
  actionInputs: { applicationId: string; index: string; query: string; credential: string },
  evidence?: ReceiverValidatedAlgoliaRealSourceEvidence,
) => {
  let effects = 0;
  const outcome = executeFallbackIfNoAlgoliaMatch({
    ...actionInputs,
    ...(evidence === undefined ? {} : { evidence }),
    effect: () => { effects += 1; },
  });
  recordAttack(id, outcome.verdict, effects);
};

if (rawOuter !== undefined && decoded !== undefined) {
  const mutationAttack = (id: string, mutate: (value: any) => void) => {
    const copy = JSON.parse(JSON.stringify(rawOuter));
    mutate(copy);
    const result = decodeAlgoliaRealSourceEvidence(copy, normalizerExpected);
    actionAttack(id, { applicationId, index, query, credential: apiKey }, result);
  };
  mutationAttack("source-application-changed", (value) => { value.sourceInstance.applicationId = "other-app"; });
  actionAttack("action-query-changed", { applicationId, index, query: `${query}-changed`, credential: apiKey }, decoded);
  actionAttack("action-index-changed", { applicationId, index: "other-index", query, credential: apiKey }, decoded);
  const effectiveCopy: any = JSON.parse(JSON.stringify(rawOuter));
  effectiveCopy.boundEvidence.sourceWarrant.scope.effectiveIndex = `${index}-replica`;
  effectiveCopy.boundEvidence.proposition.sourceScopeIdentity = `algolia:/1/indexes/${index}/query:requested=${index}:effective=${index}-replica`;
  effectiveCopy.boundEvidence.sourceWarrant.proposition.sourceScopeIdentity = effectiveCopy.boundEvidence.proposition.sourceScopeIdentity;
  const effectiveEvidence = decodeAlgoliaRealSourceEvidence(effectiveCopy, normalizerExpected);
  actionAttack("effective-index-differs-from-action", { applicationId, index, query, credential: apiKey }, effectiveEvidence);
  mutationAttack("authority-changed", (value) => { value.authorityContextId = `algolia-search-key-sha256:${"0".repeat(64)}`; });
  mutationAttack("normalized-request-binding-changed", (value) => { value.verificationCapture.normalizedRequestBinding.digest = "0".repeat(64); });
  mutationAttack("normalized-response-binding-changed", (value) => { value.verificationCapture.normalizedResponseBinding.digest = "0".repeat(64); });
  mutationAttack("nested-warrant-changed", (value) => { value.boundEvidence.sourceWarrant.observationBinding.response.digest = "0".repeat(64); });
} else {
  actionAttack("source-evidence-unavailable", { applicationId, index, query, credential: apiKey });
}
const missingMcp = await runOfficialAlgoliaMcpRoundTrip();
writeJson("mcp-missing-evidence.json", { publicResult: missingMcp.publicResult, rawHttp: missingMcp.rawHttp });
actionAttack("missing-evidence", { applicationId, index, query, credential: apiKey },
  decodeAlgoliaRealSourceEvidence(missingMcp.publicResult._meta?.[ALGOLIA_REAL_SOURCE_META_KEY], normalizerExpected));
const unknownMcp = await runOfficialAlgoliaMcpRoundTrip(resultQ);
writeJson("mcp-ordinary-unknown.json", { publicResult: unknownMcp.publicResult, rawHttp: unknownMcp.rawHttp });
actionAttack("ordinary-unknown-as-evidence", { applicationId, index, query, credential: apiKey },
  decodeAlgoliaRealSourceEvidence(unknownMcp.publicResult._meta?.[ALGOLIA_REAL_SOURCE_META_KEY], normalizerExpected));
writeJson("adversarial-results.json", { total: attacks.length, block: attacks.length, pass: 0, cases: attacks });

const parsedOrdinaryRaw = ordinary === undefined ? undefined : JSON.parse(new TextDecoder().decode(ordinaryCapture.response.bodyBytes));
const parsedVerificationRaw = verification === undefined ? undefined : JSON.parse(new TextDecoder().decode(verificationCapture.response.bodyBytes));
const normalizationTests = {
  ordinaryRequestProperties: ordinary === undefined ? [] : Object.keys(JSON.parse(experiment.requests.ordinary.bodyUtf8)),
  verificationRequestProperties: verification === undefined ? [] : Object.keys(JSON.parse(experiment.requests.verification.bodyUtf8)),
  allOrdinaryPropertiesPreserved: ordinary !== undefined && Object.entries(JSON.parse(experiment.requests.ordinary.bodyUtf8) as JsonRecord)
    .every(([key, value]) => stableJson(ordinary.normalizedRequest[key]) === stableJson(value)),
  allVerificationPropertiesPreserved: verification !== undefined && Object.entries(JSON.parse(experiment.requests.verification.bodyUtf8) as JsonRecord)
    .every(([key, value]) => stableJson(verification.normalizedRequest[key]) === stableJson(value)),
  pathAndIndexDerivedFromUrl: ordinary?.normalizedRequest.path === new URL(endpoint).pathname
    && ordinary.normalizedRequest.index === index,
  sourceApplicationPreservedOutsideProfile: ordinary?.receipt.sourceInstance.applicationId === applicationId,
  authorityPreservedOutsideProfile: ordinary?.receipt.authorityContextId === experiment.credential.authorityContextId,
  completeOrdinaryResponsePreserved: ordinary !== undefined && stableJson(parsedOrdinaryRaw) === stableJson(ordinary.normalizedResponse),
  completeVerificationResponsePreserved: verification !== undefined && stableJson(parsedVerificationRaw) === stableJson(verification.normalizedResponse),
  rawBytesDistinctFromCanonicalProfileBytes: ordinary !== undefined
    && ordinary.receipt.request.bodyBinding.digest !== ordinary.receipt.normalized.requestBinding.digest,
  canonicalization: "recursive object-key sorting; array order and JSON values preserved; raw byte bindings retained separately",
};
writeJson("capture-normalization-results.json", normalizationTests);
writeJson("final-action-result.json", {
  firstAttempt: { ...firstAction, effectCount: firstEffects },
  verifiedAttempt: { ...verifiedAction, effectCount: verifiedEffects },
  totalEffectCount: firstEffects + verifiedEffects,
});
writeJson("experiment-summary.json", {
  runId: experiment.runId,
  sourceInstance: experiment.source,
  authorityContextId: experiment.credential.authorityContextId,
  ordinaryHttpStatus: ordinaryCapture.response.status,
  verificationHttpStatus: verificationCapture.response.status,
  ordinaryNbHits: ordinary?.normalizedResponse.nbHits,
  verificationNbHits: verification?.normalizedResponse.nbHits,
  verificationExactness: verification?.normalizedResponse.exhaustive,
  verificationIndexUsed: verification?.normalizedResponse.indexUsed,
  ordinaryVerdict: resultQ?.verdict ?? "NORMALIZATION_REJECT",
  verificationVerdict: resultQPrime?.verdict ?? "NORMALIZATION_REJECT",
  preservation: comparison?.preservation ?? "UNAVAILABLE",
  acquisition: comparison?.acquisition ?? "UNAVAILABLE",
  composition: bound === undefined ? "FAILED_OR_NOT_APPLICABLE" : "SUCCEEDED",
  mcpProtocol: realMcp.negotiatedProtocolVersion,
  postMcpReceiver: decoded === undefined ? "REJECT" : "ACCEPT",
  firstAction: firstAction.verdict,
  verifiedAction: verifiedAction.verdict,
  totalEffectCount: firstEffects + verifiedEffects,
  adversarialBlockCount: attacks.length,
});

function evidenceFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    return statSync(path).isDirectory() ? evidenceFiles(path) : [path];
  });
}
const preScanFiles = evidenceFiles(runDir).filter((path) => basename(path) !== "MANIFEST.sha256");
const leaked = preScanFiles.filter((path) => readFileSync(path).includes(Buffer.from(apiKey)));
if (leaked.length > 0) throw new Error(`Credential leaked into artifacts: ${leaked.map((path) => relative(runDir, path)).join(", ")}`);
writeJson("secret-scan.json", {
  exactCredentialSearched: true,
  credentialStored: false,
  credentialFingerprint: experiment.credential.fingerprintSha256,
  leaksFound: 0,
});
const manifestFiles = evidenceFiles(runDir)
  .filter((path) => basename(path) !== "MANIFEST.sha256")
  .sort();
const manifest = manifestFiles.map((path) => (
  `${createHash("sha256").update(readFileSync(path)).digest("hex")}  ${relative(runDir, path)}`
));
writeExclusive("MANIFEST.sha256", `${manifest.join("\n")}\n`);
process.stdout.write(`${runDir}\n${JSON.stringify({
  ordinaryStatus: ordinaryCapture.response.status,
  verificationStatus: verificationCapture.response.status,
  ordinaryVerdict: resultQ?.verdict,
  verificationVerdict: resultQPrime?.verdict,
  composition: bound !== undefined,
  receiver: decoded !== undefined,
  firstAction: firstAction.verdict,
  verifiedAction: verifiedAction.verdict,
  effectCount: firstEffects + verifiedEffects,
  adversarialBlocks: attacks.length,
})}\n`);
