import type { Etablissement } from '../../types';
import { an, constant, fin, ligne } from '../aides';

/**
 * Crins de Traverse (dossier standard).
 * Modèle : SCIC de médiation équine et d'équitation adaptée, séances sous convention
 * pour des institutions médico-sociales, séances individuelles, formations de sensibilisation.
 * Situation : équilibre précaire, poids très élevé du personnel, dépendance aux subventions.
 * Toutes les données sont fictives.
 */
const etab: Etablissement = {
  id: 'crins-de-traverse',
  nom: 'Crins de Traverse',
  nomCourt: 'Crins de Traverse',
  monogramme: 'CdT',
  signature: 'Le cheval comme passage, jamais comme remède.',
  famille: 'mediation',
  libelleFamille: 'Médiation équine et équitation adaptée',
  profondeur: 'standard',
  lieu: {
    commune: 'Saint-Orens-de-Gameville',
    departement: 'Haute-Garonne (31)',
    region: 'Occitanie',
    cadre: 'Ancienne ferme maraîchère en limite de la zone agricole, sur les premiers coteaux du Lauragais, à 12 km du centre de Toulouse.',
  },
  formeJuridique: 'SCIC SAS à capital variable (société coopérative d’intérêt collectif)',
  gouvernance:
    'Multisociétariat organisé en quatre collèges de vote : salariés (40 %), usagers et familles (20 %), collectivités et établissements partenaires (20 %), soutiens et bénévoles (20 %). Une personne, une voix au sein de chaque collège. Un conseil coopératif de sept membres élit la présidente, qui est aussi directrice salariée. La structure était une association jusqu’en 2019.',
  creation: 2013,
  dirigeant: { nom: 'Hélène Castagné', fonction: 'Présidente et directrice salariée, intervenante en médiation équine' },
  theme: {
    primaire: '#3d5346',
    accent: '#8c5a3a',
    fond: '#f7f6f0',
    fondAlt: '#e7ece2',
    encre: '#243029',
    attenue: '#5b685f',
    surPrimaire: '#f7f6f0',
    policeTitre: 'lora',
    policeTexte: 'inter',
    graphique: ['#5e8069', '#c08a5b', '#8fa894', '#7c6a8e', '#d0ad62'],
  },
  accroche:
    'Coopérative de médiation équine et d’équitation adaptée aux portes de Toulouse, avec douze équidés choisis pour leur calme. Une activité reconnue par les établissements médico-sociaux, qui tient grâce à des subventions renouvelées chaque année.',
  chiffresCles: [
    { libelle: 'Séances réalisées', valeur: '2 103', detail: 'en 2025, groupes et individuels' },
    { libelle: 'Équidés', valeur: '12', detail: '5 poneys, 3 chevaux de trait léger, 4 ânes' },
    { libelle: 'Institutions conventionnées', valeur: '15', detail: 'IME, ESAT, EHPAD, foyers' },
    { libelle: 'Effectif', valeur: '5,3 ETP', detail: 'directrice comprise' },
    { libelle: 'Sociétaires', valeur: '146', detail: 'quatre collèges' },
    { libelle: 'Création', valeur: '2013', detail: 'SCIC depuis 2019' },
  ],
  enjeux: [
    'Combien coûte réellement une séance, et qui doit en payer la différence ?',
    'Peut-on augmenter les tarifs des conventions sans perdre les établissements les plus fragiles ?',
    'Comment desserrer la dépendance à des subventions votées chaque année ?',
  ],
  roleEtudiant:
    'Vous intervenez comme chargé·e de mission en gestion auprès de la directrice et du conseil coopératif, à la demande du collège des salariés. Vous disposez des comptes, des conventions, des plannings et des courriers des financeurs.',

  presentation: {
    introduction:
      'Crins de Traverse accompagne des enfants et des adultes en situation de handicap, des personnes âgées et des jeunes en difficulté, avec des chevaux, des poneys et des ânes. La structure pratique deux métiers distincts : la médiation équine, conduite par des intervenants formés à cette approche, et l’équitation adaptée, enseignée par des professionnels diplômés de l’équitation titulaires d’une qualification complémentaire.',
    histoire: [
      'L’association est fondée en 2013 par Hélène Castagné, éducatrice spécialisée formée à la médiation avec le cheval, et par deux parents d’enfants accueillis en institut médico-éducatif. Les premières séances ont lieu dans un centre équestre voisin, avec trois poneys prêtés.',
      'En 2017, l’association loue une ancienne ferme maraîchère de six hectares. La demande des établissements progresse vite, mais le modèle associatif peine à associer les salariés, les familles et les établissements aux décisions. En 2019, l’assemblée générale vote la transformation en société coopérative d’intérêt collectif. Les équidés et le matériel sont repris par la SCIC, qui construit une carrière équipée d’un montoir à rampe et un module d’accueil accessible.',
      'La crise sanitaire de 2020 interrompt les séances pendant plusieurs mois ; un prêt garanti par l’État permet de passer l’année. Depuis, l’activité a dépassé son niveau antérieur, mais les comptes restent tendus : la masse salariale absorbe l’essentiel des recettes et une partie des subventions est votée tardivement.',
      'En 2024, la perte d’une convention avec un EHPAD et le non-renouvellement d’un soutien de fondation ont provoqué une perte. L’année 2025 a permis de revenir à l’équilibre, au prix d’un recours accru à la facilité de caisse au printemps.',
    ],
    valeurs: [
      { titre: 'Deux métiers, deux cadres', texte: 'La médiation équine n’est pas un cours d’équitation et ne se présente pas comme une thérapie. L’équitation adaptée est un enseignement, encadré par des professionnels diplômés. L’équipe veille à ne pas entretenir la confusion auprès des familles.' },
      { titre: 'L’équidé partenaire', texte: 'Les équidés sont choisis pour leur tempérament et protégés par des règles de charge de travail strictes. Un équidé qui montre des signes d’inconfort est retiré de la séance, quelles qu’en soient les conséquences sur le planning.' },
      { titre: 'Accessibilité', texte: 'Un tarif solidaire est proposé aux familles selon leur quotient familial. Les locaux, la carrière et les sanitaires sont accessibles aux personnes à mobilité réduite.' },
    ],
    chronologie: [
      { annee: 2013, titre: 'Création de l’association', texte: 'Premières séances de médiation dans un centre équestre partenaire, avec des poneys prêtés.' },
      { annee: 2017, titre: 'Installation à la ferme', texte: 'Bail de neuf ans sur six hectares et une grange, arrivée des premiers ânes.' },
      { annee: 2019, titre: 'Transformation en SCIC', texte: 'Reprise des équidés et du matériel, carrière avec montoir à rampe, module d’accueil accessible.' },
      { annee: 2021, titre: 'Prêt garanti par l’État', texte: 'Financement de la reprise après l’arrêt de 2020, remboursé sur cinq ans.' },
      { annee: 2024, titre: 'Année déficitaire', texte: 'Perte d’une convention et d’un soutien de fondation ; arrivée d’une jument haflinger.' },
      { annee: 2025, titre: 'Retour à l’équilibre', texte: 'Trois nouvelles conventions, dont un foyer d’accueil médicalisé ; vingt-deux journées de formation.' },
    ],
    organisation:
      'La directrice coordonne une équipe de deux intervenants en médiation équine, d’une enseignante d’équitation adaptée et d’un enseignant à temps partiel, d’un soigneur et d’une assistante administrative à mi-temps. Le conseil coopératif se réunit six fois par an ; l’assemblée générale des sociétaires vote les comptes et l’affectation des excédents.',
    modeleEconomique:
      'Les recettes proviennent des séances de groupe facturées aux institutions selon une convention annuelle (prix par séance), des séances individuelles réglées par les familles, souvent sans prise en charge, et des journées de formation vendues aux établissements. Les subventions d’exploitation et le mécénat couvrent l’écart entre le coût complet des séances et les prix pratiqués. Les excédents, lorsqu’il y en a, sont presque entièrement mis en réserves, et les parts sociales ne sont pas rémunérées.',
  },

  installations: {
    synthese:
      'Le site est loué : six hectares de prairies, une grange transformée en écurie ouverte et en sellerie, une carrière extérieure équipée et un module d’accueil. Il n’existe aucune aire de travail couverte : les séances montées sont annulées ou déplacées lorsque la carrière est détrempée ou par grand vent.',
    elements: [
      { nom: 'Carrière équipée', type: 'aire-travail', capacite: '30 × 40 m, montoir fixe à rampe', annee: 2019, etat: 'correct', description: 'Sol sable sur géotextile, drainage partiel. Le montoir à rampe permet l’installation en selle depuis un fauteuil roulant. Impraticable plusieurs jours après chaque épisode pluvieux important.', photo: 'activite' },
      { nom: 'Écurie ouverte et aire de pansage', type: 'hebergement-equin', capacite: '12 équidés, stabulation sur aire paillée', annee: 2017, etat: 'correct', description: 'Ancienne grange ouverte sur les prés. L’aire de pansage couverte sert aux séances de médiation à pied par mauvais temps.', photo: 'chevaux' },
      { nom: 'Prairies', type: 'exterieur', surface: '6 ha en quatre parcelles', etat: 'bon', description: 'Pâturage tournant ; les ânes disposent d’une parcelle maigre pour limiter les risques de surpoids et de fourbure.', photo: 'lieu' },
      { nom: 'Module d’accueil accessible', type: 'accueil', capacite: 'Salle de 35 m², sanitaires adaptés, bureau', annee: 2019, etat: 'bon', description: 'Accueil des groupes, temps de parole avant et après les séances, salle de formation pour douze personnes.' },
      { nom: 'Parc matériel', type: 'materiel', capacite: 'Microtracteur, fourgon, van 2 places', etat: 'vieillissant', description: 'Le fourgon d’occasion sert aux interventions hors site et au transport du matériel ; le microtracteur entretient la carrière.', photo: 'detail' },
    ],
    maintenance: [
      { titre: 'Carrière', texte: 'Hersage trois fois par semaine, recharge en sable prévue tous les trois ans. Le drainage n’a été posé que sur la moitié nord.' },
      { titre: 'Matériel adapté', texte: 'Contrôle mensuel des selles à poignées, sangles et étriers de sécurité ; registre de vérification tenu par l’enseignante.' },
      { titre: 'Bâtiments', texte: 'L’entretien lourd de la grange incombe au propriétaire selon le bail ; les aménagements intérieurs restent à la charge de la SCIC.' },
    ],
    contraintes: [
      'Entre 48 et 63 séances par an ont été annulées pour intempéries depuis 2023, presque toutes entre novembre et mars.',
      'Le bail de neuf ans arrive à échéance en 2026 ; le propriétaire a fait savoir qu’il souhaitait le renouveler.',
      'L’été, les fortes chaleurs obligent à concentrer les séances le matin.',
    ],
  },

  cavalerie: {
    synthese:
      'Douze équidés appartenant à la SCIC, sélectionnés sur leur calme, leur tolérance au contact et leur stabilité face aux gestes imprévus. Les ânes sont surtout mobilisés en médiation à pied ; les poneys et les chevaux de trait léger portent les cavaliers en équitation adaptée. Onze équidés sont actifs, l’un est en convalescence.',
    effectifs: [
      { categorie: 'Poneys Shetland', statut: 'propriete', nombre: 2, usage: 'Médiation à pied avec de jeunes enfants, pansage, attelage léger' },
      { categorie: 'Poneys Welsh et Fjord', statut: 'propriete', nombre: 3, usage: 'Équitation adaptée enfants, médiation' },
      { categorie: 'Chevaux de trait léger (Haflinger, Mérens)', statut: 'propriete', nombre: 3, usage: 'Équitation adaptée adolescents et adultes, montoir à rampe' },
      { categorie: 'Ânes', statut: 'propriete', nombre: 4, usage: 'Médiation à pied, marche en main, publics âgés' },
    ],
    parAge: [
      { tranche: 'Moins de 8 ans', nombre: 2 },
      { tranche: '8 à 14 ans', nombre: 6 },
      { tranche: '15 à 20 ans', nombre: 3 },
      { tranche: 'Plus de 20 ans', nombre: 1 },
    ],
    disponibilite: [
      { etat: 'En activité normale', nombre: 10 },
      { etat: 'Activité allégée', nombre: 1, commentaire: 'Shetland de 23 ans, une séance par jour au maximum' },
      { etat: 'Convalescence', nombre: 1, commentaire: 'Poney welsh, épisode de fourbure à l’automne 2025' },
    ],
    fiches: [
      { nom: 'Gaïa', race: 'Haflinger', naissance: 2016, sexe: 'jument', robe: 'Alezan crins lavés', role: 'Équitation adaptée adultes, montoir à rampe', statut: 'Propriété de la SCIC, achetée en 2024', notes: 'Très stable à l’arrêt pendant les transferts depuis le fauteuil. Équidé le plus sollicité en 2025.' },
      { nom: 'Sorgue', race: 'Mérens', naissance: 2012, sexe: 'hongre', robe: 'Noir', role: 'Équitation adaptée adolescents', statut: 'Propriété de la SCIC', notes: 'Pied très sûr, supporte bien les cavaliers qui se déséquilibrent. Ferrure des antérieurs uniquement.' },
      { nom: 'Pivoine', race: 'Shetland', naissance: 2002, sexe: 'jument', robe: 'Pie noir', role: 'Médiation avec de jeunes enfants', statut: 'Propriété de la SCIC (reprise de l’association)', notes: 'Activité allégée. Retraite au pré envisagée d’ici deux ans.' },
      { nom: 'Bartok', race: 'Âne des Pyrénées', naissance: 2014, sexe: 'hongre', robe: 'Noir pangaré', role: 'Médiation à pied, résidents d’EHPAD', statut: 'Propriété de la SCIC', notes: 'Recherche le contact. Régime contrôlé et parcelle maigre pour prévenir le surpoids.' },
    ],
    reglesUtilisation: [
      'Deux séances par jour au maximum et neuf par semaine, avec au moins une heure de pause entre deux séances montées.',
      'Deux jours de repos complet par semaine, au pré en troupeau, et quatre semaines sans séance en août.',
      'Charge portée limitée à environ 20 % du poids de l’équidé, poids du cavalier et de la selle compris (référence retenue par l’équipe).',
      'Grille d’observation des signaux d’inconfort renseignée après chaque séance ; un équidé présentant deux signaux successifs est retiré du planning du lendemain.',
    ],
  },

  activites: {
    synthese:
      'L’activité se répartit entre les séances de groupe sous convention (médiation équine et équitation adaptée, de septembre à juillet), les séances individuelles pour les particuliers et des journées de sensibilisation pour les professionnels du médico-social. L’équithérapie, approche thérapeutique distincte qui requiert une qualification de professionnel du soin, n’est pas pratiquée ni revendiquée par la structure.',
    prestations: [
      { id: 'med-convention', nom: 'Séance de médiation équine en groupe (convention)', activite: 'groupes-mediation', description: 'Séance de 1 h 30 pour quatre à six participants, conduite par un intervenant formé à la médiation équine, avec trois équidés. Préparation, compte rendu écrit à l’établissement et bilan trimestriel inclus.', unite: 'séance de groupe', prix: an(180, 185, 190, 198), volume: an(392, 368, 405, 420), capaciteAnnuelle: constant(480), compte: '706', periode: 'Septembre à juillet', clientele: 'IME, EHPAD, foyers de vie, services de protection de l’enfance' },
      { id: 'ea-convention', nom: 'Séance d’équitation adaptée en groupe (convention)', activite: 'groupes-equitation', description: 'Séance montée de 1 h 30 pour quatre cavaliers, encadrée par un enseignant diplômé titulaire d’une qualification complémentaire en équitation adaptée. Les éducateurs de l’établissement assurent l’aide à pied.', unite: 'séance de groupe', prix: an(160, 165, 170, 178), volume: an(300, 286, 318, 330), capaciteAnnuelle: constant(400), compte: '706', periode: 'Septembre à juillet', clientele: 'IME, ESAT, foyers d’accueil médicalisés' },
      { id: 'med-individuel', nom: 'Séance individuelle de médiation équine', activite: 'particuliers', description: 'Séance de 50 minutes. Prix moyen encaissé : tarif plein de 58 € à 66 € selon l’année, tarif solidaire de 32 € à 36 € selon le quotient familial.', unite: 'séance individuelle', prix: an(48, 50, 52, 53), volume: an(690, 740, 790, 820), compte: '706', periode: 'Toute l’année sauf août', clientele: 'Enfants et adolescents (troubles du neurodéveloppement), adultes en reconstruction' },
      { id: 'ea-individuel', nom: 'Cours individuel d’équitation adaptée', activite: 'particuliers', description: 'Cours de 45 minutes. Prix moyen encaissé après application du tarif solidaire.', unite: 'cours individuel', prix: an(38, 40, 42, 44), volume: an(520, 560, 590, 610), compte: '706', periode: 'Toute l’année sauf août', clientele: 'Enfants et adultes en situation de handicap moteur ou intellectuel' },
      { id: 'formation', nom: 'Journée de sensibilisation pour professionnels', activite: 'formation', description: 'Journée pour huit à douze professionnels d’un même établissement : cadre de la médiation équine, sécurité, observation de l’animal, construction d’un projet de séances. Facturée directement à l’établissement.', unite: 'journée de session', prix: an(900, 920, 950, 980), volume: an(16, 19, 22, 26), compte: '706', periode: 'Octobre à juin', clientele: 'Équipes éducatives et soignantes' },
    ],
    calendrier: [
      'Juin : renouvellement des conventions annuelles avec les établissements, planning de rentrée.',
      'Septembre à juillet : séances de groupe du mardi au vendredi, séances individuelles le mercredi, le samedi et en fin de journée.',
      'Novembre à mars : annulations pour intempéries, reports sur l’aire de pansage couverte pour la médiation à pied.',
      'Août : fermeture des séances, repos des équidés, entretien du site.',
    ],
  },

  clients: {
    synthese:
      'Six recettes sur dix proviennent des institutions sous convention, trois des familles et une des formations. Les établissements renouvellent chaque année et arbitrent la dépense sur des budgets d’animation contraints. Les familles viennent par le bouche-à-oreille et par les professionnels qui suivent leur enfant ; près d’une séance individuelle sur deux est réglée au tarif solidaire.',
    segments: [
      { nom: 'Institutions médico-sociales', part: 0.6, effectif: '15 établissements', description: 'Instituts médico-éducatifs, ESAT, EHPAD, foyers. Convention annuelle fixant un nombre de séances et un prix par séance de groupe.' },
      { nom: 'Familles et particuliers', part: 0.3, effectif: '≈ 70 personnes suivies', description: 'Séances individuelles hebdomadaires ou tous les quinze jours, le plus souvent sans prise en charge.' },
      { nom: 'Professionnels en formation', part: 0.1, effectif: '22 journées en 2025', description: 'Équipes d’établissements partenaires ou extérieurs souhaitant construire un projet de médiation animale.' },
    ],
    indicateurs: [
      { libelle: 'Institutions conventionnées', valeurs: { 2023: 14, 2024: 12, 2025: 15, 2026: 16 } },
      { libelle: 'Personnes suivies en individuel', valeurs: { 2023: 58, 2024: 63, 2025: 71 } },
      { libelle: 'Part des séances individuelles au tarif solidaire', unite: '%', valeurs: { 2023: 38, 2024: 41, 2025: 44 } },
      { libelle: 'Demandes individuelles en attente', valeurs: { 2023: 9, 2024: 14, 2025: 22 }, commentaire: 'Au 31 décembre.' },
    ],
    satisfaction: {
      source: 'Bilan annuel des conventions, juin 2025, 13 établissements répondants',
      criteres: [
        { critere: 'Qualité de l’accompagnement', note: 4.7, noteMax: 5 },
        { critere: 'Comptes rendus aux équipes', note: 4.3, noteMax: 5 },
        { critere: 'Sécurité perçue', note: 4.6, noteMax: 5 },
        { critere: 'Régularité des séances en hiver', note: 3.1, noteMax: 5 },
        { critere: 'Prix de la séance', note: 3.6, noteMax: 5 },
      ],
    },
    verbatims: [
      { auteur: 'Cheffe de service', profil: 'IME, convention depuis 2016', texte: 'Les jeunes attendent la séance toute la semaine. Quand elle est annulée pour la pluie, c’est toute la journée qui est à reconstruire.' },
      { auteur: 'Mère d’un garçon de 9 ans', profil: 'Médiation individuelle, tarif solidaire', texte: 'Sans le tarif réduit, nous ne pourrions pas venir chaque semaine. Rien n’est remboursé.' },
      { auteur: 'Directeur adjoint', profil: 'EHPAD, convention suspendue en 2024', texte: 'Nous avons dû choisir entre plusieurs activités. Nous reviendrons si notre budget d’animation le permet.' },
    ],
    communication: [
      { canal: 'Réseau des professionnels', description: 'Orientation par les équipes des établissements, les psychomotriciens et les services de soins.' },
      { canal: 'Site internet et page de réseau social', description: 'Présentation des deux métiers, de la charte de bien-être des équidés et des tarifs.' },
      { canal: 'Journée portes ouvertes des sociétaires', description: 'Chaque année en juin, avec démonstrations et assemblée générale.' },
    ],
    reclamations: [
      'Annulations hivernales jugées trop fréquentes par deux établissements.',
      'Délai d’attente de plusieurs mois pour une première séance individuelle.',
    ],
  },

  fournisseurs: {
    synthese:
      'Les achats portent sur l’alimentation et les soins de douze équidés, sur la location du site et sur les assurances, élevées pour un accueil de publics vulnérables. Les montants sont modestes, mais plusieurs postes reposent sur un seul prestataire.',
    liste: [
      { nom: 'Fourrages du Lauragais', categorie: 'Alimentation', prestation: 'Foin de prairie en petites balles, livraison mensuelle en hiver', ligne: 'foin', part: 0.9, evolutionTarifaire: '+4 % annoncé pour 2026', delaiPaiement: '30 jours', conditions: 'Commandes de saison réservées en juin', dependance: 'moyenne', risques: 'Qualité variable après les étés secs.' },
      { nom: 'Mathieu Sarrail, maréchal-ferrant', categorie: 'Soins', prestation: 'Parage des ânes et poneys, ferrure partielle des chevaux', ligne: 'marechalerie', part: 1, evolutionTarifaire: '+5 % en 2025', delaiPaiement: 'À réception', conditions: 'Passage toutes les six à huit semaines', dependance: 'forte', risques: 'Seul intervenant habitué aux ânes du site.' },
      { nom: 'Clinique vétérinaire des Coteaux', categorie: 'Soins', prestation: 'Prophylaxie, dentisterie, urgences', ligne: 'veterinaire', part: 0.85, evolutionTarifaire: 'Selon les actes', delaiPaiement: '30 jours', conditions: 'Visite annuelle groupée', dependance: 'moyenne', risques: 'Coût imprévisible des épisodes de fourbure et de colique.' },
      { nom: 'Famille Rouzaud (bailleur)', categorie: 'Immobilier', prestation: 'Location de la ferme : six hectares et grange', ligne: 'loyer', part: 1, evolutionTarifaire: 'Indexation annuelle', delaiPaiement: 'Mensuel', conditions: 'Bail de neuf ans signé en 2017', dependance: 'forte', risques: 'Échéance du bail en 2026.' },
      { nom: 'Mutuelle d’assurance de l’économie sociale', categorie: 'Assurances', prestation: 'Responsabilité civile accueil de publics vulnérables, multirisque, mortalité', ligne: 'assurances', part: 1, evolutionTarifaire: '+6 % en 2025', delaiPaiement: 'Annuel', conditions: 'Franchise relevée en 2024', dependance: 'moyenne', risques: 'Hausse de prime en cas de sinistre corporel.' },
    ],
    partenaires: [
      { nom: 'Établissements conventionnés', type: 'Clients et sociétaires', description: 'Neuf des quinze établissements sont sociétaires de la SCIC dans le collège des partenaires.' },
      { nom: 'Fondation Lauragais Solidarités (fictive)', type: 'Mécène', description: 'Soutien au tarif solidaire en 2023 et en 2025 ; renouvellement 2026 en cours d’instruction.' },
      { nom: 'Centre équestre partenaire du secteur', type: 'Équestre', description: 'Prêt ponctuel d’un manège pour des séances d’équitation adaptée, sans engagement de créneaux.' },
      { nom: 'Fédération régionale des coopératives (fictive)', type: 'Réseau coopératif', description: 'Accompagnement juridique, préparation de la révision coopérative périodique.' },
    ],
  },

  rh: {
    synthese:
      'L’équipe est qualifiée et très stable, mais réduite : chaque absence entraîne des annulations. Les salaires restent proches des minima pour des profils diplômés de niveau bac + 3. Les charges de personnel représentent plus des trois quarts du chiffre d’affaires.',
    organigramme: [
      { id: 'dir', intitule: 'Présidente et directrice, intervenante en médiation', personne: 'Hélène Castagné' },
      { id: 'med1', intitule: 'Intervenant en médiation équine', personne: 'Yanis Ferrer', parent: 'dir' },
      { id: 'med2', intitule: 'Intervenante en médiation équine (temps partiel)', personne: 'Laure Dubarry', parent: 'dir' },
      { id: 'ea', intitule: 'Enseignante d’équitation adaptée', personne: 'Camille Bories', parent: 'dir' },
      { id: 'ea2', intitule: 'Enseignant d’équitation (temps partiel)', personne: 'Romain Escudé', parent: 'ea' },
      { id: 'soin', intitule: 'Soigneur animalier', personne: 'Bastien Lacaze', parent: 'dir' },
      { id: 'adm', intitule: 'Assistante administrative (mi-temps)', personne: 'Nadia Benamar', parent: 'dir' },
    ],
    organisationTravail: [
      'Séances de groupe du mardi au vendredi, de 9 h 30 à 16 h 30 ; séances individuelles le mercredi, le samedi matin et deux soirs par semaine.',
      'Chaque séance de groupe mobilise environ deux heures et demie d’intervenant : préparation, séance, rangement des équidés et compte rendu écrit.',
      'Analyse de pratiques mensuelle avec une psychologue extérieure pour les intervenants en médiation.',
      'Le soigneur assure les soins sept jours sur sept, relayé le dimanche par un bénévole sociétaire formé.',
    ],
    saisonnalite:
      'L’activité est régulière de septembre à juillet et s’arrête en août, période des congés de l’équipe. Les annulations d’hiver ne réduisent pas la masse salariale : les intervenants sont salariés et payés que la séance ait lieu ou non.',
    dirigeant:
      'Hélène Castagné cumule la direction, la relation avec les financeurs, la présidence du conseil coopératif et environ quinze heures de séances par semaine. Elle est salariée de la SCIC (31 800 € brut annuels en 2025) et refuse toute augmentation de sa rémunération au-delà de l’indexation appliquée à l’équipe.',
    conventionCollective: 'Convention collective nationale du personnel des centres équestres',
    enjeux: [
      'Rareté des enseignants d’équitation titulaires d’une qualification complémentaire en équitation adaptée.',
      'Écart de rémunération avec le secteur médico-social pour des profils comparables.',
      'Usure professionnelle liée à l’intensité relationnelle des séances.',
    ],
  },

  environnement: {
    synthese:
      'L’agglomération toulousaine compte de nombreux établissements médico-sociaux et une forte demande de séances individuelles. L’offre est éclatée entre de petites structures, des intervenants indépendants et des centres équestres qui proposent ponctuellement des créneaux adaptés.',
    territoire:
      'Saint-Orens-de-Gameville se situe au sud-est de Toulouse, à la jonction de la périphérie urbaine et des coteaux agricoles du Lauragais. Les établissements partenaires sont situés à moins de 35 minutes de route, ce qui permet des séances sur site sans hébergement.',
    donneesTerritoire: [
      { libelle: 'Établissements médico-sociaux pour enfants et adultes à moins de 30 km', valeur: '≈ 120', source: 'Estimation du cas' },
      { libelle: 'EHPAD à moins de 20 km', valeur: '≈ 35', source: 'Estimation du cas' },
      { libelle: 'Temps de trajet moyen des établissements partenaires', valeur: '25 minutes', source: 'Relevé du cas' },
      { libelle: 'Structures proposant de la médiation équine dans un rayon de 40 km', valeur: '6', source: 'Relevé du cas' },
    ],
    concurrents: [
      { nom: 'Équi’Lien (association)', distance: '18 km', offre: 'Médiation équine, quatre chevaux, bénévoles', tarifs: 'Séance de groupe 150 €', positionnement: 'Prix bas, disponibilité limitée' },
      { nom: 'Intervenante indépendante', distance: '25 km', offre: 'Médiation équine au domicile des établissements avec deux poneys', tarifs: 'Séance de groupe 210 € déplacement compris', positionnement: 'Mobilité, aucune installation' },
      { nom: 'Centres équestres de l’agglomération', distance: '10 à 30 km', offre: 'Créneaux d’équitation adaptée ponctuels, manèges couverts', tarifs: 'Cours collectif adapté 25 à 35 € par cavalier', positionnement: 'Infrastructures couvertes, encadrement moins spécialisé' },
    ],
    pestel: [
      { dimension: 'Politique', faits: ['Les départements sont compétents pour une large part de l’action sociale en faveur des personnes handicapées et des personnes âgées.', 'Les subventions d’exploitation de la SCIC sont votées chaque année, sans engagement pluriannuel.'] },
      { dimension: 'Économique', faits: ['Les établissements financent les activités extérieures sur des budgets d’animation ou de projets.', 'Le prix du foin a fortement augmenté après la sécheresse de 2022.', 'Le SMIC a été revalorisé à plusieurs reprises depuis 2022.'] },
      { dimension: 'Socioculturel', faits: ['Les approches de médiation animale sont de plus en plus connues des familles et des équipes.', 'Les familles d’enfants présentant des troubles du neurodéveloppement recherchent des activités régulières hors du soin.', 'Le public des EHPAD présente une dépendance plus marquée qu’il y a dix ans.'] },
      { dimension: 'Technologique', faits: ['Montoirs à rampe, selles à poignées et étriers de sécurité facilitent l’accès à cheval des personnes à mobilité réduite.', 'Les structures légères couvertes permettent de couvrir une aire de travail sans construction maçonnée.'] },
      { dimension: 'Écologique', faits: ['Les épisodes de chaleur estivale sont plus fréquents en Haute-Garonne.', 'Les automnes et hivers récents ont connu des épisodes pluvieux prolongés.'] },
      { dimension: 'Légal', faits: ['La loi n° 2021-1539 du 30 novembre 2021 visant à lutter contre la maltraitance animale a renforcé les obligations des détenteurs d’équidés.', 'L’enseignement de l’équitation contre rémunération est réservé aux titulaires de diplômes ou titres inscrits au code du sport.', 'La médiation équine n’est pas une profession réglementée ; l’équithérapie désigne une approche thérapeutique distincte, pratiquée par des professionnels du soin formés spécifiquement.', 'Le statut de SCIC, introduit en 2001 dans la loi du 10 septembre 1947 portant statut de la coopération, impose un multisociétariat et des réserves impartageables.'] },
    ],
    marche: [
      'La demande individuelle excède l’offre : la liste d’attente est passée de 9 à 22 demandes en deux ans.',
      'Les établissements comparent les prix de séance entre structures, sans toujours distinguer médiation et équitation adaptée.',
      'Les formations de sensibilisation intéressent des établissements qui envisagent un projet interne de médiation animale.',
    ],
  },

  finances: {
    referentiel: 'PCG',
    regimeFiscal: 'IS',
    formeComptable: 'SCIC SAS à capital variable, soumise à l’impôt sur les sociétés',
    subventionsExploitation: [
      ligne('subv-departement', 'Subvention du Département (fonctionnement, montants du cas)', '74', an(30000, 30000, 30000, 30000), 'Votée chaque année en avril, versée en deux fois (juillet et décembre).'),
      ligne('subv-caf', 'Aide de la caisse d’allocations familiales (inclusion des enfants, montants du cas)', '74', an(10000, 12000, 14000, 14000), 'Versée à l’automne sur justificatifs.'),
      ligne('subv-fondation', 'Soutien de la Fondation Lauragais Solidarités (fictive) au tarif solidaire', '74', an(15000, 0, 12000, 15000), 'Non renouvelée en 2024 ; demande 2026 en instruction.'),
      ligne('subv-aap', 'Appel à projets régional « sport, santé et inclusion » (dispositif fictif du cas)', '74', an(8000, 12000, 0, 10000), 'Projet annuel ; aucune candidature retenue en 2025, nouvelle candidature déposée pour 2026.'),
    ],
    autresProduits: [ligne('mecenat', 'Mécénat et dons d’entreprises partenaires', '758', an(8000, 13000, 9000, 9000), '2024 : appel exceptionnel aux sociétaires et aux entreprises voisines après la perte de la fondation.')],
    produitsFinanciers: [],
    produitsExceptionnels: [],
    achatsMarchandises: [],
    achatsApprovisionnements: [
      ligne('foin', 'Foin', '6011', an(10600, 9600, 9800, 10200), '2023 encore marqué par la sécheresse de 2022.'),
      ligne('concentres', 'Aliments concentrés et minéraux', '6013', an(3500, 3500, 3600, 3700)),
      ligne('litiere', 'Paille de litière', '6012', an(4000, 4100, 4200, 4300)),
      ligne('complements', 'Pharmacie, compléments et petites fournitures de soins', '6022', an(1300, 1400, 1500, 1500)),
    ],
    chargesExternes: [
      ligne('loyer', 'Loyer de la ferme (bail de neuf ans)', '6132', an(12600, 12900, 13200, 13600)),
      ligne('marechalerie', 'Maréchalerie et parage', '6226', an(5000, 5300, 5600, 5800)),
      ligne('veterinaire', 'Vétérinaire, dentiste, ostéopathe', '6227', an(5400, 5800, 6200, 6000), '2025 : épisode de fourbure d’un poney.'),
      ligne('energie', 'Électricité et eau', '6061', an(5600, 5200, 5400, 5600)),
      ligne('carburant', 'Carburant du fourgon et du microtracteur', '6061', an(3900, 3800, 4100, 4300)),
      ligne('entretien', 'Entretien du site, de la carrière et du matériel adapté', '615', an(5200, 5600, 5800, 6000)),
      ligne('assurances', 'Assurances (responsabilité civile, multirisque, mortalité)', '616', an(6400, 6800, 7200, 7600)),
      ligne('honoraires', 'Honoraires comptables, révision coopérative et juridique', '6226', an(4800, 5000, 5200, 5400)),
      ligne('supervision', 'Analyse de pratiques des intervenants (psychologue extérieure)', '6228', an(2400, 2600, 2800, 2800)),
      ligne('formation-equipe', 'Formation continue de l’équipe', '6228', an(1600, 1900, 2000, 2200)),
      ligne('pedagogie', 'Fournitures et matériel pédagogique non immobilisé', '6064', an(1600, 1700, 1800, 1900)),
      ligne('deplacements', 'Déplacements pour les formations en établissement', '6251', an(1500, 1900, 2400, 2700)),
      ligne('communication', 'Communication et site internet', '623', an(1100, 1200, 1300, 1500)),
      ligne('telecom', 'Téléphone, internet, logiciel de planning', '626', an(1700, 1800, 1900, 2000)),
      ligne('banque', 'Frais bancaires', '627', an(600, 650, 700, 750)),
      ligne('cotisations', 'Cotisations au réseau coopératif et adhésions', '6281', an(850, 900, 900, 950)),
    ],
    impotsTaxes: [
      ligne('cfe', 'Contribution économique territoriale et taxes diverses', '635', an(550, 580, 600, 620)),
      ligne('formation-pro', 'Contribution à la formation professionnelle', '633', an(1500, 1650, 1700, 1800)),
    ],
    autresCharges: [],
    chargesFinancieresAutres: [ligne('agios', 'Agios sur facilité de caisse', '6615', an(700, 1300, 1200, 900), 'Utilisation de la facilité de caisse de février à juin, avant le versement des subventions.')],
    chargesExceptionnelles: [],
    personnel: [
      { id: 'directrice', intitule: 'Présidente et directrice salariée, intervenante', titulaire: 'Hélène Castagné', categorie: 'direction', etp: constant(1), brutAnnuelEtp: an(30600, 31200, 31800, 32400), tauxCharges: 0.33 },
      { id: 'intervenants-mediation', intitule: 'Intervenants en médiation équine', titulaire: 'Yanis Ferrer, Laure Dubarry', categorie: 'enseignement', etp: an(1.5, 1.6, 1.6, 1.8), brutAnnuelEtp: an(24800, 25400, 26000, 26600), tauxCharges: 0.28 },
      { id: 'enseignants-ea', intitule: 'Enseignants d’équitation adaptée', titulaire: 'Camille Bories, Romain Escudé', categorie: 'enseignement', etp: an(1, 1.1, 1.2, 1.2), brutAnnuelEtp: an(23800, 24400, 25000, 25600), tauxCharges: 0.27 },
      { id: 'soigneur', intitule: 'Soigneur animalier', titulaire: 'Bastien Lacaze', categorie: 'soins', etp: constant(1), brutAnnuelEtp: an(21000, 21500, 22000, 22500), tauxCharges: 0.16 },
      { id: 'administratif', intitule: 'Assistante administrative et conventions', titulaire: 'Nadia Benamar', categorie: 'administratif', etp: an(0.5, 0.5, 0.5, 0.6), brutAnnuelEtp: an(21800, 22300, 22800, 23300), tauxCharges: 0.2 },
    ],
    immobilisations: [
      { id: 'depot-garantie', libelle: 'Dépôt de garantie du bail', categorie: 'financier', valeurOrigine: 2200, miseEnService: '2017-09', duree: 0 },
      { id: 'logiciel', libelle: 'Logiciel de planning et matériel informatique', categorie: 'incorporel', valeurOrigine: 3200, miseEnService: '2024-01', duree: 3 },
      { id: 'module-accueil', libelle: 'Module d’accueil accessible et sanitaires adaptés', categorie: 'constructions', valeurOrigine: 42000, miseEnService: '2019-11', duree: 15 },
      { id: 'carriere', libelle: 'Carrière 30 × 40 m et montoir fixe à rampe', categorie: 'installations', valeurOrigine: 34000, miseEnService: '2019-10', duree: 10 },
      { id: 'clotures', libelle: 'Clôtures, abris de pré et aire de pansage couverte', categorie: 'installations', valeurOrigine: 16000, miseEnService: '2020-05', duree: 10 },
      { id: 'sellerie', libelle: 'Selles à poignées, sangles et harnachement adaptés', categorie: 'materiel', valeurOrigine: 9500, miseEnService: '2021-02', duree: 5 },
      { id: 'materiel-2023', libelle: 'Montoir mobile, matériel sensoriel et harnachement (2023)', categorie: 'materiel', valeurOrigine: 8400, miseEnService: '2023-05', duree: 5 },
      { id: 'microtracteur', libelle: 'Microtracteur et herse d’occasion', categorie: 'materiel', valeurOrigine: 12000, miseEnService: '2020-03', duree: 8 },
      { id: 'fourgon', libelle: 'Fourgon utilitaire et van deux places d’occasion', categorie: 'vehicules', valeurOrigine: 19000, miseEnService: '2022-06', duree: 6 },
      { id: 'cav-2019', libelle: 'Équidés repris de l’association en 2019 (huit équidés)', categorie: 'cavalerie', valeurOrigine: 21000, miseEnService: '2019-09', duree: 8 },
      { id: 'cav-2021', libelle: 'Deux ânes et un poney (achats 2021)', categorie: 'cavalerie', valeurOrigine: 5400, miseEnService: '2021-04', duree: 7 },
      { id: 'cav-2024', libelle: 'Jument haflinger Gaïa (achat 2024)', categorie: 'cavalerie', valeurOrigine: 5200, miseEnService: '2024-03', duree: 7 },
      { id: 'cav-2026', libelle: 'Équidé de remplacement (budget 2026)', categorie: 'cavalerie', valeurOrigine: 5000, miseEnService: '2026-04', duree: 7, prevue: true },
    ],
    emprunts: [
      { id: 'pret-installation', libelle: 'Prêt d’installation de la SCIC', preteur: 'Caisse solidaire du Lauragais (fictive)', capital: 65000, taux: 0.0135, dureeMois: 120, debut: '2019-10', objet: 'Carrière équipée, module d’accueil, reprise des équidés' },
      { id: 'pge', libelle: 'Prêt garanti par l’État', preteur: 'Caisse solidaire du Lauragais (fictive)', capital: 25000, taux: 0.0085, dureeMois: 60, debut: '2021-05', objet: 'Reconstitution de la trésorerie après l’arrêt de 2020 (amortissement après un an de différé)' },
      { id: 'pret-fourgon', libelle: 'Prêt fourgon et van', preteur: 'Caisse solidaire du Lauragais (fictive)', capital: 14000, taux: 0.019, dureeMois: 60, debut: '2022-06', objet: 'Fourgon et van d’occasion' },
    ],
    subventionsInvestissement: [
      { id: 'subv-accueil', libelle: 'Aide à l’accessibilité du module d’accueil', financeur: 'Département (montant du cas)', montant: 18000, date: '2019-12', dureeReprise: 15 },
      { id: 'subv-materiel', libelle: 'Aide au matériel adapté', financeur: 'Fondation Lauragais Solidarités (fictive)', montant: 6000, date: '2023-06', dureeReprise: 5 },
    ],
    stocks: [{ id: 'stock-aliments', libelle: 'Foin, paille et aliments', type: 'approvisionnements', finDAn: fin(3800, 4200, 3600, 3900, 4000) }],
    provisions: [],
    bfr: {
      creancesClients: fin(19500, 20500, 21000, 23500, 24000),
      autresCreances: fin(15000, 19000, 22000, 23000, 21000),
      dettesFournisseurs: fin(6800, 7200, 7900, 8100, 8400),
      dettesFiscalesSociales: fin(18500, 20200, 21800, 23000, 24000),
      autresDettes: fin(1200, 1300, 1500, 1400, 1400),
      produitsConstatesAvance: fin(2600, 2900, 3300, 3700, 4000),
    },
    ouverture: { capital: 38000, libelleCapital: 'Capital social variable (parts des sociétaires)', tresorerie: 18000 },
    dividendes: an(0, 0, 0, 0),
    apports: an(1500, 1800, 2400, 3000),
    tresorerieMensuelle: {
      saisonnaliteEncaissements: [9, 8, 8, 9, 9, 9, 10, 6, 4, 7, 9, 9],
      saisonnaliteAchats: [10, 10, 9, 8, 7, 7, 7, 7, 8, 9, 9, 9],
      saisonnalitePersonnel: [8, 8, 8, 8, 8, 8, 9, 9, 8, 8, 8, 10],
      moisSubventions: [7, 10, 12],
      moisDistributions: [],
      commentaire:
        'Les établissements règlent les séances à 45 à 60 jours, souvent par trimestre ; aucun encaissement de convention n’intervient en septembre après la fermeture d’août. Les subventions sont versées à partir de juillet : de février à juin, puis en septembre, la trésorerie repose sur la facilité de caisse. Les familles règlent par cartes de dix séances ; la part non consommée à la clôture constitue des produits constatés d’avance.',
    },
    analytique: {
      exercice: 2025,
      sections: [
        { id: 'groupes-mediation', nom: 'Médiation équine en groupe (conventions)', uniteOeuvre: { libelle: 'séance de groupe', quantite: 405 } },
        { id: 'groupes-equitation', nom: 'Équitation adaptée en groupe (conventions)', uniteOeuvre: { libelle: 'séance de groupe', quantite: 318 } },
        { id: 'particuliers', nom: 'Séances individuelles (médiation et équitation adaptée)', uniteOeuvre: { libelle: 'séance individuelle', quantite: 1380 } },
        { id: 'formation', nom: 'Formation des professionnels', uniteOeuvre: { libelle: 'journée de session', quantite: 22 } },
      ],
      cles: [
        { id: 'equide-seances', nom: 'Équidé-séances', unite: 'équidé-séances', justification: 'Nombre d’équidés mobilisés par séance (trois en médiation de groupe, quatre en équitation adaptée de groupe, un en individuel, trois par journée de formation) multiplié par le nombre de séances 2025.', repartition: { 'groupes-mediation': 1215, 'groupes-equitation': 1272, particuliers: 1380, formation: 66 } },
        { id: 'heures-mediation', nom: 'Heures des intervenants en médiation', unite: 'heures', justification: 'Plannings 2025 : 2,5 heures par séance de groupe, 1,25 heure par séance individuelle de médiation, huit heures par journée de formation animée.', repartition: { 'groupes-mediation': 1012, particuliers: 988, formation: 176 } },
        { id: 'heures-ea', nom: 'Heures des enseignants d’équitation adaptée', unite: 'heures', justification: 'Plannings 2025 : 2,25 heures par séance de groupe, une heure par cours individuel, interventions ponctuelles en formation.', repartition: { 'groupes-equitation': 716, particuliers: 590, formation: 40 } },
        { id: 'heures-equipe', nom: 'Heures d’intervention de l’équipe', unite: 'heures', justification: 'Somme des heures d’intervention de tous les professionnels par activité.', repartition: { 'groupes-mediation': 1012, 'groupes-equitation': 716, particuliers: 1578, formation: 216 } },
        { id: 'occupation-site', nom: 'Occupation du site', unite: 'heures de séance sur site', justification: 'Durée des séances sur le site (1,5 heure en groupe, une heure en individuel) ; la moitié des journées de formation se déroule dans les établissements.', repartition: { 'groupes-mediation': 608, 'groupes-equitation': 477, particuliers: 1380, formation: 77 } },
        { id: 'financements', nom: 'Fléchage des financements', unite: '€', justification: 'Objet des conventions de subvention 2025 : le Département soutient l’accueil des publics d’établissements, la CAF et la fondation financent l’accès des familles.', repartition: { 'groupes-mediation': 15000, 'groupes-equitation': 15000, particuliers: 26000 } },
      ],
      affectations: {
        foin: { cle: 'equide-seances' },
        concentres: { cle: 'equide-seances' },
        litiere: { cle: 'equide-seances' },
        complements: { cle: 'equide-seances' },
        'variation-stocks': { cle: 'equide-seances' },
        marechalerie: { cle: 'equide-seances' },
        veterinaire: { cle: 'equide-seances' },
        soigneur: { cle: 'equide-seances' },
        'amortissements:cavalerie': { cle: 'equide-seances' },
        'intervenants-mediation': { cle: 'heures-mediation' },
        supervision: { cle: 'heures-mediation' },
        'enseignants-ea': { cle: 'heures-ea' },
        directrice: { cle: 'heures-equipe' },
        'formation-equipe': { cle: 'heures-equipe' },
        loyer: { cle: 'occupation-site' },
        energie: { cle: 'occupation-site' },
        entretien: { cle: 'occupation-site' },
        'amortissements:constructions': { cle: 'occupation-site' },
        'amortissements:installations': { cle: 'occupation-site' },
        'amortissements:materiel': { cle: 'occupation-site' },
        deplacements: { section: 'formation' },
        interets: { cle: 'occupation-site' },
      },
      cleParDefaut: 'heures-equipe',
      affectationsProduits: { subventions: { cle: 'financements' }, 'autres-produits': { section: 'particuliers' } },
      commentaire:
        'Coûts complets 2025 avant subventions et après subventions. Les charges liées aux équidés suivent les équidé-séances, celles du personnel d’intervention les heures de chaque métier, celles du site son occupation. Les subventions sont affectées selon leur objet : comparez le résultat de chaque section avec et sans cette affectation.',
    },
    hypotheses: [
      'Montants hors taxes ; la TVA et les éventuelles exonérations applicables à certaines prestations ne sont pas modélisées.',
      'Les prix des séances individuelles sont des prix moyens encaissés, après application du tarif solidaire.',
      'L’impôt sur les sociétés est calculé par le moteur sans retraitement fiscal ; la déductibilité, prévue sous conditions pour les SCIC, des sommes affectées aux réserves impartageables n’est pas modélisée.',
      'Le régime fiscal applicable aux mécènes de la SCIC n’est pas étudié ; seuls les montants reçus sont retenus.',
      'Les équidés sont des immobilisations amorties sur sept à huit ans ; un équidé amorti peut rester en activité.',
      'Les subventions notifiées et non versées à la clôture figurent en autres créances.',
    ],
  },

  documents: [
    {
      id: 'note-tarifs',
      type: 'note',
      titre: 'Tarifs des conventions 2026-2027 : proposition au conseil coopératif',
      date: '2026-01-19',
      emetteur: 'Hélène Castagné, présidente et directrice',
      destinataire: 'Conseil coopératif',
      resume: 'La directrice propose une hausse du prix des séances de groupe et le maintien du tarif solidaire.',
      rubriques: ['activites', 'finances', 'clients'],
      contenu: [
        { type: 'p', texte: 'En 2025, nous avons facturé 190 € la séance de médiation en groupe et 170 € la séance d’équitation adaptée en groupe. Pour 2026, le budget retient 198 € et 178 €. Je pense que nous devons aller plus loin pour la rentrée de septembre : 210 € et 190 €.' },
        { type: 'p', texte: 'Notre principal concurrent associatif facture 150 €, mais avec des bénévoles et sans compte rendu écrit. L’intervenante indépendante facture 210 € déplacement compris. Les établissements nous disent que le prix est un sujet, mais aucun n’a quitté la SCIC pour cette raison, sauf l’EHPAD en 2024.' },
        { type: 'p', texte: 'Je propose de ne pas toucher au tarif solidaire des familles (36 €) : c’est notre raison d’être. En revanche, le tarif plein pourrait passer de 64 € à 68 €.' },
        { type: 'p', texte: 'Je souhaite que cette proposition soit éclairée par un calcul du coût complet d’une séance avant le conseil de mars.' },
        { type: 'signature', nom: 'Hélène Castagné', fonction: 'Présidente et directrice' },
      ],
    },
    {
      id: 'courrier-departement',
      type: 'courrier',
      titre: 'Subvention de fonctionnement 2026',
      date: '2025-12-04',
      emetteur: 'Département, direction de l’autonomie (service instructeur)',
      destinataire: 'SCIC Crins de Traverse',
      resume: 'Le service instructeur indique les conditions de la subvention 2026 et un possible ajustement.',
      rubriques: ['finances', 'environnement'],
      contenu: [
        { type: 'p', texte: 'Madame la Présidente,' },
        { type: 'p', texte: 'Votre demande de subvention de fonctionnement pour 2026, d’un montant de 30 000 €, sera présentée à la commission permanente d’avril, sous réserve du vote du budget départemental.' },
        { type: 'p', texte: 'Dans le contexte budgétaire actuel, je ne suis pas en mesure de vous garantir la reconduction du montant de 2025. Une réduction de l’ordre de 10 % est envisagée pour l’ensemble des structures soutenues sur cette ligne.' },
        { type: 'p', texte: 'Le versement interviendra en deux fois : 60 % après le vote, au plus tôt en juillet, et le solde sur présentation du bilan d’activité, en décembre. Aucune avance ne peut être consentie.' },
        { type: 'signature', nom: 'Patrick Andrieu', fonction: 'Chef du service des partenariats associatifs et coopératifs' },
      ],
    },
    {
      id: 'cr-conseil',
      type: 'compte-rendu',
      titre: 'Compte rendu du conseil coopératif du 21 novembre 2025',
      date: '2025-11-21',
      emetteur: 'Nadia Benamar, secrétaire de séance',
      destinataire: 'Sociétaires',
      resume: 'Le conseil débat de la tarification, des annulations d’hiver et du projet de manège couvert.',
      rubriques: ['etablissement', 'rh', 'installations'],
      contenu: [
        { type: 'p', texte: 'Présents : Hélène Castagné (salariés), Yanis Ferrer (salariés), deux représentants des familles, la cheffe de service d’un IME (partenaires), un élu municipal à titre personnel (soutiens), le trésorier bénévole.' },
        { type: 'h', texte: '1. Comptes provisoires 2025' },
        { type: 'p', texte: 'Le trésorier annonce un résultat proche de l’équilibre. Il rappelle que la facilité de caisse de 20 000 € a été utilisée de février à juin, puis de nouveau en septembre, avant le versement du solde des subventions.' },
        { type: 'citation', texte: 'Chaque année, nous finissons à l’équilibre parce que les subventions finissent par arriver. Le jour où l’une d’elles manque, nous n’avons aucune réserve.', auteur: 'Le trésorier' },
        { type: 'h', texte: '2. Tarifs' },
        { type: 'p', texte: 'Les représentants des familles s’opposent à toute hausse du tarif solidaire. La représentante des établissements indique qu’une hausse de plus de 5 % serait difficile à faire accepter par sa direction en cours d’année.' },
        { type: 'h', texte: '3. Annulations d’hiver et projet de manège' },
        { type: 'p', texte: 'Yanis Ferrer rappelle que 51 séances ont été annulées en 2025 alors que les intervenants étaient payés. Il défend le projet de structure couverte. Le trésorier s’inquiète d’un nouvel emprunt tant que la subvention n’est pas acquise.' },
        { type: 'h', texte: 'Décisions' },
        { type: 'liste', items: ['Faire calculer le coût complet des séances avant toute décision tarifaire.', 'Instruire le projet de manège couvert avec plusieurs hypothèses de financement.', 'Aucune embauche avant la notification des subventions 2026.'] },
      ],
    },
    {
      id: 'suivi-seances',
      type: 'tableau',
      titre: 'Suivi des séances et de la charge des équidés, 2025',
      date: '2026-01-08',
      emetteur: 'Camille Bories, enseignante d’équitation adaptée',
      resume: 'Séances réalisées, annulées et charge moyenne des équidés par trimestre.',
      rubriques: ['activites', 'cavalerie'],
      contenu: [
        { type: 'tableau', colonnes: ['Période', 'Séances de groupe', 'Séances individuelles', 'Annulées (intempéries)', 'Séances par équidé actif et par semaine'], alignDroite: [1, 2, 3, 4], lignes: [
          ['Janvier à mars', 168, 330, 29, '7,1'],
          ['Avril à juin', 222, 410, 6, '8,6'],
          ['Juillet et août', 63, 150, 0, '7,8 (juillet)'],
          ['Septembre à décembre', 270, 490, 16, '8,2'],
          ['Total 2025', 723, 1380, 51, '7,9'],
        ], note: 'Équidé-séances : trois équidés par séance de médiation en groupe, quatre par séance d’équitation adaptée en groupe, un par séance individuelle. Limite de l’équipe : neuf séances par équidé et par semaine. Moyenne calculée sur onze équidés actifs et 45 semaines.' },
        { type: 'p', texte: 'Le budget 2026 prévoit 750 séances de groupe et 1 430 séances individuelles, soit environ 8,3 séances par équidé actif et par semaine en moyenne, avec des pointes au printemps.' },
      ],
    },
    {
      id: 'courriel-banque',
      type: 'courriel',
      titre: 'Re : facilité de caisse et projet de structure couverte',
      date: '2026-02-10',
      emetteur: 'Julien Mas, chargé d’affaires économie sociale, Caisse solidaire du Lauragais (fictive)',
      destinataire: 'Hélène Castagné',
      resume: 'La banque précise ses conditions pour la facilité de caisse et pour un éventuel prêt.',
      rubriques: ['finances'],
      contenu: [
        { type: 'p', texte: 'Bonjour Madame Castagné,' },
        { type: 'p', texte: 'Nous pouvons reconduire la facilité de caisse de 20 000 € pour 2026. Nous pourrions également mobiliser vos subventions notifiées par cession de créances, à condition de disposer des arrêtés d’attribution.' },
        { type: 'p', texte: 'Pour la structure couverte, un prêt de 50 000 € sur douze ans est envisageable à un taux de l’ordre de 4,1 %, sous réserve que les subventions d’investissement soient notifiées avant le déblocage. Notre comité sera attentif à la capacité de la SCIC à dégager un excédent régulier.' },
        { type: 'signature', nom: 'Julien Mas', fonction: 'Chargé d’affaires' },
      ],
    },
    {
      id: 'devis-manege',
      type: 'devis',
      titre: 'Devis : structure couverte légère 20 × 40 m accessible',
      date: '2025-10-27',
      emetteur: 'Abris et Structures d’Occitanie (fictif)',
      destinataire: 'SCIC Crins de Traverse',
      resume: 'Devis de couverture d’une aire de travail avec aménagements d’accessibilité.',
      rubriques: ['installations', 'finances'],
      contenu: [
        { type: 'tableau', colonnes: ['Poste', 'Montant HT'], alignDroite: [1], lignes: [
          ['Structure métallique et couverture textile 20 × 40 m, pose comprise', '98 000 €'],
          ['Sol sable fibré et drainage', '16 000 €'],
          ['Rampe d’accès, montoir adapté couvert, cheminement PMR', '14 000 €'],
          ['Éclairage LED', '5 000 €'],
          ['Total', '133 000 €'],
        ] },
        { type: 'p', texte: 'Délai de réalisation : six à huit mois après la commande, permis de construire compris. Garantie de la couverture textile : quinze ans. Le terrain étant loué, l’accord écrit du propriétaire est indispensable.' },
      ],
    },
  ],
  documentsAuto: [
    { id: 'tarifs', type: 'auto-tarifs', titre: 'Prix et volumes des séances 2023-2026' },
    { id: 'echeancier-installation', type: 'auto-echeancier', emprunt: 'pret-installation', titre: 'Échéancier du prêt d’installation' },
    { id: 'echeancier-pge', type: 'auto-echeancier', emprunt: 'pge', titre: 'Échéancier du prêt garanti par l’État' },
    { id: 'cr-2025', type: 'auto-compte-resultat', exercice: 2025, titre: 'Compte de résultat 2025' },
    { id: 'bilan-2025', type: 'auto-bilan', exercice: 2025, titre: 'Bilan au 31 décembre 2025' },
  ],

  projets: [
    {
      id: 'manege-couvert',
      titre: 'Structure couverte légère accessible',
      description:
        'Couverture d’une aire de travail de 20 × 40 m par une structure métallique à couverture textile, avec rampe d’accès, montoir adapté couvert et cheminement accessible. Objectif : supprimer les annulations d’hiver, reprendre des créneaux de groupe et répondre à une partie de la liste d’attente individuelle.',
      composantes: [
        { libelle: 'Structure métallique et couverture textile', montant: 98000, duree: 15 },
        { libelle: 'Sol sable fibré et drainage', montant: 16000, duree: 10 },
        { libelle: 'Rampe, montoir adapté couvert, cheminement PMR', montant: 14000, duree: 15 },
        { libelle: 'Éclairage LED', montant: 5000, duree: 10 },
      ],
      chargesLancement: 2000,
      financement: { apport: 25000, emprunt: 50000, taux: 0.041, dureeAnnees: 12, subvention: 60000, dureeRepriseSubvention: 15 },
      recettes: [
        { libelle: 'Séances de groupe sous convention maintenues ou ajoutées', unite: 'séance de groupe', prix: 185, volumes: { prudent: 50, central: 95, favorable: 120 }, capaciteMax: 160 },
        { libelle: 'Séances individuelles supplémentaires', unite: 'séance individuelle', prix: 50, volumes: { prudent: 120, central: 240, favorable: 300 }, capaciteMax: 400 },
      ],
      tauxChargesVariables: 0.15,
      chargesFixes: [
        { libelle: 'Entretien du sol et de la couverture', montant: 2600 },
        { libelle: 'Assurance de la structure', montant: 1200 },
        { libelle: 'Électricité de l’éclairage', montant: 900 },
        { libelle: 'Temps de soins supplémentaire (0,15 ETP)', montant: 3800 },
      ],
      delaiMiseEnServiceMois: 8,
      monteeEnCharge: [0.7, 0.9, 1],
      horizon: 15,
      tauxActualisation: 0.05,
      tauxImpot: 0.15,
      reperes: [
        'Séances annulées pour intempéries : 48 en 2023, 63 en 2024, 51 en 2025, dont une majorité de séances de groupe.',
        'Prix moyen d’une séance de groupe en 2025 : 190 € en médiation, 170 € en équitation adaptée.',
        'Les intervenants sont salariés : une séance annulée ne réduit pas la masse salariale, ce qui justifie un faible taux de charges variables.',
        'Subvention d’investissement de 60 000 € (Département et fondation) : hypothèse du cas, non notifiée.',
      ],
      vigilance: [
        'Le budget 2026 porte déjà la charge moyenne à 8,3 séances par équidé actif et par semaine, pour une limite de neuf.',
        'Le site est loué : l’accord du propriétaire et le renouvellement du bail en 2026 conditionnent le projet.',
        'Un nouvel emprunt alourdit des annuités supportées par un excédent faible et irrégulier.',
      ],
    },
  ],

  missions: [
    {
      numero: 1,
      titre: 'Diagnostic stratégique',
      lettre: {
        de: 'Hélène Castagné',
        fonction: 'Présidente et directrice',
        date: '2026-01-12',
        objet: 'Regard extérieur sur la situation de la coopérative',
        corps: [
          'Le conseil coopératif doit prendre au printemps plusieurs décisions qui engagent la SCIC pour plusieurs années : tarifs, projet de structure couverte, renouvellement du bail.',
          'Je vous demande un diagnostic de notre situation : nos atouts et nos fragilités, ce que notre environnement nous offre et ce qu’il nous impose. Distinguez soigneusement ce qui relève de la médiation équine, de l’équitation adaptée et de la formation.',
          'Votre synthèse sera présentée aux quatre collèges de sociétaires.',
        ],
      },
      contexte: 'La structure est reconnue par les établissements mais ne dégage presque pas d’excédent ; la demande individuelle dépasse l’offre et les annulations d’hiver pèsent sur la relation avec les institutions.',
      objectifs: ['Réaliser un diagnostic interne et externe argumenté', 'Situer la SCIC face aux autres offres du territoire', 'Hiérarchiser les enjeux stratégiques'],
      livrables: ['Matrice de diagnostic étayée par les pièces du dossier', 'Synthèse des enjeux pour les sociétaires (une page)'],
      documentsUtiles: ['cr-conseil', 'suivi-seances', 'courrier-departement', 'note-tarifs'],
      pistes: [
        'Quelles activités portent la croissance, lesquelles la contraignent ?',
        'Les équidés, l’équipe et le site : lequel est aujourd’hui le facteur limitant ?',
        'Que change le statut coopératif dans la manière de décider et de financer ?',
      ],
    },
    {
      numero: 2,
      titre: 'Diagnostic financier et coût des séances',
      lettre: {
        de: 'Hélène Castagné',
        fonction: 'Présidente et directrice',
        date: '2026-02-02',
        objet: 'Viabilité financière et coût complet d’une séance',
        corps: [
          'Nous finissons les années proches de l’équilibre, mais je ne sais pas dire combien coûte une séance ni quelle part de ce coût est payée par les établissements, par les familles et par les financeurs.',
          'Je vous demande une analyse de nos comptes 2023 à 2025 et du budget 2026, puis un calcul du coût complet de chaque type de séance comparé au prix facturé.',
        ],
      },
      contexte: 'Les comptes sont ceux d’une SCIC à l’impôt sur les sociétés, sans dividende, avec des subventions annuelles versées tardivement.',
      objectifs: ['Analyser les SIG, la CAF et la structure financière', 'Expliquer la tension de trésorerie au printemps', 'Calculer et commenter les coûts complets par section', 'Mesurer la part subventionnée de chaque type de séance'],
      livrables: ['Note d’analyse financière', 'Tableau coût complet, prix et part subventionnée par séance', 'Contrôles de calcul complétés'],
      documentsUtiles: ['cr-2025', 'bilan-2025', 'echeancier-installation', 'echeancier-pge', 'courrier-departement', 'courriel-banque', 'tarifs'],
      pistes: [
        'Que deviendrait le résultat 2025 sans la subvention de la fondation ?',
        'Pourquoi le besoin en fonds de roulement est-il positif dans une activité de services ?',
        'L’affectation des subventions par objet change-t-elle la lecture de la rentabilité des sections ?',
      ],
      controles: [
        { id: 'c-poids', question: 'Quel est le poids des charges de personnel dans le chiffre d’affaires 2025 ?', indicateur: 'poidsPersonnel', exercice: 2025, unite: '%', tolerance: 0.005, aide: 'Salaires et charges sociales divisés par le chiffre d’affaires.' },
        { id: 'c-ebe', question: 'Quel est l’excédent brut d’exploitation 2024 ?', indicateur: 'ebe', exercice: 2024, unite: '€', tolerance: 50, aide: 'Valeur ajoutée + subventions d’exploitation − impôts et taxes − charges de personnel.' },
        { id: 'c-cout-groupe', question: 'Quel est le coût complet 2025 d’une séance de médiation en groupe ?', indicateur: 'coutUnitaire:groupes-mediation', exercice: 2025, unite: '€/unité', tolerance: 3, aide: 'Coût complet de la section divisé par le nombre de séances de groupe de médiation.' },
        { id: 'c-bfr', question: 'Quel est le besoin en fonds de roulement au 31/12/2025 ?', indicateur: 'bfr', exercice: 2025, unite: '€', tolerance: 50, aide: 'Stocks + créances clients + autres créances − dettes d’exploitation, produits constatés d’avance compris.' },
      ],
    },
    {
      numero: 3,
      titre: 'Investissement : structure couverte',
      lettre: {
        de: 'Hélène Castagné',
        fonction: 'Présidente et directrice',
        date: '2026-02-23',
        objet: 'Opportunité d’une structure couverte accessible',
        corps: [
          'L’équipe est convaincue qu’une aire couverte sécuriserait la continuité des séances en hiver. Le trésorier craint un endettement que nos excédents ne permettent pas de supporter.',
          'Je vous demande d’évaluer ce projet selon plusieurs scénarios, avec et sans la subvention espérée, et de mesurer ses effets sur nos comptes, notre trésorerie et la charge de travail des équidés.',
        ],
      },
      contexte: 'Le devis s’élève à 133 000 € ; la banque conditionne son prêt à la notification préalable des subventions ; le bail doit être renouvelé.',
      objectifs: ['Simuler le projet selon trois scénarios', 'Tester la sensibilité à la subvention et aux volumes', 'Formuler une recommandation et ses conditions'],
      livrables: ['Simulation sauvegardée', 'Note de recommandation au conseil coopératif'],
      documentsUtiles: ['devis-manege', 'courriel-banque', 'suivi-seances', 'cr-conseil'],
      projets: ['manege-couvert'],
      pistes: ['Le projet augmente-t-il le résultat ou d’abord la qualité de service ?', 'Que se passe-t-il si la subvention n’est obtenue qu’à moitié ?', 'Les équidés peuvent-ils absorber les séances supplémentaires ?'],
    },
    {
      numero: 4,
      titre: 'Développement des partenariats et des publics',
      lettre: {
        de: 'Hélène Castagné',
        fonction: 'Présidente et directrice',
        date: '2026-03-09',
        objet: 'Sécuriser les conventions et mieux servir les familles',
        corps: [
          'Nos conventions sont annuelles et nos familles attendent parfois six mois une première séance. Je souhaite un plan d’action pour fidéliser les établissements, en conquérir de nouveaux et organiser l’accueil des particuliers.',
          'Proposez des actions chiffrées, compatibles avec nos équidés et notre équipe.',
        ],
      },
      contexte: 'La SCIC n’a jamais eu de démarche commerciale structurée ; ses partenaires sont aussi ses sociétaires.',
      objectifs: ['Segmenter les publics et leurs financeurs', 'Proposer une offre de conventions pluriannuelles', 'Organiser la liste d’attente et la tarification sociale', 'Définir des indicateurs de suivi'],
      livrables: ['Plan d’action partenarial et commercial avec calendrier', 'Projet de convention type'],
      documentsUtiles: ['cr-conseil', 'note-tarifs', 'suivi-seances', 'tarifs'],
      pistes: ['Une convention pluriannuelle a-t-elle un intérêt pour un établissement ?', 'Faut-il plafonner la part des séances au tarif solidaire ?', 'Les formations peuvent-elles devenir un canal d’entrée de nouveaux établissements ?'],
    },
    {
      numero: 5,
      titre: 'Arbitrage : viabilité et accessibilité',
      lettre: {
        de: 'Hélène Castagné',
        fonction: 'Présidente et directrice',
        date: '2026-03-30',
        objet: 'Assurer la viabilité financière tout en maintenant l’accessibilité des prestations',
        corps: [
          'Le conseil coopératif doit arrêter en avril les tarifs de la rentrée et la stratégie de financement. Les collèges n’ont pas les mêmes priorités : les familles défendent le tarif solidaire, les salariés la qualité des séances, les partenaires la maîtrise des prix.',
          'Je vous demande une note de recommandation qui compare les options, en chiffre les effets et précise les conditions de réussite.',
        ],
      },
      contexte: 'La subvention départementale pourrait baisser de 10 % ; la fondation n’a pas encore répondu ; la facilité de caisse reste indispensable au printemps.',
      objectifs: ['Comparer les options', 'Chiffrer leurs effets sur le résultat et la trésorerie', 'Formuler une recommandation argumentée'],
      livrables: ['Note de recommandation au conseil coopératif (deux pages)'],
      documentsUtiles: ['note-tarifs', 'courrier-departement', 'cr-conseil', 'courriel-banque', 'tarifs'],
      options: [
        { id: 'a', titre: 'Hausse des prix de convention', description: 'Porter les séances de groupe à 210 € et 190 € à la rentrée, maintenir le tarif solidaire et relever le tarif plein.' },
        { id: 'b', titre: 'Plafonnement de la part solidaire', description: 'Maintenir les prix, mais limiter les séances au tarif solidaire au montant couvert par les financeurs identifiés.' },
        { id: 'c', titre: 'Conventions pluriannuelles et mobilisation des créances', description: 'Proposer des conventions de trois ans avec acomptes, et céder les subventions notifiées à la banque.' },
        { id: 'd', titre: 'Combinaison progressive', description: 'Construire un scénario combiné, avec un calendrier et des seuils de déclenchement.' },
      ],
      pistes: ['Quel prix de séance couvrirait le coût complet sans subvention ?', 'Quel est l’effet d’une baisse de 3 000 € de la subvention départementale ?', 'Comment chaque collège percevra-t-il la décision ?'],
    },
  ],

  indicateursActivite: [
    { libelle: 'Séances réalisées', unite: 'séances', valeurs: { 2023: 1902, 2024: 1954, 2025: 2103, 2026: 2180 } },
    { libelle: 'Séances annulées pour intempéries', unite: 'séances', valeurs: { 2023: 48, 2024: 63, 2025: 51 } },
    { libelle: 'Séances par équidé actif et par semaine', unite: 'séances', valeurs: { 2023: 7.3, 2024: 7.3, 2025: 7.9, 2026: 8.3 }, aide: 'Équidé-séances rapportées à onze équidés actifs et 45 semaines ; limite fixée à neuf.' },
    { libelle: 'Part des séances individuelles au tarif solidaire', unite: '%', valeurs: { 2023: 38, 2024: 41, 2025: 44, 2026: 44 } },
    { libelle: 'Institutions conventionnées', unite: 'établissements', valeurs: { 2023: 14, 2024: 12, 2025: 15, 2026: 16 } },
  ],
};

export default etab;
