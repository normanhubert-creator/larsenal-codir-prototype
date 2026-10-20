/**
 * Moteur financier ÉQUIDÉCISION.
 *
 * Construit, à partir des données opérationnelles d'un établissement, l'ensemble
 * des états financiers : compte de résultat, SIG, CAF (deux méthodes), bilans,
 * tableau de flux, trésorerie mensuelle et comptabilité analytique.
 *
 * Principe de cohérence : la trésorerie de clôture n'est pas saisie, elle résulte
 * des flux (CAF, variation du BFR, investissements, financements). L'équilibre
 * actif = passif est donc une conséquence vérifiable (tests/finance.test.ts),
 * et non un ajustement.
 *
 * Toutes les formules financières de la plateforme sont dans ce module et dans
 * investment.ts. Aucun composant d'interface ne calcule d'agrégat comptable.
 */
import {
  EXERCICES,
  type Affectation,
  type CategorieImmo,
  type Emprunt,
  type Etablissement,
  type Exercice,
  type FinDAn,
  type Immobilisation,
  type LigneMontant,
  type ParAn,
  type Prestation,
} from '../types';

export const ANNEES_BILAN = [2022, ...EXERCICES] as const;
export type AnneeBilan = (typeof ANNEES_BILAN)[number];

// ---------------------------------------------------------------------------
// Utilitaires
// ---------------------------------------------------------------------------

export const somme = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
const sommeLignes = (lignes: LigneMontant[], an: Exercice) => somme(lignes.map((l) => l.montants[an] ?? 0));

/** 'AAAA-MM' → { annee, mois } */
export function parseMois(s: string): { annee: number; mois: number } {
  const [a, m] = s.split('-').map(Number);
  return { annee: a, mois: m || 1 };
}

/** Division protégée : renvoie null si le dénominateur est nul ou non fini. */
export function ratio(num: number, den: number): number | null {
  if (!Number.isFinite(num) || !Number.isFinite(den) || Math.abs(den) < 1e-9) return null;
  return num / den;
}

export const recettePrestation = (p: Prestation, an: Exercice) => (p.prix[an] ?? 0) * (p.volume[an] ?? 0);

// ---------------------------------------------------------------------------
// Immobilisations et amortissements (linéaire, prorata temporis mensuel)
// ---------------------------------------------------------------------------

export interface PlanAmortissement {
  immo: Immobilisation;
  /** Dotation de l'exercice. */
  dotation: Record<number, number>;
  /** Amortissements cumulés en fin d'année (avant sortie en cas de cession). */
  cumul: Record<number, number>;
  /** Valeur brute présente au bilan en fin d'année (0 si non encore acquise ou cédée). */
  brut: Record<number, number>;
  /** Valeur nette comptable au bilan en fin d'année. */
  net: Record<number, number>;
  cession?: { annee: number; mois: number; prix: number; vnc: number };
}

export function planAmortissement(immo: Immobilisation): PlanAmortissement {
  const debut = parseMois(immo.miseEnService);
  const cession = immo.cession ? parseMois(immo.cession.date) : undefined;
  const annuite = immo.duree > 0 ? immo.valeurOrigine / immo.duree : 0;
  const dotation: Record<number, number> = {};
  const cumul: Record<number, number> = {};
  const brut: Record<number, number> = {};
  const net: Record<number, number> = {};
  let c = 0;
  let vncCession = 0;
  const premiere = Math.min(debut.annee, 2022);
  for (let an = premiere; an <= 2026; an++) {
    let d = 0;
    const presente = an >= debut.annee && (!cession || an <= cession.annee);
    if (presente && immo.duree > 0) {
      let moisDebut = an === debut.annee ? debut.mois : 1;
      let moisFin = cession && an === cession.annee ? cession.mois : 12;
      const mois = Math.max(0, moisFin - moisDebut + 1);
      d = Math.min(annuite * (mois / 12), immo.valeurOrigine - c);
    }
    c += d;
    dotation[an] = d;
    if (cession && an === cession.annee) {
      vncCession = immo.valeurOrigine - c;
    }
    const auBilan = an >= debut.annee && (!cession || an < cession.annee);
    cumul[an] = auBilan ? c : 0;
    brut[an] = auBilan ? immo.valeurOrigine : 0;
    net[an] = auBilan ? immo.valeurOrigine - c : 0;
  }
  return {
    immo,
    dotation,
    cumul,
    brut,
    net,
    cession: cession && immo.cession ? { annee: cession.annee, mois: cession.mois, prix: immo.cession.prix, vnc: vncCession } : undefined,
  };
}

// ---------------------------------------------------------------------------
// Emprunts (annuités constantes, échéances mensuelles)
// ---------------------------------------------------------------------------

export interface Echeance {
  numero: number;
  annee: number;
  mois: number;
  echeance: number;
  interets: number;
  capital: number;
  restantDu: number;
}

export interface TableauEmprunt {
  emprunt: Emprunt;
  mensualite: number;
  echeances: Echeance[];
  /** Capital restant dû au 31/12 de l'année. */
  restantDu: Record<number, number>;
  interets: Record<number, number>;
  capitalRembourse: Record<number, number>;
  deblocage: { annee: number; mois: number };
}

export function mensualiteConstante(capital: number, tauxAnnuel: number, n: number): number {
  if (n <= 0) return 0;
  const r = tauxAnnuel / 12;
  if (Math.abs(r) < 1e-12) return capital / n;
  return (capital * r) / (1 - Math.pow(1 + r, -n));
}

export function tableauEmprunt(e: Emprunt): TableauEmprunt {
  const deb = parseMois(e.debut);
  const r = e.taux / 12;
  const m = mensualiteConstante(e.capital, e.taux, e.dureeMois);
  const echeances: Echeance[] = [];
  let crd = e.capital;
  let an = deb.annee;
  let mois = deb.mois;
  for (let i = 1; i <= e.dureeMois; i++) {
    mois += 1;
    if (mois > 12) {
      mois = 1;
      an += 1;
    }
    const interets = crd * r;
    let capital = m - interets;
    if (i === e.dureeMois) capital = crd; // solde exact à la dernière échéance
    crd = Math.max(0, crd - capital);
    echeances.push({ numero: i, annee: an, mois, echeance: interets + capital, interets, capital, restantDu: crd });
  }
  const restantDu: Record<number, number> = {};
  const interets: Record<number, number> = {};
  const capitalRembourse: Record<number, number> = {};
  for (let y = 2022; y <= 2026; y++) {
    const avant = y < deb.annee;
    const ech = echeances.filter((x) => x.annee <= y);
    restantDu[y] = avant ? 0 : ech.length ? ech[ech.length - 1].restantDu : e.capital;
    interets[y] = somme(echeances.filter((x) => x.annee === y).map((x) => x.interets));
    capitalRembourse[y] = somme(echeances.filter((x) => x.annee === y).map((x) => x.capital));
  }
  return { emprunt: e, mensualite: m, echeances, restantDu, interets, capitalRembourse, deblocage: deb };
}

// ---------------------------------------------------------------------------
// Subventions d'investissement (reprise au résultat, compte 777)
// ---------------------------------------------------------------------------

interface PlanSubvention {
  reprise: Record<number, number>;
  solde: Record<number, number>;
  encaissement: { annee: number; mois: number; montant: number };
}

function planSubvention(montant: number, date: string, duree: number): PlanSubvention {
  const d = parseMois(date);
  const reprise: Record<number, number> = {};
  const solde: Record<number, number> = {};
  let cumul = 0;
  for (let an = Math.min(d.annee, 2022); an <= 2026; an++) {
    let q = 0;
    if (an >= d.annee && duree > 0) {
      const mois = an === d.annee ? 12 - d.mois + 1 : 12;
      q = Math.min((montant / duree) * (mois / 12), montant - cumul);
    }
    cumul += q;
    reprise[an] = q;
    solde[an] = an >= d.annee ? montant - cumul : 0;
  }
  return { reprise, solde, encaissement: { annee: d.annee, mois: d.mois, montant } };
}

// ---------------------------------------------------------------------------
// Compte de résultat
// ---------------------------------------------------------------------------

export interface CompteResultat {
  annee: Exercice;
  // Produits d'exploitation
  ventesMarchandises: number;
  productionVendue: number;
  productionVendueDetail: { activite: string; compte: string; montant: number }[];
  productionStockee: number;
  subventionsExploitation: number;
  reprisesExploitation: number;
  autresProduits: number;
  produitsExploitation: number;
  // Charges d'exploitation
  achatsMarchandises: number;
  variationStockMarchandises: number;
  achatsApprovisionnements: number;
  variationStockApprovisionnements: number;
  chargesExternes: number;
  impotsTaxes: number;
  salaires: number;
  chargesSociales: number;
  dotationsAmortissements: number;
  dotationsProvisionsExploitation: number;
  autresCharges: number;
  chargesExploitation: number;
  resultatExploitation: number;
  // Financier
  produitsFinanciers: number;
  interetsEmprunts: number;
  chargesFinancieresAutres: number;
  chargesFinancieres: number;
  resultatFinancier: number;
  rcai: number;
  // Exceptionnel
  produitsCessions: number;
  quotePartSubventions: number;
  reprisesExceptionnelles: number;
  produitsExceptionnelsAutres: number;
  produitsExceptionnels: number;
  vncCessions: number;
  dotationsExceptionnelles: number;
  chargesExceptionnellesAutres: number;
  chargesExceptionnelles: number;
  resultatExceptionnel: number;
  impotSocietes: number;
  totalProduits: number;
  totalCharges: number;
  resultatNet: number;
  /** Chiffre d'affaires net = ventes de marchandises + production vendue. */
  chiffreAffaires: number;
}

export interface SIG {
  annee: Exercice;
  ventesMarchandises: number;
  coutAchatMarchandises: number;
  margeCommerciale: number;
  productionExercice: number;
  consommationsTiers: number;
  valeurAjoutee: number;
  subventionsExploitation: number;
  impotsTaxes: number;
  chargesPersonnel: number;
  ebe: number;
  reprisesAutresProduits: number;
  dotationsAutresCharges: number;
  resultatExploitation: number;
  resultatFinancier: number;
  rcai: number;
  resultatExceptionnel: number;
  impotSocietes: number;
  resultatNet: number;
  produitsCessions: number;
  vncCessions: number;
  plusMoinsValuesCessions: number;
}

export interface CAF {
  annee: Exercice;
  // Méthode additive (à partir du résultat)
  resultatNet: number;
  dotations: number;
  reprises: number;
  vncCessions: number;
  produitsCessions: number;
  quotePartSubventions: number;
  cafAdditive: number;
  // Méthode soustractive (à partir de l'EBE)
  ebe: number;
  autresProduitsEncaissables: number;
  autresChargesDecaissables: number;
  produitsFinanciersEncaissables: number;
  chargesFinancieresDecaissables: number;
  produitsExceptionnelsEncaissables: number;
  chargesExceptionnellesDecaissables: number;
  impotSocietes: number;
  cafSoustractive: number;
  caf: number;
}

export interface Bilan {
  annee: AnneeBilan;
  immobilisations: { categorie: CategorieImmo; brut: number; amortissements: number; net: number }[];
  actifImmobiliseBrut: number;
  amortissementsCumules: number;
  actifImmobiliseNet: number;
  stocks: { id: string; libelle: string; type: string; montant: number }[];
  totalStocks: number;
  creancesClients: number;
  autresCreances: number;
  disponibilites: number;
  actifCirculant: number;
  totalActif: number;
  // Passif
  libelleCapital: string;
  capital: number;
  reserves: number;
  resultat: number;
  subventionsInvestissement: number;
  capitauxPropres: number;
  provisions: number;
  emprunts: number;
  concoursBancaires: number;
  dettesFinancieres: number;
  dettesFournisseurs: number;
  dettesFiscalesSociales: number;
  autresDettes: number;
  produitsConstatesAvance: number;
  dettesExploitation: number;
  totalPassif: number;
  // Équilibre financier (approche « bilan financier simplifié » en valeurs nettes)
  ressourcesStables: number;
  fondsDeRoulement: number;
  besoinFondsRoulement: number;
  tresorerieNette: number;
}

export interface Flux {
  annee: Exercice;
  caf: number;
  variationBFR: number;
  fluxExploitation: number;
  investissements: number;
  cessions: number;
  fluxInvestissement: number;
  empruntsNouveaux: number;
  remboursements: number;
  distributions: number;
  apports: number;
  subventionsRecues: number;
  fluxFinancement: number;
  variationTresorerie: number;
  tresorerieOuverture: number;
  tresorerieCloture: number;
}

export interface LigneTresorerie {
  id: string;
  libelle: string;
  sens: 'encaissement' | 'decaissement';
  mois: number[];
  total: number;
}

export interface TresorerieMensuelle {
  annee: Exercice;
  ouverture: number;
  lignes: LigneTresorerie[];
  encaissements: number[];
  decaissements: number[];
  solde: number[];
  cumul: number[];
}

export interface Etats {
  etab: Etablissement;
  amortissements: PlanAmortissement[];
  emprunts: TableauEmprunt[];
  cr: Record<Exercice, CompteResultat>;
  sig: Record<Exercice, SIG>;
  caf: Record<Exercice, CAF>;
  bilans: Record<AnneeBilan, Bilan>;
  flux: Record<Exercice, Flux>;
  tresorerie: Record<2025 | 2026, TresorerieMensuelle>;
}

const variationStock = (fin: FinDAn, an: Exercice) => fin[an] - fin[(an - 1) as 2022 | Exercice];

function chiffreAffairesDetail(etab: Etablissement, an: Exercice) {
  const map = new Map<string, { activite: string; compte: string; montant: number }>();
  for (const p of etab.activites.prestations) {
    if (p.compte === '707') continue;
    const k = `${p.activite}|${p.compte}`;
    const cur = map.get(k) ?? { activite: p.activite, compte: p.compte, montant: 0 };
    cur.montant += recettePrestation(p, an);
    map.set(k, cur);
  }
  return [...map.values()];
}

/** Calcul de l'impôt sur les sociétés : 15 % jusqu'à 42 500 €, 25 % au-delà, report des déficits en avant. */
export function impotSocietes(base: number): number {
  if (base <= 0) return 0;
  return 0.15 * Math.min(base, 42500) + 0.25 * Math.max(0, base - 42500);
}

export function construireEtats(etab: Etablissement): Etats {
  const f = etab.finances;
  const amortissements = f.immobilisations.map(planAmortissement);
  const emprunts = f.emprunts.map(tableauEmprunt);
  const subventions = f.subventionsInvestissement.map((s) => planSubvention(s.montant, s.date, s.dureeReprise));
  const stocksDe = (type: string) => f.stocks.filter((s) => s.type === type);

  const cr = {} as Record<Exercice, CompteResultat>;
  let deficitReportable = 0;
  for (const an of EXERCICES) {
    const prest = etab.activites.prestations;
    const ventesMarchandises = somme(prest.filter((p) => p.compte === '707').map((p) => recettePrestation(p, an)));
    const productionVendueDetail = chiffreAffairesDetail(etab, an);
    const productionVendue = somme(productionVendueDetail.map((d) => d.montant));
    const productionStockee = somme(stocksDe('produits').map((s) => variationStock(s.finDAn, an)));
    const subventionsExploitation = sommeLignes(f.subventionsExploitation, an);
    const reprisesExploitation = somme(f.provisions.filter((p) => p.nature === 'exploitation').map((p) => p.reprises[an] ?? 0));
    const autresProduits = sommeLignes(f.autresProduits, an);
    const produitsExploitation =
      ventesMarchandises + productionVendue + productionStockee + subventionsExploitation + reprisesExploitation + autresProduits;

    const achatsMarchandises = sommeLignes(f.achatsMarchandises, an);
    const variationStockMarchandises = -somme(stocksDe('marchandises').map((s) => variationStock(s.finDAn, an)));
    const achatsApprovisionnements = sommeLignes(f.achatsApprovisionnements, an);
    const variationStockApprovisionnements = -somme(stocksDe('approvisionnements').map((s) => variationStock(s.finDAn, an)));
    const chargesExternes = sommeLignes(f.chargesExternes, an);
    const impotsTaxes = sommeLignes(f.impotsTaxes, an);
    const salaires = somme(f.personnel.map((p) => p.etp[an] * p.brutAnnuelEtp[an]));
    const chargesSociales =
      somme(f.personnel.map((p) => p.etp[an] * p.brutAnnuelEtp[an] * p.tauxCharges)) + (f.exploitant?.cotisations[an] ?? 0);
    const dotationsAmortissements = somme(amortissements.map((a) => a.dotation[an] ?? 0));
    const dotationsProvisionsExploitation = somme(
      f.provisions.filter((p) => p.nature === 'exploitation').map((p) => p.dotations[an] ?? 0),
    );
    const autresCharges = sommeLignes(f.autresCharges, an);
    const chargesExploitation =
      achatsMarchandises +
      variationStockMarchandises +
      achatsApprovisionnements +
      variationStockApprovisionnements +
      chargesExternes +
      impotsTaxes +
      salaires +
      chargesSociales +
      dotationsAmortissements +
      dotationsProvisionsExploitation +
      autresCharges;
    const resultatExploitation = produitsExploitation - chargesExploitation;

    const produitsFinanciers = sommeLignes(f.produitsFinanciers, an);
    const interetsEmprunts = somme(emprunts.map((e) => e.interets[an] ?? 0));
    const chargesFinancieresAutres = sommeLignes(f.chargesFinancieresAutres, an);
    const chargesFinancieres = interetsEmprunts + chargesFinancieresAutres;
    const resultatFinancier = produitsFinanciers - chargesFinancieres;
    const rcai = resultatExploitation + resultatFinancier;

    const cessions = amortissements.filter((a) => a.cession?.annee === an);
    const produitsCessions = somme(cessions.map((a) => a.cession!.prix));
    const vncCessions = somme(cessions.map((a) => a.cession!.vnc));
    const quotePartSubventions = somme(subventions.map((s) => s.reprise[an] ?? 0));
    const reprisesExceptionnelles = somme(
      f.provisions.filter((p) => p.nature === 'exceptionnelle').map((p) => p.reprises[an] ?? 0),
    );
    const produitsExceptionnelsAutres = sommeLignes(f.produitsExceptionnels, an);
    const produitsExceptionnels = produitsCessions + quotePartSubventions + reprisesExceptionnelles + produitsExceptionnelsAutres;
    const dotationsExceptionnelles = somme(
      f.provisions.filter((p) => p.nature === 'exceptionnelle').map((p) => p.dotations[an] ?? 0),
    );
    const chargesExceptionnellesAutres = sommeLignes(f.chargesExceptionnelles, an);
    const chargesExceptionnelles = vncCessions + dotationsExceptionnelles + chargesExceptionnellesAutres;
    const resultatExceptionnel = produitsExceptionnels - chargesExceptionnelles;

    let is = 0;
    const base = rcai + resultatExceptionnel;
    if (f.regimeFiscal === 'IS') {
      const imposable = base - deficitReportable;
      if (imposable > 0) {
        is = impotSocietes(imposable);
        deficitReportable = 0;
      } else {
        deficitReportable = -imposable;
      }
    }
    const totalProduits = produitsExploitation + produitsFinanciers + produitsExceptionnels;
    const totalCharges = chargesExploitation + chargesFinancieres + chargesExceptionnelles + is;
    cr[an] = {
      annee: an,
      ventesMarchandises,
      productionVendue,
      productionVendueDetail,
      productionStockee,
      subventionsExploitation,
      reprisesExploitation,
      autresProduits,
      produitsExploitation,
      achatsMarchandises,
      variationStockMarchandises,
      achatsApprovisionnements,
      variationStockApprovisionnements,
      chargesExternes,
      impotsTaxes,
      salaires,
      chargesSociales,
      dotationsAmortissements,
      dotationsProvisionsExploitation,
      autresCharges,
      chargesExploitation,
      resultatExploitation,
      produitsFinanciers,
      interetsEmprunts,
      chargesFinancieresAutres,
      chargesFinancieres,
      resultatFinancier,
      rcai,
      produitsCessions,
      quotePartSubventions,
      reprisesExceptionnelles,
      produitsExceptionnelsAutres,
      produitsExceptionnels,
      vncCessions,
      dotationsExceptionnelles,
      chargesExceptionnellesAutres,
      chargesExceptionnelles,
      resultatExceptionnel,
      impotSocietes: is,
      totalProduits,
      totalCharges,
      resultatNet: totalProduits - totalCharges,
      chiffreAffaires: ventesMarchandises + productionVendue,
    };
  }

  // --- SIG ---
  const sig = {} as Record<Exercice, SIG>;
  for (const an of EXERCICES) {
    const c = cr[an];
    const coutAchatMarchandises = c.achatsMarchandises + c.variationStockMarchandises;
    const margeCommerciale = c.ventesMarchandises - coutAchatMarchandises;
    const productionExercice = c.productionVendue + c.productionStockee;
    const consommationsTiers = c.achatsApprovisionnements + c.variationStockApprovisionnements + c.chargesExternes;
    const valeurAjoutee = margeCommerciale + productionExercice - consommationsTiers;
    const chargesPersonnel = c.salaires + c.chargesSociales;
    const ebe = valeurAjoutee + c.subventionsExploitation - c.impotsTaxes - chargesPersonnel;
    const reprisesAutresProduits = c.reprisesExploitation + c.autresProduits;
    const dotationsAutresCharges = c.dotationsAmortissements + c.dotationsProvisionsExploitation + c.autresCharges;
    const resultatExploitation = ebe + reprisesAutresProduits - dotationsAutresCharges;
    sig[an] = {
      annee: an,
      ventesMarchandises: c.ventesMarchandises,
      coutAchatMarchandises,
      margeCommerciale,
      productionExercice,
      consommationsTiers,
      valeurAjoutee,
      subventionsExploitation: c.subventionsExploitation,
      impotsTaxes: c.impotsTaxes,
      chargesPersonnel,
      ebe,
      reprisesAutresProduits,
      dotationsAutresCharges,
      resultatExploitation,
      resultatFinancier: c.resultatFinancier,
      rcai: resultatExploitation + c.resultatFinancier,
      resultatExceptionnel: c.resultatExceptionnel,
      impotSocietes: c.impotSocietes,
      resultatNet: resultatExploitation + c.resultatFinancier + c.resultatExceptionnel - c.impotSocietes,
      produitsCessions: c.produitsCessions,
      vncCessions: c.vncCessions,
      plusMoinsValuesCessions: c.produitsCessions - c.vncCessions,
    };
  }

  // --- CAF ---
  const caf = {} as Record<Exercice, CAF>;
  for (const an of EXERCICES) {
    const c = cr[an];
    const s = sig[an];
    const dotations = c.dotationsAmortissements + c.dotationsProvisionsExploitation + c.dotationsExceptionnelles;
    const reprises = c.reprisesExploitation + c.reprisesExceptionnelles;
    const cafAdditive =
      c.resultatNet + dotations - reprises + c.vncCessions - c.produitsCessions - c.quotePartSubventions;
    const cafSoustractive =
      s.ebe +
      c.autresProduits -
      c.autresCharges +
      c.produitsFinanciers -
      c.chargesFinancieres +
      c.produitsExceptionnelsAutres -
      c.chargesExceptionnellesAutres -
      c.impotSocietes;
    caf[an] = {
      annee: an,
      resultatNet: c.resultatNet,
      dotations,
      reprises,
      vncCessions: c.vncCessions,
      produitsCessions: c.produitsCessions,
      quotePartSubventions: c.quotePartSubventions,
      cafAdditive,
      ebe: s.ebe,
      autresProduitsEncaissables: c.autresProduits,
      autresChargesDecaissables: c.autresCharges,
      produitsFinanciersEncaissables: c.produitsFinanciers,
      chargesFinancieresDecaissables: c.chargesFinancieres,
      produitsExceptionnelsEncaissables: c.produitsExceptionnelsAutres,
      chargesExceptionnellesDecaissables: c.chargesExceptionnellesAutres,
      impotSocietes: c.impotSocietes,
      cafSoustractive,
      caf: cafAdditive,
    };
  }

  // --- Bilans et flux ---
  const bfr = f.bfr;
  const provisionsSolde = (an: AnneeBilan) =>
    somme(
      f.provisions.map((p) => {
        let s = p.ouverture;
        for (const y of EXERCICES) if (y <= an) s += (p.dotations[y] ?? 0) - (p.reprises[y] ?? 0);
        return s;
      }),
    );
  const capitalAn = (an: AnneeBilan) => {
    let c = f.ouverture.capital;
    for (const y of EXERCICES) if (y <= an) c += f.apports?.[y] ?? 0;
    return c;
  };
  const distributions = (an: Exercice) => (f.dividendes?.[an] ?? 0) + (f.exploitant?.prelevements[an] ?? 0);

  const immoParCategorie = (an: AnneeBilan) => {
    const cats = new Map<CategorieImmo, { categorie: CategorieImmo; brut: number; amortissements: number; net: number }>();
    for (const a of amortissements) {
      const k = a.immo.categorie;
      const cur = cats.get(k) ?? { categorie: k, brut: 0, amortissements: 0, net: 0 };
      cur.brut += a.brut[an] ?? 0;
      cur.amortissements += a.cumul[an] ?? 0;
      cur.net += a.net[an] ?? 0;
      cats.set(k, cur);
    }
    return [...cats.values()].filter((c) => c.brut > 0);
  };

  const flux = {} as Record<Exercice, Flux>;
  const bilans = {} as Record<AnneeBilan, Bilan>;
  let tresoNette = f.ouverture.tresorerie;
  let reserves = 0;

  const construireBilan = (an: AnneeBilan, treso: number, reservesAn: number, resultatAn: number): Bilan => {
    const immobilisations = immoParCategorie(an);
    const actifImmobiliseBrut = somme(immobilisations.map((i) => i.brut));
    const amortissementsCumules = somme(immobilisations.map((i) => i.amortissements));
    const actifImmobiliseNet = somme(immobilisations.map((i) => i.net));
    const stocks = f.stocks.map((s) => ({ id: s.id, libelle: s.libelle, type: s.type, montant: s.finDAn[an] }));
    const totalStocks = somme(stocks.map((s) => s.montant));
    const disponibilites = Math.max(0, treso);
    const concoursBancaires = Math.max(0, -treso);
    const actifCirculant = totalStocks + bfr.creancesClients[an] + bfr.autresCreances[an] + disponibilites;
    const totalActif = actifImmobiliseNet + actifCirculant;
    const subventionsInvestissement = somme(subventions.map((s) => s.solde[an] ?? 0));
    const capital = capitalAn(an);
    const capitauxPropres = capital + reservesAn + resultatAn + subventionsInvestissement;
    const provisions = provisionsSolde(an);
    const empruntsCRD = somme(emprunts.map((e) => e.restantDu[an] ?? 0));
    const dettesExploitation =
      bfr.dettesFournisseurs[an] + bfr.dettesFiscalesSociales[an] + bfr.autresDettes[an] + bfr.produitsConstatesAvance[an];
    const totalPassif = capitauxPropres + provisions + empruntsCRD + concoursBancaires + dettesExploitation;
    const ressourcesStables = capitauxPropres + provisions + empruntsCRD;
    const fondsDeRoulement = ressourcesStables - actifImmobiliseNet;
    const besoinFondsRoulement = totalStocks + bfr.creancesClients[an] + bfr.autresCreances[an] - dettesExploitation;
    return {
      annee: an,
      immobilisations,
      actifImmobiliseBrut,
      amortissementsCumules,
      actifImmobiliseNet,
      stocks,
      totalStocks,
      creancesClients: bfr.creancesClients[an],
      autresCreances: bfr.autresCreances[an],
      disponibilites,
      actifCirculant,
      totalActif,
      libelleCapital: f.ouverture.libelleCapital,
      capital,
      reserves: reservesAn,
      resultat: resultatAn,
      subventionsInvestissement,
      capitauxPropres,
      provisions,
      emprunts: empruntsCRD,
      concoursBancaires,
      dettesFinancieres: empruntsCRD + concoursBancaires,
      dettesFournisseurs: bfr.dettesFournisseurs[an],
      dettesFiscalesSociales: bfr.dettesFiscalesSociales[an],
      autresDettes: bfr.autresDettes[an],
      produitsConstatesAvance: bfr.produitsConstatesAvance[an],
      dettesExploitation,
      totalPassif,
      ressourcesStables,
      fondsDeRoulement,
      besoinFondsRoulement,
      tresorerieNette: treso,
    };
  };

  // Ouverture : les réserves sont déterminées par solde (seule grandeur non saisie).
  {
    const provisoire = construireBilan(2022, tresoNette, 0, 0);
    reserves = provisoire.totalActif - provisoire.totalPassif;
    bilans[2022] = construireBilan(2022, tresoNette, reserves, 0);
  }

  let resultatPrecedent = 0;
  for (const an of EXERCICES) {
    const prec = bilans[(an - 1) as AnneeBilan];
    const bfrPoste = (k: keyof typeof bfr) => bfr[k][an] - bfr[k][(an - 1) as AnneeBilan];
    const variationStocks = somme(f.stocks.map((s) => variationStock(s.finDAn, an)));
    const variationBFR =
      variationStocks +
      bfrPoste('creancesClients') +
      bfrPoste('autresCreances') -
      bfrPoste('dettesFournisseurs') -
      bfrPoste('dettesFiscalesSociales') -
      bfrPoste('autresDettes') -
      bfrPoste('produitsConstatesAvance');
    const investissements = somme(
      amortissements.filter((a) => parseMois(a.immo.miseEnService).annee === an).map((a) => a.immo.valeurOrigine),
    );
    const cessions = cr[an].produitsCessions;
    const empruntsNouveaux = somme(emprunts.filter((e) => e.deblocage.annee === an).map((e) => e.emprunt.capital));
    const remboursements = somme(emprunts.map((e) => e.capitalRembourse[an] ?? 0));
    const dist = distributions(an);
    const apports = f.apports?.[an] ?? 0;
    const subventionsRecues = somme(subventions.filter((s) => s.encaissement.annee === an).map((s) => s.encaissement.montant));
    const fluxExploitation = caf[an].caf - variationBFR;
    const fluxInvestissement = -investissements + cessions;
    const fluxFinancement = empruntsNouveaux - remboursements - dist + apports + subventionsRecues;
    const variationTresorerie = fluxExploitation + fluxInvestissement + fluxFinancement;
    const ouverture = tresoNette;
    tresoNette += variationTresorerie;
    flux[an] = {
      annee: an,
      caf: caf[an].caf,
      variationBFR,
      fluxExploitation,
      investissements,
      cessions,
      fluxInvestissement,
      empruntsNouveaux,
      remboursements,
      distributions: dist,
      apports,
      subventionsRecues,
      fluxFinancement,
      variationTresorerie,
      tresorerieOuverture: ouverture,
      tresorerieCloture: tresoNette,
    };
    // Affectation du résultat N-1 en réserves, distributions imputées sur les réserves.
    reserves = prec.reserves + resultatPrecedent - dist;
    bilans[an] = construireBilan(an, tresoNette, reserves, cr[an].resultatNet);
    resultatPrecedent = cr[an].resultatNet;
  }

  const etatsPartiels = { etab, amortissements, emprunts, cr, sig, caf, bilans, flux } as Omit<Etats, 'tresorerie'>;
  const tresorerie = {
    2025: tresorerieMensuelle(etatsPartiels, 2025, subventions),
    2026: tresorerieMensuelle(etatsPartiels, 2026, subventions),
  };
  return { ...etatsPartiels, tresorerie };
}

// ---------------------------------------------------------------------------
// Trésorerie mensuelle
// ---------------------------------------------------------------------------

function repartir(total: number, poids?: number[]): number[] {
  const p = poids && poids.length === 12 && somme(poids) > 0 ? poids : Array(12).fill(1);
  const s = somme(p);
  return p.map((x) => (total * x) / s);
}

function surMois(total: number, mois?: number[]): number[] {
  const out = Array(12).fill(0);
  if (!mois || mois.length === 0) return repartir(total);
  for (const m of mois) out[m - 1] += total / mois.length;
  return out;
}

function tresorerieMensuelle(
  e: Omit<Etats, 'tresorerie'>,
  an: 2025 | 2026,
  subventions: PlanSubvention[],
): TresorerieMensuelle {
  const f = e.etab.finances;
  const t = f.tresorerieMensuelle;
  const c = e.cr[an];
  const d = (k: keyof typeof f.bfr) => f.bfr[k][an] - f.bfr[k][(an - 1) as AnneeBilan];
  const lignes: LigneTresorerie[] = [];
  const ajouter = (id: string, libelle: string, sens: LigneTresorerie['sens'], mois: number[]) => {
    const total = somme(mois);
    if (Math.abs(total) < 0.005 && mois.every((x) => Math.abs(x) < 0.005)) return;
    lignes.push({ id, libelle, sens, mois, total });
  };

  // Encaissements
  const clients = c.chiffreAffaires - d('creancesClients') + d('produitsConstatesAvance');
  ajouter('clients', 'Encaissements clients', 'encaissement', repartir(clients, t.saisonnaliteEncaissements));
  ajouter('subventions', "Subventions d'exploitation", 'encaissement', surMois(c.subventionsExploitation, t.moisSubventions));
  ajouter(
    'autres-produits',
    'Autres produits encaissés',
    'encaissement',
    repartir(c.autresProduits + c.produitsFinanciers + c.produitsExceptionnelsAutres),
  );
  const cessions = Array(12).fill(0);
  for (const a of e.amortissements) if (a.cession?.annee === an) cessions[a.cession.mois - 1] += a.cession.prix;
  ajouter('cessions', "Cessions d'immobilisations", 'encaissement', cessions);
  const nouveaux = Array(12).fill(0);
  for (const em of e.emprunts) if (em.deblocage.annee === an) nouveaux[em.deblocage.mois - 1] += em.emprunt.capital;
  ajouter('emprunts', 'Déblocage d’emprunts', 'encaissement', nouveaux);
  const subv = Array(12).fill(0);
  for (const s of subventions) if (s.encaissement.annee === an) subv[s.encaissement.mois - 1] += s.encaissement.montant;
  ajouter('subv-invest', "Subventions d'investissement", 'encaissement', subv);
  const apports = Array(12).fill(0);
  apports[0] = f.apports?.[an] ?? 0;
  ajouter('apports', 'Apports en fonds propres', 'encaissement', apports);

  // Décaissements
  const fournisseurs =
    c.achatsMarchandises +
    c.achatsApprovisionnements +
    c.chargesExternes +
    c.autresCharges +
    c.chargesFinancieresAutres +
    c.chargesExceptionnellesAutres -
    d('dettesFournisseurs') +
    d('autresCreances') -
    d('autresDettes');
  ajouter('fournisseurs', 'Fournisseurs et charges externes', 'decaissement', repartir(fournisseurs, t.saisonnaliteAchats));
  const personnel = c.salaires + c.chargesSociales - d('dettesFiscalesSociales');
  ajouter('personnel', 'Salaires et cotisations sociales', 'decaissement', repartir(personnel, t.saisonnalitePersonnel));
  ajouter('impots', 'Impôts, taxes et IS', 'decaissement', repartir(c.impotsTaxes + c.impotSocietes));
  const interets = Array(12).fill(0);
  const capital = Array(12).fill(0);
  for (const em of e.emprunts)
    for (const ech of em.echeances)
      if (ech.annee === an) {
        interets[ech.mois - 1] += ech.interets;
        capital[ech.mois - 1] += ech.capital;
      }
  ajouter('interets', "Intérêts d'emprunts", 'decaissement', interets);
  ajouter('capital', "Remboursement du capital emprunté", 'decaissement', capital);
  const invest = Array(12).fill(0);
  for (const a of e.amortissements) {
    const m = parseMois(a.immo.miseEnService);
    if (m.annee === an) invest[m.mois - 1] += a.immo.valeurOrigine;
  }
  ajouter('investissements', 'Investissements', 'decaissement', invest);
  const dist = (f.dividendes?.[an] ?? 0) + (f.exploitant?.prelevements[an] ?? 0);
  ajouter(
    'distributions',
    f.exploitant ? 'Prélèvements de l’exploitant' : 'Dividendes versés',
    'decaissement',
    surMois(dist, t.moisDistributions),
  );

  const encaissements = Array(12)
    .fill(0)
    .map((_, i) => somme(lignes.filter((l) => l.sens === 'encaissement').map((l) => l.mois[i])));
  const decaissements = Array(12)
    .fill(0)
    .map((_, i) => somme(lignes.filter((l) => l.sens === 'decaissement').map((l) => l.mois[i])));
  const solde = encaissements.map((x, i) => x - decaissements[i]);
  const ouverture = e.bilans[(an - 1) as AnneeBilan].tresorerieNette;
  const cumul: number[] = [];
  let acc = ouverture;
  for (const s of solde) {
    acc += s;
    cumul.push(acc);
  }
  return { annee: an, ouverture, lignes, encaissements, decaissements, solde, cumul };
}

// ---------------------------------------------------------------------------
// Comptabilité analytique (coûts complets, exercice d'analyse)
// ---------------------------------------------------------------------------

export interface ElementCharge {
  id: string;
  libelle: string;
  nature: string;
  montant: number;
  affectation: Affectation;
}

export interface ResultatSection {
  id: string;
  nom: string;
  produits: number;
  chargesDirectes: number;
  chargesIndirectes: number;
  coutComplet: number;
  margeSurCoutsDirects: number;
  resultat: number;
  uniteOeuvre?: { libelle: string; quantite: number; coutUnitaire: number | null };
}

export interface ResultatAnalytique {
  annee: Exercice;
  elements: ElementCharge[];
  sections: ResultatSection[];
  totalProduits: number;
  totalCharges: number;
  resultat: number;
}

export function elementsCharges(e: Etats, an: Exercice): ElementCharge[] {
  const f = e.etab.finances;
  const a = f.analytique;
  const aff = (id: string): Affectation => a?.affectations[id] ?? { cle: a?.cleParDefaut ?? '' };
  const out: ElementCharge[] = [];
  const lignes = (ls: LigneMontant[], nature: string) => {
    for (const l of ls) {
      const m = l.montants[an] ?? 0;
      if (m) out.push({ id: l.id, libelle: l.libelle, nature, montant: m, affectation: aff(l.id) });
    }
  };
  lignes(f.achatsMarchandises, 'Achats de marchandises');
  lignes(f.achatsApprovisionnements, 'Approvisionnements');
  lignes(f.chargesExternes, 'Charges externes');
  lignes(f.impotsTaxes, 'Impôts et taxes');
  lignes(f.autresCharges, 'Autres charges');
  lignes(f.chargesFinancieresAutres, 'Charges financières');
  const c = e.cr[an];
  if (Math.abs(c.variationStockApprovisionnements) > 0.004)
    out.push({ id: 'variation-stocks', libelle: 'Variation des stocks d’approvisionnements', nature: 'Approvisionnements', montant: c.variationStockApprovisionnements, affectation: aff('variation-stocks') });
  if (Math.abs(c.variationStockMarchandises) > 0.004) {
    // Par défaut, la variation de stock de marchandises suit l'affectation des achats de marchandises.
    const premier = f.achatsMarchandises[0]?.id;
    const affM = a?.affectations['variation-stocks-marchandises'] ?? (premier ? aff(premier) : aff('variation-stocks-marchandises'));
    out.push({ id: 'variation-stocks-marchandises', libelle: 'Variation des stocks de marchandises', nature: 'Achats de marchandises', montant: c.variationStockMarchandises, affectation: affM });
  }
  for (const p of f.personnel) {
    const m = p.etp[an] * p.brutAnnuelEtp[an] * (1 + p.tauxCharges);
    if (m) out.push({ id: p.id, libelle: p.intitule, nature: 'Personnel', montant: m, affectation: a?.affectations[p.id] ?? p.affectation ?? aff(p.id) });
  }
  if (f.exploitant && f.exploitant.cotisations[an])
    out.push({
      id: 'exploitant',
      libelle: "Cotisations sociales de l'exploitant",
      nature: 'Personnel',
      montant: f.exploitant.cotisations[an],
      affectation: a?.affectations['exploitant'] ?? f.exploitant.affectation ?? aff('exploitant'),
    });
  const parCat = new Map<string, number>();
  for (const pa of e.amortissements) parCat.set(pa.immo.categorie, (parCat.get(pa.immo.categorie) ?? 0) + (pa.dotation[an] ?? 0));
  for (const [cat, m] of parCat)
    if (m) out.push({ id: `amortissements:${cat}`, libelle: `Amortissements · ${LIBELLES_IMMO[cat as CategorieImmo]}`, nature: 'Amortissements', montant: m, affectation: aff(`amortissements:${cat}`) });
  if (c.dotationsProvisionsExploitation)
    out.push({ id: 'provisions', libelle: 'Dotations aux provisions', nature: 'Provisions', montant: c.dotationsProvisionsExploitation, affectation: aff('provisions') });
  if (c.interetsEmprunts)
    out.push({ id: 'interets', libelle: "Intérêts d'emprunts", nature: 'Charges financières', montant: c.interetsEmprunts, affectation: aff('interets') });
  return out;
}

/**
 * Calcule les coûts complets par section. `forcerCle` permet de répartir toutes les
 * charges indirectes avec une même clé (comparaison des conventions d'imputation).
 */
export function analytique(e: Etats, forcerCle?: string): ResultatAnalytique | null {
  const a = e.etab.finances.analytique;
  if (!a) return null;
  const an = a.exercice;
  const elements = elementsCharges(e, an);
  const sections = new Map<string, ResultatSection>();
  for (const s of a.sections)
    sections.set(s.id, { id: s.id, nom: s.nom, produits: 0, chargesDirectes: 0, chargesIndirectes: 0, coutComplet: 0, margeSurCoutsDirects: 0, resultat: 0 });
  const cle = (id: string) => a.cles.find((k) => k.id === id) ?? a.cles.find((k) => k.id === a.cleParDefaut)!;
  const repartirCle = (id: string, montant: number, cb: (sid: string, m: number) => void) => {
    const k = cle(id);
    const tot = somme(Object.values(k.repartition));
    for (const [sid, q] of Object.entries(k.repartition)) cb(sid, tot ? (montant * q) / tot : 0);
  };
  for (const el of elements) {
    if ('section' in el.affectation) {
      sections.get(el.affectation.section)!.chargesDirectes += el.montant;
    } else {
      repartirCle(forcerCle ?? el.affectation.cle, el.montant, (sid, m) => (sections.get(sid)!.chargesIndirectes += m));
    }
  }
  // Produits
  for (const p of e.etab.activites.prestations) sections.get(p.activite)!.produits += recettePrestation(p, an);
  const c = e.cr[an];
  const autres: { id: string; montant: number }[] = [
    { id: 'subventions', montant: c.subventionsExploitation },
    { id: 'autres-produits', montant: c.autresProduits + c.reprisesExploitation },
    { id: 'production-stockee', montant: c.productionStockee },
    { id: 'produits-financiers', montant: c.produitsFinanciers },
  ];
  for (const p of autres) {
    if (!p.montant) continue;
    const af = a.affectationsProduits?.[p.id] ?? { cle: a.cleParDefaut };
    if ('section' in af) sections.get(af.section)!.produits += p.montant;
    else repartirCle(af.cle, p.montant, (sid, m) => (sections.get(sid)!.produits += m));
  }
  for (const s of sections.values()) {
    s.coutComplet = s.chargesDirectes + s.chargesIndirectes;
    s.margeSurCoutsDirects = s.produits - s.chargesDirectes;
    s.resultat = s.produits - s.coutComplet;
    const def = a.sections.find((x) => x.id === s.id)!;
    if (def.uniteOeuvre)
      s.uniteOeuvre = { ...def.uniteOeuvre, coutUnitaire: ratio(s.coutComplet, def.uniteOeuvre.quantite) };
  }
  const liste = [...sections.values()];
  return {
    annee: an,
    elements,
    sections: liste,
    totalProduits: somme(liste.map((s) => s.produits)),
    totalCharges: somme(liste.map((s) => s.coutComplet)),
    resultat: somme(liste.map((s) => s.resultat)),
  };
}

export const LIBELLES_IMMO: Record<CategorieImmo, string> = {
  incorporel: 'Immobilisations incorporelles',
  terrain: 'Terrains',
  constructions: 'Constructions',
  installations: 'Installations et agencements',
  materiel: 'Matériel',
  vehicules: 'Véhicules',
  cavalerie: 'Cavalerie et animaux reproducteurs',
  financier: 'Immobilisations financières',
};

// ---------------------------------------------------------------------------
// Cache
// ---------------------------------------------------------------------------

const cache = new WeakMap<Etablissement, Etats>();
export function etats(etab: Etablissement): Etats {
  let e = cache.get(etab);
  if (!e) {
    e = construireEtats(etab);
    cache.set(etab, e);
  }
  return e;
}

export type { ParAn };
