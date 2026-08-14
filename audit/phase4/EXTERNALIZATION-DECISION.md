# EXTERNALIZE-NARROW

## Decision

There is a small, meaningful, executable object left after prior-art subtraction, but it is substantially narrower than “a new negative-result warrant primitive.” Externalize the Algolia executable profile and chain as a composition artifact. Do not externalize an atomic novelty, general API, safe-action, or proof-carrying-agent-action claim.

Primary contribution classification: **C. New executable profile**.

Secondary classifications: **B. New systems composition** and **D. New empirical finding**.

## Strongest surviving claim

An executable Algolia profile makes a bounded zero-result observation admissible to one downstream operation only after source-reported scope and exactness evidence is bound to that operation-derived negative proposition, transported through MCP, and revalidated by the receiver.

## Closest prior art

The closest semantic prior art is [query-completeness/partial-closed-world reasoning](https://arxiv.org/abs/1408.6395) and [CROWN-QA](https://arxiv.org/abs/2608.04591). The closest control-path prior art is [proof-carrying authorization](https://www.cs.princeton.edu/techreports/2001/638.pdf) and [Proof-Carrying Agent Actions](https://arxiv.org/abs/2606.04104). The closest claim-verification and MCP-provenance systems are [Proof-Carrying Numbers](https://arxiv.org/abs/2509.06902) and [ProvenanceGuard](https://arxiv.org/abs/2606.18037).

## Most dangerous collision

Proof-carrying authorization is the most dangerous mechanism-level collision. Its server issues an exact proof goal, the client can fail to prove it, iteratively fetch additional facts, retry, present a proof for the correct challenge, and receive access only after server verification. When combined with database query-completeness predicates, it anticipates most of the abstract Project 4 chain.

It does not fully subsume the artifact because the located PCA work does not instantiate a real negative HTTP observation, a provider-native exactness/effective-scope witness, a checked proposition-preserving verification request, the Phase 3 `ZeroProposition`/authority/source bindings, or an MCP receiver boundary. That remainder is an executable profile/composition contribution, not an atomic mechanism.

## C1–C9 classifications

- C1 — **PRIOR ART**
- C2 — **LIKELY PRIOR ART**
- C3 — **LIKELY PRIOR ART**
- C4 — **PRIOR ART**
- C5 — **PRIOR ART**
- C6 — **COMBINATION-ONLY**
- C7 — **PRIOR ART**
- C8 — **LIKELY PRIOR ART**
- C9 — **DISTINCT ON CURRENT SEARCH**

C9’s label applies only to the exact narrow chain on the current primary-source search. It is not a patentability conclusion and does not upgrade C1–C8.

## Phase 3 verification gate

Supplied archive:

`negative-result-warrant-phase-3.zip`

Observed SHA-256:

`154c389076e18ae4ce6b3b8dcc592c8d696a486faed1a3217459e29b279feea6`

This exactly matches the Phase 3 handoff digest.

Expanded-artifact verification:

- Every entry in `ARTIFACT-MANIFEST.sha256` verified `OK`.
- Artifact-manifest SHA-256: `8299e1ab819f7f01d83bff5677346e6ab26f260e2f5ae0effd3436e1ee075002`.
- Every entry in the immutable real-evidence `MANIFEST.sha256` verified `OK`.
- Real-evidence manifest SHA-256: `ec582c620d0a11c21e20441ca30c6bf65c486c353eecd597960fb97a48a058b9`.
- Every Phase 2.1 semantic source in `FROZEN-PHASE-2.1-SOURCE-HASHES.sha256` verified `OK`.
- Frozen-source manifest SHA-256: `f74c168e8b2e8e8ae6d7504d3d5731729bd41bd4a16972c365610db02c783dfd`.
- The supplied expanded archive has no residual Phase 4 dependency staging and all manifest-covered paths remain unchanged.

The manifest-bound Phase 3 record reports strict TypeScript pass, 10/10 Phase 3 tests, 216/216 frozen Phase 2.1 tests, Q `UNKNOWN/BLOCK/effect 0`, Q′ `WARRANTED_ZERO/PASS/effect 1`, successful composition, MCP receiver acceptance, and 10/10 adversarial blocks. Phase 4 did not repeat the live Algolia calls. An independent test rerun was not completed because the supplied ZIP omits installed dependencies and sandboxed registry resolution was unavailable; the recorded test results and scripts were integrity-verified instead.

## Causal evidence accepted

- Q and Q′ each returned HTTP 200 and `nbHits=0` for the same bounded query proposition.
- Q had exact hit-count indicators but no `indexUsed`; under the experimental no-inference profile it evaluated `UNKNOWN`, and the first operation blocked with effect count 0.
- Q′ preserved the comparator-defined proposition while adding `getRankingInfo=true`; the response reported `indexUsed="bestbuy"` plus exact hit-count evidence and evaluated `WARRANTED_ZERO`.
- The bound evidence linked the request, response, observation, provider/application/index, authority-context fingerprint, source scope, and exact proposition.
- The private evidence envelope crossed official MCP 2.0.0 / protocol `2026-07-28` and was re-decoded and revalidated.
- The operation derived the required proposition from its own application/index/query/credential inputs. It passed only for exact accepted evidence and executed one local effect.

## Mandatory wording correction

Rejected Phase 3 sentence: “The same real empty search result was not sufficient merely because it was empty.”

Corrected sentence:

> The same bounded query produced empty observations in both requests. The ordinary observation lacked the explicit effective-scope witness required by the experimental profile; a proposition-preserving verification request acquired that source-reported witness.

This correction is recorded here rather than changing frozen Phase 3.

## `getRankingInfo` attack result

[Algolia documents](https://www.algolia.com/doc/api-reference/api-parameters/getRankingInfo) `getRankingInfo` as extra ranking metadata and documents `indexUsed` as the index actually used, which can differ under A/B tests. The frozen Q already used a direct index path and `enableABTest=false`. Therefore Phase 3 does not establish that Q was generally epistemically inadequate under Algolia’s contract. It establishes only that Q lacked an explicit source-reported effective-index echo demanded by the experiment’s deliberately strict no-inference profile, while Q′ acquired that echo.

## Strongest reviewer attack

“Database query completeness supplies the negative semantics, while proof-carrying authorization supplies exact challenge binding, iterative evidence acquisition, receiver verification, and gated access; Algolia and MCP are incidental adapters.”

Exact response:

“Accept the atomic and combination precedent, then narrow. Project 4 claims no new negative logic or proof-carrying action principle. It contributes a falsifiable executable Algolia profile showing that provider-native scope/exactness evidence can be normalized, bound to an operation-derived bounded negative proposition, carried through MCP, and revalidated at use.”

## Empirical, trust, and temporal boundaries

Empirical boundary: one public Algolia demo application, one index, one nonce query, two observations, one credential-defined view, one experimental profile, one MCP path, and one deterministic local effect. This is an existence result only.

Trust boundary: the artifact trusts the HTTPS source observation, provider documentation as interpreted by the profile, local capture/normalization/evaluation code, application/index/authority bindings, MCP server path, and receiver. It has no Algolia signature, independent issuer attestation, external truth oracle, or guarantee of source completeness beyond the reported response fields.

Temporal boundary: the warrant is about the bound observation. The source may change before the operation uses the premise. No freshness, lock, transaction, snapshot identity, recheck, or state-continuity property is demonstrated.

## Generality limits

The artifact does not justify any of the following inferences:

- one Algolia demo → all Algolia deployments;
- one provider → all APIs;
- bounded source-view zero → real-world absence;
- one local effect gate → safe agent action;
- one MCP carriage path → an MCP standard semantic; or
- observation-time warrant → truth at commit time.

## Terminology decision

Keep: Negative Result Warrant, `WARRANTED_ZERO`, `ZeroProposition`, `BoundNegativeEvidence`, negative-premise gate, bounded, observation-relative, provider-grounded, receiver-validated.

Avoid: proof-carrying agent action, certified absence, certified negative, proof of absence, truth certificate, safe action, complete source, general API primitive, MCP guarantee.

## Next externalization object — ranking only

1. **Standalone public repository/spec + executable artifact.** Fastest falsifiability, highest independent reuse, no academic gatekeeping dependency, and the best way for API, standards, database, and agent-infrastructure reviewers to rerun the exact narrow claim.
2. **Short technical note / paper.** Useful after the repository fixes the claim, vocabulary, and reproducible evidence surface; otherwise it risks appearing as a broad novelty claim without the most valuable falsification object.
3. **External consumer integration.** Valuable later, but it adds consumer-specific assumptions and obscures the exact profile before outsiders have reviewed it.

Recommended first move: **standalone public repository/spec + executable artifact**. Do not build it in Phase 4.

