/**
 * ÉQUIDÉCISION · Modèle de données des établissements
 *
 * Ce fichier est la spécification unique des dossiers d'entreprise.
 * Les états financiers ne sont JAMAIS saisis à la main : ils sont construits
 * par le moteur (src/finance/engine.ts) à partir des données opérationnelles
 * déclarées ici (prestations × tarifs × volumes, postes × ETP × salaires,
 * registre des immobilisations, emprunts, stocks et postes de BFR).
 *
 * Convention d'exercices : 2023, 2024, 2025 = comptes clôturés au 31/12 ;
 * 2026 = budget prévisionnel. L'ouverture est le bilan au 31/12/2022.
 * Tous les montants sont en euros hors taxes (TVA non modélisée).
 */

export const EXERCICES = [2023, 2024, 2025, 2026] as const;
export type Exercice = (typeof EXERCICES)[number];
/** Valeurs par exercice. 2026 = budget. */
export type ParAn = Record<Exercice, number>;
/** Valeurs de fin d'exercice, ouverture comprise (31/12/2022). */
export type FinDAn = Record<2022 | Exercice, number>;

export type Famille =
  | 'enseignement'
  | 'pension'
  | 'sport'
  | 'tourisme'
  | 'elevage'
  | 'valorisation'
  | 'polyvalent'
  | 'mediation'
  | 'courses'
  | 'evenementiel'
  | 'formation'
  | 'associatif'
  | 'hotellerie'
  | 'services';

export type Profondeur = 'approfondi' | 'standard';

/** Référentiel comptable applicable aux exercices simulés. */
export type Referentiel =
  | 'PCG' // règlement ANC 2014-03, sociétés commerciales
  | 'PCG-agricole' // ANC 2014-03 avec dispositions propres aux activités agricoles
  | 'ANC-2018-06'; // associations et fondations

/** Régime d'imposition des bénéfices retenu par le modèle. */
export type RegimeFiscal = 'IS' | 'IR' | 'non-lucratif';

// ---------------------------------------------------------------------------
// Identité visuelle
// ---------------------------------------------------------------------------

export type PoliceTitre =
  | 'cormorant'
  | 'playfair'
  | 'baskerville'
  | 'fraunces'
  | 'dmserif'
  | 'bodoni'
  | 'lora'
  | 'jost'
  | 'manrope'
  | 'plex';
export type PoliceTexte = 'inter' | 'manrope' | 'jost' | 'plex';

export interface Theme {
  /** Couleur dominante sombre (bandeaux, titres, fonds de section). */
  primaire: string;
  /** Accent (liens, filets, chiffres clés). Doit rester lisible sur `fond`. */
  accent: string;
  /** Fond principal des pages. */
  fond: string;
  /** Fond secondaire (cartes, alternance de sections). */
  fondAlt: string;
  /** Couleur du texte courant. */
  encre: string;
  /** Texte secondaire. */
  attenue: string;
  /** Couleur du texte posé sur `primaire`. */
  surPrimaire: string;
  policeTitre: PoliceTitre;
  policeTexte: PoliceTexte;
  /** 5 couleurs d'identité (documentation du thème). Les graphiques utilisent la palette commune validée PALETTE_DONNEES (src/theme/theme.ts). */
  graphique: [string, string, string, string, string];
  /** Casse des grands titres. */
  titresMajuscules?: boolean;
}

// ---------------------------------------------------------------------------
// Briques éditoriales
// ---------------------------------------------------------------------------

export interface ChiffreCle {
  libelle: string;
  valeur: string;
  detail?: string;
}

export interface Evenement {
  annee: number;
  titre: string;
  texte: string;
}

export interface BlocTexte {
  titre: string;
  texte: string;
}

/** Contenu d'une pièce documentaire. */
export type BlocDocument =
  | { type: 'p'; texte: string }
  | { type: 'h'; texte: string }
  | { type: 'liste'; items: string[] }
  | { type: 'tableau'; colonnes: string[]; lignes: (string | number)[][]; note?: string; alignDroite?: number[] }
  | { type: 'citation'; texte: string; auteur?: string }
  | { type: 'signature'; nom: string; fonction: string };

export type TypeDocument =
  | 'note'
  | 'compte-rendu'
  | 'courrier'
  | 'devis'
  | 'tableau'
  | 'etude'
  | 'rapport'
  | 'contrat'
  | 'courriel'
  | 'plan';

export interface DocumentPro {
  id: string;
  type: TypeDocument;
  titre: string;
  /** Date au format AAAA-MM-JJ. */
  date: string;
  emetteur: string;
  destinataire?: string;
  /** Une phrase neutre décrivant la pièce (sans conclusion d'analyse). */
  resume: string;
  /** Rubriques du dossier auxquelles la pièce se rattache. */
  rubriques?: Rubrique[];
  contenu: BlocDocument[];
  /** Pièce confidentielle de direction (affichage d'un tampon). */
  confidentiel?: boolean;
}

/** Documents générés automatiquement depuis les données (garantie de cohérence). */
export type DocumentAuto =
  | { id: string; type: 'auto-echeancier'; emprunt: string; titre?: string }
  | { id: string; type: 'auto-tarifs'; titre?: string }
  | { id: string; type: 'auto-bilan'; exercice: Exercice; titre?: string }
  | { id: string; type: 'auto-compte-resultat'; exercice: Exercice; titre?: string };

export type Rubrique =
  | 'etablissement'
  | 'installations'
  | 'cavalerie'
  | 'activites'
  | 'clients'
  | 'fournisseurs'
  | 'rh'
  | 'environnement'
  | 'finances';

// ---------------------------------------------------------------------------
// Opérations
// ---------------------------------------------------------------------------

export interface Installation {
  nom: string;
  type: 'batiment' | 'hebergement-equin' | 'aire-travail' | 'exterieur' | 'materiel' | 'accueil' | 'autre';
  /** Capacité ou dimension lisible, ex. « 24 boxes de 3,5 × 3,5 m ». */
  capacite?: string;
  surface?: string;
  annee?: number;
  etat: 'excellent' | 'bon' | 'correct' | 'vieillissant' | 'a-renover';
  description: string;
  /** Clé de créneau photo (hero, lieu, chevaux, activite, detail). */
  photo?: CreneauPhoto;
}

export interface Cavalerie {
  synthese: string;
  /** Effectifs par catégorie et statut juridique/économique. */
  effectifs: {
    categorie: string;
    statut: 'propriete' | 'pension' | 'confiage' | 'location' | 'demi-pension' | 'elevage' | 'reproducteur';
    nombre: number;
    usage: string;
  }[];
  parAge: { tranche: string; nombre: number }[];
  disponibilite: { etat: string; nombre: number; commentaire?: string }[];
  fiches: {
    nom: string;
    race: string;
    naissance: number;
    sexe: 'jument' | 'hongre' | 'étalon' | 'pouliche' | 'poulain';
    robe: string;
    role: string;
    statut: string;
    notes: string;
  }[];
  /** Règles d'utilisation et de bien-être (repos, charge de travail…). */
  reglesUtilisation: string[];
}

/** Pour les structures sans cavalerie propre : ressources productives. */
export interface RessourcesPro {
  titre: string;
  synthese: string;
  elements: { nom: string; categorie: string; quantite: string; description: string }[];
}

export interface Prestation {
  id: string;
  nom: string;
  /** Activité analytique (section) à laquelle la recette est rattachée. */
  activite: string;
  description: string;
  /** Unité de vente : « heure de cours », « mois de pension », « saillie »… */
  unite: string;
  /** Prix unitaire HT par exercice. */
  prix: ParAn;
  /** Volume vendu par exercice (même unité). */
  volume: ParAn;
  /**
   * Capacité annuelle maximale dans la même unité (ex. 30 boxes × 12 mois = 360).
   * Sert au contrôle de vraisemblance et au calcul des taux d'occupation.
   */
  capaciteAnnuelle?: ParAn;
  /** Compte de produit : 706 prestations, 701 ventes de produits finis (chevaux élevés), 707 marchandises, 708 activités annexes. */
  compte: '701' | '706' | '707' | '708';
  periode?: string;
  clientele?: string;
}

export interface Clients {
  synthese: string;
  segments: { nom: string; part: number; effectif?: string; description: string }[];
  indicateurs: { libelle: string; unite?: string; valeurs: Partial<ParAn>; commentaire?: string }[];
  satisfaction?: { source: string; criteres: { critere: string; note: number; noteMax: number }[] };
  verbatims: { auteur: string; profil: string; texte: string }[];
  communication: { canal: string; description: string }[];
  reclamations?: string[];
}

export interface Fournisseur {
  nom: string;
  categorie: string;
  prestation: string;
  /** Rattachement à une ligne de charge du compte de résultat (id) et part de celle-ci. */
  ligne: string;
  part: number;
  evolutionTarifaire: string;
  delaiPaiement: string;
  conditions: string;
  dependance: 'faible' | 'moyenne' | 'forte';
  risques: string;
}

export interface Partenaire {
  nom: string;
  type: string;
  description: string;
}

export interface Organigramme {
  id: string;
  intitule: string;
  personne: string;
  parent?: string;
}

export interface RessourcesHumaines {
  synthese: string;
  organigramme: Organigramme[];
  organisationTravail: string[];
  saisonnalite: string;
  /** Place et charge de travail du dirigeant. */
  dirigeant: string;
  conventionCollective?: string;
  enjeux?: string[];
}

export interface Concurrent {
  nom: string;
  distance: string;
  offre: string;
  tarifs: string;
  positionnement: string;
}

export interface Environnement {
  synthese: string;
  territoire: string;
  donneesTerritoire: { libelle: string; valeur: string; source?: string }[];
  concurrents: Concurrent[];
  /** Faits bruts classés par dimension PESTEL, SANS qualification opportunité/menace. */
  pestel: { dimension: 'Politique' | 'Économique' | 'Socioculturel' | 'Technologique' | 'Écologique' | 'Légal'; faits: string[] }[];
  marche: string[];
}

// ---------------------------------------------------------------------------
// Finances : données sources
// ---------------------------------------------------------------------------

/** Ligne de charge ou de produit saisie par exercice. */
export interface LigneMontant {
  id: string;
  libelle: string;
  /** Compte PCG indicatif (ex. '6011', '6061', '615', '622'). */
  compte: string;
  montants: ParAn;
  commentaire?: string;
}

export type CategorieImmo =
  | 'incorporel'
  | 'terrain'
  | 'constructions'
  | 'installations'
  | 'materiel'
  | 'vehicules'
  | 'cavalerie'
  | 'financier';

export interface Immobilisation {
  id: string;
  libelle: string;
  categorie: CategorieImmo;
  valeurOrigine: number;
  /** Mise en service AAAA-MM (prorata temporis mensuel). */
  miseEnService: string;
  /** Durée d'amortissement en années (0 = non amortissable : terrains, financier). */
  duree: number;
  /** Cession éventuelle. */
  cession?: { date: string; prix: number };
  /** Immobilisation budgétée en 2026 (affichage « prévisionnel »). */
  prevue?: boolean;
}

export interface Emprunt {
  id: string;
  libelle: string;
  preteur: string;
  capital: number;
  /** Taux nominal annuel (ex. 0.042). */
  taux: number;
  dureeMois: number;
  /** Premier déblocage AAAA-MM ; première échéance le mois suivant. */
  debut: string;
  objet: string;
}

export interface SubventionInvestissement {
  id: string;
  libelle: string;
  financeur: string;
  montant: number;
  /** Encaissement AAAA-MM (peut être antérieur à 2023 : le solde restant est alors calculé). */
  date: string;
  /** Durée de reprise au résultat (en années, alignée sur l'immobilisation financée). */
  dureeReprise: number;
}

export interface Stock {
  id: string;
  libelle: string;
  /** approvisionnements (aliments, litière) → 6031 ; marchandises → 6037 ; produits → 713 (animaux d'élevage, en-cours). */
  type: 'approvisionnements' | 'marchandises' | 'produits';
  finDAn: FinDAn;
}

export interface Provision {
  id: string;
  libelle: string;
  ouverture: number;
  dotations: ParAn;
  reprises: ParAn;
  /** exploitation (681/781) ou exceptionnelle (687/787). */
  nature: 'exploitation' | 'exceptionnelle';
}

export interface Poste {
  id: string;
  intitule: string;
  /** Prénom et nom fictifs, ou « Saisonniers ». */
  titulaire?: string;
  categorie: 'direction' | 'encadrement' | 'enseignement' | 'soins' | 'administratif' | 'commercial' | 'technique' | 'formation' | 'hotellerie' | 'saisonnier' | 'autre';
  etp: ParAn;
  /** Salaire brut annuel pour 1 ETP. */
  brutAnnuelEtp: ParAn;
  /** Taux de charges patronales (ex. 0.30 après allègements). */
  tauxCharges: number;
  /** Activité analytique de rattachement direct, ou clé de répartition. */
  affectation?: Affectation;
}

/** Exploitant non salarié (EI, EARL, gérant majoritaire). */
export interface Exploitant {
  description: string;
  /** Cotisations sociales personnelles (646). */
  cotisations: ParAn;
  /** Prélèvements privés (EI/EARL à l'IR) ou rémunération non salariée versée. */
  prelevements: ParAn;
  affectation?: Affectation;
}

export type Affectation = { section: string } | { cle: string };

export interface CleRepartition {
  id: string;
  nom: string;
  unite: string;
  justification: string;
  /** Unités d'œuvre par section (proportions calculées automatiquement). */
  repartition: Record<string, number>;
}

export interface SectionAnalytique {
  id: string;
  nom: string;
  /** Inducteur ou indicateur de volume pour calculer un coût unitaire. */
  uniteOeuvre?: { libelle: string; quantite: number };
}

export interface Analytique {
  /** Exercice analysé (en général 2025). */
  exercice: Exercice;
  sections: SectionAnalytique[];
  cles: CleRepartition[];
  /**
   * Affectation de chaque ligne de charge (id de LigneMontant, de Poste, 'exploitant',
   * 'amortissements:<categorie>', 'interets', 'provisions') à une section ou une clé.
   * Toute ligne non citée est répartie avec `cleParDefaut`.
   */
  affectations: Record<string, Affectation>;
  cleParDefaut: string;
  /** Produits non issus de prestations (subventions, autres) : section ou clé. */
  affectationsProduits?: Record<string, Affectation>;
  commentaire: string;
}

export interface Tresorerie {
  /** Poids mensuels (janv. → déc.) des encaissements clients ; normalisés par le moteur. */
  saisonnaliteEncaissements: number[];
  /** Poids mensuels des achats et charges externes ; défaut = uniforme. */
  saisonnaliteAchats?: number[];
  /** Poids mensuels des charges de personnel ; défaut = uniforme. */
  saisonnalitePersonnel?: number[];
  /** Mois (1-12) de versement des subventions d'exploitation ; défaut = étalé. */
  moisSubventions?: number[];
  /** Mois de versement des dividendes / prélèvements exceptionnels ; défaut = étalé. */
  moisDistributions?: number[];
  commentaire?: string;
}

export interface DonneesFinancieres {
  referentiel: Referentiel;
  regimeFiscal: RegimeFiscal;
  /** Libellé lisible, ex. « SARL au capital de 40 000 €, impôt sur les sociétés ». */
  formeComptable: string;

  // --- Produits ---
  /** Subventions d'exploitation (74). */
  subventionsExploitation: LigneMontant[];
  /** Autres produits de gestion courante (75), produits financiers (76). */
  autresProduits: LigneMontant[];
  produitsFinanciers: LigneMontant[];
  produitsExceptionnels: LigneMontant[];

  // --- Charges ---
  achatsMarchandises: LigneMontant[];
  /** Matières et approvisionnements (601-602) : aliments, litière… */
  achatsApprovisionnements: LigneMontant[];
  /** Autres achats et charges externes (604 à 628). */
  chargesExternes: LigneMontant[];
  impotsTaxes: LigneMontant[];
  autresCharges: LigneMontant[];
  /** Charges financières hors intérêts d'emprunts (agios, commissions). */
  chargesFinancieresAutres: LigneMontant[];
  chargesExceptionnelles: LigneMontant[];

  personnel: Poste[];
  exploitant?: Exploitant;

  immobilisations: Immobilisation[];
  emprunts: Emprunt[];
  subventionsInvestissement: SubventionInvestissement[];
  stocks: Stock[];
  provisions: Provision[];

  /** Postes de BFR en fin d'exercice. */
  bfr: {
    creancesClients: FinDAn;
    autresCreances: FinDAn;
    dettesFournisseurs: FinDAn;
    dettesFiscalesSociales: FinDAn;
    autresDettes: FinDAn;
    produitsConstatesAvance: FinDAn;
  };

  /** Bilan d'ouverture au 31/12/2022 : seuls ces éléments sont saisis, les réserves sont déduites par solde. */
  ouverture: {
    capital: number;
    /** Libellé du poste de capital (« Capital social », « Fonds associatifs », « Compte de l'exploitant »). */
    libelleCapital: string;
    /** Trésorerie nette au 31/12/2022 (disponibilités moins concours bancaires). */
    tresorerie: number;
  };

  /** Dividendes versés (sociétés) par exercice. Pour l'IR, utiliser exploitant.prelevements. */
  dividendes?: ParAn;
  /** Apports en capital / fonds propres nouveaux. */
  apports?: ParAn;

  tresorerieMensuelle: Tresorerie;
  analytique?: Analytique;

  /** Hypothèses de construction (affichées dans la méthodologie). */
  hypotheses: string[];
}

// ---------------------------------------------------------------------------
// Investissement et missions
// ---------------------------------------------------------------------------

export interface ProjetInvestissement {
  id: string;
  titre: string;
  description: string;
  /** Composantes immobilisées avec durée d'amortissement. */
  composantes: { libelle: string; montant: number; duree: number }[];
  /** Charges non immobilisées de lancement (communication, formation…), en charge l'année 1. */
  chargesLancement: number;
  financement: { apport: number; emprunt: number; taux: number; dureeAnnees: number; subvention: number; dureeRepriseSubvention?: number };
  /** Recettes incrémentales : prix × volume annuel en régime de croisière. */
  recettes: { libelle: string; unite: string; prix: number; volumes: { prudent: number; central: number; favorable: number }; capaciteMax: number }[];
  /** Charges variables en % des recettes incrémentales. */
  tauxChargesVariables: number;
  /** Charges fixes annuelles supplémentaires (personnel, entretien, assurance). */
  chargesFixes: { libelle: string; montant: number }[];
  /** Mois avant la première recette. */
  delaiMiseEnServiceMois: number;
  /** Montée en charge : part du régime de croisière atteinte en années 1, 2, 3… */
  monteeEnCharge: number[];
  horizon: number;
  tauxActualisation: number;
  /** Taux d'imposition marginal appliqué à la variation de résultat (0 pour IR ou non lucratif : documenter). */
  tauxImpot: number;
  /** Repères de marché pour discuter les hypothèses. */
  reperes: string[];
  /** Points de vigilance opérationnels (bien-être équin, personnel…). */
  vigilance: string[];
}

export interface LettreMission {
  de: string;
  fonction: string;
  date: string;
  objet: string;
  corps: string[];
}

export interface Mission {
  numero: 1 | 2 | 3 | 4 | 5;
  titre: string;
  lettre: LettreMission;
  contexte: string;
  objectifs: string[];
  livrables: string[];
  /** Ids de documents utiles. */
  documentsUtiles: string[];
  /** Questions d'orientation (ouvertes, sans réponse). */
  pistes: string[];
  /** Mission 3 : projets proposés au simulateur. */
  projets?: string[];
  /** Mission 5 : options de décision. */
  options?: { id: string; titre: string; description: string }[];
  /** Contrôles de calcul déterministes (mission 2 surtout). */
  controles?: ControleCalcul[];
}

export interface ControleCalcul {
  id: string;
  question: string;
  /** Expression évaluée par le moteur : identifiant d'indicateur calculé. */
  indicateur: string;
  exercice: Exercice;
  unite: '€' | '%' | 'jours' | '€/unité' | 'x';
  tolerance: number;
  aide: string;
}

// ---------------------------------------------------------------------------
// Établissement
// ---------------------------------------------------------------------------

export type CreneauPhoto = 'hero' | 'lieu' | 'chevaux' | 'activite' | 'detail';

export interface Etablissement {
  id: string;
  nom: string;
  nomCourt: string;
  /** Monogramme de 1 à 3 lettres pour le logo typographique. */
  monogramme: string;
  signature: string;
  famille: Famille;
  libelleFamille: string;
  profondeur: Profondeur;
  lieu: { commune: string; departement: string; region: string; cadre: string };
  formeJuridique: string;
  gouvernance: string;
  creation: number;
  dirigeant: { nom: string; fonction: string };
  theme: Theme;
  /** Courte description pour la galerie (2 phrases max). */
  accroche: string;
  chiffresCles: ChiffreCle[];
  /** Enjeux de développement affichés en accueil (formulés comme questions de direction, pas comme diagnostic). */
  enjeux: string[];
  /** Rôle confié à l'étudiant. */
  roleEtudiant: string;

  presentation: {
    introduction: string;
    histoire: string[];
    valeurs: BlocTexte[];
    chronologie: Evenement[];
    organisation: string;
    modeleEconomique: string;
  };
  installations: { synthese: string; elements: Installation[]; maintenance: BlocTexte[]; contraintes: string[] };
  cavalerie?: Cavalerie;
  ressources?: RessourcesPro;
  activites: { synthese: string; prestations: Prestation[]; calendrier?: string[] };
  clients: Clients;
  fournisseurs: { synthese: string; liste: Fournisseur[]; partenaires: Partenaire[] };
  rh: RessourcesHumaines;
  environnement: Environnement;
  finances: DonneesFinancieres;
  documents: DocumentPro[];
  documentsAuto: DocumentAuto[];
  projets: ProjetInvestissement[];
  missions: Mission[];
  /** Indicateurs d'activité spécifiques affichés au tableau de bord. */
  indicateursActivite: { libelle: string; unite: string; valeurs: Partial<ParAn>; aide?: string }[];
}
