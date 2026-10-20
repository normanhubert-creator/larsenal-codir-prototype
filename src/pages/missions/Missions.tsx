import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useEtab } from '../../contexte';
import { Aide, EnteteRubrique, FilAriane, Jauge, Section } from '../../components/commun';
import { INDICATEURS, evaluer } from '../../finance/indicateurs';
import { dateLongue, euros, selonFormat } from '../../lib/format';
import { AUTOEVALUATION, CRITERES_M5, QUADRANTS, SECTIONS_M2, SECTIONS_M3, SECTIONS_M4, SECTIONS_M5 } from '../../storage/export';
import { avancement, nouvelId, useTravail, type ObservationSwot, type QuadrantSwot, type Travail } from '../../storage/travaux';
import { EXERCICES, type Mission } from '../../types';
import { Introuvable } from '../Introuvable';
import { libelleType } from '../etablissement/Documents';

type Modifier = (f: (t: Travail) => Travail) => void;

export function EtatSauvegarde({ etat }: { etat: 'ok' | 'erreur' | 'attente' }) {
  return (
    <span className={`etat-sauvegarde ${etat === 'erreur' ? 'etat-sauvegarde--erreur' : ''}`} role="status" aria-live="polite">
      {etat === 'ok' && 'Enregistré dans ce navigateur'}
      {etat === 'attente' && 'Enregistrement…'}
      {etat === 'erreur' && 'Sauvegarde locale indisponible : exportez votre travail'}
    </span>
  );
}

function Parcours({ actuelle }: { actuelle?: number }) {
  const { etab, base } = useEtab();
  const { travail } = useTravail(etab.id);
  return (
    <nav className="parcours" aria-label="Progression des missions">
      {etab.missions.map((m) => {
        const fini = travail.terminees.includes(m.numero);
        const av = fini ? 1 : avancement(travail, m.numero);
        return (
          <Link key={m.numero} to={`${base}/missions/${m.numero}`} aria-current={actuelle === m.numero ? 'page' : undefined}>
            <span className="parcours__num">0{m.numero}</span>
            <span className="parcours__titre">{m.titre}</span>
            <Jauge valeur={av} libelle={`Avancement mission ${m.numero}`} />
            <div className="parcours__etat">{fini ? 'Marquée comme terminée' : av === 0 ? 'Non commencée' : `${Math.round(av * 100)} % des rubriques renseignées`}</div>
          </Link>
        );
      })}
    </nav>
  );
}

export function Missions() {
  const { etab, base } = useEtab();
  return (
    <>
      <EnteteRubrique
        surtitre="Missions"
        titre="Du diagnostic à la décision"
        texte={`${etab.roleEtudiant} Cinq missions vous sont confiées. Elles se répondent : vos constats du diagnostic serviront à justifier vos propositions.`}
        photo={`${etab.id}-detail`}
      />
      <FilAriane elements={[{ libelle: 'Galerie', vers: '/?galerie' }, { libelle: etab.nomCourt, vers: base }, { libelle: 'Missions' }]} />
      <Section>
        <Parcours />
        <div className="grille-auto" style={{ marginTop: 40 }}>
          {etab.missions.map((m) => (
            <Link key={m.numero} to={`${base}/missions/${m.numero}`} className="carte carte--lien">
              <span className="surtitre">Mission {m.numero}</span>
              <h3>{m.titre}</h3>
              <p className="petit">{m.lettre.objet}</p>
              <p className="petit attenue" style={{ margin: 0 }}>
                {m.contexte}
              </p>
            </Link>
          ))}
        </div>
      </Section>
      <Section alt>
        <div className="grille-2">
          <div>
            <h3>Comment travailler</h3>
            <p className="attenue">
              Chaque mission comporte une lettre de commande, des objectifs, des livrables et un espace de travail. Vos saisies sont enregistrées
              automatiquement dans ce navigateur. Vous pouvez revenir sur une mission précédente à tout moment sans perdre le reste.
            </p>
          </div>
          <div>
            <h3>Rendre votre travail</h3>
            <p className="attenue">
              Depuis <Link to={`${base}/travaux`}>Mes travaux</Link>, exportez vos réponses en Markdown ou en JSON, ou imprimez-les en PDF, puis
              déposez-les par le canal habituel de votre formation.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}

// ---------------------------------------------------------------------------

export function MissionVue() {
  const { num } = useParams();
  const { etab, base } = useEtab();
  const m = etab.missions.find((x) => String(x.numero) === num);
  const { travail, modifier, etat } = useTravail(etab.id);
  if (!m) return <Introuvable />;
  const fini = travail.terminees.includes(m.numero);
  const suivante = etab.missions.find((x) => x.numero === m.numero + 1);
  const docs = m.documentsUtiles.map((id) => {
    const d = etab.documents.find((x) => x.id === id);
    const a = etab.documentsAuto.find((x) => x.id === id);
    return { id, titre: d?.titre ?? a?.titre ?? id, type: libelleType(d?.type ?? a?.type ?? '') };
  });
  return (
    <>
      <FilAriane elements={[{ libelle: 'Galerie', vers: '/?galerie' }, { libelle: etab.nomCourt, vers: base }, { libelle: 'Missions', vers: `${base}/missions` }, { libelle: `Mission ${m.numero}` }]} />
      <Section>
        <Parcours actuelle={m.numero} />
        <div className="editorial" style={{ marginTop: 48 }}>
          <div>
            <span className="surtitre">Mission {m.numero}</span>
            <h1 style={{ fontSize: 'calc(clamp(2rem, 4vw, 3.4rem) * var(--titre-echelle))' }}>{m.titre}</h1>
            <p className="attenue">{m.contexte}</p>
            <h3 style={{ marginTop: 28 }}>Objectifs</h3>
            <ul className="liste-propre">
              {m.objectifs.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
            <h3 style={{ marginTop: 28 }}>Livrables attendus</h3>
            <ul className="liste-propre">
              {m.livrables.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
          </div>
          <div>
            <article className="lettre">
              <div className="logo-etab" style={{ color: 'var(--c-primaire)' }}>
                <span className="monogramme" aria-hidden>
                  {etab.monogramme}
                </span>
                <span className="logo-etab__nom">{etab.nom}</span>
              </div>
              <p className="petit" style={{ marginTop: 20, color: '#5d5f55' }}>
                {etab.lieu.commune}, le {dateLongue(m.lettre.date)}
              </p>
              <p className="lettre__objet">Objet : {m.lettre.objet}</p>
              {m.lettre.corps.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              <div className="lettre__signature">
                {m.lettre.de}
                <div className="petit" style={{ fontFamily: 'var(--f-texte)' }}>
                  {m.lettre.fonction}
                </div>
              </div>
            </article>
          </div>
        </div>
      </Section>
      <Section alt>
        <div className="grille-2">
          <div>
            <h3>Pièces utiles</h3>
            <div className="liste-docs">
              {docs.map((d) => (
                <Link key={d.id} to={`${base}/documents/${d.id}`} className="ligne-doc" style={{ gridTemplateColumns: '110px 1fr' }}>
                  <span className="ligne-doc__type">{d.type}</span>
                  <div>
                    <h3>{d.titre}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3>Questions pour orienter votre analyse</h3>
            <ul className="liste-propre">
              {m.pistes.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <p className="petit attenue" style={{ marginTop: 16 }}>
              Ces questions ne contiennent pas les réponses ; elles indiquent où regarder.
            </p>
          </div>
        </div>
      </Section>
      <Section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
          <div>
            <span className="surtitre">Espace de travail</span>
            <h2 style={{ marginBottom: 0 }}>Vos réponses</h2>
          </div>
          <EtatSauvegarde etat={etat} />
        </div>
        <div className="espace-travail">
          {m.numero === 1 && <EspaceM1 travail={travail} modifier={modifier} />}
          {m.numero === 2 && <EspaceM2 mission={m} travail={travail} modifier={modifier} />}
          {m.numero === 3 && <EspaceM3 mission={m} travail={travail} modifier={modifier} />}
          {m.numero === 4 && <EspaceM4 travail={travail} modifier={modifier} />}
          {m.numero === 5 && <EspaceM5 mission={m} travail={travail} modifier={modifier} />}
        </div>
        <div className="grille-2" style={{ marginTop: 32 }}>
          <div className="carte">
            <h3>Grille d’autoévaluation</h3>
            <p className="petit attenue">Une analyse stratégique n’est ni vraie ni fausse : elle est plus ou moins justifiée. Vérifiez ces critères avant de rendre.</p>
            {AUTOEVALUATION[m.numero].map((c, i) => {
              const k = `${m.numero}-${i}`;
              return (
                <label key={k} className="case">
                  <input type="checkbox" checked={!!travail.autoevaluation[k]} onChange={(ev) => modifier((t) => ({ ...t, autoevaluation: { ...t.autoevaluation, [k]: ev.target.checked } }))} />
                  <span>{c}</span>
                </label>
              );
            })}
          </div>
          <div className="carte">
            <h3>Statut de la mission</h3>
            <label className="case">
              <input
                type="checkbox"
                checked={fini}
                onChange={(ev) =>
                  modifier((t) => ({ ...t, terminees: ev.target.checked ? [...new Set([...t.terminees, m.numero])] : t.terminees.filter((n) => n !== m.numero) }))
                }
              />
              <span>Je considère cette mission comme terminée (elle reste modifiable).</span>
            </label>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 16 }}>
              {suivante && (
                <Link className="btn" to={`${base}/missions/${suivante.numero}`}>
                  Mission suivante
                </Link>
              )}
              <Link className="btn btn--contour" to={`${base}/travaux`}>
                Exporter mes travaux
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

// ---------------------------------------------------------------------------
// Champs
// ---------------------------------------------------------------------------

export function ChampTexte({ id, titre, aide, valeur, onChange, lignes = 6 }: { id: string; titre: string; aide?: string; valeur: string; onChange: (v: string) => void; lignes?: number }) {
  return (
    <div className="champ">
      <label htmlFor={id}>{titre}</label>
      {aide && <span className="indication">{aide}</span>}
      <textarea id={id} rows={lignes} value={valeur} onChange={(ev) => onChange(ev.target.value)} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mission 1 : SWOT
// ---------------------------------------------------------------------------

function EditeurObservation({ initial, onValider, onAnnuler }: { initial?: ObservationSwot; onValider: (o: ObservationSwot) => void; onAnnuler: () => void }) {
  const { etab } = useEtab();
  const [o, setO] = useState<ObservationSwot>(initial ?? { id: nouvelId(), texte: '', statut: 'etabli', importance: 2, preuves: [], justification: '' });
  const pieces = [...etab.documents.map((d) => ({ id: d.id, titre: d.titre })), ...etab.documentsAuto.map((d) => ({ id: d.id, titre: d.titre ?? d.id }))];
  const rubriques = ['Notre établissement', 'Installations', 'Cavalerie', 'Activités', 'Clients', 'Fournisseurs', 'Équipe', 'Environnement', 'Comptes et ratios'];
  return (
    <div className="carte" style={{ background: 'var(--c-fond)', padding: 14 }}>
      <div className="champ">
        <label htmlFor={`obs-${o.id}`}>Observation</label>
        <textarea id={`obs-${o.id}`} rows={2} style={{ minHeight: 60 }} value={o.texte} onChange={(ev) => setO({ ...o, texte: ev.target.value })} autoFocus />
      </div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <label className="petit">
          Nature{' '}
          <select value={o.statut} onChange={(ev) => setO({ ...o, statut: ev.target.value as ObservationSwot['statut'] })} style={{ width: 'auto' }}>
            <option value="etabli">Fait établi</option>
            <option value="hypothese">Hypothèse</option>
          </select>
        </label>
        <label className="petit">
          Importance{' '}
          <select value={o.importance} onChange={(ev) => setO({ ...o, importance: Number(ev.target.value) as 1 | 2 | 3 })} style={{ width: 'auto' }}>
            <option value={3}>Majeure</option>
            <option value={2}>Notable</option>
            <option value={1}>Secondaire</option>
          </select>
        </label>
      </div>
      <div className="champ" style={{ marginTop: 12 }}>
        <span className="libelle">Éléments de preuve</span>
        <select
          multiple
          size={5}
          value={o.preuves}
          onChange={(ev) => setO({ ...o, preuves: Array.from(ev.target.selectedOptions).map((x) => x.value) })}
          aria-label="Pièces du dossier justifiant l’observation (sélection multiple)"
        >
          <optgroup label="Pièces du dossier">
            {pieces.map((p) => (
              <option key={p.id} value={p.id}>
                {p.titre}
              </option>
            ))}
          </optgroup>
          <optgroup label="Rubriques">
            {rubriques.map((r) => (
              <option key={r} value={`rubrique:${r}`}>
                Rubrique : {r}
              </option>
            ))}
          </optgroup>
        </select>
        <span className="indication">Ctrl ou Cmd + clic pour sélectionner plusieurs pièces.</span>
      </div>
      <div className="champ">
        <label htmlFor={`just-${o.id}`}>Justification (chiffres, citation)</label>
        <textarea id={`just-${o.id}`} rows={2} style={{ minHeight: 60 }} value={o.justification} onChange={(ev) => setO({ ...o, justification: ev.target.value })} />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn btn--petit" disabled={!o.texte.trim()} onClick={() => onValider(o)}>
          Enregistrer
        </button>
        <button className="btn btn--contour btn--petit" onClick={onAnnuler}>
          Annuler
        </button>
      </div>
    </div>
  );
}

function EspaceM1({ travail, modifier }: { travail: Travail; modifier: Modifier }) {
  const { etab } = useEtab();
  const [edition, setEdition] = useState<{ q: QuadrantSwot; id?: string } | null>(null);
  const [nouvellePriorite, setNouvellePriorite] = useState('');
  const titrePreuve = (id: string) => (id.startsWith('rubrique:') ? id.slice(9) : etab.documents.find((d) => d.id === id)?.titre ?? etab.documentsAuto.find((d) => d.id === id)?.titre ?? id);
  const majSwot = (q: QuadrantSwot, f: (l: ObservationSwot[]) => ObservationSwot[]) =>
    modifier((t) => ({ ...t, m1: { ...t.m1, swot: { ...t.m1.swot, [q]: f(t.m1.swot[q]) } } }));
  const deplacer = (q: QuadrantSwot, i: number, d: -1 | 1) =>
    majSwot(q, (l) => {
      const c = [...l];
      const j = i + d;
      if (j < 0 || j >= c.length) return c;
      [c[i], c[j]] = [c[j], c[i]];
      return c;
    });
  const changerQuadrant = (de: QuadrantSwot, vers: QuadrantSwot, id: string) =>
    modifier((t) => {
      const o = t.m1.swot[de].find((x) => x.id === id);
      if (!o) return t;
      return { ...t, m1: { ...t.m1, swot: { ...t.m1.swot, [de]: t.m1.swot[de].filter((x) => x.id !== id), [vers]: [...t.m1.swot[vers], o] } } };
    });

  return (
    <>
      <h3>Matrice SWOT</h3>
      <p className="petit attenue">
        Ajoutez vos observations, qualifiez-les (fait établi ou hypothèse), rattachez-les aux pièces qui les justifient et classez-les par ordre
        d’importance. La matrice est vide au départ : elle est entièrement la vôtre.
      </p>
      <div className="swot">
        {QUADRANTS.map((q) => (
          <section key={q.id} className="swot__zone" style={{ ['--zone' as string]: q.couleur }} aria-label={q.titre}>
            <h3>{q.titre}</h3>
            <div className="sous">{q.sous}</div>
            <ul className="swot__items">
              {travail.m1.swot[q.id].map((o, i) =>
                edition?.q === q.id && edition.id === o.id ? (
                  <li key={o.id}>
                    <EditeurObservation
                      initial={o}
                      onAnnuler={() => setEdition(null)}
                      onValider={(n) => {
                        majSwot(q.id, (l) => l.map((x) => (x.id === n.id ? n : x)));
                        setEdition(null);
                      }}
                    />
                  </li>
                ) : (
                  <li key={o.id} className="swot__item">
                    <div>{o.texte}</div>
                    {o.justification && <div className="petit attenue" style={{ marginTop: 4 }}>{o.justification}</div>}
                    <div className="swot__item-meta">
                      <span className={`pastille pastille--${o.statut}`}>{o.statut === 'etabli' ? 'Établi' : 'Hypothèse'}</span>
                      <span className="pastille">{['', 'Secondaire', 'Notable', 'Majeure'][o.importance]}</span>
                      {o.preuves.map((p) => (
                        <span key={p} className="pastille" title={titrePreuve(p)}>
                          {titrePreuve(p).slice(0, 34)}
                          {titrePreuve(p).length > 34 ? '…' : ''}
                        </span>
                      ))}
                      <span className="swot__item-actions">
                        <button onClick={() => deplacer(q.id, i, -1)} aria-label="Monter">
                          ↑
                        </button>
                        <button onClick={() => deplacer(q.id, i, 1)} aria-label="Descendre">
                          ↓
                        </button>
                        <select
                          aria-label="Déplacer vers"
                          value=""
                          onChange={(ev) => ev.target.value && changerQuadrant(q.id, ev.target.value as QuadrantSwot, o.id)}
                          style={{ width: 'auto', padding: '1px 4px', fontSize: '0.72rem' }}
                        >
                          <option value="">Déplacer</option>
                          {QUADRANTS.filter((x) => x.id !== q.id).map((x) => (
                            <option key={x.id} value={x.id}>
                              {x.titre}
                            </option>
                          ))}
                        </select>
                        <button onClick={() => setEdition({ q: q.id, id: o.id })}>Modifier</button>
                        <button onClick={() => majSwot(q.id, (l) => l.filter((x) => x.id !== o.id))} aria-label="Supprimer">
                          ✕
                        </button>
                      </span>
                    </div>
                  </li>
                ),
              )}
            </ul>
            {edition?.q === q.id && !edition.id ? (
              <EditeurObservation
                onAnnuler={() => setEdition(null)}
                onValider={(n) => {
                  majSwot(q.id, (l) => [...l, n]);
                  setEdition(null);
                }}
              />
            ) : (
              <button className="btn btn--contour btn--petit" style={{ marginTop: 'auto', alignSelf: 'flex-start' }} onClick={() => setEdition({ q: q.id })}>
                + Ajouter une observation
              </button>
            )}
          </section>
        ))}
      </div>
      <div className="grille-2" style={{ marginTop: 32 }}>
        <ChampTexte id="m1-interne" titre="Diagnostic interne" aide="Ressources, compétences, organisation, performance : ce que l’établissement maîtrise." valeur={travail.m1.interne} onChange={(v) => modifier((t) => ({ ...t, m1: { ...t.m1, interne: v } }))} />
        <ChampTexte id="m1-externe" titre="Diagnostic externe" aide="Marché, concurrence, territoire, réglementation : ce qui s’impose à l’établissement." valeur={travail.m1.externe} onChange={(v) => modifier((t) => ({ ...t, m1: { ...t.m1, externe: v } }))} />
      </div>
      <ChampTexte id="m1-enjeux" titre="Synthèse stratégique personnelle" aide="Les enjeux qui ressortent du croisement des quatre zones, justifiés en quelques paragraphes." valeur={travail.m1.enjeux} onChange={(v) => modifier((t) => ({ ...t, m1: { ...t.m1, enjeux: v } }))} lignes={8} />
      <h3>Priorités hiérarchisées</h3>
      <ol style={{ paddingLeft: 20 }}>
        {travail.m1.priorites.map((p, i) => (
          <li key={i} style={{ marginBottom: 8 }}>
            <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ flex: 1 }}>{p}</span>
              <button
                className="btn btn--contour btn--petit"
                aria-label="Monter"
                disabled={i === 0}
                onClick={() =>
                  modifier((t) => {
                    const l = [...t.m1.priorites];
                    [l[i - 1], l[i]] = [l[i], l[i - 1]];
                    return { ...t, m1: { ...t.m1, priorites: l } };
                  })
                }
              >
                ↑
              </button>
              <button className="btn btn--danger btn--petit" aria-label="Supprimer" onClick={() => modifier((t) => ({ ...t, m1: { ...t.m1, priorites: t.m1.priorites.filter((_, j) => j !== i) } }))}>
                ✕
              </button>
            </span>
          </li>
        ))}
      </ol>
      <div style={{ display: 'flex', gap: 8 }}>
        <input type="text" value={nouvellePriorite} onChange={(ev) => setNouvellePriorite(ev.target.value)} placeholder="Formuler une priorité d’action" aria-label="Nouvelle priorité" />
        <button
          className="btn btn--petit"
          disabled={!nouvellePriorite.trim()}
          onClick={() => {
            modifier((t) => ({ ...t, m1: { ...t.m1, priorites: [...t.m1.priorites, nouvellePriorite.trim()] } }));
            setNouvellePriorite('');
          }}
        >
          Ajouter
        </button>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Mission 2 : diagnostic financier
// ---------------------------------------------------------------------------

function lireNombre(s: string): number | null {
  const n = Number(s.replace(/\s| |€|%/g, '').replace(',', '.'));
  return s.trim() && Number.isFinite(n) ? n : null;
}

function EspaceM2({ mission, travail, modifier }: { mission: Mission; travail: Travail; modifier: Modifier }) {
  const { e, base } = useEtab();
  const [verifies, setVerifies] = useState<Record<string, boolean>>({});
  const familles = Array.from(new Set(INDICATEURS.map((i) => i.famille)));
  return (
    <>
      <h3>1. Sélection des indicateurs</h3>
      <p className="petit attenue">
        Retenez les indicateurs les plus pertinents pour ce modèle économique (au moins quatre) et commentez leur évolution. Les valeurs proviennent des
        comptes ; leur interprétation vous revient.
      </p>
      <div className="grille-3">
        {familles.map((f) => (
          <fieldset key={f} className="carte" style={{ margin: 0 }}>
            <legend className="petit" style={{ fontWeight: 600 }}>
              {f}
            </legend>
            {INDICATEURS.filter((i) => i.famille === f).map((i) => (
              <label key={i.id} className="case" style={{ padding: '3px 0' }}>
                <input
                  type="checkbox"
                  checked={travail.m2.indicateurs.includes(i.id)}
                  onChange={(ev) =>
                    modifier((t) => ({ ...t, m2: { ...t.m2, indicateurs: ev.target.checked ? [...t.m2.indicateurs, i.id] : t.m2.indicateurs.filter((x) => x !== i.id) } }))
                  }
                />
                <span className="petit">{i.libelle}</span>
              </label>
            ))}
          </fieldset>
        ))}
      </div>
      {travail.m2.indicateurs.length > 0 && (
        <div className="table-defilante" style={{ marginTop: 20 }}>
          <table>
            <thead>
              <tr>
                <th>Indicateur</th>
                {EXERCICES.map((a) => (
                  <th key={a} className={`d ${a === 2026 ? 'col-budget' : ''}`}>
                    {a === 2026 ? '2026 B' : a}
                  </th>
                ))}
                <th style={{ minWidth: 260 }}>Votre commentaire</th>
              </tr>
            </thead>
            <tbody>
              {travail.m2.indicateurs.map((id) => {
                const d = INDICATEURS.find((i) => i.id === id);
                if (!d) return null;
                return (
                  <tr key={id}>
                    <td>
                      {d.libelle}
                      <Aide>{`${d.definition} Formule : ${d.formule}.`}</Aide>
                    </td>
                    {EXERCICES.map((a) => (
                      <td key={a} className={`d ${a === 2026 ? 'col-budget' : ''}`}>
                        {selonFormat(evaluer(e, id, a), d.format)}
                      </td>
                    ))}
                    <td>
                      <input
                        type="text"
                        aria-label={`Commentaire sur ${d.libelle}`}
                        value={travail.m2.commentairesIndicateurs[id] ?? ''}
                        onChange={(ev) => modifier((t) => ({ ...t, m2: { ...t.m2, commentairesIndicateurs: { ...t.m2.commentairesIndicateurs, [id]: ev.target.value } } }))}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <p className="petit" style={{ marginTop: 12 }}>
        Instruments complets : <Link to={`${base}/finances/sig`}>SIG</Link> · <Link to={`${base}/finances/caf`}>CAF</Link> ·{' '}
        <Link to={`${base}/finances/bilan`}>bilans</Link> · <Link to={`${base}/finances/analytique`}>coûts par activité</Link> ·{' '}
        <Link to={`${base}/finances/tresorerie`}>trésorerie mensuelle</Link> · <Link to={`${base}/finances/comparaison`}>comparaison</Link>.
      </p>

      {mission.controles && mission.controles.length > 0 && (
        <>
          <h3 style={{ marginTop: 32 }}>2. Contrôles de calcul</h3>
          <p className="petit attenue">Calculez vous-même ces grandeurs à partir des états financiers, puis vérifiez votre résultat. Le contrôle ne donne pas la réponse.</p>
          {mission.controles.map((c) => {
            const saisie = travail.m2.controles[c.id] ?? '';
            const attendu = evaluer(e, c.indicateur, c.exercice);
            const n = lireNombre(saisie);
            const valeur = n === null ? null : c.unite === '%' ? n / 100 : n;
            const ok = valeur !== null && attendu !== null && Math.abs(valeur - attendu) <= c.tolerance;
            return (
              <div key={c.id} className="controle">
                <div>
                  <label htmlFor={`ctrl-${c.id}`} style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                    {c.question}
                  </label>
                  <div className="petit attenue">{c.aide}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <input
                    id={`ctrl-${c.id}`}
                    type="text"
                    inputMode="decimal"
                    value={saisie}
                    onChange={(ev) => {
                      setVerifies((v) => ({ ...v, [c.id]: false }));
                      modifier((t) => ({ ...t, m2: { ...t.m2, controles: { ...t.m2.controles, [c.id]: ev.target.value } } }));
                    }}
                  />
                  <span className="petit attenue">{c.unite === '€/unité' ? '€' : c.unite === 'x' ? '' : c.unite}</span>
                </div>
                <button className="btn btn--contour btn--petit" disabled={valeur === null} onClick={() => setVerifies((v) => ({ ...v, [c.id]: true }))}>
                  Vérifier
                </button>
                {verifies[c.id] && (
                  <div className="controle__resultat" role="status">
                    {ok ? (
                      <span className="positif">Résultat cohérent avec les comptes (tolérance d’arrondi admise).</span>
                    ) : (
                      <span className="negatif">Écart avec les comptes. Revoyez la définition, le périmètre des postes et l’exercice concerné.</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}

      <h3 style={{ marginTop: 32 }}>3. Analyse rédigée</h3>
      {SECTIONS_M2.map((s) => (
        <ChampTexte
          key={s.id}
          id={`m2-${s.id}`}
          titre={s.titre}
          aide={s.aide}
          valeur={travail.m2.sections[s.id] ?? ''}
          onChange={(v) => modifier((t) => ({ ...t, m2: { ...t.m2, sections: { ...t.m2.sections, [s.id]: v } } }))}
        />
      ))}
    </>
  );
}

// ---------------------------------------------------------------------------
// Mission 3 : investissement
// ---------------------------------------------------------------------------

function EspaceM3({ mission, travail, modifier }: { mission: Mission; travail: Travail; modifier: Modifier }) {
  const { etab, base } = useEtab();
  const projets = etab.projets.filter((p) => (mission.projets ?? etab.projets.map((x) => x.id)).includes(p.id));
  const sims = travail.simulations;
  const observations = QUADRANTS.flatMap((q) => travail.m1.swot[q.id].map((o) => ({ ...o, quadrant: q.titre })));
  return (
    <>
      <h3>1. Projet étudié</h3>
      <div className="grille-2">
        {projets.map((p) => (
          <label key={p.id} className="carte" style={{ cursor: 'pointer', borderColor: travail.m3.projetId === p.id ? 'var(--c-accent)' : undefined }}>
            <span className="case" style={{ padding: 0 }}>
              <input type="radio" name="m3-projet" checked={travail.m3.projetId === p.id} onChange={() => modifier((t) => ({ ...t, m3: { ...t.m3, projetId: p.id } }))} />
              <strong>{p.titre}</strong>
            </span>
            <p className="petit attenue" style={{ margin: '8px 0' }}>
              {p.description}
            </p>
            <Link className="lien-fleche" to={`${base}/simulateur/${p.id}`}>
              Ouvrir dans le simulateur
            </Link>
          </label>
        ))}
      </div>
      <h3 style={{ marginTop: 28 }}>2. Simulation retenue</h3>
      {sims.length === 0 ? (
        <p className="message-vide">
          Aucune simulation enregistrée. Ouvrez le <Link to={`${base}/simulateur`}>simulateur</Link>, testez vos hypothèses puis enregistrez-les.
        </p>
      ) : (
        <div className="table-defilante">
          <table>
            <thead>
              <tr>
                <th />
                <th>Simulation</th>
                <th>Projet</th>
                <th className="d">Investissement</th>
                <th className="d">VAN</th>
                <th className="d">TRI</th>
                <th className="d">Délai de récupération</th>
              </tr>
            </thead>
            <tbody>
              {sims.map((s) => (
                <tr key={s.id}>
                  <td>
                    <input type="radio" name="m3-sim" aria-label={`Retenir ${s.nom}`} checked={travail.m3.simulationRetenue === s.id} onChange={() => modifier((t) => ({ ...t, m3: { ...t.m3, simulationRetenue: s.id, projetId: s.projetId } }))} />
                  </td>
                  <td>
                    {s.nom}
                    <div className="petit attenue">Scénario {s.parametres.scenario}</div>
                  </td>
                  <td className="petit">{etab.projets.find((p) => p.id === s.projetId)?.titre}</td>
                  <td className="d">{euros(s.synthese.montant)}</td>
                  <td className={`d ${s.synthese.van < 0 ? 'negatif' : 'positif'}`}>{euros(s.synthese.van)}</td>
                  <td className="d">{selonFormat(s.synthese.tri, '%')}</td>
                  <td className="d">{s.synthese.delai === null ? 'Au-delà de l’horizon' : `${s.synthese.delai.toFixed(1).replace('.', ',')} ans`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <h3 style={{ marginTop: 28 }}>3. Lien avec votre diagnostic</h3>
      <p className="petit attenue">Sélectionnez les observations de votre matrice SWOT (mission 1) qui justifient ce projet.</p>
      {observations.length === 0 ? (
        <p className="message-vide">
          Votre matrice SWOT est vide. <Link to={`${base}/missions/1`}>Complétez la mission 1</Link> pour pouvoir y adosser votre proposition.
        </p>
      ) : (
        <div className="grille-2">
          {observations.map((o) => (
            <label key={o.id} className="case">
              <input
                type="checkbox"
                checked={travail.m3.liensDiagnostic.includes(o.id)}
                onChange={(ev) =>
                  modifier((t) => ({ ...t, m3: { ...t.m3, liensDiagnostic: ev.target.checked ? [...t.m3.liensDiagnostic, o.id] : t.m3.liensDiagnostic.filter((x) => x !== o.id) } }))
                }
              />
              <span>
                <span className="pastille">{o.quadrant}</span> {o.texte}
              </span>
            </label>
          ))}
        </div>
      )}
      <h3 style={{ marginTop: 28 }}>4. Proposition argumentée</h3>
      {SECTIONS_M3.map((s) => (
        <ChampTexte key={s.id} id={`m3-${s.id}`} titre={s.titre} aide={s.aide} valeur={travail.m3.sections[s.id] ?? ''} onChange={(v) => modifier((t) => ({ ...t, m3: { ...t.m3, sections: { ...t.m3.sections, [s.id]: v } } }))} />
      ))}
    </>
  );
}

// ---------------------------------------------------------------------------
// Mission 4 : plan commercial
// ---------------------------------------------------------------------------

function EspaceM4({ travail, modifier }: { travail: Travail; modifier: Modifier }) {
  const budget = travail.m4.actions.reduce((s, a) => s + (lireNombre(a.cout) ?? 0), 0);
  type Action = Travail['m4']['actions'][number];
  type Ind = Travail['m4']['indicateurs'][number];
  const majAction = (id: string, k: keyof Action, v: string) => modifier((t) => ({ ...t, m4: { ...t.m4, actions: t.m4.actions.map((a) => (a.id === id ? { ...a, [k]: v } : a)) } }));
  const majInd = (id: string, k: keyof Ind, v: string) => modifier((t) => ({ ...t, m4: { ...t.m4, indicateurs: t.m4.indicateurs.map((a) => (a.id === id ? { ...a, [k]: v } : a)) } }));
  return (
    <>
      <div className="grille-2">
        {SECTIONS_M4.map((s) => (
          <ChampTexte key={s.id} id={`m4-${s.id}`} titre={s.titre} aide={s.aide} valeur={travail.m4.sections[s.id] ?? ''} onChange={(v) => modifier((t) => ({ ...t, m4: { ...t.m4, sections: { ...t.m4.sections, [s.id]: v } } }))} />
        ))}
      </div>
      <h3>Plan d’action</h3>
      <div className="table-defilante table-saisie">
        <table>
          <thead>
            <tr>
              <th>Action</th>
              <th>Public visé</th>
              <th>Coût (€)</th>
              <th>Échéance</th>
              <th>Responsable</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {travail.m4.actions.map((a) => (
              <tr key={a.id}>
                {(['action', 'cible', 'cout', 'echeance', 'responsable'] as const).map((k) => (
                  <td key={k}>
                    <input type="text" aria-label={k} value={a[k]} onChange={(ev) => majAction(a.id, k, ev.target.value)} inputMode={k === 'cout' ? 'decimal' : undefined} />
                  </td>
                ))}
                <td>
                  <button className="btn btn--danger btn--petit" aria-label="Supprimer l’action" onClick={() => modifier((t) => ({ ...t, m4: { ...t.m4, actions: t.m4.actions.filter((x) => x.id !== a.id) } }))}>
                    ✕
                  </button>
                </td>
              </tr>
            ))}
            <tr className="total">
              <td colSpan={2}>Budget total</td>
              <td className="d">{euros(budget)}</td>
              <td colSpan={3} />
            </tr>
          </tbody>
        </table>
      </div>
      <button
        className="btn btn--contour btn--petit"
        style={{ marginTop: 10 }}
        onClick={() => modifier((t) => ({ ...t, m4: { ...t.m4, actions: [...t.m4.actions, { id: nouvelId(), action: '', cible: '', cout: '', echeance: '', responsable: '' }] } }))}
      >
        + Ajouter une action
      </button>
      <h3 style={{ marginTop: 28 }}>Indicateurs de résultat</h3>
      <div className="table-defilante table-saisie">
        <table>
          <thead>
            <tr>
              <th>Indicateur</th>
              <th>Valeur actuelle</th>
              <th>Cible</th>
              <th>Échéance</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {travail.m4.indicateurs.map((a) => (
              <tr key={a.id}>
                {(['indicateur', 'actuel', 'cible', 'echeance'] as const).map((k) => (
                  <td key={k}>
                    <input type="text" aria-label={k} value={a[k]} onChange={(ev) => majInd(a.id, k, ev.target.value)} />
                  </td>
                ))}
                <td>
                  <button className="btn btn--danger btn--petit" aria-label="Supprimer l’indicateur" onClick={() => modifier((t) => ({ ...t, m4: { ...t.m4, indicateurs: t.m4.indicateurs.filter((x) => x.id !== a.id) } }))}>
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        className="btn btn--contour btn--petit"
        style={{ marginTop: 10 }}
        onClick={() => modifier((t) => ({ ...t, m4: { ...t.m4, indicateurs: [...t.m4.indicateurs, { id: nouvelId(), indicateur: '', actuel: '', cible: '', echeance: '' }] } }))}
      >
        + Ajouter un indicateur
      </button>
    </>
  );
}

// ---------------------------------------------------------------------------
// Mission 5 : arbitrage
// ---------------------------------------------------------------------------

function EspaceM5({ mission, travail, modifier }: { mission: Mission; travail: Travail; modifier: Modifier }) {
  const { etab, base } = useEtab();
  const options = mission.options ?? [];
  const total = (id: string) => CRITERES_M5.reduce((s, c) => s + (travail.m5.evaluations[id]?.[c.id] ?? 0), 0);
  const retenue = options.find((o) => o.id === travail.m5.optionRetenue);
  return (
    <>
      <h3>1. Les options sur la table</h3>
      <div className="grille-2">
        {options.map((o) => (
          <label key={o.id} className="carte" style={{ cursor: 'pointer', borderColor: travail.m5.optionRetenue === o.id ? 'var(--c-accent)' : undefined }}>
            <span className="case" style={{ padding: 0 }}>
              <input type="radio" name="m5-option" checked={travail.m5.optionRetenue === o.id} onChange={() => modifier((t) => ({ ...t, m5: { ...t.m5, optionRetenue: o.id } }))} />
              <strong>{o.titre}</strong>
            </span>
            <p className="petit attenue" style={{ margin: '8px 0 0' }}>
              {o.description}
            </p>
          </label>
        ))}
      </div>
      <h3 style={{ marginTop: 28 }}>2. Grille de comparaison</h3>
      <p className="petit attenue">Notez chaque option de 1 (défavorable) à 5 (très favorable) sur chaque critère. La grille structure la réflexion ; elle ne décide pas à votre place.</p>
      <div className="table-defilante table-saisie">
        <table>
          <thead>
            <tr>
              <th>Option</th>
              {CRITERES_M5.map((c) => (
                <th key={c.id} className="d">
                  {c.libelle}
                </th>
              ))}
              <th className="d">Total</th>
              <th>Commentaire</th>
            </tr>
          </thead>
          <tbody>
            {options.map((o) => (
              <tr key={o.id}>
                <td>{o.titre}</td>
                {CRITERES_M5.map((c) => (
                  <td key={c.id} className="d">
                    <select
                      aria-label={`${o.titre} : ${c.libelle}`}
                      value={travail.m5.evaluations[o.id]?.[c.id] ?? ''}
                      onChange={(ev) =>
                        modifier((t) => ({
                          ...t,
                          m5: { ...t.m5, evaluations: { ...t.m5.evaluations, [o.id]: { ...(t.m5.evaluations[o.id] ?? {}), [c.id]: Number(ev.target.value) } } },
                        }))
                      }
                      style={{ width: 64 }}
                    >
                      <option value="">·</option>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </td>
                ))}
                <td className="d">
                  <strong>{total(o.id) || '·'}</strong>
                </td>
                <td>
                  <input type="text" aria-label={`Commentaire ${o.titre}`} value={travail.m5.commentairesOptions[o.id] ?? ''} onChange={(ev) => modifier((t) => ({ ...t, m5: { ...t.m5, commentairesOptions: { ...t.m5.commentairesOptions, [o.id]: ev.target.value } } }))} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h3 style={{ marginTop: 28 }}>3. Note de recommandation</h3>
      {SECTIONS_M5.map((s) => (
        <ChampTexte key={s.id} id={`m5-${s.id}`} titre={s.titre} aide={s.aide} valeur={travail.m5.sections[s.id] ?? ''} onChange={(v) => modifier((t) => ({ ...t, m5: { ...t.m5, sections: { ...t.m5.sections, [s.id]: v } } }))} lignes={s.id === 'recommandation' ? 5 : 4} />
      ))}
      <div className="encart encart--accent">
        <p className="petit" style={{ margin: 0 }}>
          Aperçu : votre note est mise en forme pour la direction dans <Link to={`${base}/impression`}>la version imprimable</Link>
          {retenue ? `, avec l’option « ${retenue.titre} »` : ''}. Destinataire : {etab.dirigeant.nom}.
        </p>
      </div>
    </>
  );
}
