import { Link } from 'react-router-dom';
import { useEtab } from '../../contexte';
import { Photo, CreditPhoto } from '../../components/Photo';
import { Jauge, Section } from '../../components/commun';
import { avancement, useTravail } from '../../storage/travaux';
import { rubriquesDossier } from './Layout';

const PHOTOS_RUBRIQUES: Record<string, string> = {
  etablissement: 'lieu',
  installations: 'detail',
  cavalerie: 'chevaux',
  activites: 'activite',
};

export function AccueilEtab() {
  const { etab, base } = useEtab();
  const { travail } = useTravail(etab.id);
  const rubriques = rubriquesDossier(etab);

  return (
    <>
      <section className="hero" aria-labelledby="titre-etab">
        <Photo cle={`${etab.id}-hero`} prioritaire />
        <div className="conteneur hero__contenu">
          <span className="surtitre">
            {etab.libelleFamille} · {etab.lieu.commune}
          </span>
          <h1 id="titre-etab">{etab.nom}</h1>
          <p className="hero__signature">{etab.signature}</p>
          <div className="hero__bas">
            <p style={{ maxWidth: 560, margin: 0, opacity: 0.92 }}>{etab.lieu.cadre}</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link className="btn btn--clair" to={`${base}/missions`}>
                Voir les missions
              </Link>
              <Link className="btn btn--fantome" to={`${base}/etablissement`} style={{ color: '#fff' }}>
                Découvrir l’établissement
              </Link>
            </div>
          </div>
        </div>
        <span className="hero__credit">
          <CreditPhoto cle={`${etab.id}-hero`} />
        </span>
      </section>

      <div className="conteneur">
        <div className="bande-chiffres" role="list" aria-label="Chiffres clés">
          {etab.chiffresCles.slice(0, 6).map((c) => (
            <div key={c.libelle} role="listitem">
              <strong>{c.valeur}</strong>
              <span>{c.libelle}</span>
              {c.detail && <small>{c.detail}</small>}
            </div>
          ))}
        </div>
      </div>

      <Section>
        <div className="editorial">
          <div>
            <span className="surtitre">L’établissement</span>
            <h2>{etab.signature}</h2>
          </div>
          <div>
            <p className="chapeau">{etab.presentation.introduction}</p>
            <p className="attenue">
              {etab.formeJuridique}. Créé en {etab.creation}. Direction : {etab.dirigeant.nom}, {etab.dirigeant.fonction.toLowerCase()}.
            </p>
            <Link className="lien-fleche" to={`${base}/etablissement`}>
              Histoire, valeurs et modèle économique
            </Link>
          </div>
        </div>
      </Section>

      <Section sombre>
        <div className="editorial">
          <div>
            <span className="surtitre">Questions de direction</span>
            <h2>Ce qui occupe la direction aujourd’hui</h2>
            <p className="attenue">Ces questions sont posées par l’établissement. À vous d’établir le diagnostic qui permettra d’y répondre.</p>
          </div>
          <div>
            {etab.enjeux.map((q) => (
              <p className="question-direction" key={q}>
                {q}
              </p>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <span className="surtitre">Le dossier</span>
        <h2>Explorer l’entreprise</h2>
        <div className="grille-4" style={{ marginTop: 28 }}>
          {rubriques.slice(0, 4).map((r) => (
            <Link key={r.chemin} to={`${base}/${r.chemin}`} className="carte-photo">
              <Photo cle={`${etab.id}-${PHOTOS_RUBRIQUES[r.chemin] ?? 'detail'}`} sizes="(max-width: 640px) 100vw, 25vw" />
              <div className="carte-photo__corps">
                <h3 style={{ marginBottom: 0 }}>{r.libelle}</h3>
              </div>
            </Link>
          ))}
        </div>
        <div className="grille-4" style={{ marginTop: 16 }}>
          {rubriques.slice(4).map((r) => (
            <Link key={r.chemin} to={`${base}/${r.chemin}`} className="carte carte--lien">
              <h4 style={{ margin: 0 }}>{r.libelle}</h4>
            </Link>
          ))}
        </div>
      </Section>

      <Section alt>
        <div className="grille-2">
          <div>
            <span className="surtitre">Votre rôle</span>
            <h2>Une mission au cœur de l’entreprise</h2>
            <p className="chapeau">{etab.roleEtudiant}</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 24 }}>
              <Link className="btn" to={`${base}/finances`}>
                Tableau de bord financier
              </Link>
              <Link className="btn btn--contour" to={`${base}/documents`}>
                Documents de direction
              </Link>
            </div>
          </div>
          <div>
            <h3>Vos missions</h3>
            <div className="pile">
              {etab.missions.map((m) => {
                const av = avancement(travail, m.numero);
                return (
                  <Link key={m.numero} to={`${base}/missions/${m.numero}`} className="carte carte--lien" style={{ padding: '14px 18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
                      <strong>
                        {m.numero}. {m.titre}
                      </strong>
                      <span className="petit attenue">{travail.terminees.includes(m.numero) ? 'Terminée' : `${Math.round(av * 100)} %`}</span>
                    </div>
                    <Jauge valeur={travail.terminees.includes(m.numero) ? 1 : av} libelle={`Avancement de la mission ${m.numero}`} />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
