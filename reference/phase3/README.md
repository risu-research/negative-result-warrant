# Negative Result Warrant — Phase 3 real Algolia vertical slice

## GO

One real Algolia source boundary completed the intended causal chain:

```text
real Q: HTTP 200 + nbHits 0 + no effective-index witness
  → frozen evaluator UNKNOWN
  → action-derived premise BLOCK
  → effect 0

real Q′: same source/view/query/index/matching controls + getRankingInfo=true
  → HTTP 200 + nbHits 0 + exhaustive.nbHits true + indexUsed bestbuy
  → frozen evaluator WARRANTED_ZERO
  → frozen comparator PRESERVING / SAFE_STRENGTHENING_AVAILABLE
  → frozen composition succeeds
  → Algolia real-source envelope
  → official MCP 2026-07-28
  → outer decode + frozen nested decode
  → action-derived exact proposition PASS
  → effect exactly once
```

This is exact application-level HTTP capture, not packet-, TLS-record-, or TCP-level capture.

## Real source and precommit

- Provider: Algolia only.
- Source instance: `algolia-app:latency`.
- Index: `bestbuy`.
- Query: `risu-nrw-017a2d4235319959bbc7d882fd070306`.
- Credential: Algolia-published public/search-only demo credential; raw value is not stored.
- Credential fingerprint: `a46d4e0bff97a653de3a9c0ecd9ba874902c13d7dbd45a3720b6d86d44d3cc27`.
- Authority: `algolia-search-key-sha256:<credential SHA-256>`.

The source, credential fingerprint, single 128-bit-random query token, fixed matching controls, and exact Q/Q′ request bytes were written and hash-precommitted before either network call. The live runner contains no retry loop and sent one Q and one Q′.

Official provenance is recorded in `evidence/real/algolia/20260814T013017406Z-fd070306/SOURCE.md`. Algolia documentation publishes the `latency` / `bestbuy` tuple for a pre-loaded guide dataset and classifies search-only credentials as usable in frontend code.

## Capture and normalization

`normalizeAlgoliaHttpExchange()` is a narrow, fail-closed adapter for one HTTPS single-index POST form. It checks the expected application host and header, exact source instance, action/precommitted index, POST path, credential fingerprint, success status, JSON content type, and JSON object bodies.

The request transformation is lossless:

```text
exact raw body bytes + URL-derived path/index
  → recursive-key-sorted canonical JSON profile bytes
```

Every request body member is copied unchanged. Body-supplied `path` or `index` is rejected. Unknown search parameters are preserved, not selected away. The response transformation canonicalizes the complete parsed response object without projection, defaults, inference, or field conversion. Exact raw body bindings remain separate from canonical profile-input bindings.

Source application identity and credential/view identity stay outside the frozen profile and remain distinct.

## Frozen dependency

All Phase 2.1 semantic code is copied byte-unchanged under `frozen/phase2.1/src/`. Its 12-file hash manifest is `frozen/FROZEN-PHASE-2.1-SOURCE-HASHES.sha256`; hashes matched the source checkpoint both before and after the real run.

At Phase 3 start, the supplied ZIP itself hashed to `fc39b9901b65c04510f1acac71ffe5e5d6ca97cebca798a9295e4f80014ec860`, not the `012abd…` digest printed in the prior handoff, and contained packaging noise. Its embedded artifact manifest nevertheless verified, its semantic source hashes matched the expanded checkpoint, strict typecheck passed, and 216/216 checkpoint tests passed. See `frozen/CHECKPOINT.json`.

## Receiver and action

The Phase 3 outer decoder validates the source application, authority/credential binding, capture bindings, and the exact normalized request/response bindings against the nested warrant. It delegates nested evidence validation to the frozen `decodeBoundNegativeEvidence()` and reconstructs/freezes its own result.

MCP transport resets both local runtime trust boundaries. Metadata starts as `unknown`; a cast cannot authorize the action. The outer decoder then calls the frozen nested decoder.

`executeFallbackIfNoAlgoliaMatch()` accepts action inputs—not a caller-provided proposition. It derives:

- source instance from application ID;
- authority from exact credential bytes;
- normalized request semantics from query, index, and fixed controls;
- expected requested and effective index from the action's fixed `effectiveIndex = requestedIndex` policy;
- exact `ZeroProposition` through frozen `deriveZeroProposition()`.

Only then does it call the frozen generic gate.

## Results and evidence

- Q: HTTP 200, `nbHits=0`, `UNKNOWN`, action `BLOCK`, effect 0.
- Q′: HTTP 200, `nbHits=0`, `exhaustiveNbHits=true`, `exhaustive.nbHits=true`, `indexUsed=bestbuy`, `WARRANTED_ZERO`.
- Comparator: `PRESERVING`, `SAFE_STRENGTHENING_AVAILABLE`.
- Composition: succeeded.
- Official MCP: modern protocol revision `2026-07-28`.
- Post-MCP decode: accepted after outer and nested decoding.
- Verified action: `PASS`, effect 1.
- Real-boundary adversarial controls: 10/10 `BLOCK`, zero effects.
- Phase 3 strict typecheck and 10/10 boundary tests: pass.
- Dependencies added: none.
- Credential leaks in artifact: none.

The immutable run is `evidence/real/algolia/20260814T013017406Z-fd070306/`. Its `MANIFEST.sha256` has SHA-256 `ec582c620d0a11c21e20441ca30c6bf65c486c353eecd597960fb97a48a058b9`.

This result does not prove absence. It shows that for one real source, view, query, and captured observation, a source-native evidence-strengthening request made a bounded negative premise mechanically usable by one deterministic local operation.
