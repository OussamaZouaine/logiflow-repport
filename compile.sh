#!/usr/bin/env bash
# 1) Render Mermaid → PNG  2) Compile LaTeX
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

# MiKTeX (install utilisateur) — Git Bash ne l’ajoute pas toujours au PATH.
MIKTEX_BIN="${MIKTEX_BIN:-/c/Users/Lenovo PC/AppData/Local/Programs/MiKTeX/miktex/bin/x64}"
export PATH="$MIKTEX_BIN:$PATH"

if [ -x "$ROOT/scripts/render-mermaid.sh" ] || [ -f "$ROOT/scripts/render-mermaid.sh" ]; then
  bash "$ROOT/scripts/render-mermaid.sh" || echo "Avertissement : rendu Mermaid incomplet — le PDF affichera des placeholders."
fi

if ! command -v latexmk >/dev/null 2>&1; then
  echo "latexmk introuvable. Vérifiez MIKTEX_BIN ou ajoutez MiKTeX au PATH Windows."
  echo "Chemin attendu : $MIKTEX_BIN"
  exit 1
fi

latexmk -pdf -interaction=nonstopmode main.tex
