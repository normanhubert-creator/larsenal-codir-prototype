import { Link } from 'react-router-dom';
import { PagePlateforme } from '../components/Cadre';

export function Introuvable() {
  return (
    <PagePlateforme>
      <section className="section">
        <div className="conteneur conteneur--etroit">
          <span className="surtitre">Page introuvable</span>
          <h1>Cette adresse ne mène à aucun dossier.</h1>
          <p className="chapeau">Le lien est peut-être incomplet. Revenez à la galerie pour choisir un établissement.</p>
          <Link className="btn" to="/">Retour à la galerie</Link>
        </div>
      </section>
    </PagePlateforme>
  );
}
