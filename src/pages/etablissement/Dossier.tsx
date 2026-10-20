import { Link } from 'react-router-dom';
import { useEtab } from '../../contexte';
import { Photo } from '../../components/Photo';
import { BadgeEtat, EnteteRubrique, FilAriane, Section, TitreSection, Aide } from '../../components/commun';
import { GraphiqueBarres } from '../../components/Graphiques';
import { recettePrestation, somme } from '../../finance/engine';
import { euros, nombre, pourcent } from '../../lib/format';
import { EXERCICES, type Installation, type Organigramme as Noeud, type Rubrique } from '../../types';

function Ariane({ libelle }: { libelle: string }) {
  const { etab, base } = useEtab();
  return <FilAriane elements={[{ libelle: 'Galerie', vers: '/?galerie' }, { libelle: etab.nomCourt, vers: base }, { libelle: 'Dossier' }, { libelle }]} />;
}

/** Documents rattachés à une rubrique, pour inviter à croiser les sources. */
function DocumentsLies({ rubrique }: { rubrique: Rubrique }) {
  const { etab, base } = useEtab();
  const docs = etab.documents.filter((d) => d.rubriques?.includes(rubrique));
  if (!docs.length) return null;
  return (
    <Section alt>
      <span className="surtitre">Pièces du dossier</span>
      <h3>Documents liés à cette rubrique</h3>
      <div className="liste-docs" style={{ marginTop: 18 }}>
        {docs.map((d) => (
          <Link key={d.id} to={`${base}/documents/${d.id}`} className="ligne-doc">
            <span className="ligne-doc__type">{d.type.replace('-', ' ')}</span>
            <div>
              <h3>{d.titre}</h3>
              <p>{d.resume}</p>
            </div>
            <span className="petit attenue">{new Date(d.date).toLocaleDateString('fr-FR')}</span>
          </Link>
        ))}
      </div>
    </Section>
  );
}

// ---------------------------------------------------------------------------

export function Presentation() {
  const { etab } = useEtab();
  const p = etab.presentation;
  return (
    <>
      <EnteteRubrique surtitre="Notre établissement" titre={etab.nom} texte={p.introduction} photo={`${etab.id}-lieu`} />
      <Ariane libelle="Notre établissement" />
      <Section>
        <div className="editorial">
          <div>
            <span className="surtitre">Histoire</span>
            <h2>De {etab.creation} à aujourd’hui</h2>
            <dl className="petit" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '6px 16px', marginTop: 24 }}>
              <dt className="attenue">Forme juridique</dt>
              <dd style={{ margin: 0 }}>{etab.formeJuridique}</dd>
              <dt className="attenue">Gouvernance</dt>
              <dd style={{ margin: 0 }}>{etab.gouvernance}</dd>
              <dt className="attenue">Direction</dt>
              <dd style={{ margin: 0 }}>
                {etab.dirigeant.nom}, {etab.dirigeant.fonction}
              </dd>
              <dt className="attenue">Implantation</dt>
              <dd style={{ margin: 0 }}>
                {etab.lieu.commune}, {etab.lieu.departement}, {etab.lieu.region}
              </dd>
            </dl>
          </div>
          <div>
            {p.histoire.map((t, i) => (
              <p key={i} className={i === 0 ? 'chapeau' : ''}>
                {t}
              </p>
            ))}
          </div>
        </div>
      </Section>
      <Section alt>
        <div className="editorial">
          <div>
            <span className="surtitre">Chronologie</span>
            <h2>Les étapes marquantes</h2>
          </div>
          <ol className="chronologie">
            {p.chronologie.map((ev) => (
              <li key={ev.annee + ev.titre}>
                <span className="chronologie__annee">{ev.annee}</span>
                <div>
                  <h4>{ev.titre}</h4>
                  <p className="attenue" style={{ margin: 0 }}>
                    {ev.texte}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Section>
      <Section>
        <TitreSection surtitre="Valeurs" titre="Ce qui guide l’établissement" />
        <div className="grille-3">
          {p.valeurs.map((v) => (
            <div key={v.titre} className="carte">
              <h3>{v.titre}</h3>
              <p className="attenue" style={{ margin: 0 }}>
                {v.texte}
              </p>
            </div>
          ))}
        </div>
      </Section>
      <Section alt>
        <div className="grille-2">
          <div>
            <span className="surtitre">Organisation</span>
            <h3>Comment l’établissement fonctionne</h3>
            <p>{p.organisation}</p>
          </div>
          <div>
            <span className="surtitre">Modèle économique</span>
            <h3>D’où viennent les ressources</h3>
            <p>{p.modeleEconomique}</p>
          </div>
        </div>
      </Section>
      <DocumentsLies rubrique="etablissement" />
    </>
  );
}

// ---------------------------------------------------------------------------

export function Installations() {
  const { etab } = useEtab();
  const ins = etab.installations;
  return (
    <>
      <EnteteRubrique surtitre="Installations et moyens de production" titre="Le site et ses équipements" texte={ins.synthese} photo={`${etab.id}-lieu`} />
      <Ariane libelle="Installations" />
      <Section>
        <div className="grille-auto">
          {ins.elements.map((el) =>
            el.photo ? (
              <article key={el.nom} className="carte-photo">
                <Photo cle={`${etab.id}-${el.photo}`} sizes="(max-width: 640px) 100vw, 33vw" />
                <div className="carte-photo__corps">
                  <ElementInstallation el={el} />
                </div>
              </article>
            ) : (
              <article key={el.nom} className="carte">
                <ElementInstallation el={el} />
              </article>
            ),
          )}
        </div>
      </Section>
      <Section alt>
        <div className="grille-2">
          <div>
            <TitreSection surtitre="Maintenance" titre="Entretien et renouvellement" />
            {ins.maintenance.map((m) => (
              <div key={m.titre} style={{ marginBottom: 18 }}>
                <h4>{m.titre}</h4>
                <p className="attenue">{m.texte}</p>
              </div>
            ))}
          </div>
          <div>
            <TitreSection surtitre="Contraintes" titre="Limites de l’outil de production" />
            <ul className="liste-propre">
              {ins.contraintes.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
      <RegistreImmobilisations />
      <DocumentsLies rubrique="installations" />
    </>
  );
}

function ElementInstallation({ el }: { el: Installation }) {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
        <h3 style={{ marginBottom: 6 }}>{el.nom}</h3>
        {el.annee && <span className="petit attenue num">{el.annee}</span>}
      </div>
      <BadgeEtat etat={el.etat} />
      {(el.capacite || el.surface) && (
        <p className="petit" style={{ margin: '10px 0 6px', fontWeight: 600 }}>
          {[el.capacite, el.surface].filter(Boolean).join(' · ')}
        </p>
      )}
      <p className="petit attenue" style={{ margin: '8px 0 0' }}>
        {el.description}
      </p>
    </>
  );
}

function RegistreImmobilisations() {
  const { e } = useEtab();
  const plans = e.amortissements;
  return (
    <Section>
      <TitreSection surtitre="Investissements" titre="Registre des immobilisations">
        Valeurs d’origine, dates de mise en service et durées d’amortissement retenues. Les lignes « budget » sont prévues en 2026.
      </TitreSection>
      <div className="table-defilante">
        <table>
          <thead>
            <tr>
              <th>Immobilisation</th>
              <th>Mise en service</th>
              <th className="d">Valeur d’origine</th>
              <th className="d">Durée</th>
              <th className="d">Dotation 2025</th>
              <th className="d">VNC fin 2025</th>
              <th>Observation</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((p) => (
              <tr key={p.immo.id}>
                <td>{p.immo.libelle}</td>
                <td className="num">{p.immo.miseEnService.split('-').reverse().join('/')}</td>
                <td className="d">{euros(p.immo.valeurOrigine)}</td>
                <td className="d">{p.immo.duree ? `${p.immo.duree} ans` : 'Non amorti'}</td>
                <td className="d">{euros(p.dotation[2025] ?? 0)}</td>
                <td className="d">{euros(p.net[2025] ?? 0)}</td>
                <td className="petit attenue">
                  {p.immo.prevue ? 'Budget 2026' : p.cession ? `Cédé en ${p.cession.annee} pour ${euros(p.cession.prix)}` : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

// ---------------------------------------------------------------------------

const STATUTS: Record<string, string> = {
  propriete: 'Propriété',
  pension: 'Pension',
  confiage: 'Confiage',
  location: 'Location',
  'demi-pension': 'Demi-pension',
  elevage: 'Élevage',
  reproducteur: 'Reproducteur',
};

export function Cavalerie() {
  const { etab } = useEtab();
  const c = etab.cavalerie;
  if (!c) {
    const r = etab.ressources;
    return (
      <>
        <EnteteRubrique surtitre="Ressources" titre={r?.titre ?? 'Ressources productives'} texte={r?.synthese} photo={`${etab.id}-chevaux`} />
        <Ariane libelle={r?.titre ?? 'Ressources'} />
        <Section>
          {r ? (
            <div className="table-defilante">
              <table>
                <thead>
                  <tr>
                    <th>Ressource</th>
                    <th>Catégorie</th>
                    <th>Quantité</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {r.elements.map((x) => (
                    <tr key={x.nom}>
                      <td>
                        <strong>{x.nom}</strong>
                      </td>
                      <td>{x.categorie}</td>
                      <td className="num">{x.quantite}</td>
                      <td className="attenue">{x.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="message-vide">Cette structure ne détient pas de cavalerie.</p>
          )}
        </Section>
      </>
    );
  }
  const total = somme(c.effectifs.map((x) => x.nombre));
  const parStatut = Object.entries(
    c.effectifs.reduce<Record<string, number>>((acc, x) => ((acc[STATUTS[x.statut] ?? x.statut] = (acc[STATUTS[x.statut] ?? x.statut] ?? 0) + x.nombre), acc), {}),
  );
  return (
    <>
      <EnteteRubrique surtitre="Cavalerie et activité équine" titre={`${total} équidés présents`} texte={c.synthese} photo={`${etab.id}-chevaux`} />
      <Ariane libelle="Cavalerie" />
      <Section>
        <div className="grille-2">
          <div>
            <TitreSection surtitre="Effectifs" titre="Composition par catégorie et statut" />
            <div className="table-defilante">
              <table>
                <thead>
                  <tr>
                    <th>Catégorie</th>
                    <th>Statut</th>
                    <th className="d">Nombre</th>
                    <th>Utilisation</th>
                  </tr>
                </thead>
                <tbody>
                  {c.effectifs.map((x) => (
                    <tr key={x.categorie + x.statut}>
                      <td>{x.categorie}</td>
                      <td>{STATUTS[x.statut]}</td>
                      <td className="d">{x.nombre}</td>
                      <td className="petit attenue">{x.usage}</td>
                    </tr>
                  ))}
                  <tr className="total">
                    <td colSpan={2}>Total</td>
                    <td className="d">{total}</td>
                    <td />
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="pile">
            <GraphiqueBarres titre="Répartition par âge" donnees={c.parAge.map((a) => ({ nom: a.tranche, valeur: a.nombre }))} unite="équidés" />
            <GraphiqueBarres titre="Répartition par statut" donnees={parStatut.map(([nom, valeur]) => ({ nom, valeur }))} unite="équidés" couleur={2} />
          </div>
        </div>
      </Section>
      <Section alt>
        <div className="grille-2">
          <div>
            <TitreSection surtitre="Disponibilité" titre="État de la cavalerie" />
            <ul className="liste-propre">
              {c.disponibilite.map((d) => (
                <li key={d.etat}>
                  <strong className="num">{d.nombre}</strong> · {d.etat}
                  {d.commentaire && <span className="attenue"> : {d.commentaire}</span>}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <TitreSection surtitre="Bien-être" titre="Règles d’utilisation" />
            <ul className="liste-propre">
              {c.reglesUtilisation.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
      <Section>
        <TitreSection surtitre="Fiches individuelles" titre="Quelques pensionnaires" />
        <div className="grille-auto">
          {c.fiches.map((f) => (
            <article key={f.nom} className="fiche-cheval">
              <h3>{f.nom}</h3>
              <span className="petit attenue">
                {f.race} · {f.sexe} · {f.robe}
              </span>
              <dl>
                <dt>Naissance</dt>
                <dd className="num">
                  {f.naissance} ({2025 - f.naissance} ans)
                </dd>
                <dt>Rôle</dt>
                <dd>{f.role}</dd>
                <dt>Statut</dt>
                <dd>{f.statut}</dd>
              </dl>
              <p className="petit" style={{ margin: 0 }}>
                {f.notes}
              </p>
            </article>
          ))}
        </div>
      </Section>
      <DocumentsLies rubrique="cavalerie" />
    </>
  );
}

// ---------------------------------------------------------------------------

export function Activites() {
  const { etab, base } = useEtab();
  const a = etab.activites;
  const ca2025 = somme(a.prestations.map((p) => recettePrestation(p, 2025)));
  return (
    <>
      <EnteteRubrique surtitre="Activités et prestations" titre="Catalogue des prestations" texte={a.synthese} photo={`${etab.id}-activite`} />
      <Ariane libelle="Activités et prestations" />
      <Section>
        <div className="grille-auto">
          {a.prestations.map((p) => (
            <article key={p.id} className="prestation">
              <span className="surtitre" style={{ marginBottom: 0 }}>
                {etab.finances.analytique?.sections.find((s) => s.id === p.activite)?.nom ?? p.activite}
              </span>
              <h3 style={{ margin: 0 }}>{p.nom}</h3>
              <div className="prestation__prix num">
                {euros(p.prix[2026])}
                <small>HT / {p.unite} (tarif 2026)</small>
              </div>
              <p className="petit attenue" style={{ margin: 0 }}>
                {p.description}
              </p>
              {(p.periode || p.clientele) && (
                <p className="petit" style={{ margin: 0 }}>
                  {[p.periode, p.clientele].filter(Boolean).join(' · ')}
                </p>
              )}
            </article>
          ))}
        </div>
      </Section>
      <Section alt>
        <TitreSection surtitre="Historique" titre="Tarifs, volumes et recettes">
          Les recettes de chaque prestation sont le produit du prix unitaire hors taxes par le volume vendu. Leur total constitue le chiffre d’affaires
          du compte de résultat. 2026 est un budget.
        </TitreSection>
        <div className="table-defilante">
          <table>
            <thead>
              <tr>
                <th>Prestation</th>
                <th>Unité</th>
                {EXERCICES.map((an) => (
                  <th key={an} className={`d ${an === 2026 ? 'col-budget' : ''}`} colSpan={1}>
                    Prix {an === 2026 ? '2026 B' : an}
                  </th>
                ))}
                {EXERCICES.map((an) => (
                  <th key={'v' + an} className={`d ${an === 2026 ? 'col-budget' : ''}`}>
                    Volume {an === 2026 ? '2026 B' : an}
                  </th>
                ))}
                <th className="d">Recette 2025</th>
                <th className="d">Part 2025</th>
              </tr>
            </thead>
            <tbody>
              {a.prestations.map((p) => (
                <tr key={p.id}>
                  <td>{p.nom}</td>
                  <td className="petit attenue">{p.unite}</td>
                  {EXERCICES.map((an) => (
                    <td key={an} className={`d ${an === 2026 ? 'col-budget' : ''}`}>
                      {euros(p.prix[an])}
                    </td>
                  ))}
                  {EXERCICES.map((an) => (
                    <td key={'v' + an} className={`d ${an === 2026 ? 'col-budget' : ''}`}>
                      {nombre(p.volume[an])}
                    </td>
                  ))}
                  <td className="d">{euros(recettePrestation(p, 2025))}</td>
                  <td className="d">{pourcent(recettePrestation(p, 2025) / ca2025)}</td>
                </tr>
              ))}
              <tr className="total">
                <td colSpan={10}>Chiffre d’affaires 2025</td>
                <td className="d">{euros(ca2025)}</td>
                <td className="d">100 %</td>
              </tr>
            </tbody>
          </table>
        </div>
        <Occupations />
      </Section>
      {a.calendrier && (
        <Section>
          <div className="editorial">
            <div>
              <span className="surtitre">Calendrier</span>
              <h2>Le rythme de l’année</h2>
            </div>
            <ul className="liste-propre">
              {a.calendrier.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </Section>
      )}
      <Section alt>
        <p className="attenue" style={{ margin: 0 }}>
          La rentabilité de chaque activité s’étudie dans <Link to={`${base}/finances/analytique`}>l’analyse des coûts par activité</Link>.
        </p>
      </Section>
      <DocumentsLies rubrique="activites" />
    </>
  );
}

function Occupations() {
  const { etab } = useEtab();
  const avecCapacite = etab.activites.prestations.filter((p) => p.capaciteAnnuelle);
  if (!avecCapacite.length) return null;
  return (
    <div style={{ marginTop: 32 }}>
      <h3>
        Capacités et taux d’utilisation
        <Aide>Volume vendu rapporté à la capacité annuelle déclarée (par exemple nombre de boxes × 12 mois).</Aide>
      </h3>
      <div className="table-defilante">
        <table>
          <thead>
            <tr>
              <th>Prestation</th>
              <th className="d">Capacité annuelle</th>
              {EXERCICES.map((an) => (
                <th key={an} className={`d ${an === 2026 ? 'col-budget' : ''}`}>
                  {an === 2026 ? '2026 B' : an}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {avecCapacite.map((p) => (
              <tr key={p.id}>
                <td>
                  {p.nom} <span className="attenue petit">({p.unite})</span>
                </td>
                <td className="d">{nombre(p.capaciteAnnuelle![2025])}</td>
                {EXERCICES.map((an) => (
                  <td key={an} className={`d ${an === 2026 ? 'col-budget' : ''}`}>
                    {pourcent(p.volume[an] / p.capaciteAnnuelle![an])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

export function Clients() {
  const { etab } = useEtab();
  const c = etab.clients;
  return (
    <>
      <EnteteRubrique surtitre="Clients et développement commercial" titre="Qui sont nos clients ?" texte={c.synthese} photo={`${etab.id}-activite`} />
      <Ariane libelle="Clients" />
      <Section>
        <div className="grille-2">
          <div>
            <TitreSection surtitre="Segmentation" titre="Les clientèles" />
            <div className="pile">
              {c.segments.map((s) => (
                <div key={s.nom}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                    <strong>{s.nom}</strong>
                    <span className="num">{pourcent(s.part)}</span>
                  </div>
                  <div className="jauge" style={{ margin: '6px 0' }}>
                    <span style={{ width: `${s.part * 100}%` }} />
                  </div>
                  <p className="petit attenue" style={{ margin: 0 }}>
                    {s.effectif && <>{s.effectif}. </>}
                    {s.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <TitreSection surtitre="Indicateurs" titre="Fréquentation et fidélité" />
            <div className="table-defilante">
              <table>
                <thead>
                  <tr>
                    <th>Indicateur</th>
                    {EXERCICES.map((an) => (
                      <th key={an} className={`d ${an === 2026 ? 'col-budget' : ''}`}>
                        {an === 2026 ? '2026 B' : an}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {c.indicateurs.map((i) => (
                    <tr key={i.libelle}>
                      <td>
                        {i.libelle}
                        {i.unite && <span className="attenue"> ({i.unite})</span>}
                        {i.commentaire && <Aide>{i.commentaire}</Aide>}
                      </td>
                      {EXERCICES.map((an) => (
                        <td key={an} className={`d ${an === 2026 ? 'col-budget' : ''}`}>
                          {i.valeurs[an] !== undefined ? nombre(i.valeurs[an], 1) : '·'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Section>
      {c.satisfaction && (
        <Section alt>
          <div className="grille-2">
            <div>
              <TitreSection surtitre="Satisfaction" titre="Ce que disent les clients">
                <span className="petit">{c.satisfaction.source}</span>
              </TitreSection>
              <GraphiqueBarres
                titre="Notes moyennes"
                horizontal
                donnees={c.satisfaction.criteres.map((x) => ({ nom: x.critere, valeur: x.note }))}
                max={c.satisfaction.criteres[0]?.noteMax ?? 5}
                unite={`sur ${c.satisfaction.criteres[0]?.noteMax ?? 5}`}
              />
            </div>
            <div className="pile">
              {c.verbatims.map((v) => (
                <blockquote key={v.texte} className="verbatim">
                  <p>« {v.texte} »</p>
                  <footer>
                    {v.auteur}, {v.profil}
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </Section>
      )}
      <Section>
        <div className="grille-2">
          <div>
            <TitreSection surtitre="Communication" titre="Présence et canaux" />
            <ul className="liste-propre">
              {c.communication.map((x) => (
                <li key={x.canal}>
                  <strong>{x.canal}</strong> : <span className="attenue">{x.description}</span>
                </li>
              ))}
            </ul>
          </div>
          {c.reclamations && (
            <div>
              <TitreSection surtitre="Réclamations" titre="Remontées clients" />
              <ul className="liste-propre">
                {c.reclamations.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {!c.satisfaction && c.verbatims.length > 0 && (
          <div className="grille-2" style={{ marginTop: 40 }}>
            {c.verbatims.map((v) => (
              <blockquote key={v.texte} className="verbatim">
                <p>« {v.texte} »</p>
                <footer>
                  {v.auteur}, {v.profil}
                </footer>
              </blockquote>
            ))}
          </div>
        )}
      </Section>
      <DocumentsLies rubrique="clients" />
    </>
  );
}

// ---------------------------------------------------------------------------

export function Fournisseurs() {
  const { etab, e } = useEtab();
  const f = etab.fournisseurs;
  const lignes = [
    ...etab.finances.achatsMarchandises,
    ...etab.finances.achatsApprovisionnements,
    ...etab.finances.chargesExternes,
    ...etab.finances.impotsTaxes,
    ...etab.finances.autresCharges,
  ];
  const achatsTotal = e.cr[2025].achatsMarchandises + e.cr[2025].achatsApprovisionnements + e.cr[2025].chargesExternes;
  return (
    <>
      <EnteteRubrique surtitre="Fournisseurs et partenaires" titre="Achats, contrats et dépendances" texte={f.synthese} photo={`${etab.id}-detail`} />
      <Ariane libelle="Fournisseurs et partenaires" />
      <Section>
        <TitreSection surtitre="Principaux fournisseurs" titre="Fiches fournisseurs">
          Montants annuels estimés à partir des comptes de charges auxquels chaque fournisseur est rattaché. Achats et charges externes 2025 :{' '}
          <strong className="num">{euros(achatsTotal)}</strong>.
        </TitreSection>
        <div className="grille-auto">
          {f.liste.map((x) => {
            const l = lignes.find((y) => y.id === x.ligne);
            const m25 = (l?.montants[2025] ?? 0) * x.part;
            const m24 = (l?.montants[2024] ?? 0) * x.part;
            return (
              <article key={x.nom} className="carte">
                <span className="surtitre" style={{ marginBottom: 8 }}>
                  {x.categorie}
                </span>
                <h3 style={{ marginBottom: 6 }}>{x.nom}</h3>
                <p className="petit attenue">{x.prestation}</p>
                <dl className="petit" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4px 12px', margin: '12px 0' }}>
                  <dt className="attenue">Montant 2025</dt>
                  <dd className="num" style={{ margin: 0, fontWeight: 600 }}>
                    {euros(m25)} <span className="attenue">({m24 ? `${m25 >= m24 ? '+' : ''}${pourcent((m25 - m24) / m24)} sur un an` : 'nouveau'})</span>
                  </dd>
                  <dt className="attenue">Évolution tarifaire</dt>
                  <dd style={{ margin: 0 }}>{x.evolutionTarifaire}</dd>
                  <dt className="attenue">Paiement</dt>
                  <dd style={{ margin: 0 }}>{x.delaiPaiement}</dd>
                  <dt className="attenue">Conditions</dt>
                  <dd style={{ margin: 0 }}>{x.conditions}</dd>
                  <dt className="attenue">Dépendance</dt>
                  <dd style={{ margin: 0 }}>
                    <span className={`badge badge--${x.dependance}`}>{x.dependance}</span>
                  </dd>
                </dl>
                <p className="petit" style={{ margin: 0 }}>
                  <strong>Risques : </strong>
                  {x.risques}
                </p>
              </article>
            );
          })}
        </div>
      </Section>
      <Section alt>
        <TitreSection surtitre="Partenaires" titre="Réseau institutionnel et professionnel" />
        <div className="grille-3">
          {f.partenaires.map((p) => (
            <div key={p.nom} className="carte">
              <span className="petit attenue">{p.type}</span>
              <h4 style={{ margin: '4px 0 8px' }}>{p.nom}</h4>
              <p className="petit" style={{ margin: 0 }}>
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </Section>
      <DocumentsLies rubrique="fournisseurs" />
    </>
  );
}

// ---------------------------------------------------------------------------

function Arbre({ noeuds, parent }: { noeuds: Noeud[]; parent?: string }) {
  const enfants = noeuds.filter((n) => n.parent === parent);
  if (!enfants.length) return null;
  return (
    <ul>
      {enfants.map((n) => (
        <li key={n.id}>
          <div className="noeud">
            <strong>{n.intitule}</strong>
            <span>{n.personne}</span>
          </div>
          <Arbre noeuds={noeuds} parent={n.id} />
        </li>
      ))}
    </ul>
  );
}

export function RH() {
  const { etab, e } = useEtab();
  const rh = etab.rh;
  const postes = etab.finances.personnel;
  const totalEtp = (an: (typeof EXERCICES)[number]) => somme(postes.map((p) => p.etp[an]));
  return (
    <>
      <EnteteRubrique surtitre="Ressources humaines et organisation" titre="L’équipe" texte={rh.synthese} photo={`${etab.id}-activite`} />
      <Ariane libelle="Équipe et organisation" />
      <Section>
        <div className="grille-2">
          <div className="organigramme">
            <TitreSection surtitre="Organigramme" titre="Qui fait quoi" />
            <Arbre noeuds={rh.organigramme} />
          </div>
          <div>
            <TitreSection surtitre="Direction" titre="Le rôle du dirigeant" />
            <p>{rh.dirigeant}</p>
            {rh.conventionCollective && (
              <p className="petit attenue">
                Cadre conventionnel : {rh.conventionCollective}.
              </p>
            )}
            {etab.finances.exploitant && (
              <div className="encart encart--accent" style={{ marginTop: 20 }}>
                <p className="petit" style={{ margin: 0 }}>
                  <strong>Exploitant non salarié.</strong> {etab.finances.exploitant.description} Cotisations sociales personnelles 2025 :{' '}
                  {euros(etab.finances.exploitant.cotisations[2025])} ; prélèvements 2025 : {euros(etab.finances.exploitant.prelevements[2025])}.
                </p>
              </div>
            )}
          </div>
        </div>
      </Section>
      <Section alt>
        <TitreSection surtitre="Effectifs" titre="Postes, temps de travail et coûts">
          Coût employeur = salaire brut × (1 + taux de charges patronales). Les montants alimentent directement le compte de résultat.
        </TitreSection>
        <div className="table-defilante">
          <table>
            <thead>
              <tr>
                <th>Poste</th>
                <th>Titulaire</th>
                {EXERCICES.map((an) => (
                  <th key={an} className={`d ${an === 2026 ? 'col-budget' : ''}`}>
                    ETP {an === 2026 ? '2026 B' : an}
                  </th>
                ))}
                <th className="d">Brut annuel / ETP 2025</th>
                <th className="d">Coût employeur 2025</th>
              </tr>
            </thead>
            <tbody>
              {postes.map((p) => (
                <tr key={p.id}>
                  <td>{p.intitule}</td>
                  <td className="attenue">{p.titulaire}</td>
                  {EXERCICES.map((an) => (
                    <td key={an} className={`d ${an === 2026 ? 'col-budget' : ''}`}>
                      {nombre(p.etp[an], 2)}
                    </td>
                  ))}
                  <td className="d">{euros(p.brutAnnuelEtp[2025])}</td>
                  <td className="d">{euros(p.etp[2025] * p.brutAnnuelEtp[2025] * (1 + p.tauxCharges))}</td>
                </tr>
              ))}
              <tr className="total">
                <td colSpan={2}>Total salariés</td>
                {EXERCICES.map((an) => (
                  <td key={an} className={`d ${an === 2026 ? 'col-budget' : ''}`}>
                    {nombre(totalEtp(an), 2)}
                  </td>
                ))}
                <td />
                <td className="d">{euros(e.cr[2025].salaires + e.cr[2025].chargesSociales - (etab.finances.exploitant?.cotisations[2025] ?? 0))}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>
      <Section>
        <div className="grille-2">
          <div>
            <TitreSection surtitre="Organisation du travail" titre="Fonctionnement quotidien" />
            <ul className="liste-propre">
              {rh.organisationTravail.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
          </div>
          <div>
            <TitreSection surtitre="Saisonnalité" titre="Variations de charge" />
            <p>{rh.saisonnalite}</p>
            {rh.enjeux && (
              <>
                <h4 style={{ marginTop: 24 }}>Points d’attention signalés par la direction</h4>
                <ul className="liste-propre">
                  {rh.enjeux.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </Section>
      <DocumentsLies rubrique="rh" />
    </>
  );
}

// ---------------------------------------------------------------------------

export function Environnement() {
  const { etab } = useEtab();
  const en = etab.environnement;
  return (
    <>
      <EnteteRubrique surtitre="Environnement et marché" titre="Territoire, concurrence et contexte" texte={en.synthese} photo={`${etab.id}-hero`} />
      <Ariane libelle="Environnement et marché" />
      <Section>
        <div className="editorial">
          <div>
            <span className="surtitre">Territoire</span>
            <h2>{etab.lieu.region}</h2>
            <p className="attenue">{etab.lieu.cadre}</p>
          </div>
          <div>
            <p className="chapeau">{en.territoire}</p>
            <div className="table-defilante" style={{ marginTop: 20 }}>
              <table>
                <tbody>
                  {en.donneesTerritoire.map((d) => (
                    <tr key={d.libelle}>
                      <td>{d.libelle}</td>
                      <td className="d">
                        <strong>{d.valeur}</strong>
                      </td>
                      <td className="petit attenue">{d.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Section>
      <Section alt>
        <TitreSection surtitre="Concurrence" titre="Les structures du secteur" />
        <div className="table-defilante">
          <table>
            <thead>
              <tr>
                <th>Structure</th>
                <th>Distance</th>
                <th>Offre</th>
                <th>Tarifs relevés</th>
                <th>Positionnement</th>
              </tr>
            </thead>
            <tbody>
              {en.concurrents.map((c) => (
                <tr key={c.nom}>
                  <td>
                    <strong>{c.nom}</strong>
                  </td>
                  <td className="num">{c.distance}</td>
                  <td>{c.offre}</td>
                  <td>{c.tarifs}</td>
                  <td className="attenue">{c.positionnement}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
      <Section>
        <TitreSection surtitre="Contexte" titre="Faits relevés par dimension">
          Ces faits sont classés par nature, sans être qualifiés d’opportunités ou de menaces : c’est à vous d’en apprécier les effets pour
          l’établissement.
        </TitreSection>
        <div className="pestel">
          {en.pestel.map((p) => (
            <div key={p.dimension}>
              <h3>{p.dimension}</h3>
              <ul>
                {p.faits.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>
      <Section alt>
        <div className="editorial">
          <div>
            <span className="surtitre">Marché</span>
            <h2>Tendances du secteur</h2>
          </div>
          <ul className="liste-propre">
            {en.marche.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </div>
      </Section>
      <DocumentsLies rubrique="environnement" />
    </>
  );
}
