/**
 * Indicateurs et ratios financiers. Définitions centralisées : chaque indicateur
 * porte sa formule et une définition courte affichée à l'étudiant (sans interprétation).
 */
import { EXERCICES, type Exercice } from '../types';
import { analytique, ratio, recettePrestation, somme, type Etats } from './engine';

export type Format = '€' | '%' | 'jours' | 'x' | 'ans' | '€/unité' | 'nombre';

export interface DefIndicateur {
  id: string;
  libelle: string;
  famille: 'Activité' | 'Rentabilité' | 'Structure financière' | 'Liquidité et BFR' | 'Exploitation' | 'Équilibre';
  format: Format;
  formule: string;
  definition: string;
  calcul: (e: Etats, an: Exercice) => number | null;
}

const prec = (an: Exercice) => (an - 1) as Exercice;
const ca = (e: Etats, an: Exercice) => e.cr[an].chiffreAffaires;
const chargesPersonnel = (e: Etats, an: Exercice) => e.cr[an].salaires + e.cr[an].chargesSociales;
const etp = (e: Etats, an: Exercice) => somme(e.etab.finances.personnel.map((p) => p.etp[an]));
const annuites = (e: Etats, an: Exercice) =>
  somme(e.emprunts.map((x) => (x.interets[an] ?? 0) + (x.capitalRembourse[an] ?? 0)));

export const INDICATEURS: DefIndicateur[] = [
  // Activité
  {
    id: 'ca',
    libelle: "Chiffre d'affaires",
    famille: 'Activité',
    format: '€',
    formule: 'Ventes de marchandises + production vendue',
    definition: "Montant hors taxes des ventes de biens et de prestations de l'exercice.",
    calcul: ca,
  },
  {
    id: 'croissanceCA',
    libelle: "Variation du chiffre d'affaires",
    famille: 'Activité',
    format: '%',
    formule: '(CA N − CA N−1) / CA N−1',
    definition: "Évolution relative du chiffre d'affaires par rapport à l'exercice précédent.",
    calcul: (e, an) => (an === 2023 ? null : ratio(ca(e, an) - ca(e, prec(an)), ca(e, prec(an)))),
  },
  {
    id: 'productionExercice',
    libelle: "Production de l'exercice",
    famille: 'Activité',
    format: '€',
    formule: 'Production vendue + production stockée + production immobilisée',
    definition: "Valeur de ce que l'entreprise a produit, vendu ou non. Indispensable pour un élevage dont les jeunes chevaux restent en stock.",
    calcul: (e, an) => e.sig[an].productionExercice,
  },
  {
    id: 'va',
    libelle: 'Valeur ajoutée',
    famille: 'Activité',
    format: '€',
    formule: 'Marge commerciale + production − consommations en provenance des tiers',
    definition: "Richesse créée par l'entreprise, qui rémunère le personnel, l'État, les prêteurs, les associés et l'entreprise elle-même.",
    calcul: (e, an) => e.sig[an].valeurAjoutee,
  },
  {
    id: 'caParEtp',
    libelle: "Chiffre d'affaires par ETP salarié",
    famille: 'Exploitation',
    format: '€',
    formule: 'CA / ETP salariés',
    definition: 'Productivité apparente du travail salarié. Ne tient pas compte du travail non salarié du dirigeant.',
    calcul: (e, an) => ratio(ca(e, an), etp(e, an)),
  },
  // Rentabilité
  {
    id: 'ebe',
    libelle: 'Excédent brut d’exploitation',
    famille: 'Rentabilité',
    format: '€',
    formule: 'VA + subventions d’exploitation − impôts et taxes − charges de personnel',
    definition: "Ressource dégagée par l'exploitation avant politique d'amortissement, de financement et fiscalité.",
    calcul: (e, an) => e.sig[an].ebe,
  },
  {
    id: 'tauxEBE',
    libelle: "Taux d'EBE",
    famille: 'Rentabilité',
    format: '%',
    formule: 'EBE / CA',
    definition: "Part du chiffre d'affaires transformée en excédent brut d'exploitation.",
    calcul: (e, an) => ratio(e.sig[an].ebe, ca(e, an)),
  },
  {
    id: 'tauxVA',
    libelle: 'Taux de valeur ajoutée',
    famille: 'Rentabilité',
    format: '%',
    formule: 'VA / (CA + production stockée)',
    definition: "Part de l'activité qui correspond à une création de richesse propre à l'entreprise.",
    calcul: (e, an) => ratio(e.sig[an].valeurAjoutee, ca(e, an) + e.cr[an].productionStockee),
  },
  {
    id: 're',
    libelle: "Résultat d'exploitation",
    famille: 'Rentabilité',
    format: '€',
    formule: 'EBE + reprises et autres produits − dotations et autres charges',
    definition: "Performance de l'activité courante après prise en compte de l'usure des équipements.",
    calcul: (e, an) => e.sig[an].resultatExploitation,
  },
  {
    id: 'rn',
    libelle: 'Résultat net',
    famille: 'Rentabilité',
    format: '€',
    formule: 'Total des produits − total des charges',
    definition: "Bénéfice ou perte comptable de l'exercice.",
    calcul: (e, an) => e.cr[an].resultatNet,
  },
  {
    id: 'tauxRentabiliteNette',
    libelle: 'Rentabilité nette',
    famille: 'Rentabilité',
    format: '%',
    formule: 'Résultat net / CA',
    definition: "Résultat net rapporté au chiffre d'affaires.",
    calcul: (e, an) => ratio(e.cr[an].resultatNet, ca(e, an)),
  },
  {
    id: 'rentabiliteFinanciere',
    libelle: 'Rentabilité des capitaux propres',
    famille: 'Rentabilité',
    format: '%',
    formule: 'Résultat net / capitaux propres',
    definition: 'Rémunération comptable des fonds propres engagés.',
    calcul: (e, an) => (e.bilans[an].capitauxPropres <= 0 ? null : ratio(e.cr[an].resultatNet, e.bilans[an].capitauxPropres)),
  },
  {
    id: 'caf',
    libelle: "Capacité d'autofinancement",
    famille: 'Rentabilité',
    format: '€',
    formule: 'Résultat net + charges calculées − produits calculés ± résultat de cession',
    definition: "Ressource interne potentielle dégagée par l'activité. Ce n'est ni un résultat ni une trésorerie disponible.",
    calcul: (e, an) => e.caf[an].caf,
  },
  {
    id: 'cafSurCA',
    libelle: 'CAF / CA',
    famille: 'Rentabilité',
    format: '%',
    formule: 'CAF / CA',
    definition: "Part du chiffre d'affaires qui reste à l'entreprise pour rembourser, investir ou distribuer.",
    calcul: (e, an) => ratio(e.caf[an].caf, ca(e, an)),
  },
  // Exploitation
  {
    id: 'poidsPersonnel',
    libelle: 'Charges de personnel / CA',
    famille: 'Exploitation',
    format: '%',
    formule: '(Salaires + charges sociales) / CA',
    definition: "Poids des rémunérations et cotisations dans l'activité. Inclut les cotisations de l'exploitant non salarié.",
    calcul: (e, an) => ratio(chargesPersonnel(e, an), ca(e, an)),
  },
  {
    id: 'partPersonnelVA',
    libelle: 'Charges de personnel / VA',
    famille: 'Exploitation',
    format: '%',
    formule: 'Charges de personnel / valeur ajoutée',
    definition: 'Part de la richesse créée absorbée par la rémunération du travail.',
    calcul: (e, an) => ratio(chargesPersonnel(e, an), e.sig[an].valeurAjoutee),
  },
  {
    id: 'poidsApprovisionnements',
    libelle: 'Approvisionnements consommés / CA',
    famille: 'Exploitation',
    format: '%',
    formule: '(Achats d’approvisionnements + variation de stocks) / CA',
    definition: 'Poids des aliments, litières et fournitures consommés.',
    calcul: (e, an) => ratio(e.cr[an].achatsApprovisionnements + e.cr[an].variationStockApprovisionnements, ca(e, an)),
  },
  {
    id: 'poidsExternes',
    libelle: 'Charges externes / CA',
    famille: 'Exploitation',
    format: '%',
    formule: 'Autres achats et charges externes / CA',
    definition: 'Poids des services extérieurs : vétérinaire, maréchalerie, énergie, assurances, entretien, honoraires…',
    calcul: (e, an) => ratio(e.cr[an].chargesExternes, ca(e, an)),
  },
  {
    id: 'ebeParEtp',
    libelle: 'EBE par ETP salarié',
    famille: 'Exploitation',
    format: '€',
    formule: 'EBE / ETP salariés',
    definition: "Excédent brut d'exploitation dégagé par équivalent temps plein salarié.",
    calcul: (e, an) => ratio(e.sig[an].ebe, etp(e, an)),
  },
  // Structure
  {
    id: 'capitauxPropres',
    libelle: 'Capitaux propres',
    famille: 'Structure financière',
    format: '€',
    formule: 'Capital + réserves + résultat + subventions d’investissement',
    definition: 'Ressources appartenant aux associés, aux membres ou à l’exploitant.',
    calcul: (e, an) => e.bilans[an].capitauxPropres,
  },
  {
    id: 'endettement',
    libelle: "Taux d'endettement",
    famille: 'Structure financière',
    format: 'x',
    formule: 'Dettes financières / capitaux propres',
    definition: 'Nombre d’euros de dettes financières pour un euro de capitaux propres.',
    calcul: (e, an) => (e.bilans[an].capitauxPropres <= 0 ? null : ratio(e.bilans[an].dettesFinancieres, e.bilans[an].capitauxPropres)),
  },
  {
    id: 'autonomie',
    libelle: 'Autonomie financière',
    famille: 'Structure financière',
    format: '%',
    formule: 'Capitaux propres / total du bilan',
    definition: "Part de l'actif financée par les ressources propres.",
    calcul: (e, an) => ratio(e.bilans[an].capitauxPropres, e.bilans[an].totalPassif),
  },
  {
    id: 'capaciteRemboursement',
    libelle: 'Capacité de remboursement',
    famille: 'Structure financière',
    format: 'ans',
    formule: 'Dettes financières / CAF',
    definition: "Nombre d'années de CAF nécessaires pour rembourser l'endettement financier. Non significatif si la CAF est négative.",
    calcul: (e, an) => (e.caf[an].caf <= 0 ? null : ratio(e.bilans[an].dettesFinancieres, e.caf[an].caf)),
  },
  {
    id: 'tauxAnnuites',
    libelle: 'Annuités / EBE',
    famille: 'Structure financière',
    format: '%',
    formule: '(Intérêts + capital remboursé) / EBE',
    definition: "Part de l'EBE absorbée par le service de la dette bancaire.",
    calcul: (e, an) => (e.sig[an].ebe <= 0 ? null : ratio(annuites(e, an), e.sig[an].ebe)),
  },
  {
    id: 'vetusteImmobilisations',
    libelle: 'Degré d’amortissement des immobilisations',
    famille: 'Structure financière',
    format: '%',
    formule: 'Amortissements cumulés / immobilisations brutes amortissables',
    definition: "Indique l'ancienneté relative de l'outil de production (hors terrains).",
    calcul: (e, an) => {
      const b = e.bilans[an];
      const brutAmort = somme(b.immobilisations.filter((i) => i.categorie !== 'terrain' && i.categorie !== 'financier').map((i) => i.brut));
      return ratio(b.amortissementsCumules, brutAmort);
    },
  },
  // Équilibre
  {
    id: 'fr',
    libelle: 'Fonds de roulement',
    famille: 'Équilibre',
    format: '€',
    formule: 'Ressources stables − actif immobilisé net',
    definition: "Excédent des ressources durables sur les emplois durables, disponible pour financer le cycle d'exploitation.",
    calcul: (e, an) => e.bilans[an].fondsDeRoulement,
  },
  {
    id: 'bfr',
    libelle: 'Besoin en fonds de roulement',
    famille: 'Équilibre',
    format: '€',
    formule: 'Stocks + créances − dettes d’exploitation (dont produits constatés d’avance)',
    definition: "Besoin de financement né du décalage entre les flux d'exploitation et leurs règlements. Il peut être négatif (ressource).",
    calcul: (e, an) => e.bilans[an].besoinFondsRoulement,
  },
  {
    id: 'tn',
    libelle: 'Trésorerie nette',
    famille: 'Équilibre',
    format: '€',
    formule: 'FR − BFR = disponibilités − concours bancaires courants',
    definition: 'Position de trésorerie en fin d’exercice.',
    calcul: (e, an) => e.bilans[an].tresorerieNette,
  },
  {
    id: 'bfrJours',
    libelle: 'BFR en jours de CA',
    famille: 'Liquidité et BFR',
    format: 'jours',
    formule: 'BFR / CA × 365',
    definition: "Nombre de jours de chiffre d'affaires immobilisés dans le cycle d'exploitation.",
    calcul: (e, an) => {
      const r = ratio(e.bilans[an].besoinFondsRoulement, ca(e, an));
      return r === null ? null : r * 365;
    },
  },
  {
    id: 'delaiClients',
    libelle: 'Délai de règlement clients',
    famille: 'Liquidité et BFR',
    format: 'jours',
    formule: 'Créances clients / CA × 365 (montants HT)',
    definition: 'Durée moyenne de crédit accordée aux clients (approximation hors TVA).',
    calcul: (e, an) => {
      const r = ratio(e.bilans[an].creancesClients, ca(e, an));
      return r === null ? null : r * 365;
    },
  },
  {
    id: 'delaiFournisseurs',
    libelle: 'Délai de règlement fournisseurs',
    famille: 'Liquidité et BFR',
    format: 'jours',
    formule: 'Dettes fournisseurs / (achats + charges externes) × 365',
    definition: 'Durée moyenne de crédit obtenue des fournisseurs (approximation hors TVA).',
    calcul: (e, an) => {
      const c = e.cr[an];
      const r = ratio(e.bilans[an].dettesFournisseurs, c.achatsMarchandises + c.achatsApprovisionnements + c.chargesExternes);
      return r === null ? null : r * 365;
    },
  },
  {
    id: 'liquiditeGenerale',
    libelle: 'Liquidité générale',
    famille: 'Liquidité et BFR',
    format: 'x',
    formule: 'Actif circulant / dettes à court terme',
    definition: 'Capacité des actifs à court terme à couvrir les dettes à court terme.',
    calcul: (e, an) => {
      const b = e.bilans[an];
      return ratio(b.actifCirculant, b.dettesExploitation + b.concoursBancaires);
    },
  },
  {
    id: 'tresorerieJours',
    libelle: 'Trésorerie en jours de charges décaissables',
    famille: 'Liquidité et BFR',
    format: 'jours',
    formule: 'Trésorerie nette / (charges d’exploitation décaissables / 365)',
    definition: 'Nombre de jours de fonctionnement couverts par la trésorerie disponible.',
    calcul: (e, an) => {
      const c = e.cr[an];
      const dec = c.achatsMarchandises + c.achatsApprovisionnements + c.chargesExternes + c.impotsTaxes + c.salaires + c.chargesSociales + c.autresCharges;
      const r = ratio(e.bilans[an].tresorerieNette, dec / 365);
      return r;
    },
  },
];

export const indicateur = (id: string) => INDICATEURS.find((i) => i.id === id);

/**
 * Évalue un indicateur par identifiant. Gère aussi les identifiants dynamiques :
 *  - coutUnitaire:<section> → coût complet unitaire analytique
 *  - resultatSection:<section> → résultat analytique d'une section
 *  - occupation:<prestation> → volume / capacité
 */
export function evaluer(e: Etats, id: string, an: Exercice): number | null {
  const def = indicateur(id);
  if (def) return def.calcul(e, an);
  const [type, arg] = id.split(':');
  if (type === 'coutUnitaire' || type === 'resultatSection') {
    const a = analytique(e);
    const s = a?.sections.find((x) => x.id === arg);
    if (!s) return null;
    return type === 'coutUnitaire' ? s.uniteOeuvre?.coutUnitaire ?? null : s.resultat;
  }
  if (type === 'occupation') {
    const p = e.etab.activites.prestations.find((x) => x.id === arg);
    if (!p?.capaciteAnnuelle) return null;
    return ratio(p.volume[an], p.capaciteAnnuelle[an]);
  }
  if (type === 'recette') {
    const p = e.etab.activites.prestations.find((x) => x.id === arg);
    return p ? recettePrestation(p, an) : null;
  }
  return null;
}

export function serie(e: Etats, id: string): { annee: Exercice; valeur: number | null }[] {
  return EXERCICES.map((an) => ({ annee: an, valeur: evaluer(e, id, an) }));
}
