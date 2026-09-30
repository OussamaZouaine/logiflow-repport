# Rapport LogiFlow (LaTeX) — Projet tutoré ENSI Tanger

Dossier du rapport scolaire : conception, architecture, IA, infra et sécurité.

## Cloner et publier (GitHub)

```bash
git clone <url-du-repo>
cd logiflow-repport
npm ci                    # Playwright (captures optionnelles)
npx playwright install chromium
bash compile.sh           # génère main.pdf (non versionné)
```

Les PNG Mermaid dans `figures/out/` et les captures dans `figures/screenshots/` sont versionnés pour que le PDF compile sans Node. Pour régénérer les diagrammes : `npm run figures`.

## Compiler (Windows)

1. Installer [MiKTeX](https://miktex.org/download) (*install missing packages on the fly*).
2. Installer [Node.js](https://nodejs.org/) (pour rendre les diagrammes Mermaid).
3. Dans ce dossier :

```bash
bash compile.sh
```

Ou en deux temps :

```bash
bash scripts/render-mermaid.sh   # figures/*.mmd → figures/out/*.png
bash compile.sh                  # latexmk → main.pdf
```

PowerShell : `.\compile.ps1`

### `latexmk: command not found` (Git Bash)

```bash
export PATH="$PATH:/c/Users/Lenovo PC/AppData/Local/Programs/MiKTeX/miktex/bin/x64"
```

## Structure

```
main.tex                 couverture ENSI + entrée
chapitres/00-frontmatter.tex   dédicaces, résumé, abstract, avant-propos, sigles
chapitres/01–09*.tex     corps
chapitres/a-glossaire.tex
chapitres/b-adr.tex
figures/*.mmd            sources Mermaid
figures/out/*.png        PNG générés
figures/screenshots/     captures d'écran app (PNG à déposer)
figures/logo-ensi.png    logo ENSI
scripts/render-mermaid.sh
biblio.bib
```

## Captures d'écran

1. Exporter les écrans en PNG dans `figures/screenshots/` (noms dans `figures/screenshots/README.md`).
2. Recompiler : les placeholders du chapitre « Interfaces et captures d'écran » se remplacent tous seuls.

## Livrable

`main.pdf` est le rapport à déposer. Sources LaTeX dans `chapitres/`.  
`plan-soutenance.md` est un aide-mémoire oral (hors livrable PDF).

## Diagrammes Mermaid (principaux)

| Fichier | Sujet |
|---|---|
| `c4-containers` / `flux-global` | Vue conteneurs / flux |
| `ia-architecture` / `ia-schema` | Agents IA + schéma copilote |
| `infra-aws` / `deploy` | Topologie 1×EC2 + pipeline |
| `modules-backend` / `hexagonal` | Modulith / hexagone |
| `seq-copilote` / `seq-planification` / `seq-auth` | Séquences |
| `planning-gantt` + `gantt-*` | Planning global / individuels |

## Aperçu PDF

Extension **LaTeX Workshop** : ouvrir `main.tex`, `Ctrl+Alt+V`. SyncTeX : `Ctrl+clic` dans le PDF.
