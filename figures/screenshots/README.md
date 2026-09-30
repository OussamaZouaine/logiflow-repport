# Captures d'écran LogiFlow

| Fichier | Écran |
|---|---|
| `01-connexion.png` | Connexion |
| `02-app-shell.png` | App Shell (viewport 1920×1080) |
| `03-tableau-de-bord.png` | Tableau de bord (données chargées) |
| `04-liste-commandes.png` | Liste commandes |
| `05-fiche-dossier.png` | Fiche dossier |
| `06-nouveau-voyage.png` | Nouveau voyage (mode IA) |
| `07-liste-voyages.png` | Liste voyages + carte |
| `08-fiche-vehicule.png` | Fiche véhicule |
| `09-carburant.png` | Carburant |
| `10-maintenance.png` | Maintenance |
| `11-copilote.png` | Copilote IA (en ligne + réponse) |
| `12-planification-ia.png` | Propositions de voyages IA |

## Recapturer

FE + BE + AI UP, puis :

```bash
cd logiflow-repport
node scripts/capture-screens.mjs
```

Le script attend la fin des skeletons, vérifie que le Copilote est « En ligne », pose une question, puis lance la planification assistée.
