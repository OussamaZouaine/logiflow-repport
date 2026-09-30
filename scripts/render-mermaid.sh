#!/usr/bin/env bash
# Render all figures/*.mmd to figures/out/*.png via mermaid-cli
set -euo pipefail
cd "$(dirname "$0")/.."

OUT="figures/out"
mkdir -p "$OUT"

if ! command -v npx >/dev/null 2>&1; then
  echo "npx introuvable — installez Node.js."
  exit 1
fi

shopt -s nullglob
files=(figures/*.mmd)
if [ ${#files[@]} -eq 0 ]; then
  echo "Aucun fichier .mmd dans figures/"
  exit 1
fi

for mmd in "${files[@]}"; do
  base=$(basename "$mmd" .mmd)
  echo "Rendering $base ..."
  npx --yes -p @mermaid-js/mermaid-cli mmdc \
    -i "$mmd" \
    -o "$OUT/${base}.png" \
    -b white \
    -s 2
done

echo "OK — PNG dans $OUT/"
ls -la "$OUT"
