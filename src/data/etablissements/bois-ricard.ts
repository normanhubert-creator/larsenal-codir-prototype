import type { Etablissement } from '../../types';
import { an, constant, fin, ligne } from '../aides';

/**
 * Écurie d'entraînement du Bois-Ricard (dossier standard).
 * Modèle : entraîneur public de trotteurs, pensions d'entraînement au jour, 15 % des gains
 * des chevaux entraînés (répartition à la source par LeTrot), frais refacturés (maréchalerie, transport).
 * Situation : rentabilité moyenne, risque client élevé (retards, créance douteuse, concentration).
 * Toutes les données sont fictives.
 */
const etab: Etablissement = {
  id: 'bois-ricard',
  nom: 'Écurie d’entraînement du Bois-Ricard',
  nomCourt: 'Bois-Ricard',
  monogramme: 'BR',
  signature: 'Chaque matin sur la piste, chaque dimanche au départ.',
  famille: 'courses',
  libelleFamille: 'Écurie de courses au trot',
  profondeur: 'standard',
  lieu: {
    commune: 'Entrammes',
    departement: 'Mayenne (53)',
    region: 'Pays de la Loire',
    cadre: 'Ancienne exploitation d’élevage en bord de Mayenne, à 10 km au sud de Laval, au cœur d’un bassin d’éleveurs et d’entraîneurs de trotteurs.',
  },
  formeJuridique: 'SARL au capital de 20 000 €',
  gouvernance:
    'Le gérant, titulaire de la licence d’entraîneur public délivrée par LeTrot (Société d’encouragement à l’élevage du trotteur français), détient 80 % des parts ; son épouse, associée non salariée, 20 %. Les terrains, les écuries et la piste appartiennent à une SCI familiale qui les loue à la SARL.',
  creation: 2009,
  dirigeant: { nom: 'Gaëtan Morvilliers', fonction: 'Gérant, entraîneur public et driver' },
  theme: {
    primaire: '#3d0f1a',
    accent: '#8e1f2f',
    fond: '#f6f2ee',
    fondAlt: '#ebe2dc',
    encre: '#1b1416',
    attenue: '#5e5054',
    surPrimaire: '#f6efe9',
    policeTitre: 'bodoni',
    policeTexte: 'manrope',
    graphique: ['#7a1c2c', '#262123', '#b98a93', '#c39a48', '#5c7482'],
  },
  accroche:
    'Écurie d’entraînement de trotteurs de 42 boxes près de Laval, pour une quinzaine de propriétaires. Des résultats réguliers en province, une saison 2025 en retrait et des factures de pension qui se paient de plus en plus tard.',
  chiffresCles: [
    { libelle: 'Chevaux à l’entraînement', valeur: '36', detail: 'au 31 décembre 2025, plus 6 au repos' },
    { libelle: 'Propriétaires actifs', valeur: '15', detail: 'trois détiennent 17 chevaux' },
    { libelle: 'Partants', valeur: '312', detail: 'en 2025' },
    { libelle: 'Gains des chevaux entraînés', valeur: '560 000 €', detail: 'en 2025, dont 15 % reviennent à l’entraîneur' },
    { libelle: 'Effectif', valeur: '8,5 ETP', detail: 'gérant et apprentis compris' },
    { libelle: 'Création', valeur: '2009', detail: 'licence d’entraîneur public' },
  ],
  enjeux: [
    'Le prix de la journée de pension couvre-t-il ce que coûte réellement un cheval à l’entraînement ?',
    'Comment se protéger des propriétaires qui paient tard ou ne paient pas, sans perdre les meilleurs ?',
    'Faut-il investir dans la piste alors que les créances clients immobilisent déjà la trésorerie ?',
  ],
  roleEtudiant:
    'Vous êtes chargé·e de mission en contrôle de gestion auprès du gérant, à la demande de l’expert-comptable de l’écurie. Vous avez accès aux comptes, à la balance des propriétaires, aux contrats d’entraînement et aux devis.',

  presentation: {
    introduction:
      'Le Bois-Ricard entraîne des trotteurs pour le compte de propriétaires : l’écurie les héberge, les nourrit, les qualifie, les prépare et les conduit en course, au sulky ou au trot monté. Gaëtan Morvilliers, ancien premier garçon d’une grande écurie normande et driver, a obtenu sa licence d’entraîneur public en 2009 et s’est installé sur la ferme de ses beaux-parents.',
    histoire: [
      'L’écurie démarre en 2009 avec douze chevaux et une piste de 1 000 mètres en sable construite la même année par la SCI familiale et la SARL. Les premiers propriétaires sont des éleveurs mayennais qui confient leurs jeunes chevaux.',
      'En 2011, la SARL aménage deux bâtiments de boxes. L’effectif dépasse trente chevaux en 2016, avec l’arrivée de propriétaires extérieurs au département, attirés par les résultats en courses régionales puis à Vincennes.',
      'Depuis 2022, les charges ont fortement augmenté (aliments, carburant, salaires) et le gérant a relevé le prix de la journée de pension d’un euro chaque année. Depuis septembre 2021, sa part de 15 % sur les gains lui est versée directement par LeTrot (répartition à la source), ce qui a sécurisé cette recette. Trois propriétaires concentrent désormais près de la moitié de l’effectif.',
      'À partir de l’automne 2024, un propriétaire de quatre chevaux, en difficulté financière, n’a plus réglé ses factures que partiellement, puis plus du tout à partir d’avril 2025. Ses chevaux ont quitté l’écurie en septembre 2025. La créance, dépréciée en grande partie, pèse sur la trésorerie et alimente un débat sur les conditions de paiement.',
    ],
    valeurs: [
      { titre: 'Le cheval d’abord', texte: 'Programme individualisé, récupération après chaque course, mises au pré régulières. L’écurie refuse d’engager un cheval qui n’est pas prêt, même à la demande du propriétaire.' },
      { titre: 'Transparence', texte: 'Compte rendu hebdomadaire aux propriétaires, accès au programme d’engagements, facture mensuelle détaillée.' },
      { titre: 'Formation', texte: 'Deux apprentis accueillis en permanence, en lien avec l’AFASEC, l’école des métiers des courses hippiques.' },
    ],
    chronologie: [
      { annee: 2009, titre: 'Licence et installation', texte: 'Création de la SARL, piste de 1 000 m en sable, douze chevaux.' },
      { annee: 2011, titre: 'Écuries', texte: 'Aménagement de 42 boxes dans deux bâtiments agricoles.' },
      { annee: 2018, titre: 'Premier camion six places', texte: 'Déplacements vers Vincennes et les hippodromes de l’Ouest.' },
      { annee: 2019, titre: 'Marcheur automatique', texte: 'Six places, utilisé pour la récupération et les jours sans piste.' },
      { annee: 2023, titre: 'Second camion', texte: 'Camion quatre places financé sur sept ans.' },
      { annee: 2025, titre: 'Défaillance d’un propriétaire', texte: 'Quatre chevaux retirés en septembre, créance de 31 500 € HT en cours de recouvrement.' },
    ],
    organisation:
      'Le gérant entraîne, drive et gère la relation avec les propriétaires. Un premier garçon, lui-même lad-driver, organise le travail quotidien de deux lads-drivers, de deux lads et de deux apprentis. Une secrétaire à mi-temps assure la facturation et les relances, sous le contrôle de l’associée.',
    modeleEconomique:
      'Le chiffre d’affaires repose sur la pension d’entraînement facturée au jour (journées-cheval), complétée par la part de 15 % des gains (allocations) des chevaux entraînés qui revient à l’entraîneur public. Cette part est prélevée à la source et versée par LeTrot, sans risque d’impayé ; les 5 % du driver sont versés à celui qui drive (le gérant ou un lad-driver, à titre personnel) et n’entrent pas dans les comptes de la SARL. La maréchalerie et le transport vers les hippodromes sont refacturés ; les frais vétérinaires sont facturés directement aux propriétaires par la clinique ; les engagements sont débités du compte du propriétaire chez LeTrot. Les factures de pension sont émises au mois échu et payables à trente jours.',
  },

  installations: {
    synthese:
      'Les installations, louées à la SCI familiale, permettent d’héberger 42 chevaux à l’entraînement et une dizaine au pré. La piste, mise en service en 2009, arrive en fin de vie : son sable s’est appauvri et le drainage ne fonctionne plus dans le virage nord.',
    elements: [
      { nom: 'Piste d’entraînement', type: 'aire-travail', capacite: 'Anneau de 1 000 m en sable, ligne droite de 600 m', annee: 2009, etat: 'a-renover', description: 'Sable siliceux d’origine, recharges partielles en 2017 et 2022. Le virage nord retient l’eau plusieurs jours après la pluie ; aucun éclairage, ce qui limite le travail des matins d’hiver.', photo: 'activite' },
      { nom: 'Écuries', type: 'hebergement-equin', capacite: '42 boxes de 3,5 × 3,5 m', annee: 2011, etat: 'correct', description: 'Deux bâtiments agricoles aménagés, douches, sellerie et local de harnachement.', photo: 'chevaux' },
      { nom: 'Marcheur automatique', type: 'materiel', capacite: '6 places', annee: 2019, etat: 'bon', description: 'Utilisé pour la récupération et lorsque la piste est impraticable.' },
      { nom: 'Prés et paddocks', type: 'exterieur', surface: '9 ha', etat: 'correct', description: 'Dix places de repos au pré, six paddocks individuels.', photo: 'lieu' },
      { nom: 'Camions et sulkys', type: 'materiel', capacite: 'Camions de 6 et 4 places, 14 sulkys d’entraînement, 5 sulkys de course', etat: 'correct', description: 'Le camion de 2018 approche des 400 000 km. Harnachement, selles de trot monté et sulkys entretenus par l’équipe ; les sulkys de course, renouvelés en 2022, sont la propriété de la SARL.', photo: 'detail' },
    ],
    maintenance: [
      { titre: 'Piste', texte: 'Hersage et nivelage quotidiens, arrosage en été. Les réparations du virage nord coûtent de plus en plus cher : 16 500 € d’entretien en 2025.' },
      { titre: 'Véhicules', texte: 'Révision des camions tous les 30 000 km, contrôle technique annuel, pneumatiques changés en 2025 sur le camion de 2018.' },
      { titre: 'Bâtiments', texte: 'Le gros entretien incombe à la SCI ; la SARL assure l’entretien courant des boxes et la désinfection entre deux chevaux.' },
    ],
    contraintes: [
      'Sans éclairage, la piste n’est utilisable qu’à partir de 8 h 30 de novembre à février : les séances de travail sont décalées et compressées.',
      'Le virage nord est fermé en moyenne 25 jours par an après de fortes pluies.',
      'Les 42 boxes constituent un plafond : au-delà, il faudrait construire.',
    ],
  },

  cavalerie: {
    synthese:
      'L’écurie entraîne des trotteurs français appartenant à ses propriétaires : aucun cheval n’est la propriété de la SARL. Au 31 décembre 2025, 36 chevaux sont à l’entraînement et 6 au repos au pré. Les effectifs évoluent en permanence au gré des achats, des ventes et des mises à la retraite décidés par les propriétaires.',
    effectifs: [
      { categorie: 'Chevaux d’âge (5 à 10 ans)', statut: 'pension', nombre: 19, usage: 'Courses régionales et parisiennes' },
      { categorie: 'Chevaux de 3 et 4 ans', statut: 'pension', nombre: 13, usage: 'Qualifications et premières saisons de courses' },
      { categorie: 'Chevaux de 2 ans', statut: 'pension', nombre: 4, usage: 'Pré-entraînement, préparation aux qualifications' },
      { categorie: 'Chevaux au repos', statut: 'pension', nombre: 6, usage: 'Repos de fin de saison, convalescence, attente de vente' },
    ],
    parAge: [
      { tranche: '2 ans', nombre: 4 },
      { tranche: '3 ans', nombre: 7 },
      { tranche: '4 ans', nombre: 7 },
      { tranche: '5 à 7 ans', nombre: 15 },
      { tranche: '8 à 10 ans', nombre: 7 },
      { tranche: 'Plus de 10 ans (repos)', nombre: 2 },
    ],
    disponibilite: [
      { etat: 'À l’entraînement, engageables', nombre: 27 },
      { etat: 'En préparation (qualification, reprise)', nombre: 9 },
      { etat: 'Au repos au pré', nombre: 6, commentaire: 'Dont deux en convalescence (tendon, suites de chirurgie)' },
    ],
    fiches: [
      { nom: 'Grain de Mayenne', race: 'Trotteur français', naissance: 2016, sexe: 'hongre', robe: 'Bai', role: 'Cheval de tête, meeting d’hiver de Vincennes', statut: 'Écurie des Trois Vallées', notes: 'Meilleur gagnant de l’écurie depuis 2022. Dernière saison en 2026 : un trotteur ne peut plus courir au-delà de l’année de ses dix ans.' },
      { nom: 'Iroise du Bois', race: 'Trotteur français', naissance: 2018, sexe: 'jument', robe: 'Alezane', role: 'Courses régionales, attelé et monté', statut: 'SCEA Hamelin Élevage', notes: 'Arrêtée trois mois en 2025 pour une boiterie ; reprise en novembre.' },
      { nom: 'Kantik de l’Oudon', race: 'Trotteur français', naissance: 2020, sexe: 'hongre', robe: 'Bai brun', role: 'Courses de 5 ans en province', statut: 'Écurie du Vicoin', notes: 'Régulier, souvent placé. Ferré et déferré selon les terrains.' },
      { nom: 'Mistral Ricard', race: 'Trotteur français', naissance: 2022, sexe: 'étalon', robe: 'Noir', role: 'Qualifié en octobre 2025, débuts prévus au printemps 2026', statut: 'Copropriété de deux éleveurs', notes: 'Qualifié à la deuxième tentative sur 2 000 m à Laval. Programme de débuts prudent en province ; castration envisagée par les propriétaires.' },
    ],
    reglesUtilisation: [
      'Six jours de travail sur sept, un jour de repos au paddock ; le travail rapide est limité à deux séances par semaine.',
      'Deux à trois jours de récupération au marcheur ou au pas après chaque course.',
      'Au moins une mise au pré de quatre semaines par an pour chaque cheval d’âge.',
      'Contrôle vétérinaire avant toute reprise après blessure ; aucun engagement sans l’avis du premier garçon et du gérant.',
    ],
  },

  activites: {
    synthese:
      'L’écurie vend une journée de pension d’entraînement (hébergement, alimentation, travail, soins courants), complétée par des prestations refacturées et par la part de 15 % des gains qui revient à l’entraîneur public. Les engagements et forfaits sont débités du compte que chaque propriétaire détient auprès de LeTrot et n’apparaissent pas dans les comptes de la SARL.',
    prestations: [
      { id: 'pension-entrainement', nom: 'Pension d’entraînement', activite: 'entrainement', description: 'Box, alimentation, litière, travail quotidien, soins courants et vermifugation. Facturée au jour, au mois échu.', unite: 'journée-cheval', prix: an(30, 31, 32, 33), volume: an(13140, 14050, 13500, 14420), capaciteAnnuelle: constant(15330), compte: '706', clientele: 'Propriétaires de trotteurs' },
      { id: 'pension-repos', nom: 'Pension de repos au pré', activite: 'repos', description: 'Pré collectif avec abri, foin en hiver, surveillance quotidienne.', unite: 'journée-cheval', prix: an(13, 13.5, 14, 14.5), volume: an(1900, 2300, 2200, 2300), capaciteAnnuelle: constant(3650), compte: '706', clientele: 'Propriétaires des chevaux en repos ou en convalescence' },
      { id: 'pourcentage-gains', nom: 'Part de l’entraîneur sur les gains', activite: 'courses', description: 'Part de 15 % des gains (allocations) des chevaux entraînés, prélevée à la source et versée chaque mois par LeTrot à l’entraîneur public. Le prix est le taux, le volume le montant des gains.', unite: '€ de gains', prix: constant(0.15), volume: an(640000, 720000, 560000, 680000), compte: '706', clientele: 'Propriétaires (versement par LeTrot)' },
      { id: 'transport', nom: 'Transport aux hippodromes', activite: 'courses', description: 'Forfait par partant selon la distance moyenne, déplacement du personnel compris.', unite: 'partant', prix: an(95, 100, 105, 110), volume: an(318, 336, 312, 340), compte: '706', clientele: 'Propriétaires' },
      { id: 'marechalerie', nom: 'Maréchalerie refacturée', activite: 'refacturations', description: 'Ferrures et déferrages réalisés par le maréchal de l’écurie, refacturés avec une marge de gestion.', unite: 'ferrure', prix: an(98, 101, 105, 108), volume: an(400, 425, 410, 432), compte: '706', clientele: 'Propriétaires' },
    ],
    calendrier: [
      'Novembre à février : meeting d’hiver de Vincennes pour les deux ou trois meilleurs chevaux, travail décalé faute d’éclairage de la piste ; courses d’hiver à Caen et dans l’Ouest pour les autres.',
      'Mars à octobre : courses de province (Laval, Craon et les autres hippodromes de la Mayenne, Le Mans, Angers, Nantes, Caen), en semaine et le week-end.',
      'Toute l’année : qualifications des jeunes chevaux (épreuve chronométrée), les deux ans à partir du printemps, les trois ans et plus toute l’année.',
      'Septembre : les journées de courses de Craon ; fin d’année : mises au pré, bilan avec chaque propriétaire, programme de la saison suivante.',
    ],
  },

  clients: {
    synthese:
      'Quinze propriétaires actifs confient leurs chevaux à l’écurie : éleveurs, investisseurs particuliers et associations de copropriétaires. Trois d’entre eux détiennent 17 des 36 chevaux à l’entraînement. Les délais de paiement des pensions s’allongent et un propriétaire défaillant laisse une créance de 31 500 € HT.',
    segments: [
      { nom: 'Trois propriétaires principaux', part: 0.47, effectif: '17 chevaux', description: 'Écurie des Trois Vallées (8 chevaux), SCEA Hamelin Élevage (5), Écurie du Vicoin (4). Exigeants sur les résultats et sur les prix.' },
      { nom: 'Éleveurs mayennais', part: 0.27, effectif: '7 propriétaires, 11 chevaux', description: 'Confient leurs jeunes chevaux pour les qualifier et les valoriser avant la vente.' },
      { nom: 'Particuliers et copropriétés', part: 0.26, effectif: '5 propriétaires, 8 chevaux', description: 'Propriétaires passionnés, parfois associés à plusieurs sur un cheval ; paiements plus irréguliers.' },
    ],
    indicateurs: [
      { libelle: 'Propriétaires actifs au 31 décembre', valeurs: { 2023: 14, 2024: 16, 2025: 15, 2026: 16 } },
      { libelle: 'Partants', valeurs: { 2023: 318, 2024: 336, 2025: 312, 2026: 340 } },
      { libelle: 'Victoires', valeurs: { 2023: 41, 2024: 47, 2025: 36 } },
      { libelle: 'Gains des chevaux entraînés', unite: '€', valeurs: { 2023: 640000, 2024: 720000, 2025: 560000, 2026: 680000 }, commentaire: '2026 : budget. Moyenne 2025 : environ 1 800 € par partant.' },
      { libelle: 'Créances clients de plus de 60 jours', unite: '€', valeurs: { 2023: 8200, 2024: 19800, 2025: 34400 }, commentaire: 'Balance âgée au 31 décembre, montants hors taxes.' },
    ],
    verbatims: [
      { auteur: 'Gérant de l’Écurie des Trois Vallées', profil: '8 chevaux', texte: 'Les résultats sont là, mais à chaque hausse de pension je compare avec les écuries de la Jouanne et de Normandie. Je ne veux pas payer la piste neuve avant de l’avoir vue.' },
      { auteur: 'Éleveuse', profil: '2 chevaux de 3 ans', texte: 'On sait ce que fait chaque cheval chaque semaine. Les factures arrivent tard dans le mois, ce qui n’aide pas à suivre.' },
      { auteur: 'Copropriétaire', profil: 'Association de cinq amis, 1 cheval', texte: 'Les gains arrivent sur notre compte chez LeTrot, mais la pension, c’est à nous de la payer chaque mois. Quand le cheval ne gagne pas, il faut relancer chacun des associés.' },
    ],
    communication: [
      { canal: 'Résultats en course', description: 'Premier vecteur de notoriété auprès des propriétaires et des éleveurs.' },
      { canal: 'Compte rendu hebdomadaire', description: 'Message aux propriétaires : travail, état de santé, engagements prévus.' },
      { canal: 'Réseau des éleveurs', description: 'Ventes de yearlings, concours d’élevage, bouche-à-oreille dans le bassin mayennais.' },
    ],
    reclamations: [
      'Factures jugées trop tardives et peu lisibles par plusieurs propriétaires.',
      'Contestations ponctuelles de forfaits de transport sur les déplacements groupés.',
    ],
  },

  fournisseurs: {
    synthese:
      'Les achats concernent surtout l’alimentation, la litière, la maréchalerie et le carburant. Le loyer versé à la SCI familiale est la première charge externe. Les fournisseurs sont payés à 30 ou 45 jours, alors que certains propriétaires paient leurs pensions à 90 jours.',
    liste: [
      { nom: 'Coopérative des Coëvrons', categorie: 'Alimentation', prestation: 'Aliments floconnés et granulés pour chevaux de course', ligne: 'concentres', part: 0.9, evolutionTarifaire: '+3 % en 2026', delaiPaiement: '45 jours fin de mois', conditions: 'Remise de volume au-delà de 40 tonnes', dependance: 'moyenne', risques: 'Prix liés aux cours des céréales.' },
      { nom: 'Ludovic Perrouin, maréchal-ferrant', categorie: 'Soins', prestation: 'Ferrures et déferrages, présence deux matinées par semaine', ligne: 'marechalerie', part: 1, evolutionTarifaire: '+3 % par an', delaiPaiement: 'Mensuel', conditions: 'Tarif à la ferrure', dependance: 'forte', risques: 'Maréchal spécialisé trot difficile à remplacer.' },
      { nom: 'Paille et Foin du Maine', categorie: 'Fourrage et litière', prestation: 'Foin et paille, livraisons mensuelles', ligne: 'foin', part: 0.85, evolutionTarifaire: '+5 % annoncé pour 2026', delaiPaiement: '30 jours', conditions: 'Contrat de campagne', dependance: 'moyenne', risques: 'Disponibilité après les étés secs.' },
      { nom: 'SCI du Bois-Ricard', categorie: 'Immobilier', prestation: 'Location des écuries, des prés et de la piste', ligne: 'loyer', part: 1, evolutionTarifaire: 'Indexation annuelle', delaiPaiement: 'Mensuel', conditions: 'Bail rural de neuf ans renouvelé en 2018', dependance: 'forte', risques: 'Bailleur lié au gérant ; travaux lourds de la piste à répartir entre SCI et SARL.' },
      { nom: 'Station-service professionnelle de Laval', categorie: 'Carburant', prestation: 'Gazole des camions, carte carburant', ligne: 'carburant', part: 0.8, evolutionTarifaire: 'Selon les cours', delaiPaiement: 'Prélèvement mensuel', conditions: 'Remise par litre', dependance: 'faible', risques: 'Volatilité des prix du gazole.' },
    ],
    partenaires: [
      { nom: 'Clinique vétérinaire équine du bassin lavallois', type: 'Santé', description: 'Suivi des chevaux, facturation directe aux propriétaires.' },
      { nom: 'AFASEC, école des courses hippiques', type: 'Formation', description: 'Formation en alternance des deux apprentis (CAPa lad-cavalier d’entraînement, bac professionnel).' },
      { nom: 'LeTrot (Société d’encouragement à l’élevage du trotteur français)', type: 'Institution', description: 'Délivre les licences et autorisations, organise les qualifications et les courses, gère les comptes des propriétaires et verse à l’entraîneur sa part des gains.' },
      { nom: 'Expert-comptable de l’écurie', type: 'Conseil', description: 'Tenue des comptes, conseil sur les conditions de paiement et le recouvrement.' },
    ],
  },

  rh: {
    synthese:
      'L’équipe compte 8,5 équivalents temps plein, gérant, apprentis et secrétaire compris, pour 36 à 40 chevaux à l’entraînement, soit environ cinq chevaux par personne travaillant à l’écurie. Le travail commence à 6 h 30, les déplacements en course allongent les journées et les week-ends. La fidélisation des lads-drivers expérimentés est le principal souci du gérant.',
    organigramme: [
      { id: 'g', intitule: 'Gérant, entraîneur public et driver', personne: 'Gaëtan Morvilliers' },
      { id: 'a', intitule: 'Associée, suivi administratif', personne: 'Sandrine Morvilliers', parent: 'g' },
      { id: 'pg', intitule: 'Premier garçon, lad-driver', personne: 'Kévin Lebreton', parent: 'g' },
      { id: 'ld', intitule: 'Lads-drivers (2)', personne: 'Équipe de piste', parent: 'pg' },
      { id: 'l', intitule: 'Lads (2 ETP)', personne: 'Équipe d’écurie', parent: 'pg' },
      { id: 'ap', intitule: 'Apprentis (2), formés avec l’AFASEC', personne: 'Apprentis', parent: 'pg' },
      { id: 's', intitule: 'Secrétaire de facturation (mi-temps)', personne: 'Anaïs Gohier', parent: 'a' },
    ],
    organisationTravail: [
      'Soins et premier lot sur la piste dès 6 h 30 (8 h 30 en hiver faute d’éclairage), quatre à cinq lots par matinée ; chaque lad-driver attelle six à huit chevaux par jour.',
      'L’après-midi : marcheur, soins, douches, préparation des déplacements et du harnachement.',
      'Trois à cinq déplacements en course par semaine ; le lad qui accompagne fait office de garçon de voyage, le gérant ou un lad-driver drive.',
      'Roulement d’un week-end sur deux pour l’équipe d’écurie ; les apprentis mineurs ne travaillent ni de nuit ni lors des retours tardifs.',
    ],
    saisonnalite:
      'Activité continue toute l’année. Le meeting d’hiver de Vincennes mobilise le gérant et un lad-driver plusieurs jours par semaine ; l’été concentre les qualifications et les courses de province.',
    dirigeant:
      'Gaëtan Morvilliers entraîne, drive en course, recrute et négocie avec les propriétaires. Gérant majoritaire, il se verse une rémunération de 44 000 € brut en 2025, soumise aux cotisations des non-salariés agricoles ; ses gains de driver (5 % des gains des chevaux qu’il drive) lui reviennent à titre personnel. Il délègue la facturation et les relances, qu’il juge éloignées de son métier.',
    conventionCollective: 'Convention collective nationale des personnels des activités hippiques (IDCC 7026), qui a repris le champ de l’ancienne convention des établissements d’entraînement de chevaux de courses au trot',
    enjeux: [
      'Départ d’un lad-driver expérimenté vers une écurie normande en 2025, remplacé par un profil plus jeune qui ne drive pas encore en course.',
      'Ratio d’environ cinq chevaux par personne, inférieur aux repères des écuries de trot suivies par le Réseau Équin : le gérant l’explique par le nombre de déplacements.',
      'Pénibilité des horaires et des déplacements.',
      'Dépendance au gérant pour les décisions d’engagement et la relation avec les propriétaires.',
    ],
  },

  environnement: {
    synthese:
      'La Mayenne et l’Ouest de la France forment un bassin historique du trot, avec de nombreux éleveurs et entraîneurs et plusieurs hippodromes proches. La concurrence entre écuries porte sur les résultats, la réputation de l’entraîneur et le prix de la pension.',
    territoire:
      'Entrammes est située à 10 km de Laval. L’hippodrome de Laval (Bellevue-la-Forêt), réservé au trot, est à un quart d’heure ; Craon est à 40 minutes, Le Mans, Angers et Nantes à moins d’une heure trente, Caen à deux heures, Vincennes à trois heures de route. Le département compte de nombreux élevages et centres d’entraînement de trotteurs.',
    donneesTerritoire: [
      { libelle: 'Filière hippique de la Mayenne', valeur: '89 entraîneurs, près de 2 500 chevaux à l’entraînement, 9 hippodromes', source: 'Préfecture de la Mayenne, citée par info.fr (juin 2026)' },
      { libelle: 'Entraîneurs de trot établis dans un rayon de 40 km', valeur: '≈ 30', source: 'Estimation du cas' },
      { libelle: 'Distance moyenne par déplacement en course', valeur: '≈ 150 km aller', source: 'Relevé du cas' },
      { libelle: 'Pension d’entraînement pratiquée dans le secteur', valeur: '28 à 40 € HT par jour', source: 'Estimation du cas' },
    ],
    concurrents: [
      { nom: 'Écurie de la Jouanne', distance: '15 km', offre: '55 chevaux, piste éclairée, ligne droite en montée, bassin de récupération', tarifs: '39 € HT par jour', positionnement: 'Haut de gamme régional, propriétaires extérieurs, présence régulière à Vincennes' },
      { nom: 'Écurie familiale du Craonnais', distance: '30 km', offre: '20 chevaux, éleveurs locaux', tarifs: '28 € HT par jour', positionnement: 'Prix bas, peu de déplacements parisiens' },
      { nom: 'Grandes écuries normandes', distance: '150 à 200 km', offre: 'Structures de 60 à 120 chevaux, pistes multiples', tarifs: '38 à 50 € HT par jour', positionnement: 'Proximité des grands haras, réputation nationale, entraîneurs de premier plan' },
    ],
    pestel: [
      { dimension: 'Politique', faits: ['LeTrot, société mère des courses au trot agréée par l’État, organise les courses, délivre les licences et autorisations et répartit les allocations.', 'Le produit des paris hippiques, collectés par le PMU, finance l’essentiel des allocations.', 'Les allocations du trot ont atteint environ 258 millions d’euros en 2025 pour près de 143 000 partants, soit en moyenne 23 200 € par course (source : LeTrot).'] },
      { dimension: 'Économique', faits: ['Les prix des aliments, du carburant et de l’énergie ont fortement augmenté en 2022 et 2023.', 'Le SMIC a été revalorisé à plusieurs reprises depuis 2022.', 'Les taux des crédits professionnels sont supérieurs à 4 % depuis 2023.'] },
      { dimension: 'Socioculturel', faits: ['La propriété de chevaux de course se diffuse sous forme de copropriétés et d’associations.', 'Les métiers de lad et de lad-driver souffrent d’un déficit d’attractivité.'] },
      { dimension: 'Technologique', faits: ['Les pistes éclairées, les tapis roulants et les bassins de récupération se diffusent dans les grandes écuries.', 'Les logiciels de gestion d’écurie automatisent la facturation et les relances.'] },
      { dimension: 'Écologique', faits: ['Les épisodes de fortes pluies dégradent les pistes en sable mal drainées.', 'La gestion des fumiers et des eaux de lavage est encadrée.'] },
      { dimension: 'Légal', faits: ['La préparation et l’entraînement des équidés domestiques en vue de leur exploitation sont des activités agricoles par nature (article L311-1 du code rural et de la pêche maritime) ; exploitants et salariés relèvent de la MSA.', 'L’activité d’entraîneur public suppose une licence délivrée par LeTrot, après une expérience professionnelle et une formation sanctionnée par une certification.', 'Depuis le 1er septembre 2021, 15 % des gains sont répartis à la source au profit de l’entraîneur public, sans opposition possible du propriétaire ; la part du driver (5 %) peut être refusée par le propriétaire.', 'Le code des courses au trot permet à un entraîneur impayé de saisir une commission paritaire d’arbitrage et de conciliation ; l’opposition prononcée est publiée au bulletin officiel et interdit au débiteur de faire courir ses chevaux.', 'La loi n° 2021-1539 du 30 novembre 2021 visant à lutter contre la maltraitance animale a renforcé les obligations des détenteurs d’équidés.', 'Les délais de paiement entre professionnels sont encadrés par le code de commerce.'] },
    ],
    marche: [
      'Les propriétaires comparent les écuries sur les résultats, puis sur le prix de la journée et les frais annexes (transport, maréchalerie, part de l’entraîneur).',
      'Un trotteur doit se qualifier (épreuve chronométrée) avant de courir ; une part minoritaire des chevaux y parvient dès deux ans.',
      'Les meilleurs chevaux tendent à rejoindre les grandes écuries normandes ou parisiennes.',
      'Les éleveurs locaux privilégient les écuries proches pour suivre leurs jeunes chevaux.',
    ],
  },

  finances: {
    referentiel: 'PCG-agricole',
    regimeFiscal: 'IS',
    formeComptable: 'SARL soumise à l’impôt sur les sociétés, activité agricole par nature (article L311-1 du code rural et de la pêche maritime)',
    subventionsExploitation: [ligne('aide-apprentis', 'Aide de l’État à l’embauche d’apprentis', '74', an(6000, 6000, 5500, 5000), 'Versée mensuellement la première année de chaque contrat ; un nouveau contrat signé chaque été.')],
    autresProduits: [],
    produitsFinanciers: [],
    produitsExceptionnels: [],
    achatsMarchandises: [],
    achatsApprovisionnements: [
      ligne('concentres', 'Aliments concentrés pour chevaux de course', '6011', an(38500, 38800, 38000, 41500)),
      ligne('foin', 'Foin', '6011', an(26800, 24600, 24500, 26800), '2023 encore marqué par la sécheresse de 2022.'),
      ligne('litiere', 'Litière (paille et copeaux)', '6012', an(20200, 21400, 21500, 23400)),
      ligne('complements', 'Compléments, pharmacie courante, vermifuges', '6022', an(8800, 9600, 9500, 10200)),
    ],
    chargesExternes: [
      ligne('loyer', 'Loyer SCI du Bois-Ricard (écuries, prés, piste)', '6132', an(40000, 41200, 42400, 43600)),
      ligne('marechalerie', 'Maréchalerie (refacturée)', '6226', an(36800, 40375, 40180, 43632), 'Coût unitaire de 92 € HT en 2023, 95 € en 2024, 98 € en 2025, 101 € en 2026 (ferrure ou déferrage avec rajustement).'),
      ligne('veterinaire', 'Vétérinaire, soins courants inclus dans la pension', '6227', an(8600, 9200, 9500, 9800)),
      ligne('carburant', 'Gazole et péages des déplacements en course', '6061', an(20500, 20000, 18500, 20400)),
      ligne('entretien-camions', 'Entretien des camions', '6155', an(5400, 5900, 6800, 7000)),
      ligne('entretien-piste', 'Entretien de la piste et des installations', '615', an(11200, 13400, 16500, 17500), 'Recharges ponctuelles en sable et réparations du virage nord.'),
      ligne('energie', 'Électricité et eau', '6061', an(14600, 13900, 13800, 14200)),
      ligne('assurances', 'Assurances (responsabilité civile professionnelle d’entraîneur, véhicules, multirisque)', '616', an(12600, 13200, 13800, 14400)),
      ligne('honoraires', 'Honoraires comptables', '6226', an(7800, 8100, 8400, 8700)),
      ligne('contentieux', 'Frais de recouvrement et d’avocat', '6227', an(600, 900, 3200, 2500), '2025 : saisine de la commission d’arbitrage et procédure contre le propriétaire défaillant.'),
      ligne('deplacements', 'Repas et hébergement lors des déplacements', '6251', an(7400, 7900, 7600, 8200)),
      ligne('telecom', 'Téléphone, internet, logiciel de gestion d’écurie', '626', an(2800, 2900, 3100, 3600)),
      ligne('banque', 'Frais bancaires', '627', an(2100, 2300, 2600, 2700)),
      ligne('cotisations', 'Cotisations professionnelles', '6281', an(2200, 2300, 2400, 2500)),
      ligne('equipements', 'Petit harnachement, protections, bandes, vêtements de travail, médecine du travail', '6068', an(5800, 6100, 6400, 6700)),
    ],
    impotsTaxes: [
      ligne('taxes', 'Taxes diverses (taxe foncière refacturée par la SCI, cartes grises, taxe sur les véhicules)', '635', an(2600, 2700, 2800, 2900)),
      ligne('formation-pro', 'Contributions à la formation professionnelle', '633', an(1700, 1800, 1900, 2000)),
    ],
    autresCharges: [ligne('creances-irrecouvrables', 'Créances irrécouvrables', '654', an(6800, 1500, 1800, 1500), '2023 : créance d’un ancien propriétaire passée en perte (5 600 €), couverte par la reprise de sa dépréciation.')],
    chargesFinancieresAutres: [ligne('agios', 'Agios et commissions sur découverts ponctuels', '6615', an(500, 400, 700, 600))],
    chargesExceptionnelles: [],
    personnel: [
      { id: 'gerant', intitule: 'Gérant majoritaire, entraîneur public (rémunération de gérance)', titulaire: 'Gaëtan Morvilliers', categorie: 'direction', etp: constant(1), brutAnnuelEtp: an(42000, 43000, 44000, 46000), tauxCharges: 0.4 },
      { id: 'premier-garcon', intitule: 'Premier garçon, lad-driver', titulaire: 'Kévin Lebreton', categorie: 'encadrement', etp: constant(1), brutAnnuelEtp: an(27600, 28300, 29000, 29700), tauxCharges: 0.22 },
      { id: 'lads-drivers', intitule: 'Lads-drivers', titulaire: 'Deux salariés', categorie: 'soins', etp: constant(2), brutAnnuelEtp: an(24000, 24600, 25200, 25800), tauxCharges: 0.17 },
      { id: 'lads', intitule: 'Lads', titulaire: 'Équipe d’écurie', categorie: 'soins', etp: an(2, 2.5, 2.5, 2.5), brutAnnuelEtp: an(21300, 21700, 22000, 22300), tauxCharges: 0.11 },
      { id: 'apprentis', intitule: 'Apprentis (CAPa lad-cavalier d’entraînement, bac professionnel)', titulaire: 'Deux apprentis', categorie: 'soins', etp: constant(2), brutAnnuelEtp: an(9200, 9500, 9700, 9900), tauxCharges: 0.02 },
      { id: 'secretariat', intitule: 'Secrétaire de facturation', titulaire: 'Anaïs Gohier', categorie: 'administratif', etp: constant(0.5), brutAnnuelEtp: an(23000, 23500, 24000, 24600), tauxCharges: 0.14 },
    ],
    immobilisations: [
      { id: 'depot-bail', libelle: 'Dépôt de garantie du bail', categorie: 'financier', valeurOrigine: 6000, miseEnService: '2011-01', duree: 0 },
      { id: 'logiciel', libelle: 'Logiciel de gestion d’écurie et informatique', categorie: 'incorporel', valeurOrigine: 4500, miseEnService: '2025-01', duree: 3 },
      { id: 'piste', libelle: 'Piste d’entraînement en sable (part SARL)', categorie: 'installations', valeurOrigine: 70000, miseEnService: '2009-05', duree: 15 },
      { id: 'ecuries', libelle: 'Aménagement de 42 boxes', categorie: 'installations', valeurOrigine: 96000, miseEnService: '2011-04', duree: 20 },
      { id: 'paddocks', libelle: 'Paddocks et clôtures', categorie: 'installations', valeurOrigine: 24000, miseEnService: '2016-06', duree: 10 },
      { id: 'marcheur', libelle: 'Marcheur automatique 6 places', categorie: 'materiel', valeurOrigine: 32000, miseEnService: '2019-03', duree: 10 },
      { id: 'tracteur', libelle: 'Tracteur et herse de piste', categorie: 'materiel', valeurOrigine: 52000, miseEnService: '2017-09', duree: 10 },
      { id: 'sulkys', libelle: 'Sulkys d’entraînement et harnachement', categorie: 'materiel', valeurOrigine: 21000, miseEnService: '2022-02', duree: 6 },
      { id: 'camion-2018', libelle: 'Camion 6 chevaux', categorie: 'vehicules', valeurOrigine: 98000, miseEnService: '2018-04', duree: 10 },
      { id: 'camion-2023', libelle: 'Camion 4 chevaux', categorie: 'vehicules', valeurOrigine: 112000, miseEnService: '2023-09', duree: 10 },
    ],
    emprunts: [
      { id: 'pret-tracteur', libelle: 'Prêt tracteur', preteur: 'Banque mutualiste de l’Ouest (fictive)', capital: 45000, taux: 0.012, dureeMois: 84, debut: '2017-09', objet: 'Tracteur et herse de piste' },
      { id: 'pret-camion-2018', libelle: 'Prêt camion 6 places', preteur: 'Banque mutualiste de l’Ouest (fictive)', capital: 80000, taux: 0.0125, dureeMois: 84, debut: '2018-04', objet: 'Camion de transport de chevaux' },
      { id: 'pret-marcheur', libelle: 'Prêt marcheur', preteur: 'Banque mutualiste de l’Ouest (fictive)', capital: 30000, taux: 0.013, dureeMois: 60, debut: '2019-03', objet: 'Marcheur automatique' },
      { id: 'pret-camion-2023', libelle: 'Prêt camion 4 places', preteur: 'Banque mutualiste de l’Ouest (fictive)', capital: 95000, taux: 0.044, dureeMois: 84, debut: '2023-09', objet: 'Second camion' },
    ],
    subventionsInvestissement: [],
    stocks: [{ id: 'stock-aliments', libelle: 'Aliments, foin et litière', type: 'approvisionnements', finDAn: fin(9500, 8800, 9200, 9600, 9800) }],
    provisions: [
      { id: 'prov-ancien', libelle: 'Dépréciation de la créance d’un ancien propriétaire', ouverture: 4500, dotations: an(0, 0, 0, 0), reprises: an(4500, 0, 0, 0), nature: 'exploitation' },
      { id: 'prov-teillais', libelle: 'Dépréciation de la créance du propriétaire J. Teillais', ouverture: 0, dotations: an(0, 8000, 15000, 0), reprises: an(0, 0, 0, 0), nature: 'exploitation' },
    ],
    bfr: {
      creancesClients: fin(64000, 71000, 86000, 105000, 92000),
      autresCreances: fin(12000, 13500, 14500, 15500, 15000),
      dettesFournisseurs: fin(29000, 31500, 33500, 35000, 36000),
      dettesFiscalesSociales: fin(31000, 32500, 34000, 35500, 37500),
      autresDettes: fin(9000, 9000, 9500, 9500, 14000),
      produitsConstatesAvance: fin(0, 0, 0, 0, 0),
    },
    ouverture: { capital: 20000, libelleCapital: 'Capital social', tresorerie: 12000 },
    dividendes: an(25000, 45000, 30000, 20000),
    tresorerieMensuelle: {
      saisonnaliteEncaissements: [9, 8, 8, 8, 8, 8, 9, 8, 8, 8, 8, 10],
      saisonnaliteAchats: [9, 9, 9, 8, 8, 8, 8, 8, 8, 8, 9, 9],
      saisonnalitePersonnel: [8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 12],
      moisSubventions: [5, 11],
      moisDistributions: [7],
      commentaire:
        'Les pensions sont facturées au mois échu, payables à trente jours ; en pratique, une partie des propriétaires paie à 60 ou 90 jours. Les pourcentages sur allocations sont encaissés avec un décalage d’environ un mois. Les salaires de décembre incluent une prime de fin d’année.',
    },
    analytique: {
      exercice: 2025,
      sections: [
        { id: 'entrainement', nom: 'Pension d’entraînement', uniteOeuvre: { libelle: 'journée-cheval', quantite: 13500 } },
        { id: 'repos', nom: 'Repos au pré', uniteOeuvre: { libelle: 'journée-cheval', quantite: 2200 } },
        { id: 'courses', nom: 'Courses (transport et pourcentages)', uniteOeuvre: { libelle: 'partant', quantite: 312 } },
        { id: 'refacturations', nom: 'Maréchalerie refacturée', uniteOeuvre: { libelle: 'ferrure', quantite: 410 } },
      ],
      cles: [
        { id: 'rations', nom: 'Rations distribuées', unite: 'journées-ration', justification: 'Un cheval au repos reçoit environ 45 % de la ration d’un cheval à l’entraînement (relevé de l’écurie).', repartition: { entrainement: 13500, repos: 990 } },
        { id: 'heures-equipe', nom: 'Heures de l’équipe', unite: 'heures', justification: 'Plannings 2025 : travail et soins des chevaux à l’entraînement, déplacements (environ 10,5 heures par partant), soins des chevaux au pré, accompagnement du maréchal.', repartition: { entrainement: 13400, courses: 3300, repos: 700, refacturations: 200 } },
        { id: 'surfaces', nom: 'Surfaces louées', unite: '% des surfaces', justification: 'Écuries et piste pour l’entraînement, prés pour le repos, garage des camions pour les courses.', repartition: { entrainement: 80, repos: 15, courses: 5 } },
        { id: 'ca', nom: 'Chiffre d’affaires', unite: '€', justification: 'Clé conventionnelle pour les frais de gestion et de direction.', repartition: { entrainement: 573750, repos: 33000, courses: 118120, refacturations: 43050 } },
      ],
      affectations: {
        concentres: { cle: 'rations' },
        foin: { cle: 'rations' },
        complements: { cle: 'rations' },
        'variation-stocks': { cle: 'rations' },
        veterinaire: { cle: 'rations' },
        litiere: { section: 'entrainement' },
        marechalerie: { section: 'refacturations' },
        carburant: { section: 'courses' },
        'entretien-camions': { section: 'courses' },
        deplacements: { section: 'courses' },
        'amortissements:vehicules': { section: 'courses' },
        interets: { section: 'courses' },
        'entretien-piste': { section: 'entrainement' },
        'amortissements:installations': { cle: 'surfaces' },
        'amortissements:materiel': { section: 'entrainement' },
        loyer: { cle: 'surfaces' },
        energie: { cle: 'surfaces' },
        'premier-garcon': { cle: 'heures-equipe' },
        'lads-drivers': { cle: 'heures-equipe' },
        lads: { cle: 'heures-equipe' },
        apprentis: { cle: 'heures-equipe' },
        gerant: { cle: 'heures-equipe' },
        provisions: { section: 'entrainement' },
        'creances-irrecouvrables': { section: 'entrainement' },
        contentieux: { section: 'entrainement' },
      },
      cleParDefaut: 'ca',
      affectationsProduits: { subventions: { cle: 'heures-equipe' } },
      commentaire:
        'Coûts complets 2025. La section courses porte le transport et le pourcentage sur les allocations ; la section entraînement porte le risque client (dépréciation, pertes, frais de recouvrement). Comparez le coût complet d’une journée-cheval au prix facturé, puis testez une clé unique.',
    },
    hypotheses: [
      'Montants hors taxes ; la TVA n’est pas modélisée.',
      'Le pourcentage de l’entraîneur est fixé à 10 % des allocations gagnées par les chevaux entraînés, selon les contrats d’entraînement de l’écurie (hypothèse du cas) ; le circuit de versement n’est pas modélisé.',
      'Les engagements en course et les frais vétérinaires sont réglés directement par les propriétaires et n’apparaissent pas dans les comptes de la SARL.',
      'La dépréciation des créances douteuses (compte 491) est présentée par le moteur parmi les provisions du passif ; en toute rigueur, elle vient en diminution des créances clients à l’actif. Le fonds de roulement et le besoin en fonds de roulement doivent être retraités en conséquence.',
      'Les créances clients sont présentées pour leur montant hors taxes ; le risque réel, toutes taxes comprises, est plus élevé.',
      'La rémunération du gérant majoritaire est comptabilisée en charges de personnel avec ses cotisations sociales non salariées.',
    ],
  },

  documents: [
    {
      id: 'balance-agee',
      type: 'tableau',
      titre: 'Balance âgée des comptes propriétaires au 31 décembre 2025',
      date: '2026-01-09',
      emetteur: 'Anaïs Gohier, secrétariat',
      destinataire: 'Gaëtan et Sandrine Morvilliers',
      resume: 'Créances par propriétaire, ventilées par ancienneté.',
      rubriques: ['clients', 'finances'],
      confidentiel: true,
      contenu: [
        { type: 'tableau', colonnes: ['Propriétaire', 'Chevaux', 'Non échu', '1 à 60 jours', '61 à 90 jours', 'Plus de 90 jours', 'Total'], alignDroite: [1, 2, 3, 4, 5, 6], lignes: [
          ['Écurie des Trois Vallées', 8, '19 000 €', '5 500 €', '0 €', '0 €', '24 500 €'],
          ['SCEA Hamelin Élevage', 5, '11 800 €', '6 400 €', '0 €', '0 €', '18 200 €'],
          ['Écurie du Vicoin', 4, '9 600 €', '0 €', '0 €', '0 €', '9 600 €'],
          ['J. Teillais (sorti en septembre)', 0, '0 €', '0 €', '6 300 €', '25 200 €', '31 500 €'],
          ['Douze autres propriétaires', 19, '30 400 €', '9 300 €', '2 500 €', '0 €', '42 200 €'],
          ['Total', 36, '70 800 €', '21 200 €', '8 800 €', '25 200 €', '126 000 €'],
        ], note: 'Montants hors taxes. La créance Teillais est dépréciée à hauteur de 23 000 € (14 000 € en 2024, 9 000 € en 2025).' },
        { type: 'p', texte: 'Les douze autres propriétaires comprennent les sept éleveurs mayennais et cinq propriétaires particuliers ou copropriétés.' },
      ],
    },
    {
      id: 'note-gerant',
      type: 'note',
      titre: 'Perspectives 2026 et projet de piste',
      date: '2026-01-15',
      emetteur: 'Gaëtan Morvilliers, gérant',
      destinataire: 'Sandrine Morvilliers, expert-comptable',
      resume: 'Le gérant présente ses prévisions pour 2026 et défend la rénovation de la piste.',
      rubriques: ['activites', 'installations', 'finances'],
      contenu: [
        { type: 'p', texte: 'L’année 2025 a été moins bonne en courses (36 victoires contre 47) et l’affaire Teillais nous a coûté cher. Pour 2026, j’ai bon espoir : un nouveau propriétaire nous confie quatre chevaux dès février, et Grain de Mayenne courra sa dernière saison à Vincennes.' },
        { type: 'p', texte: 'Le budget prévoit 39,5 chevaux en moyenne et 44 € HT la journée. Les allocations devraient revenir vers 880 000 €.' },
        { type: 'p', texte: 'La piste est notre outil de travail. Sans éclairage, nous perdons deux heures chaque matin d’hiver, et le virage nord est fermé trois à quatre semaines par an. L’Écurie de la Jouanne a refait la sienne et nous prend des propriétaires. Je propose de la rénover avant l’hiver prochain et d’augmenter la pension d’un euro par jour une fois les travaux faits.' },
        { type: 'signature', nom: 'Gaëtan Morvilliers', fonction: 'Gérant' },
      ],
    },
    {
      id: 'cr-comptable',
      type: 'compte-rendu',
      titre: 'Réunion de présentation des comptes 2025',
      date: '2026-02-20',
      emetteur: 'Cabinet d’expertise comptable de l’écurie',
      destinataire: 'Gaëtan et Sandrine Morvilliers',
      resume: 'L’expert-comptable commente les comptes 2025, le risque client et la trésorerie.',
      rubriques: ['finances', 'clients'],
      contenu: [
        { type: 'p', texte: 'Le chiffre d’affaires 2025 s’établit à environ 768 000 € HT, en léger recul. Les créances clients atteignent 126 000 € HT au 31 décembre, dont 34 000 € à plus de 60 jours.' },
        { type: 'p', texte: 'Nous avons complété la dépréciation de la créance Teillais de 9 000 €, la portant à 23 000 € sur 31 500 €. L’avocat estime qu’une partie pourrait être récupérée si les deux chevaux revendus l’ont été au profit du débiteur ; rien n’est certain.' },
        { type: 'citation', texte: 'Votre écurie finance ses propriétaires : vous payez les aliments à 45 jours et les salaires chaque mois, mais certains vous paient à trois mois.', auteur: 'L’expert-comptable' },
        { type: 'h', texte: 'Recommandations formulées' },
        { type: 'liste', items: ['Facturer au plus tard le cinquième jour du mois et prélever les pensions.', 'Demander un dépôt de garantie d’un mois de pension à chaque nouveau propriétaire (prévu dans le budget 2026).', 'Suspendre les engagements des chevaux dont le compte présente plus de 60 jours de retard.', 'Ne pas engager la rénovation de la piste sans plan de financement et sans accord de la SCI sur la répartition des travaux.'] },
        { type: 'p', texte: 'Le gérant a indiqué qu’il craignait de perdre l’Écurie des Trois Vallées en durcissant les conditions de paiement.' },
      ],
    },
    {
      id: 'courriel-trois-vallees',
      type: 'courriel',
      titre: 'Re : tarifs 2026 et programme de Grain de Mayenne',
      date: '2026-01-28',
      emetteur: 'Philippe Roussard, gérant de l’Écurie des Trois Vallées',
      destinataire: 'Gaëtan Morvilliers',
      resume: 'Le principal propriétaire réagit à la hausse de pension et à l’idée de nouvelles conditions de paiement.',
      rubriques: ['clients'],
      contenu: [
        { type: 'p', texte: 'Gaëtan,' },
        { type: 'p', texte: 'J’ai bien noté le passage à 44 € HT. J’accepte pour cette année compte tenu des résultats de Grain de Mayenne, mais je n’irai pas au-delà sans voir une amélioration concrète des installations.' },
        { type: 'p', texte: 'Quant au prélèvement automatique, je préfère continuer à payer par virement à réception du relevé de gains mensuel. Je te rappelle que nous avons huit chevaux chez toi et que d’autres entraîneurs nous sollicitent.' },
        { type: 'signature', nom: 'Philippe Roussard', fonction: 'Gérant de l’Écurie des Trois Vallées' },
      ],
    },
    {
      id: 'devis-piste',
      type: 'devis',
      titre: 'Devis de rénovation de la piste d’entraînement',
      date: '2025-12-05',
      emetteur: 'Sols Équestres de l’Ouest (fictif)',
      destinataire: 'SARL Écurie d’entraînement du Bois-Ricard',
      resume: 'Devis de reprise complète de la piste, des lices et d’un éclairage.',
      rubriques: ['installations', 'finances'],
      contenu: [
        { type: 'tableau', colonnes: ['Poste', 'Montant HT'], alignDroite: [1], lignes: [
          ['Décaissement, drainage, géotextile et sable siliceux sur 1 000 m', '128 000 €'],
          ['Lices et bordures', '12 000 €'],
          ['Éclairage LED de l’anneau', '43 000 €'],
          ['Total', '183 000 €'],
        ] },
        { type: 'p', texte: 'Travaux réalisables en six semaines, de préférence en juin et juillet. Pendant le chantier, l’entraînement devra se faire sur la ligne droite et au marcheur. Recharge annuelle en sable recommandée : environ 4 000 € HT.' },
      ],
    },
  ],
  documentsAuto: [
    { id: 'tarifs', type: 'auto-tarifs', titre: 'Prix et volumes des prestations 2023-2026' },
    { id: 'echeancier-camion', type: 'auto-echeancier', emprunt: 'pret-camion-2023', titre: 'Échéancier du prêt du camion 4 places' },
    { id: 'cr-2025', type: 'auto-compte-resultat', exercice: 2025, titre: 'Compte de résultat 2025' },
    { id: 'bilan-2025', type: 'auto-bilan', exercice: 2025, titre: 'Bilan au 31 décembre 2025' },
  ],

  projets: [
    {
      id: 'piste-eclairee',
      titre: 'Rénovation et éclairage de la piste d’entraînement',
      description:
        'Reprise complète de l’anneau de 1 000 m (drainage, géotextile, sable siliceux), remplacement des lices et éclairage LED. Objectifs : supprimer les fermetures du virage nord, travailler dès 6 h 30 en hiver, attirer de nouveaux chevaux et justifier une hausse de pension d’un euro par journée.',
      composantes: [
        { libelle: 'Décaissement, drainage, géotextile et sable', montant: 128000, duree: 15 },
        { libelle: 'Lices et bordures', montant: 12000, duree: 10 },
        { libelle: 'Éclairage LED', montant: 43000, duree: 15 },
      ],
      chargesLancement: 1500,
      financement: { apport: 34500, emprunt: 150000, taux: 0.042, dureeAnnees: 12, subvention: 0 },
      recettes: [
        { libelle: 'Journées-cheval supplémentaires (nouveaux chevaux)', unite: 'journée-cheval', prix: 44, volumes: { prudent: 250, central: 700, favorable: 1100 }, capaciteMax: 1800 },
        { libelle: 'Hausse de la pension d’un euro par journée-cheval', unite: 'journée-cheval', prix: 1, volumes: { prudent: 13000, central: 13800, favorable: 14400 }, capaciteMax: 15330 },
      ],
      tauxChargesVariables: 0.3,
      chargesFixes: [
        { libelle: 'Électricité de l’éclairage', montant: 3500 },
        { libelle: 'Recharge annuelle en sable et entretien', montant: 4000 },
        { libelle: 'Assurance complémentaire', montant: 600 },
      ],
      delaiMiseEnServiceMois: 6,
      monteeEnCharge: [0.6, 0.9, 1],
      horizon: 15,
      tauxActualisation: 0.06,
      tauxImpot: 0.15,
      reperes: [
        'Capacité inutilisée en 2025 : 42 boxes × 365 jours − 13 500 journées = 1 830 journées-cheval.',
        'Coût variable estimé d’une journée-cheval supplémentaire (aliments, litière, part de temps de lad) : environ 13 € par jour, soit 30 % du prix.',
        'Pension de l’Écurie de la Jouanne, piste éclairée : 52 € HT par jour.',
        'Taux d’impôt marginal retenu à 15 % (taux réduit) : le résultat imposable reste en général sous le seuil de 42 500 €, ce qui n’a pas été le cas en 2024.',
      ],
      vigilance: [
        'Six semaines de chantier en été, au moment des qualifications des jeunes chevaux.',
        'La piste appartient en partie à la SCI : la répartition des travaux et du financement doit être formalisée.',
        'Un emprunt de 150 000 € s’ajoute à celui du camion alors que les créances clients immobilisent déjà la trésorerie.',
      ],
    },
  ],

  missions: [
    {
      numero: 1,
      titre: 'Diagnostic stratégique',
      lettre: {
        de: 'Gaëtan Morvilliers',
        fonction: 'Gérant',
        date: '2026-01-19',
        objet: 'Position de l’écurie face à la concurrence',
        corps: [
          'Nous avons de bons résultats, mais je vois des propriétaires partir vers des écuries mieux équipées, et d’autres qui paient de plus en plus tard.',
          'Je vous demande un diagnostic de l’écurie : ce qui fait notre valeur pour les propriétaires, nos faiblesses, et ce que l’évolution de la filière nous impose.',
        ],
      },
      contexte: 'L’écurie dépend de trois propriétaires principaux, d’un gérant omniprésent et d’une piste vieillissante.',
      objectifs: ['Réaliser un diagnostic interne et externe', 'Analyser le portefeuille de propriétaires', 'Hiérarchiser les enjeux'],
      livrables: ['Matrice de diagnostic étayée', 'Cartographie des propriétaires (poids, ancienneté, risque)'],
      documentsUtiles: ['note-gerant', 'courriel-trois-vallees', 'balance-agee', 'cr-comptable'],
      pistes: ['Que représente l’Écurie des Trois Vallées dans le chiffre d’affaires et dans les résultats sportifs ?', 'Le gérant est-il un atout ou une fragilité ?', 'La piste est-elle un facteur de compétitivité ou de confort ?'],
    },
    {
      numero: 2,
      titre: 'Diagnostic financier et coût de la journée',
      lettre: {
        de: 'Gaëtan Morvilliers',
        fonction: 'Gérant',
        date: '2026-02-23',
        objet: 'Rentabilité de l’écurie et risque client',
        corps: [
          'Notre expert-comptable s’inquiète de nos créances. Je voudrais comprendre ce que coûte réellement une journée de pension, ce que rapportent les courses, et ce que nous coûtent les retards de paiement.',
          'Je vous demande une analyse de nos comptes 2023 à 2025 et du budget 2026.',
        ],
      },
      contexte: 'Les comptes intègrent deux dépréciations de créances, présentées au passif par le logiciel d’analyse.',
      objectifs: ['Analyser les SIG, la CAF et l’équilibre financier', 'Mesurer le délai de paiement des propriétaires et son coût', 'Calculer le coût complet d’une journée-cheval', 'Retraiter la dépréciation des créances'],
      livrables: ['Note d’analyse financière', 'Tableau du risque client', 'Contrôles de calcul complétés'],
      documentsUtiles: ['cr-2025', 'bilan-2025', 'balance-agee', 'cr-comptable', 'echeancier-camion', 'tarifs'],
      pistes: ['Quelle part de l’EBE provient du pourcentage sur les allocations ?', 'Que deviendrait la trésorerie si les propriétaires payaient à trente jours ?', 'Le retraitement de la dépréciation change-t-il le fonds de roulement et le besoin en fonds de roulement ?'],
      controles: [
        { id: 'c-delai', question: 'Quel est le délai moyen de paiement des clients en 2025 (en jours) ?', indicateur: 'delaiClients', exercice: 2025, unite: 'jours', tolerance: 1, aide: 'Créances clients / chiffre d’affaires × 365 (montants hors taxes).' },
        { id: 'c-taux-ebe', question: 'Quel est le taux d’EBE 2025 ?', indicateur: 'tauxEBE', exercice: 2025, unite: '%', tolerance: 0.005, aide: 'EBE / chiffre d’affaires.' },
        { id: 'c-cout-journee', question: 'Quel est le coût complet 2025 d’une journée-cheval à l’entraînement ?', indicateur: 'coutUnitaire:entrainement', exercice: 2025, unite: '€/unité', tolerance: 0.5, aide: 'Coût complet de la section entraînement / journées-cheval facturées.' },
        { id: 'c-courses', question: 'Quel est le résultat 2025 de la section courses ?', indicateur: 'resultatSection:courses', exercice: 2025, unite: '€', tolerance: 100, aide: 'Produits de la section (transport et pourcentages) moins son coût complet.' },
      ],
    },
    {
      numero: 3,
      titre: 'Investissement : rénovation de la piste',
      lettre: {
        de: 'Gaëtan Morvilliers',
        fonction: 'Gérant',
        date: '2026-03-09',
        objet: 'Rénovation et éclairage de la piste',
        corps: [
          'Je souhaite rénover et éclairer la piste avant l’hiver. Mon épouse et notre expert-comptable sont plus réservés.',
          'Évaluez le projet selon plusieurs scénarios et dites-moi s’il est finançable sans mettre l’écurie en difficulté.',
        ],
      },
      contexte: 'Le devis s’élève à 183 000 € HT ; la banque n’a pas encore été consultée ; la SCI propriétaire n’a pas pris position.',
      objectifs: ['Simuler le projet selon trois scénarios', 'Mesurer son effet sur la trésorerie et l’endettement', 'Identifier les conditions préalables'],
      livrables: ['Simulation sauvegardée', 'Note de recommandation'],
      documentsUtiles: ['devis-piste', 'note-gerant', 'courriel-trois-vallees', 'cr-comptable'],
      projets: ['piste-eclairee'],
      pistes: ['Combien de chevaux supplémentaires faut-il pour couvrir l’annuité ?', 'Les propriétaires accepteront-ils un euro de plus par jour ?', 'Qui, de la SCI ou de la SARL, doit porter l’investissement ?'],
    },
    {
      numero: 4,
      titre: 'Relation propriétaires et conditions commerciales',
      lettre: {
        de: 'Sandrine Morvilliers',
        fonction: 'Associée',
        date: '2026-03-23',
        objet: 'Contrats d’entraînement et conditions de paiement',
        corps: [
          'Nos contrats d’entraînement datent de 2009 et ne prévoient ni dépôt de garantie ni pénalités de retard. Mon mari craint qu’un durcissement fasse fuir nos meilleurs propriétaires.',
          'Je vous demande de proposer une politique commerciale et de recouvrement : conditions de paiement, contrat type, suivi des comptes, et une stratégie pour élargir notre base de propriétaires.',
        ],
      },
      contexte: 'Trois propriétaires détiennent 17 des 36 chevaux ; un propriétaire défaillant laisse une créance de 31 500 €.',
      objectifs: ['Segmenter les propriétaires selon leur valeur et leur risque', 'Proposer des conditions contractuelles', 'Construire une procédure de relance', 'Proposer des actions de prospection'],
      livrables: ['Politique de crédit client et contrat type', 'Plan de prospection des propriétaires'],
      documentsUtiles: ['balance-agee', 'courriel-trois-vallees', 'cr-comptable', 'tarifs'],
      pistes: ['Faut-il traiter différemment les propriétaires selon leur poids ?', 'Quel est le coût d’un mois de délai supplémentaire ?', 'Comment attirer des éleveurs et des copropriétés solvables ?'],
    },
    {
      numero: 5,
      titre: 'Arbitrage de direction',
      lettre: {
        de: 'Gaëtan Morvilliers',
        fonction: 'Gérant',
        date: '2026-04-06',
        objet: 'Maîtriser les coûts d’entraînement et les risques liés aux propriétaires',
        corps: [
          'Je dois décider avant l’été : investir dans la piste, durcir nos conditions de paiement, revoir nos prix, ou attendre.',
          'Je vous demande une recommandation argumentée qui tienne compte de la rentabilité, de la trésorerie, des relations avec les propriétaires et du bien-être des chevaux.',
        ],
      },
      contexte: 'Les options peuvent se combiner, mais leurs effets sur la trésorerie et sur la fidélité des propriétaires diffèrent.',
      objectifs: ['Comparer les options', 'Chiffrer leurs effets', 'Formuler une recommandation et ses conditions'],
      livrables: ['Note de recommandation (deux pages)'],
      documentsUtiles: ['balance-agee', 'cr-comptable', 'note-gerant', 'devis-piste', 'courriel-trois-vallees'],
      options: [
        { id: 'a', titre: 'Sécuriser le poste clients', description: 'Dépôt de garantie, prélèvement, suspension des engagements au-delà de 60 jours de retard, pour tous les propriétaires.' },
        { id: 'b', titre: 'Investir dans la piste', description: 'Rénover et éclairer la piste dès l’été 2026, avec une hausse d’un euro par journée.' },
        { id: 'c', titre: 'Réduire les coûts', description: 'Revoir l’organisation des déplacements, le nombre de partants par camion et les achats d’aliments.' },
        { id: 'd', titre: 'Combinaison séquencée', description: 'Construire une combinaison argumentée des options sur deux ans.' },
      ],
      pistes: ['Que se passe-t-il si l’Écurie des Trois Vallées retire ses huit chevaux ?', 'Quel prix de journée couvrirait le coût complet sans le pourcentage sur les allocations ?', 'Quel est l’ordre logique des décisions ?'],
    },
  ],

  indicateursActivite: [
    { libelle: 'Chevaux à l’entraînement (moyenne annuelle)', unite: 'chevaux', valeurs: { 2023: 36, 2024: 38.5, 2025: 37, 2026: 39.5 }, aide: 'Journées-cheval facturées / 365.' },
    { libelle: 'Taux d’occupation des boxes', unite: '%', valeurs: { 2023: 86, 2024: 92, 2025: 88, 2026: 94 } },
    { libelle: 'Partants', unite: 'partants', valeurs: { 2023: 318, 2024: 336, 2025: 312, 2026: 340 } },
    { libelle: 'Allocations gagnées par les chevaux de l’écurie', unite: '€', valeurs: { 2023: 820000, 2024: 905000, 2025: 760000, 2026: 880000 } },
    { libelle: 'Chevaux par salarié d’écurie', unite: 'chevaux', valeurs: { 2023: 3.3, 2024: 3.3, 2025: 3.2, 2026: 3.3 }, aide: 'Chevaux à l’entraînement / ETP hors gérant et secrétariat.' },
  ],
};

export default etab;
