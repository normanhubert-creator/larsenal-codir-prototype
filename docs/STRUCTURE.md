# Structure du projet

```
src/
  types.ts                  Spécification commentée du modèle de données (à lire en premier)
  data/
    etablissements/*.ts     Un fichier par établissement (détecté automatiquement)
    registry.ts             Ordre d'affichage et familles de la galerie
    aides.ts                Aides de saisie : an(), fin(), constant(), ligne()
    photos.json, photos.ts  Manifeste des photographies (provenance, licence, texte alternatif)
  finance/
    engine.ts               Moteur : compte de résultat, SIG, CAF, bilans, flux, trésorerie mensuelle, analytique
    indicateurs.ts          Ratios et indicateurs (formule + définition affichée)
    investment.ts           Simulateur d'investissement (résultat, CAF, trésorerie, VAN, TRI, délai de récupération)
  storage/
    travaux.ts              Sauvegarde locale par établissement, avancement des missions
    export.ts               Export Markdown, rubriques des missions, grilles d'autoévaluation
  components/               Composants communs (photographies, graphiques, en-têtes, aides)
  pages/                    Accueil, pages générales, espace établissement, missions, simulateur, travaux
  theme/                    Polices auto-hébergées et thèmes visuels
  styles/global.css         Feuille de styles commune (variables de thème, impression, accessibilité)
tests/
  finance.test.ts           Contrôles de cohérence appliqués à tous les établissements
  rapport.test.ts           Rapport de calibrage (outil d'auteur)
scripts/
  fetch-photos.mjs          Téléchargement et optimisation des photographies (publication)
  e2e.mjs                   Tests de navigation et captures d'écran (Playwright)
```

## Principe

Aucune donnée financière n'est saisie dans un composant. Chaque page lit l'objet `Etablissement` et les états calculés par `etats(etab)` (`src/finance/engine.ts`). Les graphiques et les tableaux partagent donc la même source.

## Modifier un établissement

Ouvrir `src/data/etablissements/<id>.ts`.

- **Tarifs et volumes** : `activites.prestations[].prix` et `.volume` (séries 2023, 2024, 2025, budget 2026, saisies avec `an(a, b, c, d)`). Le chiffre d'affaires, les SIG, la CAF, la trésorerie et les ratios se recalculent.
- **Personnel** : `finances.personnel[]` (ETP, salaire brut annuel par ETP, taux de charges patronales).
- **Charges** : `finances.chargesExternes`, `achatsApprovisionnements`, etc. (lignes par compte).
- **Investissements** : `finances.immobilisations[]` (valeur, mise en service, durée) ; **emprunts** : `finances.emprunts[]`.
- **BFR** : `finances.bfr` (soldes de fin d'année, ouverture 2022 comprise, saisis avec `fin(...)`).
- **Documents** : `documents[]` (blocs de texte, listes, tableaux, citations, signatures) ; documents générés : `documentsAuto[]`.
- **Missions** : `missions[]` (lettre, objectifs, livrables, documents utiles, pistes, contrôles de calcul, options de décision) ; **projets** du simulateur : `projets[]`.

Après toute modification :

```bash
npm test                                                    # cohérence
RAPPORT=<id> npx vitest run tests/rapport.test.ts           # chiffres clés pour calibrer
```

Un test en échec signale une incohérence (bilan déséquilibré, volume supérieur à la capacité, référence de document absente, etc.).

## Ajouter un établissement

1. Copier un fichier existant de `src/data/etablissements/` sous un nouvel identifiant.
2. Modifier `id`, identité, thème, données et textes.
3. Ajouter cinq photographies au manifeste `src/data/photos.json` avec les clés `<id>-hero`, `<id>-lieu`, `<id>-chevaux`, `<id>-activite`, `<id>-detail` (sinon un aplat de couleur s'affiche).
4. Ajouter l'identifiant à `ORDRE` dans `src/data/registry.ts` (facultatif : sinon il s'affiche en fin de galerie) et sa famille dans `FAMILLES` si elle est nouvelle.
5. `npm test`.

## Sauvegarde des travaux

Clé `localStorage` : `equidecision:v1:<id>`. Le format est décrit par le type `Travail` (`src/storage/travaux.ts`). Une sauvegarde importée est complétée par les valeurs vides manquantes (`normaliser`), ce qui permet de faire évoluer le format sans perdre les travaux.
