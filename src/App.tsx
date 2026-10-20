import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Accueil } from './pages/Accueil';
import { PagesGenerales } from './pages/PagesGenerales';
import { EtablissementLayout } from './pages/etablissement/Layout';
import { Introuvable } from './pages/Introuvable';

function RemonterEnHaut() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
}

export function App() {
  return (
    <>
      <a className="lien-evitement" href="#contenu">
        Aller au contenu
      </a>
      <RemonterEnHaut />
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/methodologie" element={<PagesGenerales page="methodologie" />} />
        <Route path="/credits" element={<PagesGenerales page="credits" />} />
        <Route path="/a-propos" element={<PagesGenerales page="a-propos" />} />
        <Route path="/e/:id/*" element={<EtablissementLayout />} />
        <Route path="*" element={<Introuvable />} />
      </Routes>
    </>
  );
}
