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
  'bellegrange',
  'mesnil-sorel',
  'trois-bornes',
  'relais-des-drailles',
  'selune',
  'kervallon',
  'crins-de-traverse',
  'bois-ricard',
  'orbe-evenements',
  'campus-broceliande',
  'cercle-champdieu',
  'hautes-ferrieres',
  'hersia',
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
  { id: 'polyvalent', libelle: 'Complexe polyvalent', groupe: 'Enseignement et loisirs' },
  { id: 'pension', libelle: 'Écurie de propriétaires', groupe: 'Pensions et sport' },
  { id: 'sport', libelle: 'Écurie de compétition', groupe: 'Pensions et sport' },
  { id: 'courses', libelle: 'Courses hippiques', groupe: 'Pensions et sport' },
  { id: 'elevage', libelle: 'Haras et élevage', groupe: 'Élevage et commerce' },
  { id: 'valorisation', libelle: 'Valorisation', groupe: 'Élevage et commerce' },
  { id: 'tourisme', libelle: 'Tourisme équestre', groupe: 'Tourisme et événements' },
  { id: 'hotellerie', libelle: 'Domaine hôtelier', groupe: 'Tourisme et événements' },
  { id: 'evenementiel', libelle: 'Événementiel', groupe: 'Tourisme et événements' },
  { id: 'mediation', libelle: 'Médiation équine', groupe: 'Accompagnement et formation' },
  { id: 'formation', libelle: 'Formation professionnelle', groupe: 'Accompagnement et formation' },
  { id: 'services', libelle: 'Services aux établissements', groupe: 'Accompagnement et formation' },
];
