import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useEtab } from '../../contexte';
import { EnteteRubrique, FilAriane, Jauge, Section } from '../../components/commun';
import { euros, selonFormat } from '../../lib/format';
import { INDICATEURS, evaluer } from '../../finance/indicateurs';
import { CRITERES_M5, QUADRANTS, SECTIONS_M2, SECTIONS_M3, SECTIONS_M4, SECTIONS_M5, telecharger, versMarkdown } from '../../storage/export';
import { avancement, normaliser, useTravail, VERSION_SAUVEGARDE } from '../../storage/travaux';
import { EtatSauvegarde } from './Missions';

export function Travaux() {
  const { etab, base } = useEtab();
  const { travail, remplacer, reinitialiser, etat } = useTravail(etab.id);
  const [message, setMessage] = useState<{ type: 'ok' | 'erreur'; texte: string } | null>(null);
  const [confirmer, setConfirmer] = useState(false);
  const fichier = useRef<HTMLInputElement>(null);
  const horodatage = new Date().toISOString().slice(0, 10);

  const importer = async (f: File) => {
    try {
      const brut = JSON.parse(await f.text());
      if (!brut || typeof brut !== 'object' || brut.version === undefined) throw new Error('format');
      if (brut.etabId && brut.etabId !== etab.id) {
        setMessage({ type: 'erreur', texte: `Ce fichier concerne un autre établissement (${brut.etabId}). Ouvrez cet établissement pour l’importer.` });
        return;
      }
      if (brut.version > VERSION_SAUVEGARDE) throw new Error('version');
      remplacer(normaliser(etab.id, brut));
      setMessage({ type: 'ok', texte: `Sauvegarde importée (dernière modification : ${new Date(brut.majLe).toLocaleString('fr-FR')}).` });
    } catch {
      setMessage({ type: 'erreur', texte: 'Fichier illisible : choisissez un export JSON produit par ÉQUIDÉCISION.' });
    }
  };

  return (
    <>
      <EnteteRubrique
        surtitre="Mes travaux"
        titre="Sauvegarder, exporter, reprendre"
        texte="Vos réponses sont enregistrées automatiquement dans ce navigateur, pour cet établissement uniquement. Elles ne sont pas synchronisées entre appareils et ne sont transmises à personne."
      />
      <FilAriane elements={[{ libelle: 'Galerie', vers: '/?galerie' }, { libelle: etab.nomCourt, vers: base }, { libelle: 'Mes travaux' }]} />
      <Section>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ margin: 0 }}>Avancement</h2>
          <EtatSauvegarde etat={etat} />
        </div>
        <div className="grille-auto">
          {etab.missions.map((m) => {
            const av = travail.terminees.includes(m.numero) ? 1 : avancement(travail, m.numero);
            return (
              <Link key={m.numero} to={`${base}/missions/${m.numero}`} className="carte carte--lien">
                <span className="surtitre">Mission {m.numero}</span>
                <h3>{m.titre}</h3>
                <Jauge valeur={av} libelle={`Avancement mission ${m.numero}`} />
                <p className="petit attenue" style={{ margin: '8px 0 0' }}>
                  {travail.terminees.includes(m.numero) ? 'Marquée comme terminée' : `${Math.round(av * 100)} % des rubriques renseignées`}
                </p>
              </Link>
            );
          })}
        </div>
        <p className="petit attenue" style={{ marginTop: 16 }}>
          Dernière modification : {new Date(travail.majLe).toLocaleString('fr-FR')} · {travail.simulations.length} simulation(s) enregistrée(s).
        </p>
      </Section>
      <Section alt>
        <div className="grille-3">
          <div className="carte">
            <h3>Exporter</h3>
            <p className="petit attenue">Le Markdown se lit et se retravaille dans tout éditeur de texte. Le JSON permet de reprendre votre travail sur un autre ordinateur.</p>
            <div className="pile">
              <button className="btn" style={{ width: '100%' }} onClick={() => telecharger(`equidecision-${etab.id}-${horodatage}.md`, versMarkdown(etab, travail), 'text/markdown;charset=utf-8')}>
                Télécharger en Markdown
              </button>
              <button className="btn btn--contour" style={{ width: '100%' }} onClick={() => telecharger(`equidecision-${etab.id}-${horodatage}.json`, JSON.stringify(travail, null, 2), 'application/json')}>
                Télécharger la sauvegarde JSON
              </button>
              <Link className="btn btn--contour" style={{ width: '100%' }} to={`${base}/impression`}>
                Version imprimable (PDF)
              </Link>
            </div>
          </div>
          <div className="carte">
            <h3>Importer</h3>
            <p className="petit attenue">Reprenez un travail exporté en JSON. L’import remplace le travail actuel de cet établissement dans ce navigateur.</p>
            <input ref={fichier} type="file" accept="application/json,.json" className="visuellement-cache" id="import-json" onChange={(ev) => ev.target.files?.[0] && importer(ev.target.files[0])} />
            <label htmlFor="import-json" className="btn btn--contour" style={{ width: '100%', cursor: 'pointer' }}>
              Choisir un fichier JSON
            </label>
            {message && (
              <p role="status" className={`petit ${message.type === 'ok' ? 'positif' : 'negatif'}`} style={{ marginTop: 12 }}>
                <span className={message.type === 'ok' ? 'positif' : 'negatif'}>{message.texte}</span>
              </p>
            )}
          </div>
          <div className="carte">
            <h3>Réinitialiser</h3>
            <p className="petit attenue">Efface toutes vos réponses et simulations pour cet établissement, dans ce navigateur. Pensez à exporter d’abord.</p>
            {!confirmer ? (
              <button className="btn btn--danger" style={{ width: '100%' }} onClick={() => setConfirmer(true)}>
                Effacer mon travail
              </button>
            ) : (
              <div className="encart encart--alerte">
                <p className="petit">Confirmez-vous l’effacement définitif ?</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    className="btn btn--danger btn--petit"
                    onClick={() => {
                      reinitialiser();
                      setConfirmer(false);
                      setMessage({ type: 'ok', texte: 'Travail réinitialisé.' });
                    }}
                  >
                    Oui, tout effacer
                  </button>
                  <button className="btn btn--contour btn--petit" onClick={() => setConfirmer(false)}>
                    Annuler
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Section>
    </>
  );
}

// ---------------------------------------------------------------------------

function Texte({ titre, texte }: { titre: string; texte?: string }) {
  if (!texte?.trim()) return null;
  return (
    <>
      <h3>{titre}</h3>
      {texte
        .trim()
        .split(/\n{2,}/)
        .map((p, i) => (
          <p key={i} style={{ whiteSpace: 'pre-wrap' }}>
            {p}
          </p>
        ))}
    </>
  );
}

export function Impression() {
  const { etab, base, e } = useEtab();
  const { travail: t } = useTravail(etab.id);
  const titrePiece = (id: string) => (id.startsWith('rubrique:') ? id.slice(9) : etab.documents.find((d) => d.id === id)?.titre ?? etab.documentsAuto.find((d) => d.id === id)?.titre ?? id);
  const projet = etab.projets.find((p) => p.id === t.m3.projetId);
  const sim = t.simulations.find((s) => s.id === t.m3.simulationRetenue);
  const m5 = etab.missions.find((m) => m.numero === 5);
  const option = m5?.options?.find((o) => o.id === t.m5.optionRetenue);
  return (
    <div className="bureau">
      <div className="conteneur">
        <div className="pas-impression" style={{ maxWidth: 820, margin: '0 auto 16px', display: 'flex', gap: 12, justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Link to={`${base}/travaux`} className="btn btn--contour btn--petit">
            Retour à mes travaux
          </Link>
          <button className="btn btn--petit" onClick={() => window.print()}>
            Imprimer ou enregistrer en PDF
          </button>
        </div>
        <article className="papier rapport-impression">
          <header className="papier__entete">
            <div className="logo-etab">
              <span className="monogramme" aria-hidden>
                {etab.monogramme}
              </span>
              <span className="logo-etab__nom" style={{ whiteSpace: 'normal' }}>
                {etab.nom}
                <small>Rapport de mission · ÉQUIDÉCISION</small>
              </span>
            </div>
            <div className="papier__meta">
              <div>Établi le {new Date().toLocaleDateString('fr-FR')}</div>
              <div>À l’attention de {etab.dirigeant.nom}</div>
            </div>
          </header>
          <h1>Rapport de mission</h1>
          <p className="petit">Nom de l’étudiant ou du groupe : ……………………………………………</p>

          <section>
            <h2>Mission 1 · Diagnostic stratégique</h2>
            <table>
              <tbody>
                {QUADRANTS.map((q) => (
                  <tr key={q.id}>
                    <th style={{ width: 130 }}>{q.titre}</th>
                    <td>
                      {t.m1.swot[q.id].length === 0 ? (
                        <em>Non renseigné</em>
                      ) : (
                        <ul style={{ margin: 0, paddingLeft: 16 }}>
                          {t.m1.swot[q.id].map((o) => (
                            <li key={o.id}>
                              {o.texte} <span className="petit">({o.statut === 'etabli' ? 'établi' : 'hypothèse'}{o.preuves.length ? ` ; sources : ${o.preuves.map(titrePiece).join(', ')}` : ''})</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Texte titre="Diagnostic interne" texte={t.m1.interne} />
            <Texte titre="Diagnostic externe" texte={t.m1.externe} />
            <Texte titre="Synthèse des enjeux" texte={t.m1.enjeux} />
            {t.m1.priorites.length > 0 && (
              <>
                <h3>Priorités</h3>
                <ol>
                  {t.m1.priorites.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ol>
              </>
            )}
          </section>

          <section className="mission-imprimee">
            <h2>Mission 2 · Diagnostic financier</h2>
            {t.m2.indicateurs.length > 0 && (
              <table>
                <thead>
                  <tr>
                    <th>Indicateur</th>
                    <th className="d">2023</th>
                    <th className="d">2024</th>
                    <th className="d">2025</th>
                    <th>Commentaire</th>
                  </tr>
                </thead>
                <tbody>
                  {t.m2.indicateurs.map((id) => {
                    const d = INDICATEURS.find((i) => i.id === id);
                    if (!d) return null;
                    return (
                      <tr key={id}>
                        <td>{d.libelle}</td>
                        {([2023, 2024, 2025] as const).map((a) => (
                          <td key={a} className="d">
                            {selonFormat(evaluer(e, id, a), d.format)}
                          </td>
                        ))}
                        <td className="petit">{t.m2.commentairesIndicateurs[id]}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
            {SECTIONS_M2.map((s) => (
              <Texte key={s.id} titre={s.titre} texte={t.m2.sections[s.id]} />
            ))}
          </section>

          <section className="mission-imprimee">
            <h2>Mission 3 · Investissement et développement</h2>
            {projet && (
              <p>
                <strong>Projet : </strong>
                {projet.titre}
              </p>
            )}
            {sim && (
              <p>
                <strong>Simulation retenue : </strong>
                {sim.nom}, investissement {euros(sim.synthese.montant)}, VAN {euros(sim.synthese.van)}, TRI {selonFormat(sim.synthese.tri, '%')}.
              </p>
            )}
            {t.m3.liensDiagnostic.length > 0 && (
              <>
                <h3>Constats du diagnostic mobilisés</h3>
                <ul>
                  {t.m3.liensDiagnostic.map((id) => (
                    <li key={id}>{QUADRANTS.flatMap((q) => t.m1.swot[q.id]).find((o) => o.id === id)?.texte}</li>
                  ))}
                </ul>
              </>
            )}
            {SECTIONS_M3.map((s) => (
              <Texte key={s.id} titre={s.titre} texte={t.m3.sections[s.id]} />
            ))}
          </section>

          <section className="mission-imprimee">
            <h2>Mission 4 · Relation client et développement commercial</h2>
            {SECTIONS_M4.map((s) => (
              <Texte key={s.id} titre={s.titre} texte={t.m4.sections[s.id]} />
            ))}
            {t.m4.actions.length > 0 && (
              <table>
                <thead>
                  <tr>
                    <th>Action</th>
                    <th>Public</th>
                    <th className="d">Coût</th>
                    <th>Échéance</th>
                    <th>Responsable</th>
                  </tr>
                </thead>
                <tbody>
                  {t.m4.actions.map((a) => (
                    <tr key={a.id}>
                      <td>{a.action}</td>
                      <td>{a.cible}</td>
                      <td className="d">{a.cout}</td>
                      <td>{a.echeance}</td>
                      <td>{a.responsable}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {t.m4.indicateurs.length > 0 && (
              <table>
                <thead>
                  <tr>
                    <th>Indicateur</th>
                    <th>Actuel</th>
                    <th>Cible</th>
                    <th>Échéance</th>
                  </tr>
                </thead>
                <tbody>
                  {t.m4.indicateurs.map((a) => (
                    <tr key={a.id}>
                      <td>{a.indicateur}</td>
                      <td>{a.actuel}</td>
                      <td>{a.cible}</td>
                      <td>{a.echeance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          <section className="mission-imprimee">
            <h2>Mission 5 · Note de recommandation à la direction</h2>
            <p>
              <strong>À : </strong>
              {etab.dirigeant.nom}, {etab.dirigeant.fonction}
              <br />
              <strong>Objet : </strong>
              {m5?.lettre.objet}
            </p>
            {option && (
              <p>
                <strong>Option recommandée : </strong>
                {option.titre}
              </p>
            )}
            {m5?.options && Object.keys(t.m5.evaluations).length > 0 && (
              <table>
                <thead>
                  <tr>
                    <th>Option</th>
                    {CRITERES_M5.map((c) => (
                      <th key={c.id} className="d">
                        {c.libelle}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {m5.options.map((o) => (
                    <tr key={o.id}>
                      <td>{o.titre}</td>
                      {CRITERES_M5.map((c) => (
                        <td key={c.id} className="d">
                          {t.m5.evaluations[o.id]?.[c.id] ?? '·'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {SECTIONS_M5.map((s) => (
              <Texte key={s.id} titre={s.titre} texte={t.m5.sections[s.id]} />
            ))}
          </section>
          <p className="petit" style={{ marginTop: 32, color: '#7a7c72' }}>
            Travail réalisé sur un établissement fictif dans le cadre d’une simulation pédagogique (ÉQUIDÉCISION, ESTHUA, Université d’Angers).
          </p>
        </article>
      </div>
    </div>
  );
}
