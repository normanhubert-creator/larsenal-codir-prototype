/**
 * Sauvegarde locale des travaux étudiants, séparée par établissement.
 * Aucune donnée n'est transmise à un serveur ; le navigateur conserve les travaux
 * tant que l'utilisateur ne vide pas ses données de navigation.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ParametresSimulation } from '../finance/investment';

export const VERSION_SAUVEGARDE = 1;
const prefixe = 'equidecision:v1:';

export type QuadrantSwot = 'forces' | 'faiblesses' | 'opportunites' | 'menaces';

export interface ObservationSwot {
  id: string;
  texte: string;
  statut: 'etabli' | 'hypothese';
  importance: 1 | 2 | 3;
  preuves: string[];
  justification: string;
}

export interface SimulationSauvee {
  id: string;
  nom: string;
  projetId: string;
  parametres: ParametresSimulation;
  enregistreLe: string;
  synthese: { van: number; tri: number | null; montant: number; delai: number | null };
}

export interface Travail {
  version: number;
  etabId: string;
  majLe: string;
  m1: {
    swot: Record<QuadrantSwot, ObservationSwot[]>;
    interne: string;
    externe: string;
    enjeux: string;
    priorites: string[];
  };
  m2: {
    indicateurs: string[];
    commentairesIndicateurs: Record<string, string>;
    sections: Record<string, string>;
    controles: Record<string, string>;
  };
  m3: {
    projetId: string;
    simulationRetenue: string;
    liensDiagnostic: string[];
    sections: Record<string, string>;
  };
  m4: {
    sections: Record<string, string>;
    actions: { id: string; action: string; cible: string; cout: string; echeance: string; responsable: string }[];
    indicateurs: { id: string; indicateur: string; actuel: string; cible: string; echeance: string }[];
  };
  m5: {
    optionRetenue: string;
    evaluations: Record<string, Record<string, number>>;
    commentairesOptions: Record<string, string>;
    sections: Record<string, string>;
  };
  autoevaluation: Record<string, boolean>;
  terminees: number[];
  simulations: SimulationSauvee[];
}

export function travailVide(etabId: string): Travail {
  return {
    version: VERSION_SAUVEGARDE,
    etabId,
    majLe: new Date().toISOString(),
    m1: { swot: { forces: [], faiblesses: [], opportunites: [], menaces: [] }, interne: '', externe: '', enjeux: '', priorites: [] },
    m2: { indicateurs: [], commentairesIndicateurs: {}, sections: {}, controles: {} },
    m3: { projetId: '', simulationRetenue: '', liensDiagnostic: [], sections: {} },
    m4: { sections: {}, actions: [], indicateurs: [] },
    m5: { optionRetenue: '', evaluations: {}, commentairesOptions: {}, sections: {} },
    autoevaluation: {},
    terminees: [],
    simulations: [],
  };
}

/** Fusion défensive : une sauvegarde ancienne ou partielle est complétée par les valeurs vides. */
export function normaliser(etabId: string, brut: unknown): Travail {
  const v = travailVide(etabId);
  if (!brut || typeof brut !== 'object') return v;
  const b = brut as Partial<Travail>;
  return {
    ...v,
    ...b,
    etabId,
    m1: { ...v.m1, ...(b.m1 ?? {}), swot: { ...v.m1.swot, ...(b.m1?.swot ?? {}) } },
    m2: { ...v.m2, ...(b.m2 ?? {}) },
    m3: { ...v.m3, ...(b.m3 ?? {}) },
    m4: { ...v.m4, ...(b.m4 ?? {}) },
    m5: { ...v.m5, ...(b.m5 ?? {}) },
    autoevaluation: { ...(b.autoevaluation ?? {}) },
    terminees: Array.isArray(b.terminees) ? b.terminees : [],
    simulations: Array.isArray(b.simulations) ? b.simulations : [],
  };
}

export function lire(etabId: string): { travail: Travail; disponible: boolean } {
  try {
    const s = window.localStorage.getItem(prefixe + etabId);
    return { travail: s ? normaliser(etabId, JSON.parse(s)) : travailVide(etabId), disponible: true };
  } catch {
    return { travail: travailVide(etabId), disponible: false };
  }
}

export function ecrire(t: Travail): boolean {
  try {
    window.localStorage.setItem(prefixe + t.etabId, JSON.stringify(t));
    return true;
  } catch {
    return false;
  }
}

export function effacer(etabId: string) {
  try {
    window.localStorage.removeItem(prefixe + etabId);
  } catch {
    /* stockage indisponible */
  }
}

/** Liste des établissements pour lesquels un travail existe dans ce navigateur. */
export function etablissementsAvecTravaux(): string[] {
  try {
    const ids: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k?.startsWith(prefixe)) ids.push(k.slice(prefixe.length));
    }
    return ids;
  } catch {
    return [];
  }
}

export const nouvelId = () => Math.random().toString(36).slice(2, 10);

type Abonne = (t: Travail) => void;
const abonnes = new Map<string, Set<Abonne>>();
const memoire = new Map<string, Travail>();

/**
 * Accès partagé au travail d'un établissement, avec sauvegarde automatique différée.
 * Tous les composants abonnés au même établissement voient le même état.
 */
export function useTravail(etabId: string) {
  const [travail, setTravail] = useState<Travail>(() => {
    const m = memoire.get(etabId);
    if (m) return m;
    const t = lire(etabId).travail;
    memoire.set(etabId, t);
    return t;
  });
  const [etat, setEtat] = useState<'ok' | 'erreur' | 'attente'>(() => (lire(etabId).disponible ? 'ok' : 'erreur'));
  const minuteur = useRef<number>();

  useEffect(() => {
    const m = memoire.get(etabId) ?? lire(etabId).travail;
    memoire.set(etabId, m);
    setTravail(m);
    const set = abonnes.get(etabId) ?? new Set();
    const cb: Abonne = (t) => setTravail(t);
    set.add(cb);
    abonnes.set(etabId, set);
    return () => {
      set.delete(cb);
    };
  }, [etabId]);

  const modifier = useCallback(
    (f: (t: Travail) => Travail) => {
      const actuel = memoire.get(etabId) ?? travailVide(etabId);
      const suivant = { ...f(actuel), majLe: new Date().toISOString() };
      memoire.set(etabId, suivant);
      abonnes.get(etabId)?.forEach((cb) => cb(suivant));
      setEtat('attente');
      window.clearTimeout(minuteur.current);
      minuteur.current = window.setTimeout(() => setEtat(ecrire(suivant) ? 'ok' : 'erreur'), 450);
    },
    [etabId],
  );

  const remplacer = useCallback(
    (t: Travail) => {
      memoire.set(etabId, t);
      abonnes.get(etabId)?.forEach((cb) => cb(t));
      setEtat(ecrire(t) ? 'ok' : 'erreur');
    },
    [etabId],
  );

  const reinitialiser = useCallback(() => {
    effacer(etabId);
    const v = travailVide(etabId);
    memoire.set(etabId, v);
    abonnes.get(etabId)?.forEach((cb) => cb(v));
    setEtat('ok');
  }, [etabId]);

  return { travail, modifier, remplacer, reinitialiser, etat };
}

// ---------------------------------------------------------------------------
// Avancement
// ---------------------------------------------------------------------------

const rempli = (s?: string) => !!s && s.trim().length >= 20;

export function avancement(t: Travail, numero: number): number {
  const parts: boolean[] = [];
  switch (numero) {
    case 1: {
      const q = t.m1.swot;
      parts.push(q.forces.length > 0, q.faiblesses.length > 0, q.opportunites.length > 0, q.menaces.length > 0);
      parts.push(rempli(t.m1.interne), rempli(t.m1.externe), rempli(t.m1.enjeux), t.m1.priorites.length > 0);
      break;
    }
    case 2:
      parts.push(t.m2.indicateurs.length >= 4);
      for (const k of ['activite', 'structure', 'tresorerie', 'activites', 'risques', 'conclusion']) parts.push(rempli(t.m2.sections[k]));
      parts.push(Object.keys(t.m2.controles).length > 0);
      break;
    case 3:
      parts.push(!!t.m3.projetId, !!t.m3.simulationRetenue, t.m3.liensDiagnostic.length > 0);
      for (const k of ['proposition', 'financement', 'risques', 'recommandation']) parts.push(rempli(t.m3.sections[k]));
      break;
    case 4:
      for (const k of ['objectifs', 'cible', 'offre', 'calendrier']) parts.push(rempli(t.m4.sections[k]));
      parts.push(t.m4.actions.length >= 2, t.m4.indicateurs.length >= 2);
      break;
    case 5:
      parts.push(!!t.m5.optionRetenue, Object.keys(t.m5.evaluations).length >= 2);
      for (const k of ['recommandation', 'economique', 'faisabilite', 'service', 'bienetre', 'risques']) parts.push(rempli(t.m5.sections[k]));
      break;
  }
  if (!parts.length) return 0;
  return parts.filter(Boolean).length / parts.length;
}
