import { createHash } from "node:crypto";
import type {
  AlgoliaHttpExchangeCapture,
  AlgoliaSourceInstance,
  CredentialBinding,
} from "./types.ts";

export function credentialBinding(credential: string): CredentialBinding {
  const bytes = new TextEncoder().encode(credential);
  return {
    algorithm: "SHA-256",
    representation: "exact-credential-bytes-sha256-fingerprint",
    digest: createHash("sha256").update(bytes).digest("hex"),
    byteLength: bytes.byteLength,
  };
}

export function authorityContextIdForCredential(credential: string): string {
  return `algolia-search-key-sha256:${credentialBinding(credential).digest}`;
}

export function algoliaSourceInstance(applicationId: string): AlgoliaSourceInstance {
  return {
    provider: "algolia",
    applicationId,
    sourceInstanceId: `algolia-app:${applicationId}`,
  };
}

/** Performs exactly one fetch call. It has no retry behavior. */
export async function captureRealAlgoliaExchange(input: {
  applicationId: string;
  credential: string;
  url: string;
  observationId: string;
  bodyBytes: Uint8Array;
}): Promise<AlgoliaHttpExchangeCapture> {
  const binding = credentialBinding(input.credential);
  const authorityContextId = authorityContextIdForCredential(input.credential);
  const sourceInstance = algoliaSourceInstance(input.applicationId);
  const sentAt = new Date().toISOString();
  const requestHeaders = {
    accept: "application/json",
    "content-type": "application/json",
    "x-algolia-application-id": input.applicationId,
    "x-algolia-api-key": input.credential,
  };
  const response = await fetch(input.url, {
    method: "POST",
    headers: requestHeaders,
    body: input.bodyBytes.buffer.slice(
      input.bodyBytes.byteOffset,
      input.bodyBytes.byteOffset + input.bodyBytes.byteLength,
    ) as ArrayBuffer,
    redirect: "manual",
  });
  const bodyBytes = new Uint8Array(await response.arrayBuffer());
  const receivedAt = new Date().toISOString();
  return {
    sourceInstance,
    authorityContextId,
    observationId: input.observationId,
    request: {
      method: "POST",
      url: input.url,
      headers: {
        accept: requestHeaders.accept,
        "content-type": requestHeaders["content-type"],
        "x-algolia-application-id": input.applicationId,
        "x-algolia-api-key": `sha256:${binding.digest}`,
      },
      applicationIdHeader: input.applicationId,
      credentialBinding: binding,
      bodyBytes: input.bodyBytes,
      sentAt,
    },
    response: {
      status: response.status,
      finalUrl: response.url,
      headers: Object.fromEntries(response.headers.entries()),
      contentType: response.headers.get("content-type") ?? "",
      bodyBytes,
      receivedAt,
    },
  };
}
