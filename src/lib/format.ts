/** Formats d'affichage. Toujours en français, chiffres tabulaires via la classe .num. */
const euro0 = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
const euro2 = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 });
const nb0 = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 });
const nb1 = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 });
const nb2 = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 });
const pct1 = new Intl.NumberFormat('fr-FR', { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 });

const propre = (n: number) => (Math.abs(n) < 0.5 ? 0 : n);

export const euros = (n: number | null | undefined) => (n === null || n === undefined || !Number.isFinite(n) ? 'n.s.' : euro0.format(propre(n)));
export const eurosCentimes = (n: number | null | undefined) => (n === null || n === undefined || !Number.isFinite(n) ? 'n.s.' : euro2.format(n));
export const keuros = (n: number) => `${nb0.format(Math.round(n / 1000))} k€`;
export const nombre = (n: number | null | undefined, dec = 0) =>
  n === null || n === undefined || !Number.isFinite(n) ? 'n.s.' : (dec === 0 ? nb0 : dec === 1 ? nb1 : nb2).format(n);
export const pourcent = (n: number | null | undefined) => (n === null || n === undefined || !Number.isFinite(n) ? 'n.s.' : pct1.format(n));
export const montant = (n: number) => nb0.format(propre(Math.round(n)));

export function selonFormat(v: number | null, format: string): string {
  if (v === null || !Number.isFinite(v)) return 'n.s.';
  switch (format) {
    case '€':
      return euros(v);
    case '€/unité':
      return eurosCentimes(v);
    case '%':
      return pourcent(v);
    case 'jours':
      return `${nb0.format(v)} j`;
    case 'ans':
      return `${nb1.format(v)} ans`;
    case 'x':
      return nb2.format(v);
    default:
      return nb1.format(v);
  }
}

export function dateLongue(iso: string) {
  const [a, m, j] = iso.split('-').map(Number);
  const d = new Date(a, (m || 1) - 1, j || 1);
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export const MOIS = ['Janv.', 'Févr.', 'Mars', 'Avr.', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'];

export const variation = (a: number, b: number) => (Math.abs(a) < 1e-9 ? null : (b - a) / Math.abs(a));
