# Prior-art and collision posture

This project should be evaluated as a **narrow executable systems composition**, not as invention of its atomic ideas.

## Already established elsewhere

The repository does not claim invention of:

- open-world reasoning or query completeness;
- partial closed-world assumptions or completeness-relative negation;
- `Unknown` versus evidence-licensed negative reasoning;
- proof-carrying code or proof-carrying authorization;
- iterative evidence acquisition toward a proof goal;
- exact challenge/claim/subject binding;
- receiver-side proof/evidence verification;
- provenance and source attribution;
- fail-closed action/access gating;
- action identity/canonicalization;
- authenticated denial of existence or cryptographic non-membership proofs;
- provider-native exact-count, pagination, or effective-scope metadata; or
- MCP metadata/structured-result carriage.

## Closest collision families

### Database and Semantic Web completeness

Longstanding work on query completeness and partial closed-world reasoning already formalizes when incomplete information can license negation. That supplies much of the semantic foundation.

### CROWN-QA / completeness-sensitive negative reasoning

CROWN-QA explicitly separates insufficient evidence (`Unknown`) from coverage-licensed negative conclusions. This project does not claim that distinction as new.

### Proof-carrying authorization and proof-bearing action systems

Proof-carrying authorization already provides exact proof goals/challenges, iterative acquisition of missing proof components, receiver checking, and access only after proof succeeds. PCAA extends the action-governance side with portable action certificates, evidence/assumptions, admissibility, receipts, and replay.

### CAVA and action identity

CAVA develops canonical runtime action identity and binds approvals/evidence to the action object. Accordingly, deriving or canonicalizing the consuming action/request is not treated here as an atomic novelty.

### Provenance-based agent guardrails and claim-bound verification

ProvenanceGuard-like systems and proof-carrying output mechanisms already connect claims/actions to evidence and fail closed when verification does not succeed.

### Attestation and subject binding

in-toto/SLSA-style systems already demonstrate portable evidence bound to identified subjects. Generic binding is not claimed as new.

### Authenticated denial and non-membership proofs

DNSSEC has long provided authenticated denial of existence through signed NSEC/NSEC3 mechanisms. Authenticated dictionaries and verifiable-query systems likewise support cryptographically checkable non-membership/query results.

Those systems are **stronger than this project on authenticity**. Negative Result Warrant intentionally targets ordinary provider-reported API evidence under a declared trust boundary rather than cryptographic source proofs.

## What remains

The surviving claim is the exact executable seam demonstrated by the artifact:

```text
real provider observation
  → evidence-sensitive zero verdict
  → proposition-preserving evidence acquisition
  → exact negative proposition binding
  → protocol carriage
  → receiver revalidation
  → exact operation-derived premise consumption
```

On the prior-art audit performed for this release, no located primary source instantiated that full bounded-negative-query chain as the same executable object. This is a **“distinct on current search”** posture, not a universal priority claim.

## Important reviewer concession: the Algolia `getRankingInfo` step

The real Q used a single-index query with A/B participation disabled. Therefore the repository does not claim that Algolia requires `getRankingInfo` before a zero result can be known.

The demonstrated statement is narrower: the experimental profile refused to infer the effective source scope and required an explicit source-reported witness; Q′ acquired `indexUsed` through a proposition-preserving metadata-strengthening request.

## Primary references used by the release audit

- RFC 7129, *Authenticated Denial of Existence in the DNS*: https://www.rfc-editor.org/rfc/rfc7129.html
- RFC 5155, *DNSSEC Hashed Authenticated Denial of Existence*: https://www.rfc-editor.org/rfc/rfc5155.html
- CROWN-QA / *When Absence Is Evidence*: https://arxiv.org/abs/2608.04591
- *Proof-Carrying Agent Actions*: https://arxiv.org/abs/2606.04104
- *CAVA: Canonical Action Verification and Attestation*: https://arxiv.org/abs/2607.13716
- *Proof-Carrying Numbers*: https://arxiv.org/abs/2509.06902
- *Safeguarding LLM Agents from Misalignment through Provenance Analysis*: https://arxiv.org/abs/2607.01236
- *ProvenanceGuard*: https://arxiv.org/abs/2606.18037
- in-toto Statement v1: https://github.com/in-toto/attestation/blob/main/spec/v1/statement.md
- SLSA provenance: https://slsa.dev/spec/v1.2/provenance

The full earlier audit is preserved under `audit/phase4/`.
