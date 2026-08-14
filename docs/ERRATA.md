# Release-level errata for the immutable Phase 3 witness

The files under `reference/phase3/` are intentionally preserved as the historical Phase 3 artifact. This document corrects public wording without rewriting the evidence.

## E1. “The same real empty search result”

Historical wording in `reference/phase3/REPORT.md` says that “the same real empty search result” was insufficient before verification.

Correction:

> The same bounded query produced empty observations in both requests. Q and Q′ were separate HTTP observations with separate byte bindings. The ordinary observation lacked the explicit effective-scope witness required by the profile; the proposition-preserving verification observation acquired it.

## E2. “Complete response headers”

Historical wording uses “complete response headers.”

Correction:

> The application-level capture stores the response headers exposed by the Fetch API/runtime used by the experiment.

No packet-level or lower-layer completeness is claimed.

## E3. Historical MCP metadata namespace

The immutable witness uses:

```text
org.example.phase3/algolia-real-source-evidence
```

That key remains unchanged for provenance. New public integrations should use:

```text
io.github.risu-research/negative-result-warrant
```

## E4. Manifest meaning

The evidence manifest proves file integrity relative to the published manifest. It is not a cryptographic attestation that Algolia generated the captured response or that the source state was true/complete beyond the provider contract.
