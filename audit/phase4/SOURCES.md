# Primary sources and search record

Research cutoff: **2026-08-13**. All mechanism claims in the Phase 4 outputs rely on primary papers, official specifications, official vendor documentation, or original project documentation. Secondary search results were used only to discover primary sources and are not evidentiary citations.

## Search method

The collision search used combinations of these vocabularies:

- query completeness, completeness statements, partial closed world, negative query soundness, open-world negation, certain/possible answers;
- absence evidence, certified negative, unknown, coverage certificate, query-relative coverage;
- proof-carrying code, authentication, authorization, data, answers, numbers, agent actions, exact challenge, iterative proving;
- claim-bound, subject-bound, evidence-bound, receiver verification, fail closed, operation admissibility;
- provenance guardrail, source-aware verification, MCP provenance, tool trace, action receipt, runtime governance;
- negative provenance, why-not provenance, missing answer, failed derivation;
- exact hit count, exhaustive search, effective index, pagination closure, `has_more`, final page, lower-bound count;
- observation-to-action, evidence acquisition, pre-action gate, state drift, and TOCTOU.

No primary source located in this search instantiated the entire C9 chain. That is a bounded negative search result, not proof that no such work exists.

## Database completeness and negative reasoning

1. [Darari, Razniewski, and Nutt, *Bridging the Semantic Gap between RDF and SPARQL using Completeness Statements*](https://arxiv.org/abs/1408.6395) (2014). Formalizes completeness statements, valid interpretations, and certain/possible answers for SPARQL with negation. Establishes that query-relative completeness and sound negation are prior art.

2. [Razniewski et al., *Completeness, Recall, and Negation in Open-World Knowledge Bases: A Survey*](https://arxiv.org/abs/2305.05403) (2023/2024). Surveys partial-closed-world semantics, completeness metadata, recall, and negative knowledge. Used to avoid treating open-world versus closed-world reasoning as novel.

3. [Min et al., *When Absence Is Evidence: Evaluating Completeness-Sensitive Negative Reasoning in Large Language Models*](https://arxiv.org/abs/2608.04591) (CROWN-QA, 2026-08-05). Defines the central LLM evaluation distinction: missing support warrants a negative only with query-covering evidence; otherwise `Unknown`. Its structured certificates are model-elicited diagnostics, not source-native operational warrants.

## Proof-carrying and claim-bound mechanisms

4. [Necula, *Proof-Carrying Code*](https://dl.acm.org/doi/10.1145/263699.263712) (POPL 1997). Establishes producer-supplied proof checked by a host before executing untrusted code under a policy.

5. [Appel and Felten, *Proof-Carrying Authentication*](https://www.cs.princeton.edu/~appel/papers/says.pdf) (CCS 1999). Establishes proof-bearing requests for distributed authentication/authorization logic.

6. [Bauer, Schneider, and Felten, *A Proof-Carrying Authorization System*](https://www.cs.princeton.edu/techreports/2001/638.pdf) (2001). Critical collision: exact server challenge, mechanically generated proof, receiver checking, access only after proof, and iterative fetching of missing facts until the goal can be proved.

7. [Solatorio, *Proof-Carrying Numbers*](https://arxiv.org/abs/2509.06902) (2025). Claim-bound numeric tokens, external renderer verification, and fail-closed unverified defaults. Establishes claim binding and external verification as prior art.

8. [Wang, *Proof-Carrying Agent Actions: Model-Agnostic Runtime Governance for Heterogeneous Agent Systems*](https://arxiv.org/abs/2606.04104) (2026-06-02). High-priority collision: portable action envelope, pre-action admissibility, assumption capture, approval and runtime receipts, outcome closure, replay, coverage honesty, and an explicitly architectural novelty claim.

## Provenance, MCP, and agent guardrails

9. [She, Liang, and Kang, *Safeguarding LLM Agents from Misalignment through Provenance Analysis*](https://arxiv.org/abs/2607.01236) (v2, 2026-08-10). A provenance-based runtime monitor intercepts proposed tool calls before execution and rejects calls lacking adequate contextual support. This establishes provenance-aware pre-action gating as prior art.

10. [Alvarez et al., *ProvenanceGuard: Source-Aware Factuality Verification for MCP-Based LLM Agents*](https://arxiv.org/abs/2606.18037) (v2, 2026-07-26). Consumes MCP traces with stable source IDs, routes atomic claims, checks support with NLI/alignment/calibration, and returns allow/block. Establishes source-aware MCP claim verification, but is post-hoc and learned rather than a source-native negative-premise gate.

11. [W3C PROV-O Recommendation](https://www.w3.org/TR/prov-o/) (2013). Standardizes entities, activities, agents, generation, derivation, use, attribution, and provenance bundles. Establishes general provenance vocabulary as prior art.

12. [Model Context Protocol Tools specification, version 2026-07-28](https://modelcontextprotocol.io/specification/2026-07-28/server/tools). Defines structured tool results, optional output schemas, metadata, client validation guidance, and explicit state handles. It provides a carrier and validation affordance; it does not give private Project 4 metadata completeness semantics.

## Attestation and subject binding

13. [in-toto Statement v1](https://github.com/in-toto/attestation/blob/main/spec/v1/statement.md). Binds typed predicates to immutable digest-identified subjects. General subject binding is therefore not a Project 4 novelty.

14. [SLSA provenance v1.2](https://slsa.dev/spec/v1.2/provenance). Defines verifiable information about where, when, and how software artifacts were produced. Used as adjacent portable-provenance prior art.

## Negative and missing-answer provenance

15. [Lee et al., *Efficiently Computing Provenance Graphs for Queries with Negation*](https://arxiv.org/abs/1701.05699) (2017). Computes explanations for existing and missing query answers by capturing successful and failed derivations.

16. [Lee, Ludaescher, and Glavic, *PUG: A Framework and Practical Implementation for Why & Why-Not Provenance*](https://arxiv.org/abs/1808.05752) (2018). Implements provenance explanations for answers and non-answers. These works explain absence from a result; they do not certify source-view completeness.

## Provider-native exactness, scope, and closure

17. [Algolia `getRankingInfo`](https://www.algolia.com/doc/api-reference/api-parameters/getRankingInfo) (official, modified 2026-03-11). Documents extra ranking metadata including `indexUsed`, which may differ under A/B tests.

18. [Algolia search response fields](https://www.algolia.com/doc/libraries/sdk/v1/methods/search) (official). Documents `exhaustive.nbHits`, `indexUsed`, `nbHits`, rule exhaustivity, timeouts, and the conditions under which fields are returned.

19. [Algolia support: verifying the index used during A/B testing](https://support.algolia.com/hc/en-us/articles/29487019500049-Why-is-a-record-that-does-not-exist-in-my-index-still-appearing-in-my-search-results) (official, 2026-01-14). Explicitly recommends `getRankingInfo:true`/`indexUsed` to verify routing when A/B testing can substitute an index. This source makes the Phase 3 no-inference-profile limitation especially important.

20. [Elasticsearch Search API — track total hits](https://www.elastic.co/docs/solutions/search/the-search-api) (official). `track_total_hits=true` requests exact counts; `total.relation="eq"` is exact and `"gte"` is a lower bound. Demonstrates a provider-native evidence-strengthening pattern.

21. [Amazon DynamoDB query pagination](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Query.Pagination.html) (official). Only absence of `LastEvaluatedKey` establishes the final page; an empty page can coexist with a continuation key. Demonstrates why an empty observation alone may be non-closing.

22. [Stripe pagination](https://docs.stripe.com/pagination) (official). `has_more` distinguishes a partial page from completed enumeration. Further evidence that API closure flags are ordinary provider contracts.

## Policy gates, receipts, and temporal limits

23. [Cedar authorization reference](https://docs.cedarpolicy.com/auth/authorization.html) (official). Request-scoped principal/action/resource/context input produces deterministic allow/deny under policy. Establishes operation-specific gates as prior art.

24. [Open Policy Agent decision logs](https://www.openpolicyagent.org/docs/management-decision-logs) (official). Decision records include policy-query input, result, metadata, and decision ID. Establishes auditable policy receipts as prior art.

25. [MITRE CWE-367: Time-of-check Time-of-use Race Condition](https://cwe.mitre.org/data/definitions/367.html) (version 4.20, updated 2026-04-30). A checked resource may change before use. Used to draw the strict observation-admissibility versus state-continuity boundary.

## Source conclusions

- Semantic atom: prior art.
- Proof/claim binding atom: prior art.
- Receiver verification and fail-closed action atom: prior art.
- Provenance and MCP source attribution: prior art.
- Provider exactness/pagination witness pattern: prior art or likely prior art.
- Exact Phase 3 C9 chain: not found in the current primary-source search.
- Responsible posture: **new executable profile / narrow systems composition**, not a new foundational mechanism.
