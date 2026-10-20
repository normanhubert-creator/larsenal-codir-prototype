import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarrePlateforme, Pied } from '../components/Cadre';
import { Photo, CreditPhoto } from '../components/Photo';
import { ETABLISSEMENTS, FAMILLES } from '../data/registry';
import { etablissementsAvecTravaux } from '../storage/travaux';
import { POLICES_TITRE, THEME_PLATEFORME, variablesTheme } from '../theme/theme';
import type { CSSProperties } from 'react';

const GROUPES = ['Tous', ...Array.from(new Set(FAMILLES.map((f) => f.groupe)))];

export function Accueil() {
  const [groupe, setGroupe] = useState('Tous');
  const [approfondis, setApprofondis] = useState(false);
  const avecTravaux = useMemo(() => new Set(etablissementsAvecTravaux()), []);
  const { search } = useLocation();
  useEffect(() => {
    if (search.includes('galerie')) window.setTimeout(() => document.getElementById('etablissements')?.scrollIntoView(), 60);
  }, [search]);
  const liste = ETABLISSEMENTS.filter((e) => {
    const g = FAMILLES.find((f) => f.id === e.famille)?.groupe;
    return (groupe === 'Tous' || g === groupe) && (!approfondis || e.profondeur === 'approfondi');
  });

  return (
    <div className="plateforme" style={variablesTheme(THEME_PLATEFORME)}>
      <BarrePlateforme />
      <main id="contenu">
        <section className="hero" aria-labelledby="titre-plateforme">
          <Photo cle="accueil-hero" prioritaire cadrage="center 40%" />
          <div className="conteneur hero__contenu">
            <span className="surtitre">ESTHUA · Université d’Angers · Campus de Saumur</span>
            <h1 id="titre-plateforme" style={{ letterSpacing: '0.04em', maxWidth: 'none' }}>
              ÉQUIDÉCISION
            </h1>
            <p className="hero__signature">Laboratoire immersif de management et de finance des établissements équestres.</p>
            <div className="hero__bas">
              <p style={{ maxWidth: 560, margin: 0, opacity: 0.9 }}>
                Dix entreprises de la filière équine vous ouvrent leurs écuries, leurs comptes et leurs dossiers de direction. Choisissez-en
                une, analysez-la, puis conseillez sa direction.
              </p>
              <button className="btn btn--clair" onClick={() => document.getElementById('etablissements')?.scrollIntoView({ behavior: 'smooth' })}>
                Choisir un établissement
              </button>
            </div>
          </div>
          <span className="hero__credit"><CreditPhoto cle="accueil-hero" /></span>
        </section>

        <section className="section">
          <div className="conteneur intro-plateforme">
            <div>
              <span className="surtitre">Le principe</span>
              <h2>Entrer dans une entreprise équestre comme si vous y étiez recruté.</h2>
              <p className="chapeau">
                Chaque établissement possède son histoire, ses installations, ses chevaux, son équipe, ses clients et ses fournisseurs. Ses comptes
                sont construits à partir de son activité réelle : tarifs, volumes, effectifs, investissements et emprunts. Rien n’y est décoratif.
              </p>
              <p className="attenue">
                Vous intervenez comme chargé de mission ou consultant. La direction vous confie cinq missions, du diagnostic à la décision. Les
                réponses ne sont pas dans le site : elles se construisent en rapprochant les informations, en calculant et en argumentant.
              </p>
            </div>
            <ol className="etapes" style={{ padding: 0, margin: 0 }}>
              <li><div><strong>Choisir un établissement</strong><span className="attenue">Aucun compte : chaque dossier a son adresse.</span></div></li>
              <li><div><strong>Explorer le dossier</strong><span className="attenue">Activité, cavalerie, clients, fournisseurs, équipe, marché.</span></div></li>
              <li><div><strong>Analyser les comptes</strong><span className="attenue">SIG, CAF, bilans, ratios, coûts par activité, trésorerie.</span></div></li>
              <li><div><strong>Réaliser les missions</strong><span className="attenue">SWOT, diagnostic financier, simulateur d’investissement, plan commercial, note de direction.</span></div></li>
            </ol>
          </div>
        </section>

        <section className="section section--alt" id="etablissements" aria-labelledby="titre-galerie">
          <div className="conteneur">
            <span className="surtitre">Les établissements</span>
            <h2 id="titre-galerie">Dix modèles économiques de la filière équine</h2>
            <div className="filtres" role="group" aria-label="Filtrer les établissements">
              {GROUPES.map((g) => (
                <button key={g} className="puce-filtre" aria-pressed={groupe === g} onClick={() => setGroupe(g)}>
                  {g}
                </button>
              ))}
              <button className="puce-filtre" aria-pressed={approfondis} onClick={() => setApprofondis((a) => !a)}>
                Dossiers approfondis
              </button>
            </div>
            <div className="galerie">
              {liste.map((e) => {
                const style = {
                  '--carte-primaire': e.theme.primaire,
                  '--carte-accent': e.theme.accent,
                  '--carte-sur': e.theme.surPrimaire,
                  '--carte-police': POLICES_TITRE[e.theme.policeTitre],
                } as CSSProperties;
                return (
                  <Link
                    key={e.id}
                    to={`/e/${e.id}`}
                    className={`carte-etab apparition ${e.profondeur === 'approfondi' ? 'carte-etab--grande' : ''}`}
                    style={style}
                  >
                    <Photo cle={`${e.id}-hero`} sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 33vw" />
                    <div className="carte-etab__bandeau">
                      {e.profondeur === 'approfondi' && <span className="etiquette etiquette--accent">Dossier approfondi</span>}
                      {avecTravaux.has(e.id) && <span className="etiquette">Travail en cours</span>}
                    </div>
                    <div className="carte-etab__corps">
                      <span className="carte-etab__famille">{e.libelleFamille}</span>
                      <h3>{e.nom}</h3>
                      <span className="carte-etab__lieu">
                        {e.lieu.commune}, {e.lieu.departement}
                      </span>
                      <p className="carte-etab__accroche">{e.accroche}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
            {liste.length === 0 && <p className="message-vide">Aucun établissement ne correspond à ce filtre.</p>}
          </div>
        </section>

        <section className="section">
          <div className="conteneur grille-3">
            <div className="encart encart--accent">
              <h3>Vos travaux restent chez vous</h3>
              <p className="petit">
                Les réponses aux missions sont enregistrées automatiquement dans ce navigateur, séparément pour chaque établissement. Elles ne sont
                pas synchronisées entre appareils : exportez-les pour les reprendre ailleurs.
              </p>
            </div>
            <div className="encart encart--accent">
              <h3>Des comptes qui se tiennent</h3>
              <p className="petit">
                Les états financiers sont calculés à partir de l’activité. Bilans équilibrés, SIG, CAF et trésorerie sont vérifiés par des tests
                automatiques. <Link to="/methodologie">Voir la méthodologie</Link>.
              </p>
            </div>
            <div className="encart encart--accent">
              <h3>Une simulation pédagogique</h3>
              <p className="petit">
                Établissements, personnes et documents sont fictifs. Les photographies sont des illustrations sous licence libre et ne représentent
                aucun lieu réel. <Link to="/credits">Crédits photographiques</Link>.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Pied />
    </div>
  );
}
