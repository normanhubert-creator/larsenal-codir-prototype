import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { EtabCtx } from '../../contexte';
import { parId } from '../../data/registry';
import { etats } from '../../finance/engine';
import { variablesTheme } from '../../theme/theme';
import { Introuvable } from '../Introuvable';
import { AVERTISSEMENT } from '../../components/commun';
import { AccueilEtab } from './AccueilEtab';
import { Presentation, Installations, Cavalerie, Activites, Clients, Fournisseurs, RH, Environnement } from './Dossier';
import { Finances } from './Finances';
import { Documents, DocumentVue } from './Documents';
import { Missions, MissionVue } from '../missions/Missions';
import { Simulateur } from '../missions/Simulateur';
import { Travaux, Impression } from '../missions/Travaux';
import type { Etablissement } from '../../types';

export interface LienRubrique {
  chemin: string;
  libelle: string;
}

export function rubriquesDossier(etab: Etablissement): LienRubrique[] {
  return [
    { chemin: 'etablissement', libelle: 'Notre établissement' },
    { chemin: 'installations', libelle: 'Installations' },
    { chemin: 'cavalerie', libelle: etab.cavalerie ? 'Cavalerie' : etab.ressources?.titre ?? 'Ressources' },
    { chemin: 'activites', libelle: 'Activités et prestations' },
    { chemin: 'clients', libelle: 'Clients' },
    { chemin: 'fournisseurs', libelle: 'Fournisseurs et partenaires' },
    { chemin: 'rh', libelle: 'Équipe et organisation' },
    { chemin: 'environnement', libelle: 'Environnement et marché' },
  ];
}

function NavEtab({ etab, base, transparente }: { etab: Etablissement; base: string; transparente: boolean }) {
  const [defilee, setDefilee] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [menu, setMenu] = useState(false);
  const { pathname } = useLocation();
  const refMenu = useRef<HTMLDivElement>(null);
  const rubriques = rubriquesDossier(etab);
  const dossierActif = rubriques.some((r) => pathname.startsWith(`${base}/${r.chemin}`));

  useEffect(() => {
    const f = () => setDefilee(window.scrollY > 40);
    f();
    window.addEventListener('scroll', f, { passive: true });
    return () => window.removeEventListener('scroll', f);
  }, []);
  useEffect(() => {
    setMobile(false);
    setMenu(false);
  }, [pathname]);
  useEffect(() => {
    if (!menu) return;
    const clic = (ev: MouseEvent) => {
      if (refMenu.current && !refMenu.current.contains(ev.target as Node)) setMenu(false);
    };
    const touche = (ev: KeyboardEvent) => ev.key === 'Escape' && setMenu(false);
    document.addEventListener('mousedown', clic);
    document.addEventListener('keydown', touche);
    return () => {
      document.removeEventListener('mousedown', clic);
      document.removeEventListener('keydown', touche);
    };
  }, [menu]);

  return (
    <header className={`nav-etab ${transparente ? 'nav-etab--transparente' : ''} ${defilee ? 'nav-etab--defilee' : ''}`}>
      <div className="conteneur nav-etab__barre">
        <Link to={base} className="logo-etab" aria-label={`${etab.nom}, accueil de l’établissement`}>
          <span className="monogramme" aria-hidden>
            {etab.monogramme}
          </span>
          <span className="logo-etab__nom">
            {etab.nomCourt}
            <small>{etab.libelleFamille}</small>
          </span>
        </Link>
        <nav className="nav-etab__liens" aria-label="Rubriques de l’établissement">
          <NavLink to={base} end>
            Accueil
          </NavLink>
          <div className="menu" ref={refMenu}>
            <button aria-expanded={menu} aria-haspopup="true" onClick={() => setMenu((m) => !m)} className={dossierActif ? 'actif' : ''}>
              Dossier <span aria-hidden>▾</span>
            </button>
            {menu && (
              <div className="menu__panneau" role="menu">
                {rubriques.map((r) => (
                  <NavLink key={r.chemin} to={`${base}/${r.chemin}`} role="menuitem">
                    {r.libelle}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
          <NavLink to={`${base}/finances`}>Gestion et finances</NavLink>
          <NavLink to={`${base}/documents`}>Documents</NavLink>
          <NavLink to={`${base}/missions`}>Missions</NavLink>
          <NavLink to={`${base}/travaux`}>Mes travaux</NavLink>
          <Link to="/?galerie" className="lien-galerie">
            Galerie
          </Link>
        </nav>
        <button className="bouton-menu-mobile" aria-expanded={mobile} aria-controls="nav-mobile" onClick={() => setMobile((m) => !m)}>
          {mobile ? 'Fermer' : 'Menu'}
        </button>
      </div>
      <nav id="nav-mobile" className="nav-mobile" data-ouvert={mobile} aria-label="Rubriques (mobile)">
        <NavLink to={base} end>
          Accueil de l’établissement
        </NavLink>
        <span className="groupe">Dossier</span>
        {rubriques.map((r) => (
          <NavLink key={r.chemin} to={`${base}/${r.chemin}`}>
            {r.libelle}
          </NavLink>
        ))}
        <span className="groupe">Gestion et missions</span>
        <NavLink to={`${base}/finances`}>Gestion et finances</NavLink>
        <NavLink to={`${base}/documents`}>Documents</NavLink>
        <NavLink to={`${base}/missions`}>Missions</NavLink>
        <NavLink to={`${base}/simulateur`}>Simulateur d’investissement</NavLink>
        <NavLink to={`${base}/travaux`}>Mes travaux</NavLink>
        <Link to="/?galerie">Retour à la galerie</Link>
      </nav>
    </header>
  );
}

function PiedEtab({ etab }: { etab: Etablissement }) {
  return (
    <footer className="pied">
      <div className="conteneur pied__grille">
        <div>
          <div className="logo-etab" style={{ marginBottom: 14 }}>
            <span className="monogramme" aria-hidden>
              {etab.monogramme}
            </span>
            <span className="logo-etab__nom">{etab.nom}</span>
          </div>
          <p>
            {etab.lieu.commune}, {etab.lieu.departement}. {etab.formeJuridique}.
          </p>
          <p className="petit">{AVERTISSEMENT}</p>
        </div>
        <div>
          <h4>Plateforme</h4>
          <ul>
            <li><Link to="/?galerie">Tous les établissements</Link></li>
            <li><Link to="/methodologie">Méthodologie</Link></li>
            <li><Link to="/credits">Crédits photographiques</Link></li>
          </ul>
        </div>
        <div>
          <h4>ÉQUIDÉCISION</h4>
          <p className="petit">ESTHUA, Université d’Angers, campus de Saumur. Licence professionnelle Management des entreprises équestres.</p>
        </div>
      </div>
    </footer>
  );
}

export function EtablissementLayout() {
  const { id } = useParams();
  const etab = id ? parId(id) : undefined;
  const { pathname } = useLocation();
  const ctx = useMemo(() => (etab ? { etab, e: etats(etab), base: `/e/${etab.id}` } : null), [etab]);
  useEffect(() => {
    if (etab) document.title = `${etab.nom} · ÉQUIDÉCISION`;
    return () => {
      document.title = 'ÉQUIDÉCISION · Laboratoire de management des établissements équestres';
    };
  }, [etab]);
  if (!etab || !ctx) return <Introuvable />;
  const accueil = pathname === ctx.base || pathname === `${ctx.base}/`;
  const impression = pathname.endsWith('/impression');

  return (
    <EtabCtx.Provider value={ctx}>
      <div style={variablesTheme(etab.theme)} className="etab">
        {!impression && <NavEtab etab={etab} base={ctx.base} transparente={accueil} />}
        <main id="contenu">
          <Routes>
            <Route index element={<AccueilEtab />} />
            <Route path="etablissement" element={<Presentation />} />
            <Route path="installations" element={<Installations />} />
            <Route path="cavalerie" element={<Cavalerie />} />
            <Route path="activites" element={<Activites />} />
            <Route path="clients" element={<Clients />} />
            <Route path="fournisseurs" element={<Fournisseurs />} />
            <Route path="rh" element={<RH />} />
            <Route path="environnement" element={<Environnement />} />
            <Route path="finances" element={<Finances />} />
            <Route path="finances/:vue" element={<Finances />} />
            <Route path="documents" element={<Documents />} />
            <Route path="documents/:docId" element={<DocumentVue />} />
            <Route path="missions" element={<Missions />} />
            <Route path="missions/:num" element={<MissionVue />} />
            <Route path="simulateur" element={<Simulateur />} />
            <Route path="simulateur/:projetId" element={<Simulateur />} />
            <Route path="travaux" element={<Travaux />} />
            <Route path="impression" element={<Impression />} />
            <Route path="*" element={<Introuvable />} />
          </Routes>
        </main>
        {!impression && <PiedEtab etab={etab} />}
      </div>
    </EtabCtx.Provider>
  );
}
