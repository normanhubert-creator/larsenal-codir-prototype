import { Link } from 'react-router-dom';
import { PagePlateforme } from '../components/Cadre';
import { PHOTOS } from '../data/photos';
import { ETABLISSEMENTS } from '../data/registry';

const SOURCES = [
  {
    titre: 'IFCE, Équipédia : références technico-économiques de la filière équine',
    url: 'https://equipedia.ifce.fr/economie-et-filiere/economie/references-technico-economiques/publications-technico-economiques',
    usage: 'Cadre de référence pour la structure des coûts et des produits des établissements équestres (centres équestres, pensions, tourisme, élevage).',
  },
  {
    titre: 'Réseau Équin (IFCE et chambres d’agriculture) : synthèses nationales des exploitations équines',
    url: 'https://chevaux-normandie.com/wp-content/uploads/2022/11/Synthese-nationale_2022vf.pdf',
    usage: 'Indicateurs suivis par le réseau (résultats par équidé, unités de main-d’œuvre, frais financiers) ; aucun chiffre du cas ne leur est attribué.',
  },
  {
    titre: 'Autorité des normes comptables : règlements ANC 2014-03 (plan comptable général) et ANC 2018-06 (associations)',
    url: 'https://www.anc.gouv.fr/',
    usage: 'Référentiels retenus pour la présentation des comptes et des soldes intermédiaires de gestion.',
  },
  {
    titre: 'Code rural et de la pêche maritime, article L311-1',
    url: 'https://www.legifrance.gouv.fr/',
    usage: 'Caractère agricole des activités de préparation et d’entraînement des équidés domestiques.',
  },
  {
    titre: 'Loi n° 2021-1539 du 30 novembre 2021 visant à lutter contre la maltraitance animale',
    url: 'https://www.legifrance.gouv.fr/',
    usage: 'Contexte réglementaire du bien-être des équidés.',
  },
];

const INSPIRATIONS = [
  ['Haras de La Cense (France)', 'https://lacense.com/', 'Traitement éditorial de la photographie, place donnée à la pédagogie.'],
  ['Diamante Farms (États-Unis)', 'https://www.diamantefarms.com/', 'Présentation des installations et du confort des chevaux, positionnement premium.'],
  ['Wellington International (États-Unis)', 'https://www.wellingtoninternational.com/', 'Hiérarchie de l’information événementielle, partenaires.'],
  ['Haras de Clarbec (France)', 'https://harasdeclarbec.com/', 'Présentation de l’élevage, des étalons et des chevaux à vendre.'],
  ['Domaine de Maffliers (France)', 'https://www.demeures-de-campagne.com/hotels/domaine-de-maffliers/le-centre-equestre', 'Association du patrimoine, du tourisme et des activités équestres.'],
  ['Haras des Périchons (France)', 'https://www.harasdesperichons.com/', 'Esthétique sombre, minimaliste et élégante.'],
  ['Golden Equestrian Stables (États-Unis)', 'https://www.goldenequestrianstables.com/', 'Identité haut de gamme et univers sportif.'],
  ['Equitaide (France)', 'https://www.equitaide.com/', 'Présentation d’un projet de médiation équine et d’accompagnement.'],
];

function Methodologie() {
  return (
    <>
      <section className="section">
        <div className="conteneur conteneur--etroit">
          <span className="surtitre">Méthodologie</span>
          <h1>Comment les dossiers sont construits</h1>
          <p className="chapeau">
            Les dix établissements sont fictifs mais construits pour être économiquement plausibles. Leurs comptes ne sont pas saisis : ils sont
            calculés à partir de leur activité.
          </p>
          <h2>Du modèle économique aux états financiers</h2>
          <ol>
            <li>Chaque prestation est décrite par un prix unitaire hors taxes et un volume annuel ; leur produit forme le chiffre d’affaires.</li>
            <li>Les volumes sont confrontés aux capacités (boxes, places, jours d’ouverture) et aux moyens (équipe, cavalerie).</li>
            <li>Les charges de personnel résultent des équivalents temps plein, des salaires bruts et des taux de cotisations patronales.</li>
            <li>Les dotations aux amortissements proviennent d’un registre des immobilisations (linéaire, prorata temporis mensuel).</li>
            <li>Les intérêts et remboursements proviennent des tableaux d’emprunt (échéances mensuelles constantes).</li>
            <li>Les stocks et les postes du besoin en fonds de roulement sont saisis en fin d’exercice ; leurs variations alimentent le compte de résultat et les flux.</li>
            <li>La trésorerie de clôture résulte des flux : CAF, variation du BFR, investissements, financements, distributions. L’équilibre du bilan en découle.</li>
            <li>Au bilan d’ouverture (31 décembre 2022), les réserves sont la seule grandeur déterminée par solde.</li>
          </ol>
          <h2>Formules</h2>
          <p>
            Toutes les formules sont centralisées dans le module <code>src/finance</code> du code source : compte de résultat, soldes intermédiaires de
            gestion selon le plan comptable général, CAF par les méthodes additive et soustractive, bilan, fonds de roulement, besoin en fonds de
            roulement, trésorerie nette, ratios, comptabilité analytique en coûts complets et simulateur d’investissement (VAN, TRI, délai de
            récupération).
          </p>
          <h2>Contrôles automatiques</h2>
          <p>À chaque modification des données, des tests vérifient pour chaque établissement :</p>
          <ul>
            <li>l’équilibre actif = passif à chaque clôture ;</li>
            <li>la cohérence des sous-totaux du compte de résultat et des SIG ;</li>
            <li>l’égalité des deux méthodes de calcul de la CAF ;</li>
            <li>l’égalité trésorerie nette = FR − BFR = disponibilités − concours bancaires ;</li>
            <li>l’égalité entre recettes opérationnelles et chiffre d’affaires comptable ;</li>
            <li>la cohérence des emprunts, des amortissements et des scénarios d’investissement ;</li>
            <li>le raccordement de la trésorerie mensuelle aux bilans ;</li>
            <li>le respect des capacités et l’absence de valeurs non définies.</li>
          </ul>
          <h2>Simplifications assumées</h2>
          <ul>
            <li>Les montants sont hors taxes ; la TVA, dont les taux varient selon les prestations équestres, n’est pas modélisée.</li>
            <li>L’impôt sur les sociétés est calculé sur le résultat comptable (15 % jusqu’à 42 500 €, 25 % au-delà, report des déficits), sans réintégrations fiscales.</li>
            <li>Les entreprises soumises à l’impôt sur le revenu ne supportent pas d’impôt dans leurs comptes ; les associations sont traitées comme non lucratives.</li>
            <li>Le simulateur raisonne en différentiel : il isole les effets du projet et applique un taux d’impôt marginal simplifié.</li>
          </ul>
          <h2>Sources et statut des chiffres</h2>
          <p>
            Les données des établissements sont des <strong>données simulées</strong> fondées sur des <strong>hypothèses pédagogiques</strong>. Aucun
            chiffre inventé n’est attribué à une source réelle. Les sources ci-dessous ont servi de cadre de référence ; elles doivent être consultées
            directement pour toute donnée chiffrée sectorielle.
          </p>
          <ul>
            {SOURCES.map((s) => (
              <li key={s.titre} style={{ marginBottom: 8 }}>
                <a href={s.url} target="_blank" rel="noreferrer">
                  {s.titre}
                </a>
                <br />
                <span className="petit attenue">{s.usage}</span>
              </li>
            ))}
          </ul>
          <h2>Références graphiques</h2>
          <p>
            La direction artistique s’inspire de la qualité éditoriale de plusieurs sites d’établissements équestres, sans en reprendre ni les logos,
            ni le code, ni les photographies.
          </p>
          <ul>
            {INSPIRATIONS.map(([n, u, c]) => (
              <li key={n}>
                <a href={u} target="_blank" rel="noreferrer">
                  {n}
                </a>{' '}
                <span className="attenue">: {c}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

function Credits() {
  const nom = (cle: string) => {
    if (cle.startsWith('accueil')) return 'Accueil de la plateforme';
    return ETABLISSEMENTS.find((e) => cle.startsWith(e.id + '-'))?.nom ?? '';
  };
  return (
    <section className="section">
      <div className="conteneur">
        <span className="surtitre">Crédits photographiques</span>
        <h1>Photographies</h1>
        <p className="chapeau">
          Les photographies proviennent d’Unsplash et sont utilisées selon la licence Unsplash, qui autorise la réutilisation gratuite. Elles sont
          illustratives : elles ne représentent aucun des établissements fictifs ni aucun lieu réel désigné.
        </p>
        <p className="attenue">
          Les fichiers sont téléchargés et optimisés lors de la publication du site (format WebP, deux tailles). La vérification visuelle de chaque
          image et de son auteur reste à faire avant un usage en dehors de la formation : les entrées marquées « à vérifier » sont signalées.
        </p>
        <div className="table-defilante">
          <table>
            <thead>
              <tr>
                <th>Usage</th>
                <th>Description</th>
                <th>Auteur</th>
                <th>Licence</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              {PHOTOS.map((p) => (
                <tr key={p.cle}>
                  <td className="petit">
                    {nom(p.cle)}
                    <div className="attenue">{p.cle}</div>
                  </td>
                  <td className="petit">{p.alt}</td>
                  <td className="petit">{p.auteur}</td>
                  <td className="petit">
                    {p.licence}
                    {!p.licenceVerifiee && <div className="negatif">à vérifier</div>}
                  </td>
                  <td className="petit">
                    <a href={p.page} target="_blank" rel="noreferrer">
                      Page Unsplash
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function APropos() {
  return (
    <section className="section">
      <div className="conteneur conteneur--etroit">
        <span className="surtitre">À propos</span>
        <h1>Mentions et fonctionnement</h1>
        <h2>Une simulation pédagogique</h2>
        <p>
          ÉQUIDÉCISION est un support d’enseignement de la licence professionnelle Management des entreprises équestres (ESTHUA, Université d’Angers,
          campus de Saumur). Les établissements, personnes, documents, coordonnées et données financières sont fictifs. Toute ressemblance avec une
          entreprise existante serait fortuite.
        </p>
        <h2>Aucun compte, aucune collecte</h2>
        <p>
          Le site ne demande ni identifiant ni mot de passe et ne collecte aucune donnée personnelle. Vos réponses sont enregistrées uniquement dans le
          stockage local de votre navigateur, séparément pour chaque établissement. Elles ne sont pas synchronisées entre appareils : pour changer
          d’ordinateur, exportez votre sauvegarde au format JSON puis importez-la. Vider les données de navigation efface ces travaux.
        </p>
        <h2>Rendre son travail</h2>
        <p>
          Depuis la page « Mes travaux » de chaque établissement, exportez vos réponses en Markdown ou en JSON, ou imprimez-les en PDF, puis remettez-les
          par le canal habituel de votre formation. La plateforme ne propose pas de dépôt en ligne.
        </p>
        <h2>Partager un établissement</h2>
        <p>
          Chaque établissement possède une adresse directe (par exemple <code>#/e/clos-des-tilleuls</code>) que l’enseignant peut communiquer à un
          groupe.
        </p>
        <p>
          <Link className="btn" to="/">
            Retour à la galerie
          </Link>
        </p>
      </div>
    </section>
  );
}

export function PagesGenerales({ page }: { page: 'methodologie' | 'credits' | 'a-propos' }) {
  return <PagePlateforme>{page === 'methodologie' ? <Methodologie /> : page === 'credits' ? <Credits /> : <APropos />}</PagePlateforme>;
}
