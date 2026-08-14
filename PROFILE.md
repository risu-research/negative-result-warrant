# Experimental Negative Result Warrant Reference Profile

Status: **experimental / release candidate**

This document describes the narrow public profile demonstrated by the frozen Phase 3 artifact. It is not a standards-track specification.

## 1. Core rule

A zero-result observation is not itself an admissible negative premise.

A downstream operation may consume a bounded negative premise only when all of the following hold:

1. a supported source profile evaluates the bound observation as `WARRANTED_ZERO` rather than merely empty;
2. the resulting warrant is bound to an exact `ZeroProposition`;
3. any evidence-strengthening request preserves that proposition;
4. transported evidence is decoded and receiver-validated after the protocol boundary;
5. the consuming operation derives the premise it requires from its own inputs; and
6. the receiver-validated evidence proposition exactly matches that required premise.

Otherwise the premise is blocked.

## 2. Verdict vocabulary

- `PRESENT`: positive-result compatibility behavior; not the research center.
- `UNKNOWN`: the observation does not carry sufficient evidence under the selected profile to license zero as a usable negative premise.
- `WARRANTED_ZERO`: under the identified source contract, exact request, effective source scope, visibility context, and bound observation, source-reported evidence warrants zero matches.

`WARRANTED_ZERO` does **not** mean world-level nonexistence, durability, future truth, freshness, or cryptographic authenticity.

## 3. Reference witness

The frozen real witness is Algolia-specific. The recorded run used:

- application `latency`;
- index `bestbuy`;
- one precommitted nonce query;
- one credential-defined view;
- two real observations Q and Q′;
- the same matching semantics;
- `getRankingInfo=true` as the sole intended evidence-strengthening difference in Q′.

Under the experimental no-inference profile, Q remained `UNKNOWN` because it did not include an explicit source-reported effective-index witness. Q′ returned `indexUsed="bestbuy"` and the required exactness metadata and became `WARRANTED_ZERO`.

This is a profile decision. It is **not** a claim that Algolia itself declares Q epistemically insufficient or that every Algolia application requires a verification query.

## 4. Binding layers

The reference implementation distinguishes:

- source instance — which Algolia application was queried;
- authority/view — which credential-defined source view was observed;
- exact application-level request and response body bindings;
- deterministic normalized profile-input bindings;
- concrete source scope;
- `ZeroProposition` identity;
- receiver-validation state; and
- the operation-derived required premise.

These are not interchangeable.

## 5. Receiver boundary

Protocol metadata begins as `unknown`. A TypeScript cast does not make evidence validated.

The frozen receiver reconstructs a supported evidence object, validates its internal bindings and issuance invariants, deep-freezes it, and records a private runtime validation mark. Serialization through MCP resets that runtime trust; transported metadata must be decoded again before use.

## 6. MCP carriage

MCP is a carrier in this experiment, not the source of the warrant semantic. MCP lifecycle completion must not be interpreted as evidentiary completeness.

Historical Phase 3 evidence uses:

```text
org.example.phase3/algolia-real-source-evidence
```

New integrations following this public profile should use:

```text
io.github.risu-research/negative-result-warrant
```

The metadata key does not authenticate the producer. Evidence version and validation requirements remain inside the carried object.

## 7. Capture level

The real witness uses **application-level HTTP capture**: method/URL, semantics-relevant request data, exact request-body bytes, status/final URL, response headers exposed by the Fetch API, content type, and exact response-body bytes.

It does not claim packet-level, TLS-record-level, TCP-framing, header-order, or cryptographically attested server-execution capture.

## 8. Temporal boundary

A warrant concerns the bound observation. It is not a state lock.

The profile provides no transaction, compare-and-swap, freshness window, source recheck at commit, or other TOCTOU closure.

## 9. Public contribution posture

Do not describe this profile as:

- proof of absence;
- certified absence;
- a truth certificate;
- a proof-carrying agent action architecture;
- a general safe-action system; or
- an MCP guarantee.

Preferred description:

> An experimental executable reference profile for carrying a bounded negative query premise from provider-reported evidence to exact downstream premise consumption with explicit proposition binding and receiver validation.
