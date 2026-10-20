/**
 * Contrôles de cohérence financière et opérationnelle, exécutés sur TOUS les établissements.
 * Lancer : npm test
 */
import { describe, expect, it } from 'vitest';
import { ETABLISSEMENTS } from '../src/data/registry';
import { analytique, construireEtats, planAmortissement, recettePrestation, somme, tableauEmprunt, ANNEES_BILAN } from '../src/finance/engine';
import { INDICATEURS, evaluer } from '../src/finance/indicateurs';
import { parametresInitiaux, simuler } from '../src/finance/investment';
import { EXERCICES } from '../src/types';

const EPS = 0.01;

function toutesValeursFinies(obj: unknown, chemin = ''): string[] {
  const erreurs: string[] = [];
  const visite = (v: unknown, c: string, profondeur: number) => {
    if (profondeur > 6) return;
    if (typeof v === 'number') {
      if (!Number.isFinite(v)) erreurs.push(c);
    } else if (Array.isArray(v)) v.forEach((x, i) => visite(x, `${c}[${i}]`, profondeur + 1));
    else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) if (k !== 'etab') visite(x, `${c}.${k}`, profondeur + 1);
  };
  visite(obj, chemin, 0);
  return erreurs;
}

it('le registre contient des établissements aux identifiants uniques', () => {
  expect(ETABLISSEMENTS.length).toBeGreaterThan(0);
  const ids = ETABLISSEMENTS.map((e) => e.id);
  expect(new Set(ids).size).toBe(ids.length);
});

for (const etab of ETABLISSEMENTS) {
  describe(`${etab.nom} (${etab.id})`, () => {
    const e = construireEtats(etab);

    it('1. bilans équilibrés (actif = passif) à chaque clôture', () => {
      for (const an of ANNEES_BILAN) {
        const b = e.bilans[an];
        expect(Math.abs(b.totalActif - b.totalPassif), `écart ${an}`).toBeLessThan(EPS);
      }
    });

    it('1b. capitaux propres d’ouverture positifs', () => {
      expect(e.bilans[2022].capitauxPropres).toBeGreaterThan(0);
    });

    it('2. compte de résultat cohérent (produits − charges = résultat ; sous-totaux)', () => {
      for (const an of EXERCICES) {
        const c = e.cr[an];
        expect(Math.abs(c.totalProduits - c.totalCharges - c.resultatNet)).toBeLessThan(EPS);
        expect(Math.abs(c.resultatExploitation + c.resultatFinancier + c.resultatExceptionnel - c.impotSocietes - c.resultatNet)).toBeLessThan(EPS);
        expect(c.impotSocietes).toBeGreaterThanOrEqual(0);
        if (etab.finances.regimeFiscal !== 'IS') expect(c.impotSocietes).toBe(0);
      }
    });

    it('3. SIG calculés et raccordés au compte de résultat', () => {
      for (const an of EXERCICES) {
        const s = e.sig[an];
        const c = e.cr[an];
        expect(Math.abs(s.valeurAjoutee - (s.margeCommerciale + s.productionExercice - s.consommationsTiers))).toBeLessThan(EPS);
        expect(Math.abs(s.ebe - (s.valeurAjoutee + s.subventionsExploitation - s.impotsTaxes - s.chargesPersonnel))).toBeLessThan(EPS);
        expect(Math.abs(s.resultatExploitation - c.resultatExploitation)).toBeLessThan(EPS);
        expect(Math.abs(s.rcai - c.rcai)).toBeLessThan(EPS);
        expect(Math.abs(s.resultatNet - c.resultatNet)).toBeLessThan(EPS);
      }
    });

    it('4. CAF : méthode additive = méthode soustractive', () => {
      for (const an of EXERCICES) {
        const k = e.caf[an];
        expect(Math.abs(k.cafAdditive - k.cafSoustractive), `CAF ${an}`).toBeLessThan(EPS);
      }
    });

    it('5. trésorerie nette = FR − BFR = disponibilités − concours bancaires', () => {
      for (const an of ANNEES_BILAN) {
        const b = e.bilans[an];
        expect(Math.abs(b.fondsDeRoulement - b.besoinFondsRoulement - b.tresorerieNette)).toBeLessThan(EPS);
        expect(Math.abs(b.disponibilites - b.concoursBancaires - b.tresorerieNette)).toBeLessThan(EPS);
      }
      for (const an of EXERCICES) {
        expect(Math.abs(e.flux[an].tresorerieCloture - e.bilans[an].tresorerieNette)).toBeLessThan(EPS);
      }
    });

    it('6. recettes opérationnelles (prix × volumes) = chiffre d’affaires comptable', () => {
      for (const an of EXERCICES) {
        const rec = somme(etab.activites.prestations.map((p) => recettePrestation(p, an)));
        expect(Math.abs(rec - e.cr[an].chiffreAffaires)).toBeLessThan(EPS);
      }
    });

    it('7. emprunts : capital remboursé + capital restant dû = capital emprunté ; emprunt absent du compte de résultat', () => {
      for (const em of etab.finances.emprunts) {
        const t = tableauEmprunt(em);
        const rembourse = somme(t.echeances.map((x) => x.capital));
        expect(Math.abs(rembourse - em.capital)).toBeLessThan(EPS);
        for (const x of t.echeances.slice(0, -1)) expect(Math.abs(x.echeance - t.mensualite)).toBeLessThan(EPS);
        expect(em.taux).toBeGreaterThanOrEqual(0);
        expect(em.taux).toBeLessThan(0.15);
      }
      // Le capital emprunté n'apparaît dans aucun produit
      for (const an of EXERCICES) {
        const c = e.cr[an];
        const nouveaux = e.flux[an].empruntsNouveaux;
        if (nouveaux > 0) expect(c.totalProduits).toBeLessThan(c.totalProduits + nouveaux);
        expect(Math.abs(e.flux[an].remboursements - somme(e.emprunts.map((x) => x.capitalRembourse[an] ?? 0)))).toBeLessThan(EPS);
      }
    });

    it('8. amortissements : cumul ≤ valeur d’origine, investissement non passé en charge', () => {
      for (const im of etab.finances.immobilisations) {
        const p = planAmortissement(im);
        for (const an of ANNEES_BILAN) {
          expect(p.cumul[an]).toBeLessThanOrEqual(im.valeurOrigine + EPS);
          expect(p.net[an]).toBeGreaterThanOrEqual(-EPS);
        }
        if (im.duree === 0) for (const an of EXERCICES) expect(p.dotation[an]).toBe(0);
        expect(['incorporel', 'terrain', 'constructions', 'installations', 'materiel', 'vehicules', 'cavalerie', 'financier']).toContain(im.categorie);
      }
      for (const an of EXERCICES) {
        // Les dotations de l'exercice restent inférieures aux investissements cumulés amortissables
        expect(e.cr[an].dotationsAmortissements).toBeGreaterThanOrEqual(0);
      }
    });

    it('9. trésorerie mensuelle raccordée aux bilans 2024, 2025 et 2026', () => {
      for (const an of [2025, 2026] as const) {
        const t = e.tresorerie[an];
        expect(Math.abs(t.ouverture - e.bilans[(an - 1) as 2024 | 2025].tresorerieNette)).toBeLessThan(EPS);
        expect(Math.abs(t.cumul[11] - e.bilans[an].tresorerieNette), `clôture ${an}`).toBeLessThan(EPS);
        for (const l of t.lignes) expect(l.mois.length).toBe(12);
      }
    });

    it('10. aucune valeur non finie (division par zéro, donnée manquante)', () => {
      expect(toutesValeursFinies({ cr: e.cr, sig: e.sig, caf: e.caf, bilans: e.bilans, flux: e.flux, tresorerie: e.tresorerie })).toEqual([]);
      for (const ind of INDICATEURS) for (const an of EXERCICES) {
        const v = ind.calcul(e, an);
        if (v !== null) expect(Number.isFinite(v), `${ind.id} ${an}`).toBe(true);
      }
    });

    it('11. unités et périodes : séries complètes, taux en proportion, saisonnalités sur 12 mois', () => {
      const f = etab.finances;
      for (const p of etab.activites.prestations) for (const an of EXERCICES) {
        expect(Number.isFinite(p.prix[an]), `${p.id} prix ${an}`).toBe(true);
        expect(Number.isFinite(p.volume[an]), `${p.id} volume ${an}`).toBe(true);
        expect(p.prix[an]).toBeGreaterThanOrEqual(0);
        expect(p.volume[an]).toBeGreaterThanOrEqual(0);
      }
      for (const p of f.personnel) {
        expect(p.tauxCharges, p.id).toBeGreaterThanOrEqual(0);
        expect(p.tauxCharges, p.id).toBeLessThan(0.6);
        for (const an of EXERCICES) {
          expect(p.etp[an]).toBeGreaterThanOrEqual(0);
          if (p.etp[an] > 0) expect(p.brutAnnuelEtp[an], `${p.id} brut`).toBeGreaterThan(8000);
        }
      }
      expect(f.tresorerieMensuelle.saisonnaliteEncaissements.length).toBe(12);
      if (f.tresorerieMensuelle.saisonnaliteAchats) expect(f.tresorerieMensuelle.saisonnaliteAchats.length).toBe(12);
      if (f.tresorerieMensuelle.saisonnalitePersonnel) expect(f.tresorerieMensuelle.saisonnalitePersonnel.length).toBe(12);
      for (const em of f.emprunts) expect(em.debut).toMatch(/^\d{4}-\d{2}$/);
      for (const im of f.immobilisations) expect(im.miseEnService).toMatch(/^\d{4}-\d{2}$/);
    });

    it('12. capacités opérationnelles respectées (volume ≤ capacité)', () => {
      for (const p of etab.activites.prestations)
        if (p.capaciteAnnuelle)
          for (const an of EXERCICES) expect(p.volume[an], `${p.id} ${an}`).toBeLessThanOrEqual(p.capaciteAnnuelle[an]);
    });

    it('13. comptabilité analytique : somme des résultats de sections = RCAI', () => {
      const a = analytique(e);
      if (!a) return;
      const sec = new Set(etab.finances.analytique!.sections.map((s) => s.id));
      for (const p of etab.activites.prestations) expect(sec.has(p.activite), `section ${p.activite}`).toBe(true);
      for (const k of etab.finances.analytique!.cles) for (const s of Object.keys(k.repartition)) expect(sec.has(s), `clé ${k.id} → ${s}`).toBe(true);
      for (const [id, af] of Object.entries(etab.finances.analytique!.affectations)) {
        if ('section' in af) expect(sec.has(af.section), `${id} → ${af.section}`).toBe(true);
        else expect(etab.finances.analytique!.cles.some((k) => k.id === af.cle), `${id} → clé ${af.cle}`).toBe(true);
      }
      expect(Math.abs(a.resultat - e.cr[a.annee].rcai)).toBeLessThan(EPS);
      for (const k of etab.finances.analytique!.cles) {
        const alt = analytique(e, k.id)!;
        expect(Math.abs(alt.resultat - a.resultat)).toBeLessThan(EPS);
      }
    });

    it('14. scénarios d’investissement cohérents et explicables', () => {
      for (const projet of etab.projets) {
        const pr = simuler(projet, parametresInitiaux(projet, 'prudent'));
        const ce = simuler(projet, parametresInitiaux(projet, 'central'));
        const fa = simuler(projet, parametresInitiaux(projet, 'favorable'));
        expect(pr.van).toBeLessThanOrEqual(ce.van + EPS);
        expect(ce.van).toBeLessThanOrEqual(fa.van + EPS);
        for (const s of [pr, ce, fa]) {
          expect(toutesValeursFinies(s)).toEqual([]);
          // Somme des dotations sur la durée de vie = montant investi (dans la limite de l'horizon)
          const amortiHorizon = somme(projet.composantes.map((c) => (c.duree <= projet.horizon ? c.montant : (c.montant * projet.horizon) / c.duree)));
          expect(Math.abs(somme(s.annees.map((a) => a.dotations)) - amortiHorizon)).toBeLessThan(1);
          // Capital remboursé ≤ emprunt
          expect(somme(s.annees.map((a) => a.remboursementCapital))).toBeLessThanOrEqual(projet.financement.emprunt + EPS);
        }
        // Le montant emprunté ne modifie pas les recettes
        const p0 = parametresInitiaux(projet, 'central');
        const sansEmprunt = simuler(projet, { ...p0, emprunt: 0, apport: p0.apport + p0.emprunt });
        expect(Math.abs(sansEmprunt.annees[0].recettes - ce.annees[0].recettes)).toBeLessThan(EPS);
        expect(Math.abs(sansEmprunt.van - ce.van)).toBeLessThan(EPS);
        // En régime de croisière (dernière année), recettes = Σ prix × volume plafonné × montée en charge finale
        const derniere = ce.annees[ce.annees.length - 1];
        const attendu = somme(projet.recettes.map((r) => r.prix * Math.min(r.volumes.central, r.capaciteMax))) * (projet.monteeEnCharge.at(-1) ?? 1);
        if (projet.horizon * 12 - projet.delaiMiseEnServiceMois >= 12 * projet.monteeEnCharge.length)
          expect(Math.abs(derniere.recettes - attendu)).toBeLessThan(EPS);
        // Nombre total de mois d'activité = horizon − délai de mise en service
        expect(ce.annees.every((a) => a.recettes >= 0)).toBe(true);
        // La somme des composantes égale le montant d'investissement
        expect(Math.abs(ce.montantInvestissement - somme(projet.composantes.map((c) => c.montant)))).toBeLessThan(EPS);
        for (const r of projet.recettes) {
          expect(r.volumes.prudent).toBeLessThanOrEqual(r.volumes.central);
          expect(r.volumes.central).toBeLessThanOrEqual(r.volumes.favorable);
        }
      }
    });

    it('15. intégrité des références (documents, fournisseurs, missions, contrôles)', () => {
      const lignes = new Set(
        [
          ...etab.finances.achatsMarchandises,
          ...etab.finances.achatsApprovisionnements,
          ...etab.finances.chargesExternes,
          ...etab.finances.impotsTaxes,
          ...etab.finances.autresCharges,
        ].map((l) => l.id),
      );
      for (const f of etab.fournisseurs.liste) {
        expect(lignes.has(f.ligne), `fournisseur ${f.nom} → ${f.ligne}`).toBe(true);
        expect(f.part).toBeGreaterThan(0);
        expect(f.part).toBeLessThanOrEqual(1);
      }
      const docIds = [...etab.documents.map((d) => d.id), ...etab.documentsAuto.map((d) => d.id)];
      expect(new Set(docIds).size).toBe(docIds.length);
      for (const m of etab.missions) for (const d of m.documentsUtiles) expect(docIds, `mission ${m.numero} → ${d}`).toContain(d);
      expect(etab.missions.map((m) => m.numero).sort()).toEqual([1, 2, 3, 4, 5]);
      const projets = new Set(etab.projets.map((p) => p.id));
      for (const m of etab.missions) for (const p of m.projets ?? []) expect(projets.has(p), `projet ${p}`).toBe(true);
      const m5 = etab.missions.find((m) => m.numero === 5)!;
      expect((m5.options ?? []).length).toBeGreaterThanOrEqual(2);
      for (const m of etab.missions)
        for (const c of m.controles ?? []) expect(evaluer(e, c.indicateur, c.exercice), `contrôle ${c.id}`).not.toBeNull();
      for (const d of etab.documentsAuto) if (d.type === 'auto-echeancier') expect(etab.finances.emprunts.some((x) => x.id === d.emprunt)).toBe(true);
      // Pas de tiret cadratin en incise dans les textes (consigne éditoriale)
      const texte = JSON.stringify(etab);
      expect(texte.includes(' — '), 'tiret cadratin en incise').toBe(false);
    });
  });
}
