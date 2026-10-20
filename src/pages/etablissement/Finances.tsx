import { useMemo, useState, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useEtab } from '../../contexte';
import { Aide, EnteteRubrique, FilAriane } from '../../components/commun';
import { GraphiqueAnnuel, GraphiqueBarres, GraphiqueTresorerie } from '../../components/Graphiques';
import { analytique, ANNEES_BILAN, LIBELLES_IMMO, somme, type AnneeBilan, type Etats } from '../../finance/engine';
import { INDICATEURS, evaluer, type DefIndicateur } from '../../finance/indicateurs';
import { euros, MOIS, nombre, pourcent, selonFormat, variation } from '../../lib/format';
import { EXERCICES, type Exercice } from '../../types';

const VUES = [
  { id: 'tableau-de-bord', libelle: 'Tableau de bord' },
  { id: 'compte-de-resultat', libelle: 'Compte de résultat' },
  { id: 'sig', libelle: 'Soldes intermédiaires' },
  { id: 'caf', libelle: 'Capacité d’autofinancement' },
  { id: 'bilan', libelle: 'Bilans' },
  { id: 'flux', libelle: 'Flux de trésorerie' },
  { id: 'tresorerie', libelle: 'Trésorerie mensuelle' },
  { id: 'ratios', libelle: 'Ratios' },
  { id: 'analytique', libelle: 'Coûts par activité' },
  { id: 'financements', libelle: 'Emprunts et investissements' },
  { id: 'comparaison', libelle: 'Comparer des exercices' },
] as const;

const libAn = (an: number) => (an === 2026 ? '2026 B' : String(an));

// ---------------------------------------------------------------------------
// Tableau financier générique
// ---------------------------------------------------------------------------

export interface LigneTable {
  libelle: ReactNode;
  valeur?: (an: Exercice) => number | null;
  style?: 'total' | 'sous-total' | 'titre' | 'niv-1' | 'niv-2';
  aide?: string;
  signe?: boolean;
  format?: string;
  masquerSiNul?: boolean;
}

function TableFinanciere({ lignes, annees = [...EXERCICES], variationCol = true, legende }: { lignes: LigneTable[]; annees?: Exercice[]; variationCol?: boolean; legende?: string }) {
  const visibles = lignes.filter((l) => !(l.masquerSiNul && l.valeur && annees.every((an) => Math.abs(l.valeur!(an) ?? 0) < 0.5)));
  const fmt = (v: number | null, f?: string) => (f ? selonFormat(v, f) : euros(v));
  return (
    <div className="table-defilante">
      <table>
        {legende && <caption>{legende}</caption>}
        <thead>
          <tr>
            <th>Poste</th>
            {annees.map((an) => (
              <th key={an} className={`d ${an === 2026 ? 'col-budget' : ''}`}>
                {libAn(an)}
              </th>
            ))}
            {variationCol && (
              <>
                <th className="d">Écart 2025/2024</th>
                <th className="d">Variation</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {visibles.map((l, i) => {
            if (l.style === 'titre')
              return (
                <tr key={i} className="titre">
                  <td colSpan={annees.length + (variationCol ? 3 : 1)}>{l.libelle}</td>
                </tr>
              );
            const v24 = l.valeur?.(2024) ?? null;
            const v25 = l.valeur?.(2025) ?? null;
            return (
              <tr key={i} className={l.style ?? ''}>
                <td>
                  {l.libelle}
                  {l.aide && <Aide>{l.aide}</Aide>}
                </td>
                {annees.map((an) => {
                  const v = l.valeur?.(an) ?? null;
                  return (
                    <td key={an} className={`d ${an === 2026 ? 'col-budget' : ''} ${l.signe && v !== null && v < -0.5 ? 'negatif' : ''}`}>
                      {fmt(v, l.format)}
                    </td>
                  );
                })}
                {variationCol && (
                  <>
                    <td className="d">{v24 !== null && v25 !== null && !l.format ? euros(v25 - v24) : ''}</td>
                    <td className="d petit attenue">{v24 !== null && v25 !== null && !l.format ? pourcent(variation(v24, v25)) : ''}</td>
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ---------------------------------------------------------------------------

export function Finances() {
  const { vue = 'tableau-de-bord' } = useParams();
  const { etab, base, e } = useEtab();
  const actuelle = VUES.find((v) => v.id === vue) ?? VUES[0];
  return (
    <>
      <EnteteRubrique
        surtitre="Gestion et finances"
        titre="Comptes et instruments d’analyse"
        texte={`${e.etab.finances.formeComptable}. Exercices 2023 à 2025 clôturés au 31 décembre, 2026 en budget prévisionnel (B). Montants en euros hors taxes.`}
      />
      <FilAriane elements={[{ libelle: 'Galerie', vers: '/?galerie' }, { libelle: etab.nomCourt, vers: base }, { libelle: 'Gestion et finances', vers: `${base}/finances` }, { libelle: actuelle.libelle }]} />
      <section className="section" style={{ paddingTop: 28 }}>
        <div className="conteneur">
          <nav className="onglets" aria-label="Vues financières">
            {VUES.map((v) => (
              <Link key={v.id} to={`${base}/finances/${v.id}`} aria-current={v.id === actuelle.id ? 'page' : undefined}>
                {v.libelle}
              </Link>
            ))}
          </nav>
          {actuelle.id === 'tableau-de-bord' && <TableauDeBord e={e} />}
          {actuelle.id === 'compte-de-resultat' && <CompteResultat e={e} />}
          {actuelle.id === 'sig' && <VueSIG e={e} />}
          {actuelle.id === 'caf' && <VueCAF e={e} />}
          {actuelle.id === 'bilan' && <VueBilan e={e} />}
          {actuelle.id === 'flux' && <VueFlux e={e} />}
          {actuelle.id === 'tresorerie' && <VueTresorerie e={e} />}
          {actuelle.id === 'ratios' && <VueRatios e={e} />}
          {actuelle.id === 'analytique' && <VueAnalytique e={e} />}
          {actuelle.id === 'financements' && <VueFinancements e={e} />}
          {actuelle.id === 'comparaison' && <VueComparaison e={e} />}
          <p className="petit attenue" style={{ marginTop: 40 }}>
            Hypothèses de construction de ce dossier :
          </p>
          <ul className="petit attenue">
            {etab.finances.hypotheses.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

// ---------------------------------------------------------------------------
// Tableau de bord
// ---------------------------------------------------------------------------

function Tuile({ libelle, valeur, precedent, format = '€', aide, inverse }: { libelle: string; valeur: number | null; precedent?: number | null; format?: string; aide?: string; inverse?: boolean }) {
  const v = valeur !== null && precedent !== null && precedent !== undefined ? valeur - precedent : null;
  const positif = v !== null && (inverse ? v < 0 : v > 0);
  return (
    <div className="tuile">
      <div className="tuile__libelle">
        {libelle}
        {aide && <Aide>{aide}</Aide>}
      </div>
      <div className="tuile__valeur">{selonFormat(valeur, format)}</div>
      {v !== null && Math.abs(v) > 1e-9 && (
        <div className={`tuile__variation ${positif ? 'positif' : 'negatif'}`}>
          <span className={positif ? 'positif' : 'negatif'}>
            {v > 0 ? '▲' : '▼'} {format === '€' ? euros(Math.abs(v)) : format === '%' ? `${nombre(Math.abs(v) * 100, 1)} pt` : selonFormat(Math.abs(v), format)}
          </span>{' '}
          <span className="attenue">vs exercice précédent</span>
        </div>
      )}
    </div>
  );
}

function TableauDeBord({ e }: { e: Etats }) {
  const [an, setAn] = useState<Exercice>(2025);
  const prec = an > 2023 ? ((an - 1) as Exercice) : null;
  const val = (id: string, a: Exercice | null) => (a ? evaluer(e, id, a) : null);
  const sections = useMemo(() => {
    const ids = new Map<string, string>();
    for (const p of e.etab.activites.prestations) ids.set(p.activite, e.etab.finances.analytique?.sections.find((s) => s.id === p.activite)?.nom ?? p.activite);
    return [...ids.entries()];
  }, [e]);
  const donneesCA = EXERCICES.map((a) => {
    const row: Record<string, string | number> = { annee: libAn(a) };
    for (const [id] of sections) row[id] = somme(e.etab.activites.prestations.filter((p) => p.activite === id).map((p) => p.prix[a] * p.volume[a]));
    return row;
  });
  const donneesRes = EXERCICES.map((a) => ({ annee: libAn(a), ebe: e.sig[a].ebe, re: e.sig[a].resultatExploitation, rn: e.cr[a].resultatNet, caf: e.caf[a].caf }));
  const c = e.cr[an];
  const charges = [
    { nom: 'Marchandises consommées', valeur: c.achatsMarchandises + c.variationStockMarchandises },
    { nom: 'Approvisionnements consommés', valeur: c.achatsApprovisionnements + c.variationStockApprovisionnements },
    { nom: 'Charges externes', valeur: c.chargesExternes },
    { nom: 'Impôts et taxes', valeur: c.impotsTaxes },
    { nom: 'Charges de personnel', valeur: c.salaires + c.chargesSociales },
    { nom: 'Dotations aux amortissements et provisions', valeur: c.dotationsAmortissements + c.dotationsProvisionsExploitation },
    { nom: 'Charges financières', valeur: c.chargesFinancieres },
    { nom: 'Autres charges', valeur: c.autresCharges + c.chargesExceptionnelles },
  ].filter((x) => Math.abs(x.valeur) > 0.5);
  const t = e.tresorerie[an === 2026 ? 2026 : 2025];

  return (
    <div className="apparition">
      <div className="barre-outils">
        <span className="petit attenue">Exercice affiché</span>
        <div className="segments" role="group" aria-label="Choisir l’exercice">
          {EXERCICES.map((a) => (
            <button key={a} aria-pressed={a === an} onClick={() => setAn(a)}>
              {libAn(a)}
            </button>
          ))}
        </div>
        {an === 2026 && <span className="badge badge--alerte">Budget prévisionnel</span>}
      </div>
      <div className="tuiles">
        <Tuile libelle="Chiffre d’affaires" valeur={val('ca', an)} precedent={val('ca', prec)} />
        <Tuile libelle="Excédent brut d’exploitation" valeur={val('ebe', an)} precedent={val('ebe', prec)} aide="VA + subventions d’exploitation − impôts et taxes − charges de personnel." />
        <Tuile libelle="Résultat net" valeur={val('rn', an)} precedent={val('rn', prec)} />
        <Tuile libelle="Capacité d’autofinancement" valeur={val('caf', an)} precedent={val('caf', prec)} aide="Ressource interne potentielle ; ni un résultat, ni une trésorerie." />
        <Tuile libelle="Trésorerie nette (31/12)" valeur={val('tn', an)} precedent={val('tn', prec)} />
        <Tuile libelle="Dettes financières / capitaux propres" valeur={val('endettement', an)} precedent={val('endettement', prec)} format="x" inverse />
      </div>
      <div className="grille-2">
        <GraphiqueAnnuel
          titre="Chiffre d’affaires par activité"
          note="Recettes calculées à partir des tarifs et des volumes ; budget 2026 hachuré."
          donnees={donneesCA}
          series={sections.map(([id, nom], i) => ({ cle: id, libelle: nom, empile: true, couleur: i }))}
        />
        <GraphiqueAnnuel
          titre="Excédent brut d’exploitation et résultat net"
          note="Même échelle en euros pour les deux mesures."
          donnees={donneesRes}
          series={[
            { cle: 'ebe', libelle: 'EBE', couleur: 0 },
            { cle: 'rn', libelle: 'Résultat net', couleur: 1 },
            { cle: 'caf', libelle: 'CAF', type: 'ligne', couleur: 3 },
          ]}
        />
        <GraphiqueBarres titre={`Structure des charges ${libAn(an)}`} horizontal donnees={charges} format="€" couleur={2} />
        <GraphiqueTresorerie
          titre={`Trésorerie mensuelle ${an === 2026 ? '2026 (budget)' : '2025'}`}
          note={an !== 2025 && an !== 2026 ? 'Le plan mensuel est disponible pour 2025 et 2026.' : 'Encaissements − décaissements de chaque mois.'}
          mois={MOIS}
          solde={t.solde}
          cumul={t.cumul}
        />
      </div>
      {e.etab.indicateursActivite.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h3>Indicateurs d’activité</h3>
          <div className="table-defilante">
            <table>
              <thead>
                <tr>
                  <th>Indicateur</th>
                  {EXERCICES.map((a) => (
                    <th key={a} className={`d ${a === 2026 ? 'col-budget' : ''}`}>
                      {libAn(a)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {e.etab.indicateursActivite.map((i) => (
                  <tr key={i.libelle}>
                    <td>
                      {i.libelle} <span className="attenue">({i.unite})</span>
                      {i.aide && <Aide>{i.aide}</Aide>}
                    </td>
                    {EXERCICES.map((a) => (
                      <td key={a} className={`d ${a === 2026 ? 'col-budget' : ''}`}>
                        {i.valeurs[a] !== undefined ? nombre(i.valeurs[a], 1) : '·'}
                      </td>
                    ))}
                  </tr>
                ))}
                {e.etab.activites.prestations
                  .filter((p) => p.capaciteAnnuelle)
                  .map((p) => (
                    <tr key={p.id}>
                      <td>
                        Taux d’utilisation : {p.nom.toLowerCase()} <span className="attenue">(%)</span>
                      </td>
                      {EXERCICES.map((a) => (
                        <td key={a} className={`d ${a === 2026 ? 'col-budget' : ''}`}>
                          {pourcent(evaluer(e, `occupation:${p.id}`, a))}
                        </td>
                      ))}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Compte de résultat
// ---------------------------------------------------------------------------

function CompteResultat({ e }: { e: Etats }) {
  const [detail, setDetail] = useState(false);
  const f = e.etab.finances;
  const cr = (k: keyof Etats['cr'][2023]) => (an: Exercice) => e.cr[an][k] as number;
  const lignesDetail = (ls: typeof f.chargesExternes): LigneTable[] =>
    detail ? ls.map((l) => ({ libelle: `${l.compte} · ${l.libelle}`, valeur: (an: Exercice) => l.montants[an], style: 'niv-2' as const, aide: l.commentaire })) : [];
  const sectionsCA = useMemo(() => {
    const m = new Map<string, string>();
    for (const p of e.etab.activites.prestations) if (p.compte !== '707') m.set(p.activite, f.analytique?.sections.find((s) => s.id === p.activite)?.nom ?? p.activite);
    return [...m.entries()];
  }, [e, f]);
  const lignes: LigneTable[] = [
    { libelle: 'Produits d’exploitation', style: 'titre' },
    { libelle: 'Ventes de marchandises (707)', valeur: cr('ventesMarchandises'), style: 'niv-1', masquerSiNul: true },
    { libelle: 'Production vendue (701, 706, 708)', valeur: cr('productionVendue'), style: 'niv-1' },
    ...(detail
      ? sectionsCA.map(([id, nom]) => ({
          libelle: nom,
          valeur: (an: Exercice) => somme(e.cr[an].productionVendueDetail.filter((d) => d.activite === id).map((d) => d.montant)),
          style: 'niv-2' as const,
        }))
      : []),
    { libelle: 'Chiffre d’affaires net', valeur: cr('chiffreAffaires'), style: 'sous-total' },
    { libelle: 'Production stockée (713)', valeur: cr('productionStockee'), style: 'niv-1', masquerSiNul: true, signe: true, aide: 'Variation des stocks de produits (par exemple jeunes chevaux d’élevage) valorisés au coût de production.' },
    { libelle: 'Subventions d’exploitation (74)', valeur: cr('subventionsExploitation'), style: 'niv-1', masquerSiNul: true },
    ...lignesDetail(f.subventionsExploitation),
    { libelle: 'Reprises sur provisions (781)', valeur: cr('reprisesExploitation'), style: 'niv-1', masquerSiNul: true },
    { libelle: 'Autres produits (75)', valeur: cr('autresProduits'), style: 'niv-1', masquerSiNul: true },
    ...lignesDetail(f.autresProduits),
    { libelle: 'Total des produits d’exploitation', valeur: cr('produitsExploitation'), style: 'sous-total' },
    { libelle: 'Charges d’exploitation', style: 'titre' },
    { libelle: 'Achats de marchandises (607)', valeur: cr('achatsMarchandises'), style: 'niv-1', masquerSiNul: true },
    { libelle: 'Variation de stocks de marchandises (6037)', valeur: cr('variationStockMarchandises'), style: 'niv-1', masquerSiNul: true, signe: true },
    { libelle: 'Achats de matières et approvisionnements (601, 602)', valeur: cr('achatsApprovisionnements'), style: 'niv-1', masquerSiNul: true },
    ...lignesDetail(f.achatsApprovisionnements),
    { libelle: 'Variation de stocks d’approvisionnements (6031)', valeur: cr('variationStockApprovisionnements'), style: 'niv-1', masquerSiNul: true, signe: true, aide: 'Stock initial − stock final : positif si le stock a diminué.' },
    { libelle: 'Autres achats et charges externes (604 à 628)', valeur: cr('chargesExternes'), style: 'niv-1' },
    ...lignesDetail(f.chargesExternes),
    { libelle: 'Impôts, taxes et versements assimilés (63)', valeur: cr('impotsTaxes'), style: 'niv-1' },
    ...lignesDetail(f.impotsTaxes),
    { libelle: 'Salaires et traitements (641)', valeur: cr('salaires'), style: 'niv-1' },
    { libelle: 'Charges sociales (645, 646)', valeur: cr('chargesSociales'), style: 'niv-1', aide: f.exploitant ? 'Comprend les cotisations sociales personnelles de l’exploitant.' : undefined },
    { libelle: 'Dotations aux amortissements (6811)', valeur: cr('dotationsAmortissements'), style: 'niv-1' },
    { libelle: 'Dotations aux provisions (6815, 6817)', valeur: cr('dotationsProvisionsExploitation'), style: 'niv-1', masquerSiNul: true },
    { libelle: 'Autres charges (65)', valeur: cr('autresCharges'), style: 'niv-1', masquerSiNul: true },
    ...lignesDetail(f.autresCharges),
    { libelle: 'Total des charges d’exploitation', valeur: cr('chargesExploitation'), style: 'sous-total' },
    { libelle: 'Résultat d’exploitation', valeur: cr('resultatExploitation'), style: 'total', signe: true },
    { libelle: 'Résultat financier', style: 'titre' },
    { libelle: 'Produits financiers (76)', valeur: cr('produitsFinanciers'), style: 'niv-1', masquerSiNul: true },
    { libelle: 'Intérêts des emprunts (661)', valeur: cr('interetsEmprunts'), style: 'niv-1', masquerSiNul: true },
    { libelle: 'Autres charges financières', valeur: cr('chargesFinancieresAutres'), style: 'niv-1', masquerSiNul: true },
    { libelle: 'Résultat financier', valeur: cr('resultatFinancier'), style: 'sous-total', signe: true },
    { libelle: 'Résultat courant avant impôt', valeur: cr('rcai'), style: 'total', signe: true },
    { libelle: 'Résultat exceptionnel', style: 'titre' },
    { libelle: 'Produits de cession d’immobilisations (775)', valeur: cr('produitsCessions'), style: 'niv-1', masquerSiNul: true },
    { libelle: 'Quote-part des subventions d’investissement virée au résultat (777)', valeur: cr('quotePartSubventions'), style: 'niv-1', masquerSiNul: true },
    { libelle: 'Autres produits exceptionnels', valeur: (an) => e.cr[an].produitsExceptionnelsAutres + e.cr[an].reprisesExceptionnelles, style: 'niv-1', masquerSiNul: true },
    { libelle: 'Valeur nette comptable des éléments cédés (675)', valeur: cr('vncCessions'), style: 'niv-1', masquerSiNul: true },
    { libelle: 'Autres charges exceptionnelles', valeur: (an) => e.cr[an].chargesExceptionnellesAutres + e.cr[an].dotationsExceptionnelles, style: 'niv-1', masquerSiNul: true },
    { libelle: 'Résultat exceptionnel', valeur: cr('resultatExceptionnel'), style: 'sous-total', signe: true },
    { libelle: f.regimeFiscal === 'IS' ? 'Impôt sur les sociétés (695)' : 'Impôt sur les bénéfices', valeur: cr('impotSocietes'), style: 'niv-1', aide: f.regimeFiscal === 'IR' ? 'Entreprise soumise à l’impôt sur le revenu : l’impôt est payé par les exploitants, il n’apparaît pas dans les comptes.' : f.regimeFiscal === 'non-lucratif' ? 'Organisme sans but lucratif : pas d’impôt sur les sociétés dans le modèle.' : undefined },
    { libelle: 'Résultat net de l’exercice', valeur: cr('resultatNet'), style: 'total', signe: true },
  ];
  return (
    <div className="apparition">
      <div className="barre-outils">
        <div className="segments" role="group" aria-label="Niveau de détail">
          <button aria-pressed={!detail} onClick={() => setDetail(false)}>
            Synthétique
          </button>
          <button aria-pressed={detail} onClick={() => setDetail(true)}>
            Détaillé par compte
          </button>
        </div>
        <span className="petit attenue">Présentation en liste, référentiel {f.referentiel === 'ANC-2018-06' ? 'des associations (règlement ANC 2018-06)' : 'du plan comptable général (règlement ANC 2014-03)'}.</span>
      </div>
      <TableFinanciere lignes={lignes} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// SIG
// ---------------------------------------------------------------------------

function VueSIG({ e }: { e: Etats }) {
  const s = (k: keyof Etats['sig'][2023]) => (an: Exercice) => e.sig[an][k] as number;
  const commerciale = EXERCICES.some((an) => Math.abs(e.sig[an].ventesMarchandises) > 0);
  const lignes: LigneTable[] = [
    ...(commerciale
      ? [
          { libelle: 'Ventes de marchandises', valeur: s('ventesMarchandises'), style: 'niv-1' as const },
          { libelle: '− Coût d’achat des marchandises vendues', valeur: s('coutAchatMarchandises'), style: 'niv-1' as const },
          { libelle: 'Marge commerciale', valeur: s('margeCommerciale'), style: 'sous-total' as const, signe: true },
        ]
      : []),
    { libelle: 'Production vendue', valeur: (an) => e.cr[an].productionVendue, style: 'niv-1' },
    { libelle: '+ Production stockée', valeur: (an) => e.cr[an].productionStockee, style: 'niv-1', masquerSiNul: true, signe: true },
    { libelle: 'Production de l’exercice', valeur: s('productionExercice'), style: 'sous-total' },
    { libelle: '− Consommations en provenance des tiers', valeur: s('consommationsTiers'), style: 'niv-1', aide: 'Achats d’approvisionnements ± variation de stocks + autres achats et charges externes.' },
    { libelle: 'Valeur ajoutée', valeur: s('valeurAjoutee'), style: 'total', signe: true },
    { libelle: '+ Subventions d’exploitation', valeur: s('subventionsExploitation'), style: 'niv-1', masquerSiNul: true },
    { libelle: '− Impôts, taxes et versements assimilés', valeur: s('impotsTaxes'), style: 'niv-1' },
    { libelle: '− Charges de personnel', valeur: s('chargesPersonnel'), style: 'niv-1' },
    { libelle: 'Excédent brut d’exploitation', valeur: s('ebe'), style: 'total', signe: true },
    { libelle: '+ Reprises et autres produits', valeur: s('reprisesAutresProduits'), style: 'niv-1' },
    { libelle: '− Dotations et autres charges', valeur: s('dotationsAutresCharges'), style: 'niv-1' },
    { libelle: 'Résultat d’exploitation', valeur: s('resultatExploitation'), style: 'sous-total', signe: true },
    { libelle: '± Résultat financier', valeur: s('resultatFinancier'), style: 'niv-1', signe: true },
    { libelle: 'Résultat courant avant impôt', valeur: s('rcai'), style: 'sous-total', signe: true },
    { libelle: '± Résultat exceptionnel', valeur: s('resultatExceptionnel'), style: 'niv-1', signe: true },
    { libelle: '− Impôt sur les bénéfices', valeur: s('impotSocietes'), style: 'niv-1' },
    { libelle: 'Résultat net', valeur: s('resultatNet'), style: 'total', signe: true },
    { libelle: 'Pour mémoire : plus ou moins-values de cession', valeur: s('plusMoinsValuesCessions'), style: 'niv-2', masquerSiNul: true, signe: true },
  ];
  const f = e.etab.finances;
  return (
    <div className="apparition">
      <div className="grille-2" style={{ marginBottom: 24 }}>
        <p className="attenue" style={{ margin: 0 }}>
          Les soldes intermédiaires de gestion sont calculés à partir du compte de résultat selon la méthode du plan comptable général. Les
          subventions d’exploitation sont intégrées à l’EBE.
        </p>
        <div className="encart encart--accent">
          <p className="petit" style={{ margin: 0 }}>
            {f.exploitant
              ? 'Entreprise dont les exploitants ne sont pas salariés : l’EBE et le résultat doivent aussi rémunérer leur travail et couvrir leurs prélèvements privés. Leur lecture n’est donc pas celle d’une société employant un dirigeant salarié.'
              : f.referentiel === 'ANC-2018-06'
                ? 'Association : le résultat n’a pas vocation à être distribué ; il renforce les fonds associatifs. Les subventions et le bénévolat pèsent sur la lecture de la valeur ajoutée.'
                : commerciale
                  ? 'L’activité combine prestations de services et ventes de marchandises : la marge commerciale isole la performance du négoce.'
                  : 'Activité de services : en l’absence de négoce, la marge commerciale n’est pas significative et n’est pas présentée.'}
          </p>
        </div>
      </div>
      <TableFinanciere lignes={lignes} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// CAF
// ---------------------------------------------------------------------------

function VueCAF({ e }: { e: Etats }) {
  const [an, setAn] = useState<Exercice>(2025);
  const k = e.caf[an];
  const ligne = (lib: string, v: number, style = '') => (
    <tr className={style}>
      <td>{lib}</td>
      <td className={`d ${v < -0.5 && style ? 'negatif' : ''}`}>{euros(v)}</td>
    </tr>
  );
  return (
    <div className="apparition">
      <div className="barre-outils">
        <span className="petit attenue">Exercice</span>
        <div className="segments" role="group" aria-label="Choisir l’exercice">
          {EXERCICES.map((a) => (
            <button key={a} aria-pressed={a === an} onClick={() => setAn(a)}>
              {libAn(a)}
            </button>
          ))}
        </div>
      </div>
      <div className="grille-2">
        <div>
          <h3>Méthode additive (à partir du résultat)</h3>
          <div className="table-defilante">
            <table>
              <tbody>
                {ligne('Résultat net de l’exercice', k.resultatNet)}
                {ligne('+ Dotations aux amortissements et provisions', k.dotations)}
                {ligne('− Reprises sur provisions', -k.reprises)}
                {ligne('+ Valeur nette comptable des éléments cédés', k.vncCessions)}
                {ligne('− Produits de cession d’éléments d’actif', -k.produitsCessions)}
                {ligne('− Quote-part des subventions d’investissement virée au résultat', -k.quotePartSubventions)}
                {ligne('Capacité d’autofinancement', k.cafAdditive, 'total')}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <h3>Méthode soustractive (à partir de l’EBE)</h3>
          <div className="table-defilante">
            <table>
              <tbody>
                {ligne('Excédent brut d’exploitation', k.ebe)}
                {ligne('+ Autres produits d’exploitation encaissables', k.autresProduitsEncaissables)}
                {ligne('− Autres charges d’exploitation décaissables', -k.autresChargesDecaissables)}
                {ligne('+ Produits financiers encaissables', k.produitsFinanciersEncaissables)}
                {ligne('− Charges financières décaissables', -k.chargesFinancieresDecaissables)}
                {ligne('+ Produits exceptionnels encaissables (hors cessions)', k.produitsExceptionnelsEncaissables)}
                {ligne('− Charges exceptionnelles décaissables', -k.chargesExceptionnellesDecaissables)}
                {ligne('− Impôt sur les bénéfices', -k.impotSocietes)}
                {ligne('Capacité d’autofinancement', k.cafSoustractive, 'total')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="encart encart--accent" style={{ marginTop: 28 }}>
        <h4>Résultat, CAF et trésorerie : trois grandeurs différentes</h4>
        <div className="grille-3" style={{ marginTop: 12 }}>
          <div>
            <span className="petit attenue">Résultat net {libAn(an)}</span>
            <div className="tuile__valeur">{euros(e.cr[an].resultatNet)}</div>
            <p className="petit attenue">Enrichissement comptable de l’exercice, après charges calculées (amortissements, provisions).</p>
          </div>
          <div>
            <span className="petit attenue">CAF {libAn(an)}</span>
            <div className="tuile__valeur">{euros(k.caf)}</div>
            <p className="petit attenue">Ressource potentielle dégagée par l’activité, avant variation du BFR et décisions de financement.</p>
          </div>
          <div>
            <span className="petit attenue">Variation de trésorerie {libAn(an)}</span>
            <div className="tuile__valeur">{euros(e.flux[an].variationTresorerie)}</div>
            <p className="petit attenue">Effet réel sur la trésorerie, après BFR, investissements, emprunts, remboursements et distributions.</p>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 28 }}>
        <TableFinanciere
          lignes={[
            { libelle: 'Capacité d’autofinancement', valeur: (a) => e.caf[a].caf, style: 'sous-total', signe: true },
            { libelle: 'CAF / chiffre d’affaires', valeur: (a) => evaluer(e, 'cafSurCA', a), format: '%' },
            { libelle: 'Remboursement du capital des emprunts', valeur: (a) => e.flux[a].remboursements },
            { libelle: 'Autofinancement disponible après remboursements', valeur: (a) => e.caf[a].caf - e.flux[a].remboursements, style: 'total', signe: true, aide: 'CAF − remboursement du capital des emprunts. Sert d’indicateur de capacité à financer de nouveaux investissements.' },
          ]}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Bilan
// ---------------------------------------------------------------------------

function VueBilan({ e }: { e: Etats }) {
  const [an, setAn] = useState<AnneeBilan>(2025);
  const b = e.bilans[an];
  const prec = an > 2022 ? e.bilans[(an - 1) as AnneeBilan] : null;
  const L = ({ lib, v, p, style = '', aide }: { lib: string; v: number; p?: number | null; style?: string; aide?: string }) => (
    <tr className={style}>
      <td>
        {lib}
        {aide && <Aide>{aide}</Aide>}
      </td>
      <td className="d">{euros(v)}</td>
      <td className="d attenue">{p !== null && p !== undefined ? euros(p) : ''}</td>
    </tr>
  );
  const pc = (f: (x: typeof b) => number) => (prec ? f(prec) : null);
  return (
    <div className="apparition">
      <div className="barre-outils">
        <span className="petit attenue">Bilan au 31 décembre</span>
        <div className="segments" role="group" aria-label="Choisir la date de clôture">
          {ANNEES_BILAN.map((a) => (
            <button key={a} aria-pressed={a === an} onClick={() => setAn(a)}>
              {a === 2022 ? '2022 (ouverture)' : libAn(a)}
            </button>
          ))}
        </div>
        <span className={`badge ${Math.abs(b.totalActif - b.totalPassif) < 0.01 ? 'badge--positif' : 'badge--negatif'}`}>
          {Math.abs(b.totalActif - b.totalPassif) < 0.01 ? 'Bilan équilibré' : 'Écart'}
        </span>
      </div>
      <div className="grille-2">
        <div>
          <h3>Actif</h3>
          <div className="table-defilante">
            <table>
              <thead>
                <tr>
                  <th>Poste (valeurs nettes)</th>
                  <th className="d">{an === 2022 ? '31/12/2022' : libAn(an)}</th>
                  <th className="d">{prec ? `Rappel ${prec.annee}` : ''}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="titre">
                  <td colSpan={3}>Actif immobilisé</td>
                </tr>
                {b.immobilisations.map((i) => (
                  <L key={i.categorie} lib={`${LIBELLES_IMMO[i.categorie]} (brut ${euros(i.brut)}, amort. ${euros(i.amortissements)})`} v={i.net} p={prec?.immobilisations.find((x) => x.categorie === i.categorie)?.net ?? 0} style="niv-1" />
                ))}
                <L lib="Total actif immobilisé net" v={b.actifImmobiliseNet} p={pc((x) => x.actifImmobiliseNet)} style="sous-total" />
                <tr className="titre">
                  <td colSpan={3}>Actif circulant</td>
                </tr>
                {b.stocks.map((s) => (
                  <L key={s.id} lib={`Stock : ${s.libelle}`} v={s.montant} p={prec?.stocks.find((x) => x.id === s.id)?.montant} style="niv-1" />
                ))}
                <L lib="Créances clients" v={b.creancesClients} p={pc((x) => x.creancesClients)} style="niv-1" />
                <L lib="Autres créances et charges constatées d’avance" v={b.autresCreances} p={pc((x) => x.autresCreances)} style="niv-1" />
                <L lib="Disponibilités" v={b.disponibilites} p={pc((x) => x.disponibilites)} style="niv-1" />
                <L lib="Total actif circulant" v={b.actifCirculant} p={pc((x) => x.actifCirculant)} style="sous-total" />
                <L lib="Total de l’actif" v={b.totalActif} p={pc((x) => x.totalActif)} style="total" />
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <h3>Passif</h3>
          <div className="table-defilante">
            <table>
              <thead>
                <tr>
                  <th>Poste</th>
                  <th className="d">{an === 2022 ? '31/12/2022' : libAn(an)}</th>
                  <th className="d">{prec ? `Rappel ${prec.annee}` : ''}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="titre">
                  <td colSpan={3}>Capitaux propres</td>
                </tr>
                <L lib={b.libelleCapital} v={b.capital} p={pc((x) => x.capital)} style="niv-1" />
                <L lib="Réserves et report à nouveau" v={b.reserves} p={pc((x) => x.reserves)} style="niv-1" aide="Au bilan d’ouverture, ce poste regroupe l’ensemble des résultats antérieurs non distribués." />
                <L lib="Résultat de l’exercice" v={b.resultat} p={pc((x) => x.resultat)} style="niv-1" />
                {(b.subventionsInvestissement > 0 || (prec?.subventionsInvestissement ?? 0) > 0) && (
                  <L lib="Subventions d’investissement" v={b.subventionsInvestissement} p={pc((x) => x.subventionsInvestissement)} style="niv-1" />
                )}
                <L lib="Total capitaux propres" v={b.capitauxPropres} p={pc((x) => x.capitauxPropres)} style="sous-total" />
                {(b.provisions > 0 || (prec?.provisions ?? 0) > 0) && <L lib="Provisions" v={b.provisions} p={pc((x) => x.provisions)} style="niv-1" />}
                <tr className="titre">
                  <td colSpan={3}>Dettes</td>
                </tr>
                <L lib="Emprunts auprès des établissements de crédit" v={b.emprunts} p={pc((x) => x.emprunts)} style="niv-1" />
                <L lib="Concours bancaires courants" v={b.concoursBancaires} p={pc((x) => x.concoursBancaires)} style="niv-1" />
                <L lib="Dettes fournisseurs" v={b.dettesFournisseurs} p={pc((x) => x.dettesFournisseurs)} style="niv-1" />
                <L lib="Dettes fiscales et sociales" v={b.dettesFiscalesSociales} p={pc((x) => x.dettesFiscalesSociales)} style="niv-1" />
                <L lib="Autres dettes" v={b.autresDettes} p={pc((x) => x.autresDettes)} style="niv-1" />
                <L lib="Produits constatés d’avance" v={b.produitsConstatesAvance} p={pc((x) => x.produitsConstatesAvance)} style="niv-1" aide="Encaissements ou facturations relatifs à des prestations de l’exercice suivant (forfaits, sponsoring…)." />
                <L lib="Total des dettes" v={b.emprunts + b.concoursBancaires + b.dettesExploitation} p={pc((x) => x.emprunts + x.concoursBancaires + x.dettesExploitation)} style="sous-total" />
                <L lib="Total du passif" v={b.totalPassif} p={pc((x) => x.totalPassif)} style="total" />
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <h3 style={{ marginTop: 40 }}>
        Équilibre financier
        <Aide>Approche simplifiée en valeurs nettes : ressources stables = capitaux propres + provisions + emprunts. Elle donne le même fonds de roulement que l’approche fonctionnelle en valeurs brutes.</Aide>
      </h3>
      <TableFinanciere
        annees={[...EXERCICES]}
        lignes={[
          { libelle: 'Ressources stables', valeur: (a) => e.bilans[a].ressourcesStables },
          { libelle: '− Actif immobilisé net', valeur: (a) => e.bilans[a].actifImmobiliseNet },
          { libelle: 'Fonds de roulement', valeur: (a) => e.bilans[a].fondsDeRoulement, style: 'sous-total', signe: true },
          { libelle: 'Stocks et créances d’exploitation', valeur: (a) => e.bilans[a].totalStocks + e.bilans[a].creancesClients + e.bilans[a].autresCreances },
          { libelle: '− Dettes d’exploitation (dont produits constatés d’avance)', valeur: (a) => e.bilans[a].dettesExploitation },
          { libelle: 'Besoin en fonds de roulement', valeur: (a) => e.bilans[a].besoinFondsRoulement, style: 'sous-total', signe: true },
          { libelle: 'Trésorerie nette (FR − BFR)', valeur: (a) => e.bilans[a].tresorerieNette, style: 'total', signe: true },
        ]}
      />
      <div style={{ marginTop: 24 }}>
        <GraphiqueAnnuel
          titre="Fonds de roulement, besoin en fonds de roulement et trésorerie nette"
          donnees={EXERCICES.map((a) => ({ annee: libAn(a), fr: e.bilans[a].fondsDeRoulement, bfr: e.bilans[a].besoinFondsRoulement, tn: e.bilans[a].tresorerieNette }))}
          series={[
            { cle: 'fr', libelle: 'Fonds de roulement', couleur: 0 },
            { cle: 'bfr', libelle: 'Besoin en fonds de roulement', couleur: 1 },
            { cle: 'tn', libelle: 'Trésorerie nette', type: 'ligne', couleur: 3 },
          ]}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Flux
// ---------------------------------------------------------------------------

function VueFlux({ e }: { e: Etats }) {
  const fl = (k: keyof Etats['flux'][2023]) => (an: Exercice) => e.flux[an][k] as number;
  return (
    <div className="apparition">
      <p className="attenue" style={{ maxWidth: 760 }}>
        Tableau des flux de trésorerie simplifié. La trésorerie de clôture n’est pas saisie : elle résulte de ces flux, et elle est identique à celle
        du bilan.
      </p>
      <TableFinanciere
        lignes={[
          { libelle: 'Activité', style: 'titre' },
          { libelle: 'Capacité d’autofinancement', valeur: fl('caf'), style: 'niv-1', signe: true },
          { libelle: '− Variation du besoin en fonds de roulement', valeur: (a) => -e.flux[a].variationBFR, style: 'niv-1', signe: true, aide: 'Une hausse du BFR consomme de la trésorerie ; une baisse en libère.' },
          { libelle: 'Flux de trésorerie d’exploitation', valeur: fl('fluxExploitation'), style: 'sous-total', signe: true },
          { libelle: 'Investissement', style: 'titre' },
          { libelle: '− Acquisitions d’immobilisations', valeur: (a) => -e.flux[a].investissements, style: 'niv-1', signe: true },
          { libelle: '+ Cessions d’immobilisations', valeur: fl('cessions'), style: 'niv-1', masquerSiNul: true },
          { libelle: 'Flux d’investissement', valeur: fl('fluxInvestissement'), style: 'sous-total', signe: true },
          { libelle: 'Financement', style: 'titre' },
          { libelle: '+ Emprunts nouveaux', valeur: fl('empruntsNouveaux'), style: 'niv-1', masquerSiNul: true },
          { libelle: '− Remboursement du capital emprunté', valeur: (a) => -e.flux[a].remboursements, style: 'niv-1', signe: true },
          { libelle: '+ Subventions d’investissement reçues', valeur: fl('subventionsRecues'), style: 'niv-1', masquerSiNul: true },
          { libelle: '+ Apports en fonds propres', valeur: fl('apports'), style: 'niv-1', masquerSiNul: true },
          { libelle: e.etab.finances.exploitant ? '− Prélèvements des exploitants' : '− Dividendes versés', valeur: (a) => -e.flux[a].distributions, style: 'niv-1', signe: true, masquerSiNul: true },
          { libelle: 'Flux de financement', valeur: fl('fluxFinancement'), style: 'sous-total', signe: true },
          { libelle: 'Variation de la trésorerie', valeur: fl('variationTresorerie'), style: 'total', signe: true },
          { libelle: 'Trésorerie d’ouverture', valeur: fl('tresorerieOuverture'), style: 'niv-1', signe: true },
          { libelle: 'Trésorerie de clôture', valeur: fl('tresorerieCloture'), style: 'total', signe: true },
        ]}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Trésorerie mensuelle
// ---------------------------------------------------------------------------

function VueTresorerie({ e }: { e: Etats }) {
  const [an, setAn] = useState<2025 | 2026>(2025);
  const t = e.tresorerie[an];
  const min = Math.min(...t.cumul);
  return (
    <div className="apparition">
      <div className="barre-outils">
        <div className="segments" role="group" aria-label="Choisir l’année">
          <button aria-pressed={an === 2025} onClick={() => setAn(2025)}>
            2025 réalisé
          </button>
          <button aria-pressed={an === 2026} onClick={() => setAn(2026)}>
            2026 budget
          </button>
        </div>
        <span className="petit attenue">
          Trésorerie nette d’ouverture : <strong className="num">{euros(t.ouverture)}</strong> · point bas : <strong className={`num ${min < 0 ? 'negatif' : ''}`}>{euros(min)}</strong>
        </span>
      </div>
      <GraphiqueTresorerie titre={`Plan de trésorerie ${an}${an === 2026 ? ' (budget)' : ''}`} mois={MOIS} solde={t.solde} cumul={t.cumul} note="Flux encaissés et décaissés, et non produits et charges : les amortissements n’y figurent pas, les remboursements d’emprunt et les investissements oui." />
      <div className="table-defilante" style={{ marginTop: 20 }}>
        <table>
          <thead>
            <tr>
              <th>Flux</th>
              {MOIS.map((m) => (
                <th key={m} className="d">
                  {m}
                </th>
              ))}
              <th className="d">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr className="titre">
              <td colSpan={14}>Encaissements</td>
            </tr>
            {t.lignes
              .filter((l) => l.sens === 'encaissement')
              .map((l) => (
                <tr key={l.id} className="niv-1">
                  <td>{l.libelle}</td>
                  {l.mois.map((v, i) => (
                    <td key={i} className="d">
                      {nombre(v)}
                    </td>
                  ))}
                  <td className="d">{nombre(l.total)}</td>
                </tr>
              ))}
            <tr className="sous-total">
              <td>Total encaissements</td>
              {t.encaissements.map((v, i) => (
                <td key={i} className="d">
                  {nombre(v)}
                </td>
              ))}
              <td className="d">{nombre(somme(t.encaissements))}</td>
            </tr>
            <tr className="titre">
              <td colSpan={14}>Décaissements</td>
            </tr>
            {t.lignes
              .filter((l) => l.sens === 'decaissement')
              .map((l) => (
                <tr key={l.id} className="niv-1">
                  <td>{l.libelle}</td>
                  {l.mois.map((v, i) => (
                    <td key={i} className="d">
                      {nombre(v)}
                    </td>
                  ))}
                  <td className="d">{nombre(l.total)}</td>
                </tr>
              ))}
            <tr className="sous-total">
              <td>Total décaissements</td>
              {t.decaissements.map((v, i) => (
                <td key={i} className="d">
                  {nombre(v)}
                </td>
              ))}
              <td className="d">{nombre(somme(t.decaissements))}</td>
            </tr>
            <tr className="sous-total">
              <td>Solde du mois</td>
              {t.solde.map((v, i) => (
                <td key={i} className={`d ${v < 0 ? 'negatif' : ''}`}>
                  {nombre(v)}
                </td>
              ))}
              <td className="d">{nombre(somme(t.solde))}</td>
            </tr>
            <tr className="total">
              <td>Trésorerie nette en fin de mois</td>
              {t.cumul.map((v, i) => (
                <td key={i} className={`d ${v < 0 ? 'negatif' : ''}`}>
                  {nombre(v)}
                </td>
              ))}
              <td />
            </tr>
          </tbody>
        </table>
      </div>
      {e.etab.finances.tresorerieMensuelle.commentaire && <p className="petit attenue" style={{ marginTop: 14 }}>{e.etab.finances.tresorerieMensuelle.commentaire}</p>}
      <p className="petit attenue">
        Construction : les encaissements clients correspondent au chiffre d’affaires corrigé de la variation des créances et des produits constatés
        d’avance ; les décaissements fournisseurs et sociaux, aux charges corrigées de la variation des dettes correspondantes. La répartition mensuelle
        suit la saisonnalité propre à l’établissement.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Ratios
// ---------------------------------------------------------------------------

function VueRatios({ e }: { e: Etats }) {
  const familles = Array.from(new Set(INDICATEURS.map((i) => i.famille)));
  return (
    <div className="apparition">
      <p className="attenue" style={{ maxWidth: 760 }}>
        Les ratios sont des instruments : leur sens dépend du modèle économique, de la taille et du statut de l’établissement. Survolez le point
        d’interrogation pour obtenir la définition et la formule. « n.s. » signale un ratio non significatif (dénominateur nul ou négatif).
      </p>
      {familles.map((fam) => (
        <div key={fam} style={{ marginBottom: 28 }}>
          <h3>{fam}</h3>
          <TableFinanciere
            variationCol={false}
            lignes={INDICATEURS.filter((i) => i.famille === fam).map((i) => ({
              libelle: i.libelle,
              valeur: (an: Exercice) => i.calcul(e, an),
              format: i.format,
              aide: `${i.definition} Formule : ${i.formule}.`,
            }))}
          />
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Analytique
// ---------------------------------------------------------------------------

function VueAnalytique({ e }: { e: Etats }) {
  const a = e.etab.finances.analytique;
  const [cle, setCle] = useState<string>('');
  const res = useMemo(() => analytique(e, cle || undefined), [e, cle]);
  if (!a || !res) return <p className="message-vide">Pas de comptabilité analytique pour cet établissement.</p>;
  const nomSection = (id: string) => a.sections.find((s) => s.id === id)?.nom ?? id;
  return (
    <div className="apparition">
      <p className="attenue" style={{ maxWidth: 820 }}>
        {a.commentaire} Exercice analysé : {a.exercice}. Le total des résultats par activité est égal au résultat courant avant impôt du compte de
        résultat.
      </p>
      <div className="barre-outils">
        <label>
          Répartition des charges indirectes
          <select value={cle} onChange={(ev) => setCle(ev.target.value)} style={{ width: 'auto' }}>
            <option value="">Clés retenues par l’établissement (par défaut)</option>
            {a.cles.map((k) => (
              <option key={k.id} value={k.id}>
                Tout répartir selon : {k.nom}
              </option>
            ))}
          </select>
        </label>
        {cle && <span className="badge badge--alerte">Convention modifiée</span>}
      </div>
      <div className="table-defilante">
        <table>
          <thead>
            <tr>
              <th>Activité</th>
              <th className="d">Produits</th>
              <th className="d">Charges directes</th>
              <th className="d">Marge sur coûts directs</th>
              <th className="d">Charges indirectes</th>
              <th className="d">Coût complet</th>
              <th className="d">Résultat</th>
              <th className="d">Coût complet unitaire</th>
            </tr>
          </thead>
          <tbody>
            {res.sections.map((s) => (
              <tr key={s.id}>
                <td>
                  <strong>{s.nom}</strong>
                </td>
                <td className="d">{euros(s.produits)}</td>
                <td className="d">{euros(s.chargesDirectes)}</td>
                <td className={`d ${s.margeSurCoutsDirects < 0 ? 'negatif' : ''}`}>{euros(s.margeSurCoutsDirects)}</td>
                <td className="d">{euros(s.chargesIndirectes)}</td>
                <td className="d">{euros(s.coutComplet)}</td>
                <td className={`d ${s.resultat < 0 ? 'negatif' : 'positif'}`}>{euros(s.resultat)}</td>
                <td className="d">{s.uniteOeuvre ? `${selonFormat(s.uniteOeuvre.coutUnitaire, '€/unité')} / ${s.uniteOeuvre.libelle}` : '·'}</td>
              </tr>
            ))}
            <tr className="total">
              <td>Total</td>
              <td className="d">{euros(res.totalProduits)}</td>
              <td className="d">{euros(somme(res.sections.map((s) => s.chargesDirectes)))}</td>
              <td className="d">{euros(somme(res.sections.map((s) => s.margeSurCoutsDirects)))}</td>
              <td className="d">{euros(somme(res.sections.map((s) => s.chargesIndirectes)))}</td>
              <td className="d">{euros(res.totalCharges)}</td>
              <td className="d">{euros(res.resultat)}</td>
              <td />
            </tr>
          </tbody>
        </table>
      </div>
      <div className="grille-2" style={{ marginTop: 24 }}>
        <GraphiqueBarres titre="Résultat par activité" horizontal donnees={res.sections.map((s) => ({ nom: s.nom, valeur: s.resultat }))} format="€" couleur={0} />
        <GraphiqueBarres titre="Coût complet par activité" horizontal donnees={res.sections.map((s) => ({ nom: s.nom, valeur: s.coutComplet }))} format="€" couleur={1} />
      </div>
      <h3 style={{ marginTop: 36 }}>Clés de répartition</h3>
      <div className="grille-auto">
        {a.cles.map((k) => {
          const tot = somme(Object.values(k.repartition));
          return (
            <div key={k.id} className="carte">
              <h4 style={{ marginBottom: 4 }}>{k.nom}</h4>
              <p className="petit attenue">
                Unité : {k.unite}. {k.justification}
              </p>
              <table>
                <tbody>
                  {Object.entries(k.repartition).map(([s, q]) => (
                    <tr key={s}>
                      <td className="petit">{nomSection(s)}</td>
                      <td className="d petit">{nombre(q, 1)}</td>
                      <td className="d petit attenue">{pourcent(tot ? q / tot : 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
      <h3 style={{ marginTop: 36 }}>Affectation des charges {a.exercice}</h3>
      <div className="table-defilante">
        <table>
          <thead>
            <tr>
              <th>Charge</th>
              <th>Nature</th>
              <th className="d">Montant</th>
              <th>Affectation</th>
            </tr>
          </thead>
          <tbody>
            {res.elements.map((el) => (
              <tr key={el.id}>
                <td>{el.libelle}</td>
                <td className="attenue">{el.nature}</td>
                <td className="d">{euros(el.montant)}</td>
                <td>
                  {'section' in el.affectation ? (
                    <span>Directe : {nomSection(el.affectation.section)}</span>
                  ) : (
                    <span className="attenue">Indirecte : {a.cles.find((k) => k.id === (cle || (el.affectation as { cle: string }).cle))?.nom}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Financements
// ---------------------------------------------------------------------------

function VueFinancements({ e }: { e: Etats }) {
  const { base } = useEtab();
  return (
    <div className="apparition">
      <h3>Emprunts</h3>
      <div className="table-defilante">
        <table>
          <thead>
            <tr>
              <th>Emprunt</th>
              <th>Prêteur</th>
              <th className="d">Capital</th>
              <th className="d">Taux</th>
              <th className="d">Durée</th>
              <th>Déblocage</th>
              <th className="d">Mensualité</th>
              {ANNEES_BILAN.map((a) => (
                <th key={a} className={`d ${a === 2026 ? 'col-budget' : ''}`}>
                  CRD {a === 2026 ? '2026 B' : a}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {e.emprunts.map((t) => (
              <tr key={t.emprunt.id}>
                <td>
                  {t.emprunt.libelle}
                  <div className="petit attenue">{t.emprunt.objet}</div>
                </td>
                <td className="petit">{t.emprunt.preteur}</td>
                <td className="d">{euros(t.emprunt.capital)}</td>
                <td className="d">{pourcent(t.emprunt.taux)}</td>
                <td className="d">{t.emprunt.dureeMois} mois</td>
                <td className="num">{t.emprunt.debut.split('-').reverse().join('/')}</td>
                <td className="d">{euros(t.mensualite)}</td>
                {ANNEES_BILAN.map((a) => (
                  <td key={a} className={`d ${a === 2026 ? 'col-budget' : ''}`}>
                    {euros(t.restantDu[a] ?? 0)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: 20 }}>
        <TableFinanciere
          lignes={[
            { libelle: 'Intérêts payés', valeur: (a) => somme(e.emprunts.map((t) => t.interets[a] ?? 0)) },
            { libelle: 'Capital remboursé', valeur: (a) => somme(e.emprunts.map((t) => t.capitalRembourse[a] ?? 0)) },
            { libelle: 'Annuités totales', valeur: (a) => somme(e.emprunts.map((t) => (t.interets[a] ?? 0) + (t.capitalRembourse[a] ?? 0))), style: 'sous-total' },
            { libelle: 'Capital restant dû au 31/12', valeur: (a) => e.bilans[a].emprunts, style: 'total' },
          ]}
        />
      </div>
      <p className="petit attenue" style={{ marginTop: 12 }}>
        Les échéanciers détaillés figurent parmi les <Link to={`${base}/documents`}>documents</Link>. Seuls les intérêts sont des charges ; le
        remboursement du capital est un flux de financement.
      </p>
      <h3 style={{ marginTop: 32 }}>Investissements de la période</h3>
      <TableFinanciere
        lignes={[
          { libelle: 'Acquisitions d’immobilisations', valeur: (a) => e.flux[a].investissements },
          { libelle: 'Dotations aux amortissements', valeur: (a) => e.cr[a].dotationsAmortissements },
          { libelle: 'Degré d’amortissement des immobilisations', valeur: (a) => evaluer(e, 'vetusteImmobilisations', a), format: '%' },
        ]}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Comparaison
// ---------------------------------------------------------------------------

function VueComparaison({ e }: { e: Etats }) {
  const [a1, setA1] = useState<Exercice>(2024);
  const [a2, setA2] = useState<Exercice>(2025);
  const [choix, setChoix] = useState<string[]>(['ca', 'va', 'ebe', 'tauxEBE', 'rn', 'caf', 'fr', 'bfr', 'tn', 'endettement']);
  const [graphe, setGraphe] = useState('ebe');
  const familles = Array.from(new Set(INDICATEURS.map((i) => i.famille)));
  const defs = INDICATEURS.filter((i) => choix.includes(i.id));
  const ecart = (d: DefIndicateur) => {
    const v1 = d.calcul(e, a1);
    const v2 = d.calcul(e, a2);
    if (v1 === null || v2 === null) return { abs: null, rel: null };
    return { abs: v2 - v1, rel: d.format === '€' ? variation(v1, v2) : null };
  };
  const g = INDICATEURS.find((i) => i.id === graphe)!;
  return (
    <div className="apparition">
      <div className="barre-outils">
        <label>
          Exercice de référence
          <select value={a1} onChange={(ev) => setA1(Number(ev.target.value) as Exercice)} style={{ width: 'auto' }}>
            {EXERCICES.map((a) => (
              <option key={a} value={a}>
                {libAn(a)}
              </option>
            ))}
          </select>
        </label>
        <label>
          Exercice comparé
          <select value={a2} onChange={(ev) => setA2(Number(ev.target.value) as Exercice)} style={{ width: 'auto' }}>
            {EXERCICES.map((a) => (
              <option key={a} value={a}>
                {libAn(a)}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="grille-1-2">
        <fieldset className="carte" style={{ margin: 0 }}>
          <legend className="petit" style={{ fontWeight: 600 }}>
            Indicateurs à comparer
          </legend>
          {familles.map((f) => (
            <div key={f} style={{ marginBottom: 10 }}>
              <div className="petit attenue" style={{ marginTop: 8 }}>
                {f}
              </div>
              {INDICATEURS.filter((i) => i.famille === f).map((i) => (
                <label key={i.id} className="case" style={{ padding: '2px 0' }}>
                  <input type="checkbox" checked={choix.includes(i.id)} onChange={(ev) => setChoix((c) => (ev.target.checked ? [...c, i.id] : c.filter((x) => x !== i.id)))} />
                  <span className="petit">{i.libelle}</span>
                </label>
              ))}
            </div>
          ))}
        </fieldset>
        <div>
          <div className="table-defilante">
            <table>
              <thead>
                <tr>
                  <th>Indicateur</th>
                  <th className="d">{libAn(a1)}</th>
                  <th className="d">{libAn(a2)}</th>
                  <th className="d">Écart absolu</th>
                  <th className="d">Écart relatif</th>
                </tr>
              </thead>
              <tbody>
                {defs.map((d) => {
                  const x = ecart(d);
                  return (
                    <tr key={d.id}>
                      <td>
                        <button className="lien-fleche" style={{ border: 0, background: 'none', padding: 0, fontWeight: graphe === d.id ? 700 : 500 }} onClick={() => setGraphe(d.id)}>
                          {d.libelle}
                        </button>
                        <Aide>{`${d.definition} Formule : ${d.formule}.`}</Aide>
                      </td>
                      <td className="d">{selonFormat(d.calcul(e, a1), d.format)}</td>
                      <td className="d">{selonFormat(d.calcul(e, a2), d.format)}</td>
                      <td className="d">{x.abs === null ? 'n.s.' : d.format === '%' ? `${nombre(x.abs * 100, 1)} pt` : selonFormat(x.abs, d.format)}</td>
                      <td className="d">{x.rel === null ? '·' : pourcent(x.rel)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {defs.length === 0 && <p className="message-vide">Sélectionnez au moins un indicateur.</p>}
          <div style={{ marginTop: 20 }}>
            <GraphiqueAnnuel
              titre={`${g.libelle} sur quatre exercices`}
              note="Cliquez sur un indicateur du tableau pour l’afficher."
              format={g.format === '%' ? '%' : g.format === '€' ? '€' : g.format}
              donnees={EXERCICES.map((a) => ({ annee: libAn(a), v: evaluer(e, g.id, a) }))}
              series={[{ cle: 'v', libelle: g.libelle, couleur: 0 }]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
