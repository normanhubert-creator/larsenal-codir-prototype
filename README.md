# ÉQUIDÉCISION

**Laboratoire immersif de management et de finance des établissements équestres.**
Plateforme pédagogique de la licence professionnelle Management des entreprises équestres (ESTHUA, Université d'Angers, campus de Saumur).

Les étudiants choisissent l'une des dix entreprises fictives de la filière équine, en explorent le dossier (histoire, installations, cavalerie, activités, clients, fournisseurs, équipe, marché, comptes, documents de direction), puis réalisent cinq missions : diagnostic stratégique, diagnostic financier, investissement, développement commercial et arbitrage de direction.

- Aucun compte, aucun mot de passe : chaque établissement a une adresse directe (`#/e/<identifiant>`).
- Les travaux sont enregistrés dans le navigateur, séparément par établissement, et s'exportent en Markdown, en JSON ou en PDF (impression).
- Les états financiers sont **calculés** à partir de l'activité (prix × volumes, ETP × salaires, registre des immobilisations, emprunts) et vérifiés par des tests automatiques.

## Les dix établissements

| Identifiant | Établissement | Modèle | Dossier |
|---|---|---|---|
| `clos-des-tilleuls` | Centre équestre du Clos des Tilleuls (49) | Centre équestre et poney-club, SARL | approfondi |
| `bellegrange` | Écuries de Bellegrange (37) | Écurie de propriétaires, SAS | approfondi |
| `mesnil-sorel` | Haras du Mesnil-Sorel (61) | Élevage et valorisation, EARL à l'IR | approfondi |
| `trois-bornes` | Écurie des Trois Bornes (27) | Écurie de compétition (CSO) | standard |
| `bois-ricard` | Écurie d'entraînement du Bois-Ricard (53) | Entraînement de trotteurs | standard |
| `relais-des-drailles` | Relais des Drailles (48) | Tourisme équestre, entreprise individuelle | standard |
| `hautes-ferrieres` | Domaine des Hautes Ferrières (84) | Hôtellerie haut de gamme et activité équestre | standard |
| `orbe-evenements` | Orbe Événements | Organisation de concours (CSI 2*) | standard |
| `crins-de-traverse` | Crins de Traverse (31) | Médiation équine et équitation adaptée, SCIC | standard |
| `cercle-champdieu` | Cercle hippique de Champdieu (42) | Centre équestre associatif sur équipement municipal | standard |

## Lancer le projet

Prérequis : Node.js 20 ou plus récent.

```bash
npm install          # dépendances
npm run dev          # serveur de développement (http://localhost:5173)
npm test             # contrôles de cohérence financière (tous les établissements)
npm run build        # version de production dans dist/
npx vite preview     # prévisualiser la version de production
npm run photos       # télécharger et optimiser les photographies (accès internet requis)
```

Rapport de calibrage d'un établissement (outil d'auteur) :

```bash
RAPPORT=clos-des-tilleuls npx vitest run tests/rapport.test.ts
```

Tests de navigation et captures d'écran (après `npm run build` et `npx vite preview --port 4173`) :

```bash
node scripts/e2e.mjs --captures
```

## Publication sur GitHub Pages

Le workflow `.github/workflows/pages.yml` publie le site à chaque mise à jour de la branche `main` :
1. installation, **tests de cohérence** (la publication échoue si un bilan est déséquilibré) ;
2. téléchargement et optimisation des photographies (`scripts/fetch-photos.mjs`) ;
3. construction et déploiement.

Réglage à faire une seule fois : **Settings › Pages › Build and deployment › Source : GitHub Actions**.
L'adresse est alors `https://<compte>.github.io/<dépôt>/`. Les chemins sont relatifs et la navigation utilise des adresses en `#/…`, ce qui fonctionne dans n'importe quel sous-répertoire.

## Documentation

- [docs/STRUCTURE.md](docs/STRUCTURE.md) : organisation du code et des données, ajouter ou modifier un établissement.
- [docs/METHODOLOGIE.md](docs/METHODOLOGIE.md) : construction des données, formules, contrôles, simplifications.
- [docs/REFERENCES.md](docs/REFERENCES.md) : inspirations graphiques, sources, crédits photographiques.
- [docs/ETAT.md](docs/ETAT.md) : état d'avancement et limites du prototype.

## Ressources enseignant

Les corrigés, diagnostics attendus et grilles d'évaluation **ne sont pas dans ce dépôt** (il est public). Ils sont générés localement dans `enseignant-prive/` (dossier ignoré par git) et remis séparément à l'enseignant.

L'ancien prototype « L'Arsenal » est conservé dans `archive/larsenal-v2/`.
