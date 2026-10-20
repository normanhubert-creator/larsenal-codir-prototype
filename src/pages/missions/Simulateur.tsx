import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEtab } from '../../contexte';
import { Aide, EnteteRubrique, FilAriane, Section } from '../../components/commun';
import { GraphiqueScenarios } from '../../components/Graphiques';
import { parametresInitiaux, simuler, type ParametresSimulation, type Scenario } from '../../finance/investment';
import { somme } from '../../finance/engine';
import { euros, nombre, pourcent, selonFormat } from '../../lib/format';
import { nouvelId, useTravail } from '../../storage/travaux';
import { EtatSauvegarde } from './Missions';

const SCENARIOS: { id: Scenario; libelle: string; couleur: number }[] = [
  { id: 'prudent', libelle: 'Prudent', couleur: 1 },
  { id: 'central', libelle: 'Central', couleur: 0 },
  { id: 'favorable', libelle: 'Favorable', couleur: 2 },
];

function Curseur({
  libelle,
  valeur,
  min,
  max,
  pas,
  format,
  onChange,
  aide,
}: {
  libelle: string;
  valeur: number;
  min: number;
  max: number;
  pas: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
  aide?: string;
}) {
  const id = `c-${libelle.replace(/\W+/g, '-')}`;
  return (
    <div className="curseur">
      <div className="curseur__tete">
        <label htmlFor={id}>
          {libelle}
          {aide && <Aide>{aide}</Aide>}
        </label>
        <output htmlFor={id}>{format(valeur)}</output>
      </div>
      <input id={id} type="range" min={min} max={max} step={pas} value={valeur} onChange={(ev) => onChange(Number(ev.target.value))} />
    </div>
  );
}

export function Simulateur() {
  const { projetId } = useParams();
  const { etab, base, e } = useEtab();
  const navigate = useNavigate();
  const { travail, modifier, etat } = useTravail(etab.id);
  const projet = etab.projets.find((p) => p.id === projetId) ?? etab.projets[0];
  const [p, setP] = useState<ParametresSimulation>(() => parametresInitiaux(projet));
  const [nom, setNom] = useState('');

  useEffect(() => {
    setP(parametresInitiaux(projet));
  }, [projet]);

  const res = useMemo(() => simuler(projet, p), [projet, p]);
  const comparaison = useMemo(
    () => SCENARIOS.map((s) => ({ ...s, r: simuler(projet, { ...p, scenario: s.id, volumes: projet.recettes.map((x) => x.volumes[s.id]) }) })),
    [projet, p],
  );
  if (!projet) return <p className="message-vide">Aucun projet d’investissement n’est défini pour cet établissement.</p>;

  const besoin = res.besoinFinancement;
  const maj = (k: Partial<ParametresSimulation>) => setP((x) => ({ ...x, ...k }));
  const croisiere = res.annees.find((a) => a.annee === Math.min(projet.horizon, Math.ceil(projet.delaiMiseEnServiceMois / 12) + projet.monteeEnCharge.length)) ?? res.annees[res.annees.length - 1];

  // Effets sur l'établissement (budget 2026 + projet en régime de croisière)
  const b26 = e.bilans[2026];
  const dettesApres = b26.dettesFinancieres + p.emprunt;
  const cafApres = e.caf[2026].caf + croisiere.caf;
  const cpApres = b26.capitauxPropres + p.subvention;

  const donneesTreso = res.annees.map((a) => {
    const row: Record<string, number> = { annee: a.annee };
    for (const c of comparaison) row[c.id] = c.r.annees[a.annee - 1].tresorerieCumulee;
    row.actuelle = a.tresorerieCumulee;
    return row;
  });
  const donneesResultat = res.annees.map((a) => ({ annee: a.annee, rn: a.resultatNet, caf: a.caf, tresorerie: a.tresorerie }));

  const enregistrer = () => {
    const id = nouvelId();
    modifier((t) => ({
      ...t,
      simulations: [
        ...t.simulations,
        {
          id,
          nom: nom.trim() || `${projet.titre} · ${p.scenario}`,
          projetId: projet.id,
          parametres: p,
          enregistreLe: new Date().toISOString(),
          synthese: { van: res.van, tri: res.tri, montant: res.montantInvestissement, delai: res.delaiRecuperation },
        },
      ],
      m3: t.m3.simulationRetenue ? t.m3 : { ...t.m3, simulationRetenue: id, projetId: projet.id },
    }));
    setNom('');
  };

  return (
    <>
      <EnteteRubrique
        surtitre="Mission 3 · Simulateur d’investissement"
        titre={projet.titre}
        texte="Modifiez les hypothèses et observez leurs effets sur le résultat, la CAF, la trésorerie et la rentabilité du projet. Les calculs sont détaillés année par année."
      />
      <FilAriane elements={[{ libelle: 'Galerie', vers: '/?galerie' }, { libelle: etab.nomCourt, vers: base }, { libelle: 'Missions', vers: `${base}/missions` }, { libelle: 'Simulateur' }]} />
      <Section>
        {etab.projets.length > 1 && (
          <div className="onglets" role="tablist" aria-label="Projets">
            {etab.projets.map((x) => (
              <button key={x.id} role="tab" aria-selected={x.id === projet.id} onClick={() => navigate(`${base}/simulateur/${x.id}`)}>
                {x.titre}
              </button>
            ))}
          </div>
        )}
        <p className="chapeau" style={{ marginBottom: 28 }}>
          {projet.description}
        </p>
        <div className="simulateur">
          <aside className="panneau-parametres" aria-label="Hypothèses">
            <div className="segments" role="group" aria-label="Scénario de volumes" style={{ width: '100%' }}>
              {SCENARIOS.map((s) => (
                <button key={s.id} style={{ flex: 1 }} aria-pressed={p.scenario === s.id} onClick={() => maj({ scenario: s.id, volumes: projet.recettes.map((r) => r.volumes[s.id]) })}>
                  {s.libelle}
                </button>
              ))}
            </div>
            <button className="btn btn--contour btn--petit" style={{ marginTop: 10, width: '100%' }} onClick={() => setP(parametresInitiaux(projet, p.scenario))}>
              Rétablir les hypothèses du dossier
            </button>
            <h3>Investissement</h3>
            <Curseur libelle="Montant des travaux et équipements" valeur={p.coefMontant} min={0.8} max={1.5} pas={0.01} format={(v) => `${euros(somme(projet.composantes.map((c) => c.montant)) * v)} (${v >= 1 ? '+' : ''}${nombre((v - 1) * 100)} %)`} onChange={(v) => maj({ coefMontant: v })} aide="Simule une maîtrise ou une dérive des coûts par rapport aux devis." />
            <Curseur libelle="Délai de mise en service" valeur={p.delaiMiseEnServiceMois} min={0} max={24} pas={1} format={(v) => `${v} mois`} onChange={(v) => maj({ delaiMiseEnServiceMois: v })} />
            <h3>Financement</h3>
            <Curseur libelle="Apport (autofinancement)" valeur={p.apport} min={0} max={Math.round(besoin * 1.2)} pas={500} format={euros} onChange={(v) => maj({ apport: v })} />
            <Curseur libelle="Emprunt" valeur={p.emprunt} min={0} max={Math.round(besoin * 1.2)} pas={500} format={euros} onChange={(v) => maj({ emprunt: v })} />
            <Curseur libelle="Taux d’intérêt" valeur={p.taux} min={0} max={0.08} pas={0.001} format={pourcent} onChange={(v) => maj({ taux: v })} />
            <Curseur libelle="Durée de l’emprunt" valeur={p.dureeEmprunt} min={2} max={25} pas={1} format={(v) => `${v} ans`} onChange={(v) => maj({ dureeEmprunt: v })} />
            <Curseur libelle="Subvention d’investissement" valeur={p.subvention} min={0} max={Math.round(besoin * 0.6)} pas={500} format={euros} onChange={(v) => maj({ subvention: v })} aide="Reprise au résultat au rythme de l’amortissement ; exclue des flux économiques de la VAN." />
            <h3>Activité</h3>
            {projet.recettes.map((r, i) => (
              <Curseur
                key={r.libelle}
                libelle={`${r.libelle} (${r.unite})`}
                valeur={p.volumes[i] ?? 0}
                min={0}
                max={Math.round(r.capaciteMax * 1.1)}
                pas={Math.max(1, Math.round(r.capaciteMax / 200))}
                format={(v) => `${nombre(v)} / an`}
                onChange={(v) => maj({ volumes: p.volumes.map((x, j) => (j === i ? v : x)) })}
                aide={`Prix de base ${euros(r.prix)} par ${r.unite}. Capacité maximale retenue : ${nombre(r.capaciteMax)}.`}
              />
            ))}
            <Curseur libelle="Ajustement des prix" valeur={p.ajustementPrix} min={-0.15} max={0.3} pas={0.01} format={(v) => `${v >= 0 ? '+' : ''}${nombre(v * 100)} %`} onChange={(v) => maj({ ajustementPrix: v })} />
            <Curseur libelle="Charges variables (% des recettes)" valeur={p.tauxChargesVariables} min={0} max={0.9} pas={0.01} format={pourcent} onChange={(v) => maj({ tauxChargesVariables: v })} />
            <Curseur libelle="Charges fixes annuelles" valeur={p.chargesFixes} min={0} max={Math.max(1000, somme(projet.chargesFixes.map((c) => c.montant)) * 3)} pas={100} format={euros} onChange={(v) => maj({ chargesFixes: v })} aide={projet.chargesFixes.map((c) => `${c.libelle} : ${euros(c.montant)}`).join(' · ')} />
            <h3>Rentabilité</h3>
            <Curseur libelle="Taux d’actualisation" valeur={p.tauxActualisation} min={0.02} max={0.12} pas={0.005} format={pourcent} onChange={(v) => maj({ tauxActualisation: v })} aide="Rentabilité minimale exigée compte tenu du risque du projet." />
          </aside>

          <div>
            <div className="tuiles">
              <div className="tuile">
                <div className="tuile__libelle">Investissement</div>
                <div className="tuile__valeur">{euros(res.montantInvestissement)}</div>
                <div className="petit attenue">+ {euros(projet.chargesLancement)} de charges de lancement</div>
              </div>
              <div className="tuile">
                <div className="tuile__libelle">
                  VAN
                  <Aide>Somme des flux économiques actualisés (EBE après impôt, valeur résiduelle comprise) moins l’investissement. Le financement n’entre pas dans ce calcul.</Aide>
                </div>
                <div className={`tuile__valeur ${res.van < 0 ? 'negatif' : 'positif'}`}>{euros(res.van)}</div>
                <div className="petit attenue">au taux de {pourcent(p.tauxActualisation)} sur {projet.horizon} ans</div>
              </div>
              <div className="tuile">
                <div className="tuile__libelle">TRI</div>
                <div className="tuile__valeur">{selonFormat(res.tri, '%')}</div>
                <div className="petit attenue">taux qui annule la VAN</div>
              </div>
              <div className="tuile">
                <div className="tuile__libelle">Délai de récupération</div>
                <div className="tuile__valeur">{res.delaiRecuperation === null ? '> horizon' : `${nombre(res.delaiRecuperation, 1)} ans`}</div>
                <div className="petit attenue">actualisé : {res.delaiRecuperationActualise === null ? '> horizon' : `${nombre(res.delaiRecuperationActualise, 1)} ans`}</div>
              </div>
              <div className="tuile">
                <div className="tuile__libelle">CAF du projet (croisière)</div>
                <div className={`tuile__valeur ${croisiere.caf < 0 ? 'negatif' : ''}`}>{euros(croisiere.caf)}</div>
                <div className="petit attenue">année {croisiere.annee}</div>
              </div>
              <div className="tuile">
                <div className="tuile__libelle">Trésorerie cumulée fin d’horizon</div>
                <div className={`tuile__valeur ${res.annees[res.annees.length - 1].tresorerieCumulee < 0 ? 'negatif' : ''}`}>{euros(res.annees[res.annees.length - 1].tresorerieCumulee)}</div>
                <div className="petit attenue">après remboursement des emprunts</div>
              </div>
            </div>

            {res.alertes.length > 0 && (
              <div className="encart encart--alerte" style={{ marginBottom: 24 }} role="status">
                <h4 style={{ marginBottom: 6 }}>Points de vigilance sur vos hypothèses</h4>
                <ul className="petit" style={{ margin: 0, paddingLeft: 18 }}>
                  {res.alertes.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grille-souple">
              <div>
                <h3>Plan de financement initial</h3>
                <div className="table-defilante">
                  <table>
                    <tbody>
                      <tr className="titre">
                        <td colSpan={2}>Besoins</td>
                      </tr>
                      {projet.composantes.map((c) => (
                        <tr key={c.libelle} className="niv-1">
                          <td>
                            {c.libelle} <span className="attenue petit">(amorti sur {c.duree} ans)</span>
                          </td>
                          <td className="d">{euros(c.montant * p.coefMontant)}</td>
                        </tr>
                      ))}
                      <tr className="niv-1">
                        <td>Charges de lancement (non immobilisées)</td>
                        <td className="d">{euros(projet.chargesLancement)}</td>
                      </tr>
                      <tr className="sous-total">
                        <td>Total des besoins</td>
                        <td className="d">{euros(besoin)}</td>
                      </tr>
                      <tr className="titre">
                        <td colSpan={2}>Ressources</td>
                      </tr>
                      <tr className="niv-1">
                        <td>Apport</td>
                        <td className="d">{euros(p.apport)}</td>
                      </tr>
                      <tr className="niv-1">
                        <td>Emprunt</td>
                        <td className="d">{euros(p.emprunt)}</td>
                      </tr>
                      <tr className="niv-1">
                        <td>Subvention</td>
                        <td className="d">{euros(p.subvention)}</td>
                      </tr>
                      <tr className="sous-total">
                        <td>Total des ressources</td>
                        <td className="d">{euros(res.ressources)}</td>
                      </tr>
                      <tr className="total">
                        <td>Écart (ressources − besoins)</td>
                        <td className={`d ${res.ecartFinancement < -1 ? 'negatif' : ''}`}>{euros(res.ecartFinancement)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                <h3>
                  Effets sur l’établissement
                  <Aide>Budget 2026 de l’établissement, auquel on ajoute le nouvel emprunt et la CAF du projet en régime de croisière. Ordre de grandeur, pas une prévision.</Aide>
                </h3>
                <div className="table-defilante">
                  <table>
                    <thead>
                      <tr>
                        <th>Indicateur</th>
                        <th className="d">Budget 2026</th>
                        <th className="d">Avec le projet</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Dettes financières</td>
                        <td className="d">{euros(b26.dettesFinancieres)}</td>
                        <td className="d">{euros(dettesApres)}</td>
                      </tr>
                      <tr>
                        <td>CAF annuelle</td>
                        <td className="d">{euros(e.caf[2026].caf)}</td>
                        <td className="d">{euros(cafApres)}</td>
                      </tr>
                      <tr>
                        <td>Dettes financières / capitaux propres</td>
                        <td className="d">{selonFormat(b26.capitauxPropres > 0 ? b26.dettesFinancieres / b26.capitauxPropres : null, 'x')}</td>
                        <td className="d">{selonFormat(cpApres > 0 ? dettesApres / cpApres : null, 'x')}</td>
                      </tr>
                      <tr>
                        <td>Capacité de remboursement (années de CAF)</td>
                        <td className="d">{selonFormat(e.caf[2026].caf > 0 ? b26.dettesFinancieres / e.caf[2026].caf : null, 'ans')}</td>
                        <td className="d">{selonFormat(cafApres > 0 ? dettesApres / cafApres : null, 'ans')}</td>
                      </tr>
                      <tr>
                        <td>Trésorerie nette fin 2026 après apport</td>
                        <td className="d">{euros(b26.tresorerieNette)}</td>
                        <td className={`d ${b26.tresorerieNette - p.apport < 0 ? 'negatif' : ''}`}>{euros(b26.tresorerieNette - p.apport)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="grille-souple" style={{ marginTop: 28 }}>
              <GraphiqueScenarios
                titre="Trésorerie cumulée du projet par scénario"
                note="Après financement et remboursement des emprunts. Les autres hypothèses sont celles que vous avez réglées ; trait plein : vos réglages actuels."
                donnees={donneesTreso}
                series={[
                  ...comparaison.map((c) => ({ cle: c.id, libelle: `Scénario ${c.libelle.toLowerCase()}`, couleur: c.couleur })),
                  { cle: 'actuelle', libelle: 'Vos réglages', couleur: 3, actif: true },
                ]}
              />
              <GraphiqueScenarios
                titre="Résultat net, CAF et flux de trésorerie annuels"
                note="Le résultat est diminué des amortissements ; la trésorerie supporte le remboursement du capital."
                donnees={donneesResultat}
                series={[
                  { cle: 'rn', libelle: 'Résultat net différentiel', couleur: 1, actif: true },
                  { cle: 'caf', libelle: 'CAF différentielle', couleur: 0, actif: true },
                  { cle: 'tresorerie', libelle: 'Trésorerie de l’année', couleur: 2 },
                ]}
              />
            </div>

            <h3 style={{ marginTop: 32 }}>Comparaison des trois scénarios</h3>
            <div className="table-defilante">
              <table>
                <thead>
                  <tr>
                    <th>Scénario</th>
                    <th className="d">Recettes en croisière</th>
                    <th className="d">VAN</th>
                    <th className="d">TRI</th>
                    <th className="d">Délai de récupération</th>
                    <th className="d">Trésorerie cumulée finale</th>
                  </tr>
                </thead>
                <tbody>
                  {comparaison.map((c) => (
                    <tr key={c.id}>
                      <td>{c.libelle}</td>
                      <td className="d">{euros(c.r.recettesCroisiere)}</td>
                      <td className={`d ${c.r.van < 0 ? 'negatif' : 'positif'}`}>{euros(c.r.van)}</td>
                      <td className="d">{selonFormat(c.r.tri, '%')}</td>
                      <td className="d">{c.r.delaiRecuperation === null ? '> horizon' : `${nombre(c.r.delaiRecuperation, 1)} ans`}</td>
                      <td className="d">{euros(c.r.annees[c.r.annees.length - 1].tresorerieCumulee)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 style={{ marginTop: 32 }}>Détail des calculs année par année</h3>
            <div className="table-defilante">
              <table>
                <thead>
                  <tr>
                    <th>Année</th>
                    {res.annees.map((a) => (
                      <th key={a.annee} className="d">
                        A{a.annee}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(
                    [
                      ['Recettes', 'recettes', ''],
                      ['− Charges variables', 'chargesVariables', 'niv-1'],
                      ['− Charges fixes', 'chargesFixes', 'niv-1'],
                      ['− Charges de lancement', 'chargesLancement', 'niv-1'],
                      ['= EBE différentiel', 'ebe', 'sous-total'],
                      ['− Dotations aux amortissements', 'dotations', 'niv-1'],
                      ['+ Quote-part de subvention', 'repriseSubvention', 'niv-1'],
                      ['= Résultat d’exploitation', 'resultatExploitation', 'sous-total'],
                      ['− Intérêts d’emprunt', 'interets', 'niv-1'],
                      ['− Impôt différentiel', 'impot', 'niv-1'],
                      ['= Résultat net différentiel', 'resultatNet', 'sous-total'],
                      ['= CAF (résultat + dotations − quote-part)', 'caf', 'total'],
                      ['− Remboursement du capital', 'remboursementCapital', 'niv-1'],
                      ['= Trésorerie de l’année', 'tresorerie', 'sous-total'],
                      ['Trésorerie cumulée (dont financement initial)', 'tresorerieCumulee', 'total'],
                      ['Capital restant dû', 'capitalRestantDu', 'niv-2'],
                      ['Flux économique (VAN)', 'fluxEconomique', 'niv-2'],
                      ['Flux actualisé', 'fluxActualise', 'niv-2'],
                    ] as const
                  ).map(([lib, k, st]) => (
                    <tr key={k} className={st}>
                      <td style={{ whiteSpace: 'nowrap' }}>{lib}</td>
                      {res.annees.map((a) => (
                        <td key={a.annee} className={`d ${a[k] < -0.5 && (st === 'sous-total' || st === 'total') ? 'negatif' : ''}`}>
                          {nombre(a[k])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <caption style={{ display: 'block' }}>
                Année 0 : décaissement de l’investissement ({euros(res.montantInvestissement)}) et encaissement des ressources ({euros(res.ressources)}). Taux d’impôt marginal retenu :{' '}
                {pourcent(projet.tauxImpot)}
                {projet.tauxImpot === 0 ? ' (entreprise à l’IR ou organisme non lucratif : l’imposition n’est pas modélisée au niveau du projet)' : ''}.
              </caption>
            </div>

            <div className="grille-souple" style={{ marginTop: 28 }}>
              <div className="carte">
                <h3>Repères pour discuter vos hypothèses</h3>
                <ul className="liste-propre petit">
                  {projet.reperes.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </div>
              <div className="carte">
                <h3>Vigilance opérationnelle</h3>
                <ul className="liste-propre petit">
                  {projet.vigilance.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="carte" style={{ marginTop: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                <h3 style={{ margin: 0 }}>Enregistrer cette simulation</h3>
                <EtatSauvegarde etat={etat} />
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <input type="text" placeholder={`${projet.titre} · ${p.scenario}`} value={nom} onChange={(ev) => setNom(ev.target.value)} aria-label="Nom de la simulation" />
                <button className="btn" onClick={enregistrer}>
                  Enregistrer
                </button>
              </div>
              {travail.simulations.length > 0 && (
                <div className="table-defilante" style={{ marginTop: 16 }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Simulation</th>
                        <th className="d">VAN</th>
                        <th className="d">TRI</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {travail.simulations.map((s) => (
                        <tr key={s.id}>
                          <td>
                            {s.nom}
                            {travail.m3.simulationRetenue === s.id && <span className="pastille pastille--etabli" style={{ marginLeft: 8 }}>Retenue en mission 3</span>}
                          </td>
                          <td className="d">{euros(s.synthese.van)}</td>
                          <td className="d">{selonFormat(s.synthese.tri, '%')}</td>
                          <td className="d" style={{ whiteSpace: 'nowrap' }}>
                            <button
                              className="btn btn--contour btn--petit"
                              onClick={() => {
                                navigate(`${base}/simulateur/${s.projetId}`);
                                window.setTimeout(() => setP(s.parametres), 0);
                              }}
                            >
                              Recharger
                            </button>{' '}
                            <button className="btn btn--danger btn--petit" onClick={() => modifier((t) => ({ ...t, simulations: t.simulations.filter((x) => x.id !== s.id), m3: t.m3.simulationRetenue === s.id ? { ...t.m3, simulationRetenue: '' } : t.m3 }))}>
                              Supprimer
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <p className="petit attenue" style={{ marginTop: 12 }}>
                Les simulations enregistrées sont reprises dans la <Link to={`${base}/missions/3`}>mission 3</Link>.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
