import { createHash, randomBytes } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { FIXED_MATCHING_CONTROLS } from "../src/action.ts";
import { canonicalJsonBytes } from "../src/normalizer.ts";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const applicationId = "latency";
const index = "bestbuy";
const credentialFingerprint = "a46d4e0bff97a653de3a9c0ecd9ba874902c13d7dbd45a3720b6d86d44d3cc27";
const query = `risu-nrw-${randomBytes(16).toString("hex")}`;
const preparedAt = new Date().toISOString();
const runId = `${preparedAt.replace(/[-:.]/g, "").replace("Z", "Z")}-${query.slice(-8)}`;
const runDir = join(root, "evidence", "real", "algolia", runId);
mkdirSync(runDir, { recursive: true });

const ordinaryBody = { query, ...FIXED_MATCHING_CONTROLS };
const verificationBody = { query, ...FIXED_MATCHING_CONTROLS, getRankingInfo: true };
const ordinaryBytes = canonicalJsonBytes(ordinaryBody);
const verificationBytes = canonicalJsonBytes(verificationBody);
const binding = (bytes: Uint8Array) => ({
  algorithm: "SHA-256",
  representation: "exact-http-body-bytes",
  digest: createHash("sha256").update(bytes).digest("hex"),
  byteLength: bytes.byteLength,
});

const source = `# Official Algolia source provenance

- Retrieved: 2026-08-13
- Official credential/demo documentation: https://www.algolia.com/doc/guides/building-search-ui/getting-started/how-to/programmatically/ios?language=php
- Official API-key classification: https://www.algolia.com/doc/guides/security/api-keys?language=javascript
- Official Search API reference: https://www.algolia.com/doc/rest-api/search
- Application ID: \`${applicationId}\`
- Index: \`${index}\`
- Credential class: public/search-only client credential published by Algolia for its pre-loaded guide dataset
- Credential retained in artifact: no
- Credential SHA-256: \`${credentialFingerprint}\`
- Authority context: \`algolia-search-key-sha256:${credentialFingerprint}\`

No GitHub source is used as the tuple authority, so no repository commit SHA applies.
`;

const experiment = {
  version: "0.3.0",
  runId,
  preparedAt,
  precommit: true,
  networkRequestsSentAtPreparation: 0,
  plannedAlgoliaNetworkRequests: 2,
  source: {
    provider: "algolia",
    applicationId,
    sourceInstanceId: `algolia-app:${applicationId}`,
    index,
    endpoint: `https://${applicationId}-dsn.algolia.net/1/indexes/${index}/query`,
  },
  credential: {
    stored: false,
    classification: "official-public-search-only-demo-credential",
    fingerprintSha256: credentialFingerprint,
    authorityContextId: `algolia-search-key-sha256:${credentialFingerprint}`,
  },
  query: {
    token: query,
    generatedRandomBits: 128,
    generationCount: 1,
  },
  fixedMatchingControls: FIXED_MATCHING_CONTROLS,
  requests: {
    ordinary: {
      bodyUtf8: new TextDecoder().decode(ordinaryBytes),
      bodyBinding: binding(ordinaryBytes),
      getRankingInfo: "absent",
    },
    verification: {
      bodyUtf8: new TextDecoder().decode(verificationBytes),
      bodyBinding: binding(verificationBytes),
      getRankingInfo: true,
    },
  },
};

const writeExclusive = (name: string, value: string | Uint8Array) => {
  writeFileSync(join(runDir, name), value, { flag: "wx" });
};
writeExclusive("SOURCE.md", source);
writeExclusive("experiment.json", `${JSON.stringify(experiment, null, 2)}\n`);
const precommitLines = ["SOURCE.md", "experiment.json"].map((name) => {
  const content = name === "SOURCE.md" ? new TextEncoder().encode(source) : new TextEncoder().encode(`${JSON.stringify(experiment, null, 2)}\n`);
  return `${createHash("sha256").update(content).digest("hex")}  ${name}`;
});
writeExclusive("PRECOMMIT.sha256", `${precommitLines.join("\n")}\n`);
writeFileSync(join(root, "ACTIVE-RUN.txt"), `${relative(root, runDir)}\n`, { flag: "wx" });
process.stdout.write(`${runDir}\n${query}\n`);
