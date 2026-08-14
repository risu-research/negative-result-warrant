#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PHASE3="$ROOT/reference/phase3"
RUN="$PHASE3/evidence/real/algolia/20260814T013017406Z-fd070306"

command -v sha256sum >/dev/null 2>&1 || {
  echo "sha256sum is required for recorded-evidence verification." >&2
  exit 1
}

echo "[1/4] Phase 3 artifact manifest"
(
  cd "$PHASE3"
  sha256sum -c ARTIFACT-MANIFEST.sha256 >/dev/null
)

echo "[2/4] Real Algolia evidence manifest"
(
  cd "$RUN"
  sha256sum -c MANIFEST.sha256 >/dev/null
)

echo "[3/4] Frozen Phase 2.1 semantic source hashes"
(
  cd "$PHASE3/frozen"
  sha256sum -c FROZEN-PHASE-2.1-SOURCE-HASHES.sha256 >/dev/null
)

echo "[4/4] Historical Phase 3 ZIP digest declaration"
EXPECTED="154c389076e18ae4ce6b3b8dcc592c8d696a486faed1a3217459e29b279feea6"
RECORDED="$(cat "$ROOT/reference/PHASE3-ZIP-SHA256.txt")"
if [[ "$RECORDED" != "$EXPECTED" ]]; then
  echo "Recorded Phase 3 ZIP digest mismatch: $RECORDED" >&2
  exit 1
fi

echo "Recorded evidence verified."
