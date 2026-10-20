import { Link } from 'react-router-dom';
import { variablesTheme, THEME_PLATEFORME } from '../theme/theme';
import type { ReactNode } from 'react';

export function BarrePlateforme({ pleine }: { pleine?: boolean }) {
  return (
    <header className={`barre-plateforme ${pleine ? 'barre-plateforme--pleine' : ''}`}>
      <div className="conteneur">
        <Link to="/" className="marque-plateforme" aria-label="ÉQUIDÉCISION, retour à l’accueil">
          ÉQUIDÉCISION <small>Laboratoire de management équestre</small>
        </Link>
        <nav aria-label="Navigation générale">
          <Link to="/?galerie">Établissements</Link>
          <Link to="/methodologie">Méthodologie</Link>
          <Link to="/a-propos">À propos</Link>
        </nav>
      </div>
    </header>
  );
}

export function Pied() {
  return (
    <footer className="pied">
      <div className="conteneur pied__grille">
        <div>
          <h4>ÉQUIDÉCISION</h4>
          <p>
            Laboratoire immersif de management et de finance des établissements équestres. Licence professionnelle Management des entreprises
            équestres, ESTHUA, Université d’Angers, campus de Saumur.
          </p>
          <p className="petit">
            Tous les établissements, personnes, documents et chiffres sont fictifs et construits à des fins pédagogiques. Vos travaux restent dans
            votre navigateur : ils ne sont transmis à personne.
          </p>
        </div>
        <div>
          <h4>Ressources</h4>
          <ul>
            <li><Link to="/methodologie">Méthodologie et sources</Link></li>
            <li><Link to="/credits">Crédits photographiques</Link></li>
            <li><Link to="/a-propos">Mentions et fonctionnement</Link></li>
          </ul>
        </div>
        <div>
          <h4>Accès</h4>
          <ul>
            <li>Sans compte ni mot de passe</li>
            <li>Sauvegarde locale par établissement</li>
            <li>Export Markdown, JSON et impression</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export function PagePlateforme({ children }: { children: ReactNode }) {
  return (
    <div className="plateforme" style={variablesTheme(THEME_PLATEFORME)}>
      <BarrePlateforme pleine />
      <main id="contenu">{children}</main>
      <Pied />
    </div>
  );
}
