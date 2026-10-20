/**
 * Génération du dossier enseignant (corrigés chiffrés) dans enseignant-prive/ (ignoré par git).
 * Usage : GEN_ENSEIGNANT=1 npx vitest run tests/enseignant.gen.test.ts
 * Le dossier produit ne doit jamais être publié : le dépôt et le site sont publics.
 */
import { it } from 'vitest';
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { ETABLISSEMENTS } from '../src/data/registry';
import { analytique, construireEtats } from '../src/finance/engine';
import { INDICATEURS, evaluer } from '../src/finance/indicateurs';
import { parametresInitiaux, simuler } from '../src/finance/investment';
import { EXERCICES } from '../src/types';
import { selonFormat } from '../src/lib/format';

const actif = !!process.env.GEN_ENSEIGNANT;
const e0 = (n: number) => Math.round(n).toLocaleString('fr-FR') + ' €';

it.skipIf(!actif)('génère le dossier enseignant', () => {
  mkdirSync('enseignant-prive/etablissements', { recursive: true });
  const index: string[] = [];
  for (const etab of ETABLISSEMENTS) {
    const e = construireEtats(etab);
    const L: string[] = [];
    L.push(`# ${etab.nom} : éléments de correction chiffrés`, '');
    L.push(`> Document enseignant. Ne pas diffuser aux étudiants. Chiffres calculés par le moteur de la plateforme à partir des données du dossier.`, '');
    L.push(`**Modèle** : ${etab.libelleFamille}. ${etab.formeJuridique}. ${etab.finances.formeComptable}.`, '');
    L.push(`**Problématique** : ${etab.enjeux.join(' ')}`, '');

    L.push('## 1. Indicateurs de référence', '', '| Indicateur | 2023 | 2024 | 2025 | 2026 B |', '|---|---|---|---|---|');
    for (const d of INDICATEURS) L.push(`| ${d.libelle} | ${EXERCICES.map((an) => selonFormat(d.calcul(e, an), d.format)).join(' | ')} |`);
    L.push('');

    L.push('## 2. SIG et CAF', '', '| Solde | 2023 | 2024 | 2025 | 2026 B |', '|---|---|---|---|---|');
    const sig: [string, (an: (typeof EXERCICES)[number]) => number][] = [
      ['Marge commerciale', (an) => e.sig[an].margeCommerciale],
      ["Production de l'exercice", (an) => e.sig[an].productionExercice],
      ['Valeur ajoutée', (an) => e.sig[an].valeurAjoutee],
      ['EBE', (an) => e.sig[an].ebe],
      ["Résultat d'exploitation", (an) => e.sig[an].resultatExploitation],
      ['RCAI', (an) => e.sig[an].rcai],
      ['Résultat exceptionnel', (an) => e.sig[an].resultatExceptionnel],
      ['Résultat net', (an) => e.sig[an].resultatNet],
      ['CAF', (an) => e.caf[an].caf],
      ['Remboursement du capital', (an) => e.flux[an].remboursements],
      ['Variation du BFR', (an) => e.flux[an].variationBFR],
      ['Variation de trésorerie', (an) => e.flux[an].variationTresorerie],
    ];
    for (const [l, f] of sig) L.push(`| ${l} | ${EXERCICES.map((an) => e0(f(an))).join(' | ')} |`);
    L.push('');

    const t = e.tresorerie[2025];
    const min = Math.min(...t.cumul);
    L.push('## 3. Trésorerie', '', `Trésorerie nette fin 2024 : ${e0(t.ouverture)} ; point bas 2025 : ${e0(min)} (mois ${t.cumul.indexOf(min) + 1}) ; fin 2025 : ${e0(t.cumul[11])}. Point bas 2026 (budget) : ${e0(Math.min(...e.tresorerie[2026].cumul))}.`, '');

    const a = analytique(e);
    if (a) {
      L.push(`## 4. Coûts complets ${a.annee} (clés par défaut)`, '', '| Section | Produits | Coût complet | Résultat | Coût unitaire |', '|---|---|---|---|---|');
      for (const s of a.sections) L.push(`| ${s.nom} | ${e0(s.produits)} | ${e0(s.coutComplet)} | ${e0(s.resultat)} | ${s.uniteOeuvre?.coutUnitaire ? `${Math.round(s.uniteOeuvre.coutUnitaire).toLocaleString('fr-FR')} € / ${s.uniteOeuvre.libelle}` : ''} |`);
      L.push('', 'Sensibilité aux conventions (résultat par section si toutes les charges indirectes suivent une seule clé) :', '');
      for (const k of etab.finances.analytique!.cles) {
        const alt = analytique(e, k.id)!;
        L.push(`- ${k.nom} : ${alt.sections.map((s) => `${s.nom} ${e0(s.resultat)}`).join(' ; ')}`);
      }
      L.push('');
    }

    L.push('## 5. Contrôles de calcul de la mission 2 (réponses)', '');
    for (const m of etab.missions) for (const c of m.controles ?? []) L.push(`- ${c.question} → **${selonFormat(evaluer(e, c.indicateur, c.exercice), c.unite === '€/unité' ? '€/unité' : c.unite === 'x' ? 'x' : c.unite)}** (tolérance ${c.tolerance})`);
    L.push('');

    L.push('## 6. Projets d’investissement (paramètres du dossier)', '');
    for (const p of etab.projets) {
      L.push(`### ${p.titre}`, '', '| Scénario | Investissement | VAN | TRI | Délai de récupération | Trésorerie cumulée fin d’horizon |', '|---|---|---|---|---|---|');
      for (const sc of ['prudent', 'central', 'favorable'] as const) {
        const s = simuler(p, parametresInitiaux(p, sc));
        L.push(`| ${sc} | ${e0(s.montantInvestissement)} | ${e0(s.van)} | ${s.tri === null ? 'n.s.' : (s.tri * 100).toFixed(1) + ' %'} | ${s.delaiRecuperation === null ? '> horizon' : s.delaiRecuperation.toFixed(1) + ' ans'} | ${e0(s.annees.at(-1)!.tresorerieCumulee)} |`);
      }
      L.push('', `Points de vigilance du dossier : ${p.vigilance.join(' ; ')}`, '');
    }

    L.push('## 7. Missions : rappel des options et critères', '');
    for (const m of etab.missions) {
      L.push(`- **Mission ${m.numero} · ${m.titre}** : ${m.objectifs.join(' ; ')}.`);
      if (m.options) L.push(`  Options : ${m.options.map((o) => `${o.titre} (${o.description})`).join(' ; ')}`);
    }
    L.push('');

    const qualitatif = `enseignant-prive/qualitatif/${etab.id}.md`;
    if (existsSync(qualitatif)) L.push('## 8. Diagnostic attendu et pistes de correction', '', readFileSync(qualitatif, 'utf8'), '');

    writeFileSync(`enseignant-prive/etablissements/${etab.id}.md`, L.join('\n'));
    index.push(`- [${etab.nom}](etablissements/${etab.id}.md)`);
  }
  writeFileSync('enseignant-prive/README.md', ['# Dossier enseignant ÉQUIDÉCISION', '', '> Confidentiel : ne pas publier ni déposer dans le dépôt public.', '', ...index, '', 'Voir aussi GRILLE-EVALUATION.md et INTENTIONS.md.'].join('\n'));
});
