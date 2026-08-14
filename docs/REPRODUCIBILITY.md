# Reproducibility

The repository separates **recorded-evidence verification** from **live-provider replay**.

## 1. Offline verification first

No network request to Algolia is required to verify the published evidence manifests:

```bash
bash ./scripts/verify-recorded.sh
```

This checks:

- the frozen Phase 3 artifact manifest;
- the real Algolia evidence manifest;
- the frozen Phase 2.1 semantic-source hashes; and
- the recorded Phase 3 ZIP digest declaration.

## 2. Run the deterministic TypeScript checks

Install only the pinned lockfile dependencies in the frozen reference artifact:

```bash
cd reference/phase3
pnpm install --frozen-lockfile
pnpm check
```

The recorded Phase 3 package uses the exact MCP client/server 2.0.0 dependency path captured by the experiment.

## 3. Why CI does not call Algolia

The real provider is external and mutable. Repeated CI queries would test the provider's present state, not prove the historical recorded run, and would unnecessarily consume a public demo service.

CI therefore verifies manifests and deterministic tests only.

## 4. Optional live replay

The frozen reference contains the original preparation and live-run scripts under `reference/phase3/scripts/`. A live replay should be treated as a **new observation**, not a reproduction of the historical bytes.

Before running it:

1. independently confirm that Algolia still publishes the intended public/search-only demo credential and tuple;
2. never substitute an admin key or private production credential;
3. precommit a new query/run rather than editing historical evidence; and
4. store a new run separately from `reference/phase3/evidence/`.

The historical evidence tree is immutable.

## 5. Secret handling

The published artifact retains only the SHA-256 fingerprint of the public search credential used in the original run. The raw credential is not included in the repository.
