GO

# Phase 3 final report

## Causal result

For one real Algolia source, one exact source view, one exact query, and one captured observation, a source-native evidence-strengthening request produced a proposition-bound negative warrant that survived MCP transport and receiver validation, and a deterministic local operation consumed that premise only after the warrant became usable.

The same real empty search result was not sufficient merely because it was empty. A proposition-preserving verification request acquired the missing source evidence required before the downstream operation could consume the negative premise.

## Required fields

- Real source: official Algolia public demo application `latency`, source instance `algolia-app:latency`.
- Official provenance: Algolia's current InstantSearch iOS getting-started guide publishes application `latency`, index `bestbuy`, and a credential for its pre-loaded guide dataset; Algolia's API-key guide identifies search-only keys as frontend-usable. Retrieval date: 2026-08-13. No GitHub tuple source was used, so no commit SHA applies.
- Application ID: `latency`.
- Index: `bestbuy`.
- Query token: `risu-nrw-017a2d4235319959bbc7d882fd070306`, generated once from 128 random bits before network activity.
- Authority context: `algolia-search-key-sha256:` plus SHA-256 of the exact public credential bytes; fingerprint `a46d4e0bff97a653de3a9c0ecd9ba874902c13d7dbd45a3720b6d86d44d3cc27`.
- Ordinary HTTP: 200.
- Verification HTTP: 200.
- Ordinary `nbHits`: 0.
- Verification `nbHits`: 0.
- Exactness metadata: both responses returned `exhaustiveNbHits=true` and `exhaustive={nbHits:true}`.
- Effective index: absent in Q; Q′ returned `indexUsed="bestbuy"`.
- Q verdict: `UNKNOWN` because ranking information was not requested and the effective-index/source-scope witness was absent.
- Q′ verdict: `WARRANTED_ZERO`; every frozen obligation was satisfied.
- Proposition preservation: `PRESERVING` and `SAFE_STRENGTHENING_AVAILABLE`, reason `ALGOLIA_RANKING_INFO_METADATA_ENABLED`.
- Composition: succeeded through frozen `composeNegativeEvidence()`.
- Source-instance binding: passed independently of authority binding.
- Official MCP: modern revision `2026-07-28` using exact existing 2.0.0 dependencies.
- Post-MCP receiver: raw metadata began as `unknown`; outer decode and frozen nested decode accepted it.
- Action-derived proposition: exactly matched the evidence proposition. The caller supplied no `ZeroProposition`.
- First action: `BLOCK`; effect 0.
- Verified action: `PASS`; effect 1.
- Total effect count: 1.
- Adversarial controls: 10 `BLOCK`, 0 pass, 0 effects. Cases changed source application, action query, action index, effective index, authority, normalized request link, normalized response link, nested warrant, missing evidence, and ordinary UNKNOWN evidence.
- Capture-normalization: both real body-property enumerations were preserved; path/index came from the URL; body overrides reject; source and authority stayed outside the frozen profile; both complete parsed responses were retained; raw and canonical bindings were distinct. Synthetic mutations additionally covered unknown-field preservation, invalid JSON, non-200, incompatible content type, application-header changes, URL-index changes, and key-order canonicalization.
- Frozen Phase 2.1 hashes: all 12 semantic source hashes matched before and after; see `frozen/FROZEN-PHASE-2.1-SOURCE-HASHES.sha256`.
- Raw evidence manifest: `evidence/real/algolia/20260814T013017406Z-fd070306/MANIFEST.sha256`, SHA-256 `ec582c620d0a11c21e20441ca30c6bf65c486c353eecd597960fb97a48a058b9`.
- Dependencies added: none; the exact Phase 2.1 lockfile was reused.
- Credential leakage: none. The exact credential was recursively scanned and did not occur in the evidence or project artifacts; only its fingerprint is retained.
- LLM participation: none.

## Exact application-level capture

Both exchanges preserve method, absolute URL, origin, pathname, query string, semantic headers, application-ID header, fingerprinted credential binding, exact request body bytes/binding, status, final URL, complete response headers, content type, exact response body bytes/binding, and provenance timestamps. No packet, TLS-record, header-order, or TCP-framing claim is made.

The normalization receipt separately binds raw request/response bodies to adapter version `0.3.0` and exact canonical profile request/response bytes. No source field was manufactured or projected.

## Frozen-checkpoint provenance note

The archive presented at Phase 3 start had observed SHA-256 `fc39b9901b65c04510f1acac71ffe5e5d6ca97cebca798a9295e4f80014ec860`, differing from the prior handoff's printed `012abd296ee0cc1477608db3707e43f976bf6c9a787d1288e178b1878d67ccac`, and included `node_modules`, `__MACOSX`, and `.DS_Store`. Its internal artifact manifest and semantic source hashes verified. Phase 3 therefore froze and reused the verified semantic bytes, not the archive's packaging noise.

## Strongest remaining risk

The strongest remaining risk is source/capture truth outside internal consistency: the application-level capture trusts the HTTPS runtime and Algolia endpoint to report the exchange accurately, and the official public demo tuple may change or disappear. There is no cryptographic attestation tying Algolia's server execution to the captured response, by design.

No broader Algolia, MCP, or world-level absence claim follows. No further synthetic hardening phase is recommended; the next decision is whether this primitive is important enough to externalize.
