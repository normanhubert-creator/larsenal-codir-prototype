# Références

## Inspirations graphiques

Sites étudiés pour leurs principes de composition (aucun logo, code, texte ni photographie n'en est repris). L'environnement de développement n'ayant pas d'accès direct à ces sites, la synthèse s'appuie sur la connaissance de leurs codes visuels ; elle mérite d'être confrontée aux pages actuelles.

| Site | Ce qui a été retenu |
|---|---|
| [Haras de La Cense](https://lacense.com/) | photographie éditoriale en grand format, ton pédagogique, rubriques de formation clairement hiérarchisées |
| [Diamante Farms](https://www.diamantefarms.com/) | mise en scène des installations et du confort des chevaux, positionnement premium sobre |
| [Wellington International](https://www.wellingtoninternational.com/) | hiérarchie événementielle (calendrier, partenaires, hospitalité) |
| [Haras de Clarbec](https://harasdeclarbec.com/) | fiches d'étalons et de chevaux à vendre, valorisation des origines |
| [Domaine de Maffliers](https://www.demeures-de-campagne.com/hotels/domaine-de-maffliers/le-centre-equestre) | association patrimoine, nature et activités équestres |
| [Haras des Périchons](https://www.harasdesperichons.com/) | esthétique sombre, minimaliste, grands blancs typographiques |
| [Golden Equestrian Stables](https://www.goldenequestrianstables.com/) | identité haut de gamme, univers sportif |
| [Equitaide](https://www.equitaide.com/) | présentation humaine et apaisée d'un projet de médiation |

### Synthèse des choix

- **Grille et pages** : en-têtes photographiques pleine largeur, grille éditoriale asymétrique (5/12 – 7/12) pour les textes, grilles régulières pour les fiches et les tableaux ; conteneur de 1 240 px.
- **Couleurs** : une identité par établissement (sombre dominante, accent, fond clair légèrement teinté), toujours vérifiée en contraste ; palette de graphiques propre à chaque thème.
- **Typographies** (licence SIL OFL, auto-hébergées) : une police à empattements pour les titres éditoriaux (Cormorant, Fraunces, Libre Baskerville, Playfair, Bodoni Moda, Lora, DM Serif) ou une linéale géométrique pour les univers sportifs et techniques (Jost, Manrope, IBM Plex) ; Inter, Manrope, Jost ou IBM Plex Sans pour la navigation et les chiffres, en chiffres tabulaires.
- **Photographie** : grands formats, voile dégradé vers la couleur dominante pour garantir la lisibilité, recadrage par `object-position`, chargement différé des images secondaires, deux tailles WebP.
- **Hiérarchie** : surtitres en petites capitales espacées précédés d'un filet, titres éditoriaux, chapeaux, puis contenu.
- **Navigation** : barre horizontale persistante (transparente sur la photo d'accueil, pleine ensuite), menu « Dossier » regroupant les rubriques, fil d'Ariane, menu plein écran sur mobile.
- **Composants** : bandeau de chiffres clés, chronologie, fiches de chevaux, catalogue de prestations, pièces documentaires sur « papier », lettres de mission, tableaux financiers à niveaux, tuiles d'indicateurs.
- **Animations** : apparitions discrètes, zoom lent des photographies au survol ; désactivées si l'utilisateur préfère réduire les animations.
- **Élégance et lisibilité** : l'immersion est portée par la photographie et la typographie ; les espaces d'analyse restent sobres, très lisibles, avec budget hachuré et simulations en tirets.

## Sources économiques et réglementaires

- IFCE, Équipédia : [références technico-économiques](https://equipedia.ifce.fr/economie-et-filiere/economie/references-technico-economiques/publications-technico-economiques).
- Réseau Équin : [synthèse nationale 2022](https://chevaux-normandie.com/wp-content/uploads/2022/11/Synthese-nationale_2022vf.pdf) et éditions précédentes.
- SMIC 2026 : [info.gouv.fr](https://www.info.gouv.fr/actualite/le-smic-revalorise-au-1er-janvier-2026).
- Convention collective des personnels des activités hippiques (IDCC 7026), qui a repris le champ des centres équestres (IDCC 7012) : [legisocial.fr](https://www.legisocial.fr/conventions-collectives-nationales/7012-centres-equestres).
- Règlements ANC 2014-03 (plan comptable général) et 2018-06 (associations) ; code rural, article L311-1 ; loi n° 2021-1539 du 30 novembre 2021.
- Les repères réels propres à chaque secteur (tarifs observés, salaires, prix des chevaux, réglementation) sont listés, avec leur URL, dans les hypothèses de chaque dossier (page Gestion et finances).

## Crédits photographiques

Photographies issues d'[Unsplash](https://unsplash.com/license) (licence Unsplash : réutilisation gratuite, attribution non obligatoire mais pratiquée ici). La liste complète (clé, description, auteur, page source) est publiée sur la page « Crédits photographiques » du site et conservée dans `src/data/photos.json`. Les images sont illustratives : elles ne représentent aucun établissement réel. Les entrées marquées « à vérifier » doivent être contrôlées visuellement avant tout usage hors formation.
