# Phase 3 verification record

Date: 2026-08-13 America/New_York / 2026-08-14 UTC

## Frozen Phase 2.1 checkpoint

```text
embedded artifact manifest: PASS
strict TypeScript: PASS
tests: 216
pass: 216
fail: 0
frozen semantic source comparison before/after: BYTE_IDENTICAL
```

The archive-level digest discrepancy and packaging noise are recorded in `frozen/CHECKPOINT.json`; semantic files and the embedded manifest verified.

## Phase 3 boundary suite

```text
tsc --noEmit: PASS
tests: 10
pass: 10
fail: 0
```

The suite covers lossless request normalization, unexpected-field preservation, body path/index conflict rejection, wrong application/index rejection, invalid JSON response, non-success response, incompatible content type, deterministic canonicalization with separate raw bindings, outer/nested decoder mutations, action-derived mismatches, runtime trust reset across official MCP, and cast failure.

## Real run

```text
real Algolia calls: 2 (one Q, one Q′; no retries)
Q HTTP/verdict/action/effect:  200 / UNKNOWN / BLOCK / 0
Q′ HTTP/verdict/action/effect: 200 / WARRANTED_ZERO / PASS / 1
preservation/acquisition: PRESERVING / SAFE_STRENGTHENING_AVAILABLE
composition: SUCCEEDED
MCP: modern / 2026-07-28
post-MCP outer+nested decode: ACCEPT
real-boundary adversarial controls: 10 BLOCK / 0 effects
```

Immutable evidence manifest verification: PASS, 30 entries. The manifest file itself hashes to `ec582c620d0a11c21e20441ca30c6bf65c486c353eecd597960fb97a48a058b9`.
