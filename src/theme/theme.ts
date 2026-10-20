import type { CSSProperties } from 'react';
import type { PoliceTexte, PoliceTitre, Theme } from '../types';

export const POLICES_TITRE: Record<PoliceTitre, string> = {
  cormorant: "'Cormorant Garamond', Georgia, serif",
  playfair: "'Playfair Display', Georgia, serif",
  baskerville: "'Libre Baskerville', Georgia, serif",
  fraunces: "'Fraunces Variable', Georgia, serif",
  dmserif: "'DM Serif Display', Georgia, serif",
  bodoni: "'Bodoni Moda', Didot, Georgia, serif",
  lora: "'Lora Variable', Georgia, serif",
  jost: "'Jost Variable', 'Helvetica Neue', Arial, sans-serif",
  manrope: "'Manrope Variable', 'Helvetica Neue', Arial, sans-serif",
  plex: "'IBM Plex Sans', 'Helvetica Neue', Arial, sans-serif",
};

export const POLICES_TEXTE: Record<PoliceTexte, string> = {
  inter: "'Inter Variable', 'Helvetica Neue', Arial, sans-serif",
  manrope: "'Manrope Variable', 'Helvetica Neue', Arial, sans-serif",
  jost: "'Jost Variable', 'Helvetica Neue', Arial, sans-serif",
  plex: "'IBM Plex Sans', 'Helvetica Neue', Arial, sans-serif",
};

/** Correction optique : certaines polices de titre paraissent plus grandes que d'autres. */
const ECHELLE_TITRE: Partial<Record<PoliceTitre, number>> = { cormorant: 1.12, baskerville: 0.9, bodoni: 1.02, jost: 0.94, manrope: 0.9, plex: 0.9 };

/** Identité de la plateforme (accueil, pages générales). */
export const THEME_PLATEFORME: Theme = {
  primaire: '#14231c',
  accent: '#9a7b45',
  fond: '#f5f1e8',
  fondAlt: '#ebe5d8',
  encre: '#1b2620',
  attenue: '#5b6660',
  surPrimaire: '#f5f1e8',
  policeTitre: 'cormorant',
  policeTexte: 'inter',
  graphique: ['#2f5d4a', '#b08a4a', '#7d9c8c', '#5b4636', '#c9b48a'],
};

/**
 * Palette des séries de données, commune à tous les établissements.
 * Validée (bande de luminosité, saturation minimale, séparation pour les daltonismes protan/deutan,
 * écart en vision normale) sur les fonds clairs des thèmes. L'identité de chaque établissement
 * passe par ses couleurs d'interface et sa typographie, pas par les couleurs des données.
 */
export const PALETTE_DONNEES = ['#2f6db5', '#d0662f', '#1f9d73', '#c98f00', '#b5578a'] as const;

export function variablesTheme(t: Theme): CSSProperties {
  return {
    '--c-primaire': t.primaire,
    '--c-accent': t.accent,
    '--c-fond': t.fond,
    '--c-fond-alt': t.fondAlt,
    '--c-encre': t.encre,
    '--c-attenue': t.attenue,
    '--c-sur-primaire': t.surPrimaire,
    '--f-titre': POLICES_TITRE[t.policeTitre],
    '--f-texte': POLICES_TEXTE[t.policeTexte],
    '--titre-echelle': String(ECHELLE_TITRE[t.policeTitre] ?? 1),
    '--titre-casse': t.titresMajuscules ? 'uppercase' : 'none',
    '--g1': PALETTE_DONNEES[0],
    '--g2': PALETTE_DONNEES[1],
    '--g3': PALETTE_DONNEES[2],
    '--g4': PALETTE_DONNEES[3],
    '--g5': PALETTE_DONNEES[4],
  } as CSSProperties;
}
