import { useId, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Photo } from './Photo';

export function EnteteRubrique({ surtitre, titre, texte, photo }: { surtitre: string; titre: string; texte?: string; photo?: string }) {
  return (
    <header className={`entete-rubrique ${photo ? '' : 'entete-rubrique--sans-photo'}`}>
      <div className="entete-rubrique__texte">
        <span className="surtitre">{surtitre}</span>
        <h1>{titre}</h1>
        {texte && <p>{texte}</p>}
      </div>
      {photo && <Photo cle={photo} prioritaire sizes="(max-width: 820px) 100vw, 45vw" />}
    </header>
  );
}

export function FilAriane({ elements }: { elements: { libelle: string; vers?: string }[] }) {
  return (
    <nav className="fil-ariane conteneur" aria-label="Fil d’Ariane">
      {elements.map((el, i) => (
        <span key={i} style={{ display: 'inline-flex', gap: 6 }}>
          {i > 0 && <span aria-hidden>/</span>}
          {el.vers ? <Link to={el.vers}>{el.libelle}</Link> : <span aria-current="page">{el.libelle}</span>}
        </span>
      ))}
    </nav>
  );
}

/** Bulle d'aide accessible (survol, focus clavier, clic tactile). */
export function Aide({ children, libelle = 'Aide' }: { children: ReactNode; libelle?: string }) {
  const [ouvert, setOuvert] = useState(false);
  const id = useId();
  return (
    <button
      type="button"
      className="aide"
      aria-label={libelle}
      aria-describedby={ouvert ? id : undefined}
      onMouseEnter={() => setOuvert(true)}
      onMouseLeave={() => setOuvert(false)}
      onFocus={() => setOuvert(true)}
      onBlur={() => setOuvert(false)}
      onClick={() => setOuvert((o) => !o)}
    >
      ?
      {ouvert && (
        <span role="tooltip" id={id} className="aide__bulle">
          {children}
        </span>
      )}
    </button>
  );
}

export function Section({ children, alt, sombre, id, etroit }: { children: ReactNode; alt?: boolean; sombre?: boolean; id?: string; etroit?: boolean }) {
  return (
    <section id={id} className={`section ${alt ? 'section--alt' : ''} ${sombre ? 'section--sombre' : ''} ancre-haut`}>
      <div className={`conteneur ${etroit ? 'conteneur--etroit' : ''}`}>{children}</div>
    </section>
  );
}

export function TitreSection({ surtitre, titre, children }: { surtitre?: string; titre: string; children?: ReactNode }) {
  return (
    <div style={{ marginBottom: 32, maxWidth: 760 }}>
      {surtitre && <span className="surtitre">{surtitre}</span>}
      <h2>{titre}</h2>
      {children && <div className="chapeau">{children}</div>}
    </div>
  );
}

const LIBELLES_ETAT: Record<string, string> = {
  excellent: 'Excellent état',
  bon: 'Bon état',
  correct: 'État correct',
  vieillissant: 'Vieillissant',
  'a-renover': 'À rénover',
};

export const BadgeEtat = ({ etat }: { etat: string }) => <span className={`badge badge--${etat}`}>{LIBELLES_ETAT[etat] ?? etat}</span>;

export function Jauge({ valeur, libelle }: { valeur: number; libelle?: string }) {
  const v = Math.max(0, Math.min(1, valeur));
  return (
    <div className="jauge" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(v * 100)} aria-label={libelle}>
      <span style={{ width: `${v * 100}%` }} />
    </div>
  );
}

export const AVERTISSEMENT =
  'Établissement fictif créé pour l’enseignement. Les personnes, entreprises, données et documents sont simulés ; les photographies sont illustratives et ne représentent aucun établissement réel.';
