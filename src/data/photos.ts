import brut from './photos.json';

export interface Photo {
  cle: string;
  unsplashId: string;
  page: string;
  auteur: string;
  licence: string;
  licenceVerifiee: boolean;
  alt: string;
  remarque?: string;
}

export const PHOTOS: Photo[] = brut as Photo[];
const index = new Map(PHOTOS.map((p) => [p.cle, p]));
export const photo = (cle: string) => index.get(cle);

const base = import.meta.env.BASE_URL;
/** Fichier optimisé local (généré par scripts/fetch-photos.mjs lors de la publication). */
export const urlLocale = (cle: string, largeur: 800 | 1600) => `${base}photos/${cle}-${largeur}.webp`;
/** Repli : téléchargement direct depuis Unsplash si le fichier local est absent. */
export const urlDistante = (p: Photo, largeur = 1600) => `https://unsplash.com/photos/${p.unsplashId}/download?force=true&w=${largeur}`;
