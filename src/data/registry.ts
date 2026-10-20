import type { Etablissement, Famille } from '../types';

/**
 * Registre des établissements. Chaque fichier de src/data/etablissements/ exporte
 * par défaut un objet Etablissement ; il est détecté automatiquement.
 * Pour ajouter une entreprise : créer un nouveau fichier sur le modèle des existants.
 */
const modules = import.meta.glob<{ default: Etablissement }>('./etablissements/*.ts', { eager: true });

/** Ordre d'affichage dans la galerie (les identifiants absents sont ajoutés à la fin). */
const ORDRE = [
  'clos-des-tilleuls',
  'cercle-champdieu',
  'bellegrange',
  'trois-bornes',
  'bois-ricard',
  'mesnil-sorel',
  'relais-des-drailles',
  'hautes-ferrieres',
  'crins-de-traverse',
  'orbe-evenements',
];

export const ETABLISSEMENTS: Etablissement[] = Object.values(modules)
  .map((m) => m.default)
  .filter(Boolean)
  .sort((a, b) => {
    const ia = ORDRE.indexOf(a.id);
    const ib = ORDRE.indexOf(b.id);
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
  });

export const parId = (id: string) => ETABLISSEMENTS.find((e) => e.id === id);

export const FAMILLES: { id: Famille; libelle: string; groupe: string }[] = [
  { id: 'enseignement', libelle: 'Centre équestre', groupe: 'Enseignement et loisirs' },
  { id: 'associatif', libelle: 'Centre associatif', groupe: 'Enseignement et loisirs' },
  { id: 'pension', libelle: 'Écurie de propriétaires', groupe: 'Sport et pensions' },
  { id: 'sport', libelle: 'Écurie de compétition', groupe: 'Sport et pensions' },
  { id: 'courses', libelle: 'Courses hippiques', groupe: 'Sport et pensions' },
  { id: 'elevage', libelle: 'Haras et élevage', groupe: 'Élevage' },
  { id: 'tourisme', libelle: 'Tourisme équestre', groupe: 'Tourisme et événements' },
  { id: 'hotellerie', libelle: 'Domaine hôtelier', groupe: 'Tourisme et événements' },
  { id: 'evenementiel', libelle: 'Événementiel', groupe: 'Tourisme et événements' },
  { id: 'mediation', libelle: 'Médiation équine', groupe: 'Accompagnement' },
];
