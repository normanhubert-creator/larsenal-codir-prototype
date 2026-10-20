import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useEtab } from '../../contexte';
import { EnteteRubrique, FilAriane, Section } from '../../components/commun';
import { recettePrestation, somme, LIBELLES_IMMO } from '../../finance/engine';
import { dateLongue, euros, eurosCentimes, nombre, pourcent } from '../../lib/format';
import { EXERCICES, type BlocDocument, type DocumentAuto, type DocumentPro } from '../../types';
import { Introuvable } from '../Introuvable';

const TYPES: Record<string, string> = {
  note: 'Note interne',
  'compte-rendu': 'Compte rendu',
  courrier: 'Courrier',
  devis: 'Devis',
  tableau: 'Tableau de suivi',
  etude: 'Étude',
  rapport: 'Rapport',
  contrat: 'Contrat',
  courriel: 'Courriel',
  plan: 'Plan d’action',
  'auto-echeancier': 'Échéancier',
  'auto-tarifs': 'Grille tarifaire',
  'auto-bilan': 'État financier',
  'auto-compte-resultat': 'État financier',
};

export const libelleType = (t: string) => TYPES[t] ?? t;

function titreAuto(d: DocumentAuto, etabNom: string, emprunts: { id: string; libelle: string }[]) {
  if (d.titre) return d.titre;
  switch (d.type) {
    case 'auto-echeancier':
      return `Échéancier : ${emprunts.find((x) => x.id === d.emprunt)?.libelle ?? ''}`;
    case 'auto-tarifs':
      return 'Grille tarifaire et volumes';
    case 'auto-bilan':
      return `Bilan au 31 décembre ${d.exercice}`;
    case 'auto-compte-resultat':
      return `Compte de résultat ${d.exercice}`;
  }
  return etabNom;
}

export function Documents() {
  const { etab, base } = useEtab();
  const [filtre, setFiltre] = useState('tous');
  const types = Array.from(new Set(etab.documents.map((d) => d.type)));
  const docs = [...etab.documents].sort((a, b) => b.date.localeCompare(a.date)).filter((d) => filtre === 'tous' || d.type === filtre);
  return (
    <>
      <EnteteRubrique
        surtitre="Documents professionnels"
        titre="Le dossier de direction"
        texte="Notes, comptes rendus, courriers, devis et études : les pièces sur lesquelles s’appuient les décisions. Certaines expriment des points de vue divergents ; à vous de les confronter."
      />
      <FilAriane elements={[{ libelle: 'Galerie', vers: '/?galerie' }, { libelle: etab.nomCourt, vers: base }, { libelle: 'Documents' }]} />
      <Section>
        <div className="filtres" role="group" aria-label="Filtrer par type">
          <button className="puce-filtre" aria-pressed={filtre === 'tous'} onClick={() => setFiltre('tous')}>
            Toutes les pièces ({etab.documents.length})
          </button>
          {types.map((t) => (
            <button key={t} className="puce-filtre" aria-pressed={filtre === t} onClick={() => setFiltre(t)}>
              {libelleType(t)}
            </button>
          ))}
        </div>
        <div className="liste-docs">
          {docs.map((d) => (
            <Link key={d.id} to={`${base}/documents/${d.id}`} className="ligne-doc">
              <span className="ligne-doc__type">{libelleType(d.type)}</span>
              <div>
                <h3>{d.titre}</h3>
                <p>
                  {d.emetteur} · {d.resume}
                </p>
              </div>
              <span className="petit attenue num">{dateLongue(d.date)}</span>
            </Link>
          ))}
        </div>
      </Section>
      <Section alt>
        <span className="surtitre">Pièces comptables et contractuelles</span>
        <h3>Documents établis à partir des données de gestion</h3>
        <div className="liste-docs" style={{ marginTop: 18 }}>
          {etab.documentsAuto.map((d) => (
            <Link key={d.id} to={`${base}/documents/${d.id}`} className="ligne-doc">
              <span className="ligne-doc__type">{libelleType(d.type)}</span>
              <div>
                <h3>{titreAuto(d, etab.nom, etab.finances.emprunts)}</h3>
                <p>Document généré à partir des comptes et des contrats de l’établissement.</p>
              </div>
              <span className="petit attenue">Consulter</span>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}

function Bloc({ b }: { b: BlocDocument }) {
  switch (b.type) {
    case 'p':
      return <p>{b.texte}</p>;
    case 'h':
      return <h2>{b.texte}</h2>;
    case 'liste':
      return (
        <ul>
          {b.items.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      );
    case 'citation':
      return (
        <blockquote>
          « {b.texte} »{b.auteur && <footer className="petit">{b.auteur}</footer>}
        </blockquote>
      );
    case 'signature':
      return (
        <div className="signature">
          <strong>{b.nom}</strong>
          <span className="petit">{b.fonction}</span>
        </div>
      );
    case 'tableau':
      return (
        <div className="table-defilante" style={{ border: 0, background: 'none' }}>
          <table>
            <thead>
              <tr>
                {b.colonnes.map((c, i) => (
                  <th key={c} className={b.alignDroite?.includes(i) ? 'd' : ''}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.lignes.map((l, i) => (
                <tr key={i} className={String(l[0]).startsWith('Total') ? 'total' : ''}>
                  {l.map((c, j) => (
                    <td key={j} className={b.alignDroite?.includes(j) ? 'd' : ''}>
                      {typeof c === 'number' ? nombre(c) : c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {b.note && <p className="petit" style={{ color: '#5d5f55' }}>{b.note}</p>}
        </div>
      );
  }
}

export function DocumentVue() {
  const { docId } = useParams();
  const { etab, base } = useEtab();
  const doc = etab.documents.find((d) => d.id === docId);
  const auto = etab.documentsAuto.find((d) => d.id === docId);
  if (!doc && !auto) return <Introuvable />;
  const titre = doc ? doc.titre : titreAuto(auto!, etab.nom, etab.finances.emprunts);
  return (
    <>
      <FilAriane elements={[{ libelle: 'Galerie', vers: '/?galerie' }, { libelle: etab.nomCourt, vers: base }, { libelle: 'Documents', vers: `${base}/documents` }, { libelle: titre }]} />
      <div className="bureau" style={{ marginTop: 16 }}>
        <div className="conteneur">
          <div className="pas-impression" style={{ display: 'flex', justifyContent: 'space-between', gap: 12, maxWidth: 820, margin: '0 auto 16px', flexWrap: 'wrap' }}>
            <Link to={`${base}/documents`} className="lien-fleche" style={{ flexDirection: 'row-reverse' }}>
              Retour aux documents
            </Link>
            <button className="btn btn--contour btn--petit" onClick={() => window.print()}>
              Imprimer la pièce
            </button>
          </div>
          <article className="papier">
            {doc?.confidentiel && <span className="tampon">Confidentiel</span>}
            <header className="papier__entete">
              <div className="logo-etab">
                <span className="monogramme" aria-hidden>
                  {etab.monogramme}
                </span>
                <span className="logo-etab__nom" style={{ whiteSpace: 'normal' }}>
                  {etab.nom}
                  <small>
                    {etab.lieu.commune} · {etab.lieu.departement}
                  </small>
                </span>
              </div>
              <div className="papier__meta">
                {doc ? (
                  <>
                    <div>{libelleType(doc.type)}</div>
                    <div>{dateLongue(doc.date)}</div>
                    <div>De : {doc.emetteur}</div>
                    {doc.destinataire && <div>À : {doc.destinataire}</div>}
                  </>
                ) : (
                  <>
                    <div>{libelleType(auto!.type)}</div>
                    <div>Source : comptabilité et contrats</div>
                  </>
                )}
              </div>
            </header>
            <h1>{titre}</h1>
            {doc ? doc.contenu.map((b, i) => <Bloc key={i} b={b} />) : <ContenuAuto d={auto!} />}
            <p className="petit" style={{ marginTop: 36, color: '#7a7c72', borderTop: '1px solid #e3ddce', paddingTop: 12 }}>
              Document fictif établi pour un usage pédagogique. Coordonnées et personnes simulées.
            </p>
          </article>
        </div>
      </div>
    </>
  );
}

function ContenuAuto({ d }: { d: DocumentAuto }) {
  const { etab, e } = useEtab();
  if (d.type === 'auto-echeancier') {
    const t = e.emprunts.find((x) => x.emprunt.id === d.emprunt)!;
    const parAn = new Map<number, { interets: number; capital: number; crd: number }>();
    for (const ech of t.echeances) {
      const cur = parAn.get(ech.annee) ?? { interets: 0, capital: 0, crd: 0 };
      cur.interets += ech.interets;
      cur.capital += ech.capital;
      cur.crd = ech.restantDu;
      parAn.set(ech.annee, cur);
    }
    return (
      <>
        <p>
          Prêteur : {t.emprunt.preteur}. Objet : {t.emprunt.objet}. Capital : {euros(t.emprunt.capital)}, taux nominal annuel {pourcent(t.emprunt.taux)},{' '}
          {t.emprunt.dureeMois} échéances mensuelles constantes de {eurosCentimes(t.mensualite)}, déblocage en {t.emprunt.debut.split('-').reverse().join('/')}.
        </p>
        <h2>Récapitulatif annuel</h2>
        <table>
          <thead>
            <tr>
              <th>Année</th>
              <th className="d">Intérêts</th>
              <th className="d">Capital remboursé</th>
              <th className="d">Annuité</th>
              <th className="d">Capital restant dû au 31/12</th>
            </tr>
          </thead>
          <tbody>
            {[...parAn.entries()].map(([an, v]) => (
              <tr key={an}>
                <td>{an}</td>
                <td className="d">{eurosCentimes(v.interets)}</td>
                <td className="d">{eurosCentimes(v.capital)}</td>
                <td className="d">{eurosCentimes(v.interets + v.capital)}</td>
                <td className="d">{eurosCentimes(v.crd)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h2>Échéances de l’année 2025 et 2026</h2>
        <table>
          <thead>
            <tr>
              <th>N°</th>
              <th>Échéance</th>
              <th className="d">Intérêts</th>
              <th className="d">Capital</th>
              <th className="d">Restant dû</th>
            </tr>
          </thead>
          <tbody>
            {t.echeances
              .filter((x) => x.annee === 2025 || x.annee === 2026)
              .map((x) => (
                <tr key={x.numero}>
                  <td>{x.numero}</td>
                  <td>
                    {String(x.mois).padStart(2, '0')}/{x.annee}
                  </td>
                  <td className="d">{eurosCentimes(x.interets)}</td>
                  <td className="d">{eurosCentimes(x.capital)}</td>
                  <td className="d">{eurosCentimes(x.restantDu)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </>
    );
  }
  if (d.type === 'auto-tarifs') {
    return (
      <>
        <p>Tarifs hors taxes par unité vendue et volumes réalisés (2023 à 2025) ou budgétés (2026).</p>
        <table>
          <thead>
            <tr>
              <th>Prestation</th>
              <th>Unité</th>
              {EXERCICES.map((a) => (
                <th key={a} className="d">
                  Tarif {a === 2026 ? '2026 B' : a}
                </th>
              ))}
              <th className="d">Volume 2025</th>
              <th className="d">Recette 2025</th>
            </tr>
          </thead>
          <tbody>
            {etab.activites.prestations.map((p) => (
              <tr key={p.id}>
                <td>{p.nom}</td>
                <td>{p.unite}</td>
                {EXERCICES.map((a) => (
                  <td key={a} className="d">
                    {euros(p.prix[a])}
                  </td>
                ))}
                <td className="d">{nombre(p.volume[2025])}</td>
                <td className="d">{euros(recettePrestation(p, 2025))}</td>
              </tr>
            ))}
            <tr className="total">
              <td colSpan={7}>Total 2025</td>
              <td className="d">{euros(somme(etab.activites.prestations.map((p) => recettePrestation(p, 2025))))}</td>
            </tr>
          </tbody>
        </table>
      </>
    );
  }
  if (d.type === 'auto-compte-resultat') {
    const c = e.cr[d.exercice];
    const rows: [string, number, boolean?][] = [
      ['Chiffre d’affaires net', c.chiffreAffaires],
      ['Production stockée', c.productionStockee],
      ['Subventions d’exploitation', c.subventionsExploitation],
      ['Autres produits et reprises', c.autresProduits + c.reprisesExploitation],
      ['Total produits d’exploitation', c.produitsExploitation, true],
      ['Achats consommés (marchandises et approvisionnements)', c.achatsMarchandises + c.variationStockMarchandises + c.achatsApprovisionnements + c.variationStockApprovisionnements],
      ['Autres achats et charges externes', c.chargesExternes],
      ['Impôts et taxes', c.impotsTaxes],
      ['Salaires et charges sociales', c.salaires + c.chargesSociales],
      ['Dotations aux amortissements et provisions', c.dotationsAmortissements + c.dotationsProvisionsExploitation],
      ['Autres charges', c.autresCharges],
      ['Total charges d’exploitation', c.chargesExploitation, true],
      ['Résultat d’exploitation', c.resultatExploitation, true],
      ['Résultat financier', c.resultatFinancier],
      ['Résultat exceptionnel', c.resultatExceptionnel],
      ['Impôt sur les bénéfices', c.impotSocietes],
      ['Résultat net', c.resultatNet, true],
    ];
    return (
      <>
        <p>Compte de résultat simplifié de l’exercice clos le 31 décembre {d.exercice}. Le détail par compte figure dans la rubrique Gestion et finances.</p>
        <table>
          <tbody>
            {rows
              .filter(([, v, t]) => t || Math.abs(v) > 0.5)
              .map(([l, v, t]) => (
                <tr key={l} className={t ? 'sous-total' : ''}>
                  <td>{l}</td>
                  <td className="d">{euros(v)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </>
    );
  }
  const b = e.bilans[d.exercice];
  return (
    <>
      <p>Bilan simplifié au 31 décembre {d.exercice}, après affectation du résultat non encore décidée (résultat présenté séparément).</p>
      <table>
        <thead>
          <tr>
            <th>Actif</th>
            <th className="d">Net</th>
          </tr>
        </thead>
        <tbody>
          {b.immobilisations.map((i) => (
            <tr key={i.categorie}>
              <td>{LIBELLES_IMMO[i.categorie]}</td>
              <td className="d">{euros(i.net)}</td>
            </tr>
          ))}
          <tr>
            <td>Stocks</td>
            <td className="d">{euros(b.totalStocks)}</td>
          </tr>
          <tr>
            <td>Créances clients</td>
            <td className="d">{euros(b.creancesClients)}</td>
          </tr>
          <tr>
            <td>Autres créances</td>
            <td className="d">{euros(b.autresCreances)}</td>
          </tr>
          <tr>
            <td>Disponibilités</td>
            <td className="d">{euros(b.disponibilites)}</td>
          </tr>
          <tr className="total">
            <td>Total actif</td>
            <td className="d">{euros(b.totalActif)}</td>
          </tr>
        </tbody>
      </table>
      <table>
        <thead>
          <tr>
            <th>Passif</th>
            <th className="d">Montant</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{b.libelleCapital}</td>
            <td className="d">{euros(b.capital)}</td>
          </tr>
          <tr>
            <td>Réserves et report à nouveau</td>
            <td className="d">{euros(b.reserves)}</td>
          </tr>
          <tr>
            <td>Résultat de l’exercice</td>
            <td className="d">{euros(b.resultat)}</td>
          </tr>
          {b.subventionsInvestissement > 0 && (
            <tr>
              <td>Subventions d’investissement</td>
              <td className="d">{euros(b.subventionsInvestissement)}</td>
            </tr>
          )}
          {b.provisions > 0 && (
            <tr>
              <td>Provisions</td>
              <td className="d">{euros(b.provisions)}</td>
            </tr>
          )}
          <tr>
            <td>Emprunts</td>
            <td className="d">{euros(b.emprunts)}</td>
          </tr>
          {b.concoursBancaires > 0 && (
            <tr>
              <td>Concours bancaires courants</td>
              <td className="d">{euros(b.concoursBancaires)}</td>
            </tr>
          )}
          <tr>
            <td>Dettes d’exploitation (fournisseurs, fiscales et sociales, autres, produits constatés d’avance)</td>
            <td className="d">{euros(b.dettesExploitation)}</td>
          </tr>
          <tr className="total">
            <td>Total passif</td>
            <td className="d">{euros(b.totalPassif)}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

export type { DocumentPro };
