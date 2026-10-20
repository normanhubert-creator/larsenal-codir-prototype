import type { Etablissement } from '../types';
import { INDICATEURS } from '../finance/indicateurs';
import type { Travail, QuadrantSwot } from './travaux';

export const QUADRANTS: { id: QuadrantSwot; titre: string; sous: string; couleur: string }[] = [
  { id: 'forces', titre: 'Forces', sous: 'Interne · favorable', couleur: 'var(--g1)' },
  { id: 'faiblesses', titre: 'Faiblesses', sous: 'Interne · défavorable', couleur: 'var(--g2)' },
  { id: 'opportunites', titre: 'Opportunités', sous: 'Externe · favorable', couleur: 'var(--g3)' },
  { id: 'menaces', titre: 'Menaces', sous: 'Externe · défavorable', couleur: 'var(--g4)' },
];

export const SECTIONS_M2 = [
  { id: 'activite', titre: 'Activité et rentabilité', aide: 'Évolution du chiffre d’affaires, de la valeur ajoutée, de l’EBE et du résultat. Facteurs explicatifs.' },
  { id: 'structure', titre: 'Structure financière et endettement', aide: 'Capitaux propres, endettement, capacité de remboursement, poids des annuités.' },
  { id: 'tresorerie', titre: 'Besoin en fonds de roulement et trésorerie', aide: 'Équilibre FR, BFR, trésorerie ; saisonnalité ; points bas.' },
  { id: 'activites', titre: 'Rentabilité des activités', aide: 'Lecture des coûts complets et des marges par activité ; discussion des conventions de répartition.' },
  { id: 'risques', titre: 'Risques et points de vigilance', aide: 'Dépendances, fragilités, hypothèses du budget 2026.' },
  { id: 'conclusion', titre: 'Capacité de développement et conclusion', aide: 'Ce que l’entreprise peut financer, à quelles conditions.' },
];

export const SECTIONS_M3 = [
  { id: 'proposition', titre: 'Projet proposé et justification', aide: 'Quel projet, pourquoi, en réponse à quel constat des missions 1 et 2 ?' },
  { id: 'financement', titre: 'Plan de financement et effets financiers', aide: 'Apport, emprunt, subvention ; effets sur le résultat, la CAF, la trésorerie et l’endettement.' },
  { id: 'risques', titre: 'Risques, sensibilité et conditions', aide: 'Que se passe-t-il dans le scénario prudent ? Quelles conditions de réussite ?' },
  { id: 'recommandation', titre: 'Recommandation', aide: 'Décision proposée à la direction et calendrier.' },
];

export const SECTIONS_M4 = [
  { id: 'objectifs', titre: 'Objectifs commerciaux', aide: 'Objectifs chiffrés et datés.' },
  { id: 'cible', titre: 'Publics cibles', aide: 'Segments visés et justification.' },
  { id: 'offre', titre: 'Offre et positionnement', aide: 'Prestations, prix, expérience client, fidélisation.' },
  { id: 'calendrier', titre: 'Calendrier et moyens', aide: 'Étapes, moyens humains, cavalerie, installations.' },
];

export const SECTIONS_M5 = [
  { id: 'recommandation', titre: 'Recommandation', aide: 'Option retenue, en une phrase, puis ses modalités.' },
  { id: 'economique', titre: 'Performance économique', aide: 'Effets chiffrés sur le chiffre d’affaires, les marges, la trésorerie.' },
  { id: 'faisabilite', titre: 'Faisabilité opérationnelle', aide: 'Équipe, installations, calendrier, compétences.' },
  { id: 'service', titre: 'Qualité de service', aide: 'Effets sur les clients, l’image, la fidélité.' },
  { id: 'bienetre', titre: 'Bien-être équin', aide: 'Charge de travail des équidés, conditions de vie, soins.' },
  { id: 'risques', titre: 'Risques et conditions de réussite', aide: 'Ce qui pourrait faire échouer la recommandation et comment le prévenir.' },
];

export const CRITERES_M5 = [
  { id: 'economique', libelle: 'Performance économique' },
  { id: 'faisabilite', libelle: 'Faisabilité opérationnelle' },
  { id: 'service', libelle: 'Qualité de service' },
  { id: 'bienetre', libelle: 'Bien-être équin' },
];

export const AUTOEVALUATION: Record<number, string[]> = {
  1: [
    'Chaque observation importante est appuyée sur au moins une pièce du dossier.',
    'Les faits établis sont distingués des hypothèses.',
    'Les facteurs internes et externes ne sont pas confondus.',
    'Les priorités découlent logiquement du diagnostic.',
    'La synthèse est lisible en une page par la direction.',
  ],
  2: [
    'Les indicateurs retenus sont adaptés au modèle économique et au statut de l’établissement.',
    'Les évolutions sont chiffrées et expliquées, pas seulement décrites.',
    'Résultat, CAF et trésorerie ne sont jamais confondus.',
    'La lecture des coûts par activité discute les conventions de répartition.',
    'La conclusion hiérarchise les constats.',
  ],
  3: [
    'Le projet répond à un constat des missions 1 et 2.',
    'Les trois scénarios ont été comparés et commentés.',
    'Le plan de financement est équilibré et soutenable.',
    'Les effets sur la trésorerie sont distingués des effets sur le résultat.',
    'Les contraintes opérationnelles et le bien-être équin sont traités.',
  ],
  4: [
    'Les publics cibles sont définis et justifiés par les données clients.',
    'Chaque action a un coût, une échéance et un responsable.',
    'Le budget est compatible avec les moyens de l’établissement.',
    'Les indicateurs de résultat sont mesurables.',
    'La capacité de l’équipe, des installations et de la cavalerie est vérifiée.',
  ],
  5: [
    'Les options sont comparées selon des critères explicites.',
    'La recommandation est chiffrée.',
    'La faisabilité opérationnelle est démontrée.',
    'La qualité de service et le bien-être équin sont pris en compte.',
    'Les risques et conditions de réussite sont identifiés.',
  ],
};

const bloc = (titre: string, texte?: string) => (texte && texte.trim() ? `### ${titre}\n\n${texte.trim()}\n\n` : '');

export function versMarkdown(etab: Etablissement, t: Travail): string {
  const doc = (id: string) => etab.documents.find((d) => d.id === id)?.titre ?? etab.documentsAuto.find((d) => d.id === id)?.titre ?? id;
  let md = `# ${etab.nom} : travaux de mission\n\n`;
  md += `Plateforme ÉQUIDÉCISION · export du ${new Date().toLocaleString('fr-FR')} · dernière modification ${new Date(t.majLe).toLocaleString('fr-FR')}\n\n`;
  md += `> Établissement fictif à vocation pédagogique.\n\n`;

  md += `## Mission 1 · Diagnostic stratégique\n\n`;
  for (const q of QUADRANTS) {
    const items = t.m1.swot[q.id];
    md += `### ${q.titre}\n\n`;
    if (!items.length) md += `_Aucune observation._\n\n`;
    for (const it of items) {
      md += `- **${it.texte}** (${it.statut === 'etabli' ? 'établi' : 'hypothèse'}, importance ${it.importance}/3)`;
      if (it.preuves.length) md += ` · preuves : ${it.preuves.map(doc).join(' ; ')}`;
      if (it.justification) md += `\n  ${it.justification}`;
      md += `\n`;
    }
    md += `\n`;
  }
  md += bloc('Diagnostic interne', t.m1.interne);
  md += bloc('Diagnostic externe', t.m1.externe);
  md += bloc('Synthèse des enjeux', t.m1.enjeux);
  if (t.m1.priorites.length) md += `### Priorités\n\n${t.m1.priorites.map((p, i) => `${i + 1}. ${p}`).join('\n')}\n\n`;

  md += `## Mission 2 · Diagnostic financier\n\n`;
  if (t.m2.indicateurs.length) {
    md += `### Indicateurs retenus\n\n`;
    for (const id of t.m2.indicateurs) {
      const d = INDICATEURS.find((i) => i.id === id);
      md += `- ${d?.libelle ?? id}${t.m2.commentairesIndicateurs[id] ? ` : ${t.m2.commentairesIndicateurs[id]}` : ''}\n`;
    }
    md += `\n`;
  }
  for (const s of SECTIONS_M2) md += bloc(s.titre, t.m2.sections[s.id]);

  md += `## Mission 3 · Investissement et développement\n\n`;
  const projet = etab.projets.find((p) => p.id === t.m3.projetId);
  if (projet) md += `Projet étudié : **${projet.titre}**\n\n`;
  const sim = t.simulations.find((s) => s.id === t.m3.simulationRetenue);
  if (sim) {
    md += `Simulation retenue : ${sim.nom} (scénario ${sim.parametres.scenario}) · investissement ${Math.round(sim.synthese.montant).toLocaleString('fr-FR')} € · VAN ${Math.round(sim.synthese.van).toLocaleString('fr-FR')} € · TRI ${sim.synthese.tri === null ? 'n.s.' : (sim.synthese.tri * 100).toFixed(1).replace('.', ',') + ' %'}\n\n`;
  }
  const liens = t.m3.liensDiagnostic
    .map((id) => QUADRANTS.flatMap((q) => t.m1.swot[q.id]).find((x) => x.id === id)?.texte)
    .filter(Boolean);
  if (liens.length) md += `Constats du diagnostic mobilisés :\n\n${liens.map((l) => `- ${l}`).join('\n')}\n\n`;
  for (const s of SECTIONS_M3) md += bloc(s.titre, t.m3.sections[s.id]);

  md += `## Mission 4 · Relation client et développement commercial\n\n`;
  for (const s of SECTIONS_M4) md += bloc(s.titre, t.m4.sections[s.id]);
  if (t.m4.actions.length) {
    md += `### Plan d'action\n\n| Action | Cible | Coût | Échéance | Responsable |\n|---|---|---|---|---|\n`;
    md += t.m4.actions.map((a) => `| ${a.action} | ${a.cible} | ${a.cout} | ${a.echeance} | ${a.responsable} |`).join('\n') + '\n\n';
  }
  if (t.m4.indicateurs.length) {
    md += `### Indicateurs de suivi\n\n| Indicateur | Valeur actuelle | Cible | Échéance |\n|---|---|---|---|\n`;
    md += t.m4.indicateurs.map((a) => `| ${a.indicateur} | ${a.actuel} | ${a.cible} | ${a.echeance} |`).join('\n') + '\n\n';
  }

  md += `## Mission 5 · Note de recommandation à la direction\n\n`;
  const m5 = etab.missions.find((m) => m.numero === 5);
  const opt = m5?.options?.find((o) => o.id === t.m5.optionRetenue);
  if (opt) md += `Option retenue : **${opt.titre}**\n\n`;
  if (Object.keys(t.m5.evaluations).length && m5?.options) {
    md += `| Option | ${CRITERES_M5.map((c) => c.libelle).join(' | ')} |\n|---|${CRITERES_M5.map(() => '---').join('|')}|\n`;
    for (const o of m5.options) md += `| ${o.titre} | ${CRITERES_M5.map((c) => t.m5.evaluations[o.id]?.[c.id] ?? '·').join(' | ')} |\n`;
    md += `\n`;
  }
  for (const s of SECTIONS_M5) md += bloc(s.titre, t.m5.sections[s.id]);
  return md;
}

export function telecharger(nom: string, contenu: string, type: string) {
  const blob = new Blob([contenu], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nom;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
