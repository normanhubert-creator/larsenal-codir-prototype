import { useState } from 'react';
import { photo as trouver, urlDistante, urlLocale } from '../data/photos';

interface Props {
  cle: string;
  className?: string;
  /** Image principale chargée immédiatement (sinon chargement différé). */
  prioritaire?: boolean;
  sizes?: string;
  alt?: string;
  /** Point de cadrage CSS, ex. 'center 30%'. */
  cadrage?: string;
}

/**
 * Photographie avec chaîne de repli : fichier local optimisé (WebP 800/1600)
 * → téléchargement Unsplash → aplat de couleur du thème avec motif discret.
 */
export function Photo({ cle, className = '', prioritaire, sizes = '100vw', alt, cadrage }: Props) {
  const p = trouver(cle);
  const [etape, setEtape] = useState<0 | 1 | 2>(p ? 0 : 2);
  const texte = alt ?? p?.alt ?? '';
  if (!p || etape === 2) {
    return <div className={`photo photo--repli ${className}`} role="img" aria-label={texte || 'Illustration'} />;
  }
  const commun = {
    alt: texte,
    loading: prioritaire ? ('eager' as const) : ('lazy' as const),
    decoding: 'async' as const,
    style: cadrage ? { objectPosition: cadrage } : undefined,
    onError: () => setEtape((e) => (e === 0 ? 1 : 2)),
  };
  return (
    <div className={`photo ${className}`}>
      {etape === 0 ? (
        <img {...commun} src={urlLocale(cle, 1600)} srcSet={`${urlLocale(cle, 800)} 800w, ${urlLocale(cle, 1600)} 1600w`} sizes={sizes} />
      ) : (
        <img {...commun} src={urlDistante(p)} referrerPolicy="no-referrer" />
      )}
    </div>
  );
}

export function CreditPhoto({ cle }: { cle: string }) {
  const p = trouver(cle);
  if (!p) return null;
  return (
    <span className="credit-photo">
      Photo : {p.auteur.replace(' (à vérifier)', '')}, Unsplash (illustration)
    </span>
  );
}
