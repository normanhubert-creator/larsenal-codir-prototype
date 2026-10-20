/**
 * Simulateur d'investissement.
 *
 * Distingue strictement :
 *  - le compte de résultat différentiel (recettes, charges, amortissements, intérêts, impôt) ;
 *  - la CAF différentielle (résultat + dotations − quote-part de subvention virée) ;
 *  - la trésorerie (CAF − remboursement du capital + financements − dépense d'investissement) ;
 *  - les flux économiques, hors financement, servant au calcul de la VAN et du TRI.
 *
 * L'investissement n'est jamais passé en charge : il est amorti par composante.
 * L'emprunt n'est jamais un produit : il apparaît uniquement en trésorerie.
 */
import type { ProjetInvestissement } from '../types';
import { mensualiteConstante, ratio, somme } from './engine';

export type Scenario = 'prudent' | 'central' | 'favorable';

export interface ParametresSimulation {
  scenario: Scenario;
  /** Multiplicateur appliqué au montant de chaque composante (dérive ou maîtrise des coûts). */
  coefMontant: number;
  apport: number;
  emprunt: number;
  taux: number;
  dureeEmprunt: number;
  subvention: number;
  /** Ajustement des prix de vente en % (ex. 0.05 = +5 %). */
  ajustementPrix: number;
  /** Volumes en régime de croisière, par recette (indexés comme projet.recettes). */
  volumes: number[];
  tauxChargesVariables: number;
  chargesFixes: number;
  delaiMiseEnServiceMois: number;
  tauxActualisation: number;
}

export function parametresInitiaux(p: ProjetInvestissement, scenario: Scenario = 'central'): ParametresSimulation {
  return {
    scenario,
    coefMontant: 1,
    apport: p.financement.apport,
    emprunt: p.financement.emprunt,
    taux: p.financement.taux,
    dureeEmprunt: p.financement.dureeAnnees,
    subvention: p.financement.subvention,
    ajustementPrix: 0,
    volumes: p.recettes.map((r) => r.volumes[scenario]),
    tauxChargesVariables: p.tauxChargesVariables,
    chargesFixes: somme(p.chargesFixes.map((c) => c.montant)),
    delaiMiseEnServiceMois: p.delaiMiseEnServiceMois,
    tauxActualisation: p.tauxActualisation,
  };
}

export interface AnneeProjet {
  annee: number; // 1..horizon
  recettes: number;
  chargesVariables: number;
  chargesFixes: number;
  chargesLancement: number;
  ebe: number;
  dotations: number;
  repriseSubvention: number;
  resultatExploitation: number;
  interets: number;
  resultatAvantImpot: number;
  impot: number;
  resultatNet: number;
  caf: number;
  remboursementCapital: number;
  capitalRestantDu: number;
  /** Flux de trésorerie de l'entreprise (avec financement). */
  tresorerie: number;
  tresorerieCumulee: number;
  /** Flux économique (hors financement) pour VAN/TRI. */
  fluxEconomique: number;
  fluxActualise: number;
  fluxActualiseCumule: number;
}

export interface ResultatSimulation {
  montantInvestissement: number;
  besoinFinancement: number;
  ressources: number;
  ecartFinancement: number;
  annees: AnneeProjet[];
  van: number;
  tri: number | null;
  delaiRecuperation: number | null;
  delaiRecuperationActualise: number | null;
  indiceProfitabilite: number | null;
  recettesCroisiere: number;
  alertes: string[];
}

export function simuler(p: ProjetInvestissement, s: ParametresSimulation): ResultatSimulation {
  const H = p.horizon;
  const composantes = p.composantes.map((c) => ({ ...c, montant: c.montant * s.coefMontant }));
  const I = somme(composantes.map((c) => c.montant));
  const besoin = I + p.chargesLancement;
  const ressources = s.apport + s.emprunt + s.subvention;
  const alertes: string[] = [];

  // Échéancier d'emprunt annuel à partir des mensualités constantes
  const n = Math.round(s.dureeEmprunt * 12);
  const m = mensualiteConstante(s.emprunt, s.taux, n);
  let crd = s.emprunt;
  const interetsAn: number[] = [];
  const capitalAn: number[] = [];
  const crdAn: number[] = [];
  for (let y = 1; y <= H; y++) {
    let i = 0;
    let c = 0;
    for (let k = 0; k < 12; k++) {
      const num = (y - 1) * 12 + k + 1;
      if (num > n || crd <= 1e-9) break;
      const int = crd * (s.taux / 12);
      let cap = m - int;
      if (num === n) cap = crd;
      crd -= cap;
      i += int;
      c += cap;
    }
    interetsAn.push(i);
    capitalAn.push(c);
    crdAn.push(Math.max(0, crd));
  }

  const dureeSubv = p.financement.dureeRepriseSubvention ?? Math.max(1, ...composantes.map((c) => c.duree));
  const annees: AnneeProjet[] = [];
  let tresoCum = -I + ressources; // année 0 : dépense immobilisée et financements (les charges de lancement passent par la CAF de l'année 1)
  let actuCum = 0;
  const flux0 = -I; // investissement (flux économique en t0) ; charges de lancement en année 1
  actuCum = flux0;
  const prixCoef = 1 + s.ajustementPrix;

  for (let y = 1; y <= H; y++) {
    // Mois d'activité dans l'année compte tenu du délai de mise en service
    const debutMois = s.delaiMiseEnServiceMois;
    const moisActifs = Math.min(12, Math.max(0, y * 12 - debutMois) - Math.max(0, (y - 1) * 12 - debutMois));
    const anneeActivite = Math.ceil(Math.max(0, y * 12 - debutMois) / 12); // rang d'année d'exploitation
    const montee = anneeActivite <= 0 ? 0 : p.monteeEnCharge[Math.min(anneeActivite - 1, p.monteeEnCharge.length - 1)] ?? 1;
    const recettes = somme(
      p.recettes.map((r, idx) => {
        const vol = Math.min(s.volumes[idx] ?? 0, r.capaciteMax);
        return r.prix * prixCoef * vol * montee * (moisActifs / 12);
      }),
    );
    const chargesVariables = recettes * s.tauxChargesVariables;
    const chargesFixes = s.chargesFixes * (moisActifs / 12);
    const chargesLancement = y === 1 ? p.chargesLancement : 0;
    const ebe = recettes - chargesVariables - chargesFixes - chargesLancement;
    const dotations = somme(composantes.map((c) => (c.duree > 0 && y <= c.duree ? c.montant / c.duree : 0)));
    const repriseSubvention = y <= dureeSubv ? s.subvention / dureeSubv : 0;
    const resultatExploitation = ebe - dotations + repriseSubvention;
    const interets = interetsAn[y - 1];
    const resultatAvantImpot = resultatExploitation - interets;
    // Impôt différentiel symétrique : une perte du projet réduit l'impôt du reste de l'entreprise (hypothèse documentée).
    const impot = resultatAvantImpot * p.tauxImpot;
    const resultatNet = resultatAvantImpot - impot;
    const caf = resultatNet + dotations - repriseSubvention;
    const remboursementCapital = capitalAn[y - 1];
    const tresorerie = caf - remboursementCapital;
    tresoCum += tresorerie;
    // Flux économique : EBE − impôt sur le résultat d'exploitation (hors frais financiers), hors subvention
    const impotEco = (ebe - dotations) * p.tauxImpot;
    let fluxEconomique = ebe - impotEco;
    if (y === H) {
      // Valeur résiduelle : valeur nette comptable des composantes en fin d'horizon
      fluxEconomique += somme(composantes.map((c) => (c.duree > H ? c.montant * (1 - H / c.duree) : 0)));
    }
    const fluxActualise = fluxEconomique / Math.pow(1 + s.tauxActualisation, y);
    actuCum += fluxActualise;
    annees.push({
      annee: y,
      recettes,
      chargesVariables,
      chargesFixes,
      chargesLancement,
      ebe,
      dotations,
      repriseSubvention,
      resultatExploitation,
      interets,
      resultatAvantImpot,
      impot,
      resultatNet,
      caf,
      remboursementCapital,
      capitalRestantDu: crdAn[y - 1],
      tresorerie,
      tresorerieCumulee: tresoCum,
      fluxEconomique,
      fluxActualise,
      fluxActualiseCumule: actuCum,
    });
  }

  const flux = [flux0, ...annees.map((a) => a.fluxEconomique)];
  const van = somme(flux.map((f, t) => f / Math.pow(1 + s.tauxActualisation, t)));
  const tri = triBissection(flux);

  const delai = (cle: 'fluxEconomique' | 'fluxActualise') => {
    let cum = flux0;
    for (const a of annees) {
      const avant = cum;
      cum += a[cle];
      if (cum >= 0 && avant < 0) return a.annee - 1 + (-avant / a[cle]);
    }
    return null;
  };

  // Alertes de vraisemblance (aucune ne bloque le calcul)
  p.recettes.forEach((r, idx) => {
    const v = s.volumes[idx] ?? 0;
    if (v > r.capaciteMax) alertes.push(`Le volume « ${r.libelle} » (${v}) dépasse la capacité maximale retenue (${r.capaciteMax}) : il est plafonné.`);
    else if (v > 0.9 * r.capaciteMax) alertes.push(`Le volume « ${r.libelle} » suppose une utilisation supérieure à 90 % de la capacité.`);
  });
  if (Math.abs(ressources - besoin) > 1) {
    alertes.push(
      ressources < besoin
        ? `Le plan de financement est insuffisant de ${Math.round(besoin - ressources).toLocaleString('fr-FR')} € : la trésorerie de l'entreprise doit couvrir l'écart.`
        : `Les ressources excèdent le besoin de ${Math.round(ressources - besoin).toLocaleString('fr-FR')} €.`,
    );
  }
  if (s.dureeEmprunt > Math.max(...composantes.map((c) => c.duree)) && s.emprunt > 0)
    alertes.push("La durée de l'emprunt dépasse la durée de vie économique des actifs financés.");
  if (s.ajustementPrix > 0.15) alertes.push('La hausse de prix retenue dépasse 15 % : elle doit être justifiée par les repères de marché.');
  const anneesNegatives = annees.filter((a) => a.tresorerie < 0).length;
  if (anneesNegatives > 0) alertes.push(`Le projet consomme de la trésorerie pendant ${anneesNegatives} année(s) après remboursement des emprunts.`);

  return {
    montantInvestissement: I,
    besoinFinancement: besoin,
    ressources,
    ecartFinancement: ressources - besoin,
    annees,
    van,
    tri,
    delaiRecuperation: delai('fluxEconomique'),
    delaiRecuperationActualise: delai('fluxActualise'),
    indiceProfitabilite: ratio(van + I, I),
    recettesCroisiere: somme(p.recettes.map((r, i) => r.prix * prixCoef * Math.min(s.volumes[i] ?? 0, r.capaciteMax))),
    alertes,
  };
}

/** TRI par bissection sur [-99 %, +200 %]. Renvoie null si pas de changement de signe. */
export function triBissection(flux: number[]): number | null {
  const van = (r: number) => somme(flux.map((f, t) => f / Math.pow(1 + r, t)));
  let lo = -0.99;
  let hi = 2;
  let vlo = van(lo);
  const vhi = van(hi);
  if (vlo * vhi > 0) return null;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    const vm = van(mid);
    if (Math.abs(vm) < 1e-7) return mid;
    if (vlo * vm < 0) hi = mid;
    else {
      lo = mid;
      vlo = vm;
    }
  }
  return (lo + hi) / 2;
}
