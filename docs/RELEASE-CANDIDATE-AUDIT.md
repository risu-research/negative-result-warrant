# Release-candidate audit

This public shell was created after the frozen Phase 3 real-source result and Phase 4 prior-art audit. It intentionally makes **no semantic changes** to the historical witness.

## Micro-fixes applied before publication

1. Added authenticated denial / cryptographic non-membership as explicit prior art, including DNSSEC NSEC/NSEC3, and stated that this profile makes no cryptographic source-authenticity claim.
2. Added two release-level reviewer limits: the nonce query exercises the zero path but is not evidence of production importance; the warrant does not bind a versioned snapshot of all source configuration or credential policy.
3. Changed public framing from “new executable profile” to **experimental executable reference profile / narrow systems composition**.
4. Preserved the historical `org.example...` MCP key in immutable evidence while defining `io.github.risu-research/negative-result-warrant` for new public integrations.
5. Made recorded-evidence verification the default reproduction path; CI never calls the mutable public Algolia demo.
6. Corrected public capture language to “response headers exposed by the Fetch API” and separated artifact integrity from source authenticity.
7. Added CAVA/action-identity credit so operation-derived premise identity is not presented as an atomic novelty.

## Verification performed for this release candidate

- frozen Phase 3 artifact manifest: verified;
- real Algolia evidence manifest: verified;
- frozen Phase 2.1 semantic-source hashes: verified;
- exact credential scan: no raw credential present;
- public and historical MCP metadata keys: accepted by the frozen adopter-key validator;
- packaging-noise scan: no `node_modules`, `__MACOSX`, `.DS_Store`, or pnpm store;
- release manifest: verified.

## Deliberately not changed

- provider semantics;
- warrant issuance;
- proposition identity;
- composition rules;
- receiver invariants;
- generic premise gate;
- historical HTTP/MCP evidence;
- real Phase 3 observations.

Corrections to historical wording are recorded in `docs/ERRATA.md` rather than rewriting the witness.
