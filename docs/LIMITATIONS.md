# Limitations and non-claims

These limits are part of the profile, not fine print.

## 1. Observation-relative, not world-relative

`WARRANTED_ZERO` concerns one bound source observation under one identified source/view/query/scope. It does not prove that no matching object exists elsewhere or will remain absent.

## 2. No cryptographic source authenticity

The recorded Phase 3 capture trusts the HTTPS runtime and provider endpoint. The warrant is produced by the local evaluator from provider-reported fields. Algolia did not sign the warrant, and the artifact contains no independent attestation of server execution or source truth.

Authenticated-denial systems such as DNSSEC/NSEC/NSEC3 are stronger in this dimension: they use cryptographic authentication for denial-of-existence claims. This project does not claim to reproduce that property.

## 3. Integrity manifests are not source attestations

SHA-256 manifests let an outsider verify that published evidence files match the recorded artifact. They do not establish who originally emitted those bytes.

## 4. No source-configuration snapshot binding

The proposition binds the observed request/scope/view representation used by the profile. It does not bind a versioned snapshot of every server-side index setting, synonym set, ranking configuration, dataset revision, or credential-restriction policy that may influence the provider's behavior.

The credential fingerprint identifies the token used for the view; it is not a cryptographic commitment to an immutable authorization-policy snapshot behind that token.

## 5. TOCTOU remains outside scope

A warranted observation may become stale before an action commits. The profile has no transaction, lock, freshness guarantee, compare-and-swap, or mandatory source recheck.

In short:

```text
warranted at observation time ≠ state guaranteed at commit time
```

## 6. The real query was deliberately a nonce

The Phase 3 query was generated once from 128 random bits and precommitted before the two network calls. That design reduces cherry-picking of a convenient empty result and exercises the zero-result path reproducibly.

It does **not** demonstrate that the queried absence was operationally important or representative of ordinary production searches.

## 7. One real provider witness

The real constructive witness covers one public Algolia application, one index, one credential-defined view, one query, two observations, one MCP path, and one local effect. Synthetic frozen profiles also exist for Elasticsearch and OData, but Phase 3 did not establish real-source results for them.

## 8. The Algolia verification requirement is profile-induced

The ordinary Q already used a single-index request with A/B participation disabled. The experiment therefore does not claim that Algolia itself says Q is unknowable without `getRankingInfo`.

The narrower result is:

> Under the experimental no-inference profile, Q lacked an explicit source-reported effective-index witness; Q′ acquired that witness without changing the bounded query proposition.

## 9. MCP is only carriage

MCP lifecycle completion, structured content, or `_meta` does not itself mean a negative premise is warranted. The private evidence semantic and receiver checks come from this profile.

## 10. The local effect is not a production safety result

The action witness is deterministic and deliberately low consequence. It shows exact premise consumption, not that arbitrary autonomous-agent actions become safe.

## 11. Application-level capture only

The recorded exchange preserves response headers exposed by the Fetch API, not an assertion of every byte or header that may have existed below the application runtime. No packet, TLS-record, TCP-framing, or header-order claim is made.
