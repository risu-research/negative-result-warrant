# Negative Result Warrant

> **Empty is not absent.**

`negative-result-warrant` is an **experimental executable reference profile** for making a bounded negative query premise usable by a downstream operation only after provider-reported evidence is sufficient, bound to that exact premise, transported, and receiver-validated.

It is deliberately narrow. It is **not** a proof of world-level absence, a cryptographic non-membership proof, a general safe-action framework, or an MCP semantic.

## The observed contrast

A recorded real Algolia run used one precommitted bounded query twice under the same source/view/index and matching controls:

```text
ordinary observation Q
  real HTTP 200 + nbHits=0
  but no explicit source-reported effective-index witness
  → UNKNOWN
  → downstream premise BLOCK
  → effect 0

verification observation Q′
  same bounded query + getRankingInfo=true
  → real HTTP 200 + nbHits=0
  → exhaustive hit-count metadata + indexUsed="bestbuy"
  → WARRANTED_ZERO
  → proposition-preserving composition
  → official MCP 2026-07-28 carriage
  → receiver decode + validation
  → exact operation-derived premise PASS
  → effect exactly once
```

Q and Q′ are **separate HTTP observations**. The stable object is the bounded query proposition, not a single observation that was “upgraded.” Under this experimental no-inference profile, Q lacked an explicit source-reported effective-scope witness; the verification request acquired that witness.

## What is actually claimed

> We present an experimental executable reference profile in which a bounded negative query premise becomes usable by a downstream operation only after provider-reported evidence is bound to that exact premise, transported, and receiver-validated.

The warrant is issued **locally by the profile evaluator from provider-reported fields**. It is not an Algolia-issued certificate and not a cryptographic proof.

The real-source evidence is an existence result for one Algolia application, index, credential-defined view, query, two observations, one MCP path, and one deterministic local effect. It does not generalize to all Algolia searches, all providers, all MCP tools, or world-level nonexistence.

## Why this repository exists

The individual ideas are mostly prior art: query completeness, fail-closed verification, proof/claim binding, receiver checking, provenance, and action gating all predate this repository. The contribution posture is therefore **systems composition / executable profile**, not a new foundational logic.

The repository makes one narrow seam independently inspectable:

```text
provider observation
  → negative-evidence sufficiency
  → exact ZeroProposition
  → bound warrant
  → protocol carriage
  → receiver validation
  → exact premise consumption
```

See [`docs/PRIOR-ART.md`](docs/PRIOR-ART.md) and [`docs/LIMITATIONS.md`](docs/LIMITATIONS.md) before making novelty or safety claims.

## Repository layout

- [`PROFILE.md`](PROFILE.md) — the release-level experimental profile and terminology.
- [`reference/phase3/`](reference/phase3/) — the **frozen Phase 3 real-source artifact**, preserved as the historical constructive witness.
- [`docs/REPRODUCIBILITY.md`](docs/REPRODUCIBILITY.md) — offline verification and optional live replay.
- [`docs/LIMITATIONS.md`](docs/LIMITATIONS.md) — trust, temporal, capture, configuration, and empirical limits.
- [`docs/PRIOR-ART.md`](docs/PRIOR-ART.md) — explicit collision posture, including authenticated denial/non-membership systems.
- [`docs/ERRATA.md`](docs/ERRATA.md) — release-level corrections to wording in the immutable historical report.
- [`audit/phase4/`](audit/phase4/) — frozen externalization/prior-art audit that motivated the narrow public claim.

## Consumer witness

A versioned consumer witness is published at [`risu-research/negative-result-warrant-agents-consumer`](https://github.com/risu-research/negative-result-warrant-agents-consumer), with release [`v0.1.0-rc.1`](https://github.com/risu-research/negative-result-warrant-agents-consumer/releases/tag/v0.1.0-rc.1).

That witness consumes the recorded NRW evidence through the OpenAI Agents SDK v0.15.0 application-only `customData` path, revalidates it after the SDK boundary, derives the operation's exact negative premise, and blocks persuasive model-visible text when matching machine evidence is missing.

This is a **third-party runtime witness**, not independent human adoption, not another provider witness, and not evidence that the SDK itself guarantees NRW semantics.

## Reproduce without touching the live provider

The default verification path uses only recorded artifacts:

```bash
bash ./scripts/verify-recorded.sh
```

For the TypeScript reference checks after installing the pinned dependencies:

```bash
cd reference/phase3
pnpm install --frozen-lockfile
pnpm check
```

The live Algolia experiment is intentionally **not** part of CI. The public demo is mutable and should not be repeatedly queried merely to prove that the recorded run existed. See [`docs/REPRODUCIBILITY.md`](docs/REPRODUCIBILITY.md).

## MCP metadata namespace

The historical Phase 3 fixture intentionally retains its experimental key:

```text
org.example.phase3/algolia-real-source-evidence
```

The public reference-profile adopter key is:

```text
io.github.risu-research/negative-result-warrant
```

The namespace is an identifier, **not a trust signal**. Envelope versioning remains inside the evidence object. See [`PROFILE.md`](PROFILE.md).

## Integrity is not authenticity

SHA-256 manifests establish that the recorded files have not changed relative to the published manifest. They do **not** cryptographically prove that Algolia generated the response, that the source data were true, or that the source state persisted until the effect.

For comparison, systems such as DNSSEC provide authenticated denial of existence using signed NSEC/NSEC3-style mechanisms. This project does not claim that property.

## Status

**Release candidate: semantics frozen; public shell only.**

The next useful information should come from external inspection, reproduction, or consumption—not another synthetic hardening phase.

## License

Apache-2.0. See [`LICENSE`](LICENSE).
