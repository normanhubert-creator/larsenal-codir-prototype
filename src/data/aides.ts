/**
 * Aides de saisie des données d'établissement.
 * Elles évitent les fautes de frappe dans les séries annuelles.
 */
import type { FinDAn, LigneMontant, ParAn } from '../types';

/** Série 2023, 2024, 2025, budget 2026. */
export const an = (a: number, b: number, c: number, d: number): ParAn => ({ 2023: a, 2024: b, 2025: c, 2026: d });
/** Même valeur sur les quatre exercices. */
export const constant = (x: number): ParAn => an(x, x, x, x);
/** Série de fin d'exercice : ouverture 31/12/2022 puis 2023 à 2026. */
export const fin = (o: number, a: number, b: number, c: number, d: number): FinDAn => ({ 2022: o, 2023: a, 2024: b, 2025: c, 2026: d });
/** Ligne de compte de résultat. */
export const ligne = (id: string, libelle: string, compte: string, montants: ParAn, commentaire?: string): LigneMontant => ({
  id,
  libelle,
  compte,
  montants,
  ...(commentaire ? { commentaire } : {}),
});
/** Série nulle. */
export const zero = (): ParAn => an(0, 0, 0, 0);
/** Saisonnalité uniforme. */
export const uniforme = () => Array(12).fill(1);
