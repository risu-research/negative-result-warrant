# Contributing

Issues, counterexamples, prior-art corrections, and independent consumer reports are especially welcome.

## Frozen historical evidence

Do not edit files under:

- `reference/phase3/evidence/`
- `reference/phase3/frozen/`
- `audit/phase4/`

A correction to historical wording belongs in `docs/ERRATA.md`, not by rewriting the recorded witness.

## Semantic changes

The current semantic core is frozen for this release candidate. A change to verdict meaning, proposition identity, provider obligations, receiver invariants, or gate semantics should be proposed as a separately versioned experiment with an explicit compatibility note rather than silently changing the reference witness.

## Highest-value contributions

Prefer:

1. a concrete false-PASS or false-BLOCK counterexample;
2. a primary-source prior-art collision not already credited;
3. an independent consumer integration using the public metadata namespace; or
4. an independently captured real-source witness that preserves the same narrow claim discipline.
