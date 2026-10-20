# Méthodologie des données et des calculs

## Statut des données

| Nature | Où | Exemple |
|---|---|---|
| Données simulées du cas | fichiers d'établissement | tarifs, volumes, effectifs, documents |
| Hypothèses de construction | `finances.hypotheses` de chaque dossier, page Gestion et finances | TVA non modélisée, barème de valorisation des stocks |
| Repères réels sourcés | lignes « Repère réel : … (source : URL) » dans `finances.hypotheses` | SMIC, convention collective, fourchettes de tarifs observées |
| Calculs dérivés | moteur `src/finance` | SIG, CAF, FR, BFR, ratios, coûts complets, VAN |

Aucun chiffre inventé n'est attribué à une source réelle. Les références de l'IFCE et du Réseau Équin servent de cadre ; leurs publications doivent être consultées directement pour toute donnée sectorielle chiffrée.

## Construction

1. Modèle économique, capacité productive (boxes, places, journées, équidés), ressources humaines et équipements.
2. Prestations : prix unitaire HT × volume = recette ; la somme forme le chiffre d'affaires.
3. Charges : lignes par compte ; personnel = ETP × salaire brut × (1 + taux de charges) ; dotations calculées depuis le registre des immobilisations (linéaire, prorata temporis mensuel) ; intérêts depuis les tableaux d'emprunt (mensualités constantes).
4. Stocks et BFR saisis en fin d'année ; leurs variations alimentent le compte de résultat (6031, 6037, 713) et les flux.
5. Impôt sur les sociétés : 15 % jusqu'à 42 500 €, 25 % au-delà, report des déficits ; pas de réintégration fiscale. Entreprises à l'IR et associations : pas d'impôt dans les comptes.
6. Trésorerie de clôture = trésorerie d'ouverture + CAF − variation du BFR − investissements + cessions + emprunts − remboursements + subventions d'investissement + apports − distributions.
7. Bilan d'ouverture (31/12/2022) : seules les réserves sont déterminées par solde.

## Formules principales

- **Marge commerciale** = ventes de marchandises − (achats + variation de stock de marchandises).
- **Production de l'exercice** = production vendue + production stockée (+ immobilisée).
- **Valeur ajoutée** = marge commerciale + production − consommations en provenance des tiers.
- **EBE** = VA + subventions d'exploitation − impôts et taxes − charges de personnel.
- **CAF additive** = résultat net + dotations − reprises + VNC des cessions − produits de cession − quote-part des subventions virée au résultat.
- **CAF soustractive** = EBE + autres produits encaissables − autres charges décaissables ± résultat financier encaissable ± exceptionnel encaissable − IS. Les deux sont égales (test).
- **FR** = capitaux propres + provisions + emprunts − actif immobilisé net ; **BFR** = stocks + créances − dettes d'exploitation (produits constatés d'avance compris) ; **TN** = FR − BFR = disponibilités − concours bancaires.
- **Coûts complets** : charges directes + charges indirectes réparties par clés ; somme des résultats de sections = résultat courant avant impôt (test).
- **Simulateur** : compte de résultat différentiel, CAF différentielle, trésorerie (après remboursement du capital), flux économiques hors financement pour la VAN, TRI par bissection, valeur résiduelle = VNC en fin d'horizon. La subvention est reprise au résultat mais exclue des flux économiques.

## Contrôles automatiques (`npm test`)

Pour chaque établissement : équilibre des bilans, capitaux propres d'ouverture positifs, cohérence du compte de résultat, SIG, égalité des deux CAF, TN = FR − BFR, recettes = chiffre d'affaires, emprunts, amortissements, trésorerie mensuelle raccordée aux bilans, absence de valeurs non finies, unités et périodes, capacités respectées, analytique raccordée au RCAI, scénarios d'investissement ordonnés et explicables, intégrité des références (documents, fournisseurs, missions, contrôles), absence de tiret cadratin en incise.

## Simplifications assumées

- Montants hors taxes ; la TVA n'est pas modélisée.
- Prorata temporis mensuel ; pas d'amortissement dérogatoire ni de composants au-delà de ceux déclarés.
- Pas de crédit-bail : les équipements financés sont traités comme des immobilisations financées par emprunt.
- Approche du bilan financier en valeurs nettes (même FR que l'approche fonctionnelle en valeurs brutes).
