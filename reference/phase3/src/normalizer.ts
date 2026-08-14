import { createHash } from "node:crypto";
import { stableJson } from "../frozen/phase2.1/src/proposition.ts";
import {
  ALGOLIA_HTTP_NORMALIZER_VERSION,
  type AlgoliaHttpExchangeCapture,
  type DigestBinding,
  type NormalizedAlgoliaObservation,
} from "./types.ts";

type JsonRecord = Record<string, unknown>;

function record(value: unknown): JsonRecord | undefined {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? value as JsonRecord
    : undefined;
}

export function canonicalJsonBytes(value: unknown): Uint8Array {
  return new TextEncoder().encode(stableJson(value));
}

export function bindBytes<Representation extends string>(
  bytes: Uint8Array,
  representation: Representation,
): DigestBinding<Representation> {
  return {
    algorithm: "SHA-256",
    representation,
    digest: createHash("sha256").update(bytes).digest("hex"),
    byteLength: bytes.byteLength,
  };
}

function parseJsonObject(bytes: Uint8Array): JsonRecord | undefined {
  try {
    return record(JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)));
  } catch {
    return undefined;
  }
}

function decodedIndex(url: URL): string | undefined {
  const segments = url.pathname.split("/").filter(Boolean);
  if (segments.length !== 4
    || segments[0] !== "1"
    || segments[1] !== "indexes"
    || segments[3] !== "query") return undefined;
  try {
    const value = decodeURIComponent(segments[2]!);
    return value.length === 0 ? undefined : value;
  } catch {
    return undefined;
  }
}

/** Fail-closed, lossless application-level HTTP to frozen-profile normalization. */
export function normalizeAlgoliaHttpExchange(
  capture: AlgoliaHttpExchangeCapture,
  expected: {
    applicationId: string;
    index: string;
    credentialFingerprint: string;
  },
): NormalizedAlgoliaObservation | undefined {
  let url: URL;
  try {
    url = new URL(capture.request.url);
  } catch {
    return undefined;
  }
  const index = decodedIndex(url);
  if (url.protocol !== "https:"
    || url.hostname.toLowerCase() !== `${expected.applicationId.toLowerCase()}-dsn.algolia.net`
    || url.search !== ""
    || capture.request.method !== "POST"
    || index !== expected.index
    || capture.sourceInstance.provider !== "algolia"
    || capture.sourceInstance.applicationId !== expected.applicationId
    || capture.sourceInstance.sourceInstanceId !== `algolia-app:${expected.applicationId}`
    || capture.request.applicationIdHeader !== expected.applicationId
    || capture.request.headers["x-algolia-application-id"] !== expected.applicationId
    || capture.request.credentialBinding.digest !== expected.credentialFingerprint
    || capture.authorityContextId !== `algolia-search-key-sha256:${expected.credentialFingerprint}`) {
    return undefined;
  }
  const requestBody = parseJsonObject(capture.request.bodyBytes);
  if (requestBody === undefined
    || Object.hasOwn(requestBody, "path")
    || Object.hasOwn(requestBody, "index")) return undefined;
  const normalizedRequest: JsonRecord = {
    path: url.pathname,
    index,
    ...requestBody,
  };
  for (const [key, value] of Object.entries(requestBody)) {
    if (!Object.hasOwn(normalizedRequest, key) || stableJson(normalizedRequest[key]) !== stableJson(value)) {
      return undefined;
    }
  }

  if (capture.response.status !== 200
    || !capture.response.contentType.toLowerCase().startsWith("application/json")) return undefined;
  const normalizedResponse = parseJsonObject(capture.response.bodyBytes);
  if (normalizedResponse === undefined) return undefined;

  const normalizedRequestBytes = canonicalJsonBytes(normalizedRequest);
  const normalizedResponseBytes = canonicalJsonBytes(normalizedResponse);
  const requestBinding = bindBytes(normalizedRequestBytes, "exact-profile-input-bytes");
  const responseBinding = bindBytes(normalizedResponseBytes, "exact-profile-input-bytes");
  return {
    observation: {
      profile: "algolia-search",
      observationId: capture.observationId,
      requestBytes: normalizedRequestBytes,
      responseBytes: normalizedResponseBytes,
      authorityContext: { kind: "opaque-non-secret", id: capture.authorityContextId },
    },
    receipt: {
      version: "0.3.0",
      sourceInstance: capture.sourceInstance,
      authorityContextId: capture.authorityContextId,
      observationId: capture.observationId,
      request: {
        method: "POST",
        url: capture.request.url,
        origin: url.origin,
        pathname: url.pathname,
        queryString: url.search,
        headers: capture.request.headers,
        applicationIdHeader: capture.request.applicationIdHeader,
        bodyBinding: bindBytes(capture.request.bodyBytes, "exact-http-body-bytes"),
        credentialBinding: capture.request.credentialBinding,
      },
      response: {
        status: 200,
        finalUrl: capture.response.finalUrl,
        headers: capture.response.headers,
        contentType: capture.response.contentType,
        bodyBinding: bindBytes(capture.response.bodyBytes, "exact-http-body-bytes"),
      },
      normalized: {
        adapterVersion: ALGOLIA_HTTP_NORMALIZER_VERSION,
        profile: "algolia-search",
        requestBinding,
        responseBinding,
      },
    },
    normalizedRequest,
    normalizedResponse,
    normalizedRequestBytes,
    normalizedResponseBytes,
  };
}
