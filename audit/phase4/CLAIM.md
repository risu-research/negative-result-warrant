# Phase 4 claim

## Strongest surviving one-sentence claim

An executable Algolia profile makes a bounded zero-result observation admissible to one downstream operation only after source-reported scope and exactness evidence is bound to that operation-derived negative proposition, transported through MCP, and revalidated by the receiver.

This is 36 words. It is intentionally provider-specific, operation-specific, and framed as an executable profile rather than a new foundational principle.

## Exact demonstrated result

The same bounded query produced empty observations in both requests. The ordinary observation lacked the explicit effective-scope witness required by the experimental profile; a proposition-preserving verification request acquired that source-reported witness. Under that profile, Q remained `UNKNOWN` and the operation blocked with effect count 0; Q′ became `WARRANTED_ZERO`, survived MCP carriage and receiver validation, and enabled the operation once.

Q and Q′ are separate source observations. They are not “the same real empty search result.” The stable object is the bounded query proposition; the observations and their byte bindings differ.

## Contribution boundary

The artifact does not invent:

- open-world reasoning, query completeness, partial closed-world assumptions, or the rule that missing support does not license negation;
- `Unknown` versus coverage-licensed negative judgments;
- proof-carrying code, proof-carrying authorization, exact challenge binding, iterative proof-component acquisition, receiver-side proof checking, or fail-closed access;
- claim-bound verification, subject binding, provenance, source attribution, action gating, policy engines, receipts, or MCP structured results;
- provider flags for exact hit counts, effective index identity, pagination closure, or completeness; or
- freshness, source truth, state continuity, transactionality, or safe-agent-action guarantees.

The surviving contribution is a concrete executable profile that composes these known ideas at one narrow seam: real Algolia response evidence becomes a proposition-bound negative premise, crosses a real MCP result boundary, is revalidated, and is consumed only by an operation that derives the same premise from its own inputs.

## Novelty posture

We do not claim to invent completeness-sensitive negation or proof-bearing action gates. We demonstrate one independently inspectable composition in which a real provider’s explicit scope and exactness fields are normalized into a bounded negative-result warrant and mechanically checked at the consuming operation after protocol transport.

Primary contribution classification: **C. New executable profile**.

Secondary classifications: **B. New systems composition** and **D. New empirical finding**. The empirical finding is only an existence result for the recorded Algolia slice.

## Empirical scope

- One public Algolia demo application: `latency`.
- One index: `bestbuy`.
- One nonce query and one fixed matching-control profile.
- Two HTTP observations, Q and Q′, recorded on 2026-08-14 UTC; no retries.
- Q′ added `getRankingInfo=true`; the match predicate was preserved under the artifact’s comparator.
- One official MCP 2.0.0 / protocol `2026-07-28` path.
- One deterministic local operation with one in-memory effect counter.

This proves that the chain can exist. It does not establish the behavior of all Algolia applications, all Algolia configurations, other providers, all APIs, production agent systems, or the world outside the source-effective view.

## Trust boundary

The profile trusts the captured HTTPS response as an Algolia source observation, the local normalizer and frozen evaluator, the profile’s interpretation of Algolia fields, the application/index/credential-fingerprint bindings, the MCP server path, and the receiver implementation. Algolia did not sign the warrant. The prototype supplies no independent attestation that the source data are true, complete beyond the response contract, immutable, or honestly served. Receiver validation establishes structural and binding consistency under local trust policy, not source truth.

## Temporal boundary

`WARRANTED_ZERO` is admissibility evidence about the bound observation. It is not a guarantee that the source remains unchanged until or after the effect. The profile has no transaction, state lock, freshness window, compare-and-swap, or recheck at commit, so it does not close the time-of-check/time-of-use gap.

## Terminology

Keep:

- Negative Result Warrant
- `WARRANTED_ZERO`
- `ZeroProposition`
- `BoundNegativeEvidence`
- negative-premise gate
- provider-grounded, bounded, observation-relative, receiver-validated

Avoid:

- proof-carrying agent action
- certified absence
- proof of absence
- truth certificate
- safe action
- complete database
- real-world nonexistence
- MCP guarantee or MCP semantic

