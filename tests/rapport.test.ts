/**
 * Rapport de calibrage d'un établissement (outil d'auteur, non bloquant).
 * Usage : RAPPORT=clos-des-tilleuls npx vitest run tests/rapport.test.ts
 */
import { it } from 'vitest';
import { ETABLISSEMENTS } from '../src/data/registry';
import { analytique, construireEtats } from '../src/finance/engine';
import { evaluer } from '../src/finance/indicateurs';
import { parametresInitiaux, simuler } from '../src/finance/investment';
import { EXERCICES } from '../src/types';

const cible = process.env.RAPPORT;

it.skipIf(!cible)('rapport', () => {
  for (const etab of ETABLISSEMENTS.filter((x) => !cible || x.id === cible)) {
    const e = construireEtats(etab);
    const r = (v: number | null) => (v === null ? 'n.s.' : Math.abs(v) < 10 ? v.toFixed(3) : Math.round(v).toLocaleString('fr-FR'));
    const ids = ['ca', 'croissanceCA', 'productionExercice', 'va', 'ebe', 'tauxEBE', 're', 'rn', 'caf', 'poidsPersonnel', 'poidsApprovisionnements', 'capitauxPropres', 'endettement', 'capaciteRemboursement', 'tauxAnnuites', 'fr', 'bfr', 'tn', 'tresorerieJours'];
    const lignes = [`\n=== ${etab.nom} (${etab.id}) ===`];
    lignes.push(['indicateur', ...EXERCICES].join(' | '));
    for (const id of ids) lignes.push([id, ...EXERCICES.map((an) => r(evaluer(e, id, an)))].join(' | '));
    lignes.push(['IS', ...EXERCICES.map((an) => r(e.cr[an].impotSocietes))].join(' | '));
    lignes.push(['réserves ouverture', r(e.bilans[2022].reserves), 'CP ouverture', r(e.bilans[2022].capitauxPropres)].join(' '));
    for (const p of etab.activites.prestations)
      if (p.capaciteAnnuelle) lignes.push(`occupation ${p.id}: ${EXERCICES.map((an) => r(evaluer(e, 'occupation:' + p.id, an))).join(' / ')}`);
    const t = e.tresorerie[2025];
    lignes.push('tréso 2025 cumul: ' + t.cumul.map((x) => Math.round(x)).join(' '));
    const a = analytique(e);
    if (a) for (const s of a.sections) lignes.push(`section ${s.id}: produits ${r(s.produits)} directs ${r(s.chargesDirectes)} indirects ${r(s.chargesIndirectes)} résultat ${r(s.resultat)} coût unitaire ${r(s.uniteOeuvre?.coutUnitaire ?? null)}`);
    for (const p of etab.projets)
      for (const sc of ['prudent', 'central', 'favorable'] as const) {
        const s = simuler(p, parametresInitiaux(p, sc));
        lignes.push(`projet ${p.id} ${sc}: VAN ${r(s.van)} TRI ${r(s.tri)} DR ${r(s.delaiRecuperation)} tréso cumulée fin ${r(s.annees.at(-1)!.tresorerieCumulee)}`);
      }
    console.log(lignes.join('\n'));
  }
});
