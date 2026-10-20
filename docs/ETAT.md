# État d'avancement du prototype

## Terminé et testé

- **Galerie** de dix établissements couvrant les grands modèles de la filière (enseignement, associatif, pension, compétition, courses, élevage et valorisation, tourisme, hôtellerie, organisation de concours, médiation), filtres, adresse directe par établissement.
- **Dossiers d'entreprise** complets pour les dix structures : histoire et chronologie, installations, cavalerie ou ressources, activités et tarifs, clients, fournisseurs, équipe, environnement et faits PESTEL non qualifiés, documents de direction (7 à 13 pièces par dossier) et pièces générées (échéanciers, tarifs, états financiers).
- **Gestion et finances** : tableau de bord interactif, compte de résultat synthétique et détaillé, SIG, CAF (deux méthodes), bilans 2022 à 2026, équilibre FR/BFR/TN, flux, trésorerie mensuelle 2025 et 2026, ratios, coûts complets par activité avec test des clés de répartition, emprunts et investissements, comparaison d'exercices. Budget 2026 hachuré.
- **Missions** : lettres de mission, pièces utiles, pistes, espace de travail par mission (SWOT éditable avec preuves et statut des observations, sélection et commentaire d'indicateurs, contrôles de calcul, simulateur d'investissement, plan d'action commercial budgété, grille de comparaison des options et note de recommandation), autoévaluation, suivi d'avancement, réutilisation de la SWOT en mission 3.
- **Simulateur** : trois scénarios, curseurs, plan de financement, résultat, CAF, trésorerie, VAN, TRI, délais de récupération, effets sur l'endettement, alertes de vraisemblance, enregistrement des simulations.
- **Sauvegarde** locale par établissement, export Markdown et JSON, import, réinitialisation confirmée, version imprimable.
- **Qualité** : 161 contrôles automatiques de cohérence financière ; tests de navigation Playwright sur toutes les rubriques, vues financières, missions et documents des dix établissements, persistance, export, import ; contrôle de l'absence de défilement horizontal sur mobile ; palette de données validée pour les daltonismes.
- **Réalisme** : chaque dossier a été révisé à partir de recherches (tarifs observés, SMIC, convention collective des personnels des activités hippiques, règles FEI et FFE, LeTrot, SHF, IFCE, Réseau Équin, labels FFE, réglementation des transports, médico-social, hôtellerie). Les repères réels sont cités avec leur URL dans les hypothèses de chaque dossier.

## Limites connues

- **Photographies** : le manifeste (52 images Unsplash) a été constitué à partir de résultats de recherche, sans visualisation des images. Elles sont téléchargées lors de la publication ; leur pertinence, leur auteur et leur licence doivent être contrôlés visuellement (page Crédits). En leur absence, un aplat de couleur s'affiche. Les captures de `docs/captures/` ont été prises sans accès aux images.
- **Vérifications non abouties** (quota de recherche atteint) : grille de salaires 2025-2026 de la convention IDCC 7026, coût annuel récent d'un équidé selon l'IFCE, prix d'achat des équidés de club, prix du foin 2025, coûts de construction (carrière, solarium), rémunération des officiels de concours, règles fiscales d'évaluation des stocks d'animaux, statut de conjoint collaborateur depuis 2022, régime des buvettes temporaires pour une société commerciale. Ces points sont présentés comme hypothèses du cas.
- **Lettre de l'année de naissance** des chevaux (SIRE) : appliquée à partir d'une séquence reconstituée (2005 R, 2011 B, 2015 F, 2020 K…), à confirmer.
- **TVA, fiscalité fine, crédit-bail** : non modélisés (voir METHODOLOGIE.md).
- **Travaux étudiants** : stockés dans le navigateur uniquement ; pas de synchronisation ni de dépôt en ligne (choix assumé).

## Pistes d'évolution

- Vérification visuelle et remplacement éventuel des photographies par des prises de vue réelles.
- Grille salariale officielle IDCC 7026 une fois publiée.
- Retour en version complète des quatre structures écartées de la sélection (valorisation, complexe polyvalent, formation, services aux établissements) sur le même modèle.
