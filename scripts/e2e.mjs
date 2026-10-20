/**
 * Tests de navigation et captures d'écran (Playwright).
 * Prérequis : `npm run build` puis `npx vite preview --port 4173` lancé dans un autre terminal.
 * Usage : node scripts/e2e.mjs [--captures]
 * Variable CHROMIUM_PATH pour indiquer un exécutable Chromium (par défaut celui de Playwright).
 */
import { chromium } from 'playwright-core';
import { mkdirSync, readdirSync, readFileSync } from 'node:fs';

const BASE = process.env.BASE_URL ?? 'http://localhost:4173/';
const CAPTURES = process.argv.includes('--captures');
const dossierCaptures = 'docs/captures';
if (CAPTURES) mkdirSync(dossierCaptures, { recursive: true });

const ids = readdirSync('src/data/etablissements').map((f) => f.replace(/\.ts$/, ''));
const RUBRIQUES = ['', 'etablissement', 'installations', 'cavalerie', 'activites', 'clients', 'fournisseurs', 'rh', 'environnement', 'documents', 'missions', 'simulateur', 'travaux', 'impression'];
const VUES = ['tableau-de-bord', 'compte-de-resultat', 'sig', 'caf', 'bilan', 'flux', 'tresorerie', 'ratios', 'analytique', 'financements', 'comparaison'];

const echecs = [];
const ok = (cond, msg) => {
  if (!cond) {
    echecs.push(msg);
    console.log('  ✗', msg);
  }
};

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell' });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
const page = await ctx.newPage();
const erreurs = [];
page.on('pageerror', (e) => erreurs.push(e.message));
page.on('console', (m) => {
  if (m.type() === 'error' && !/Failed to load resource|ERR_|net::/.test(m.text())) erreurs.push(m.text());
});

const aller = async (chemin) => {
  await page.goto(BASE + '#/' + chemin, { waitUntil: 'networkidle' });
  await page.waitForTimeout(150);
};
const capture = async (nom, pleinePage = false) => {
  if (CAPTURES) await page.screenshot({ path: `${dossierCaptures}/${nom}.png`, fullPage: pleinePage });
};

// 1. Accueil
console.log('Accueil');
await aller('');
const cartes = await page.locator('.carte-etab').count();
ok(cartes === ids.length, `galerie : ${cartes} cartes pour ${ids.length} établissements`);
await capture('01-accueil');
await page.locator('#etablissements').scrollIntoViewIfNeeded();
await capture('02-galerie', false);
await page.getByRole('button', { name: 'Dossiers approfondis' }).click();
const approfondis = await page.locator('.carte-etab').count();
ok(approfondis >= 1 && approfondis < cartes, `filtre approfondis : ${approfondis}`);
await page.getByRole('button', { name: 'Dossiers approfondis' }).click();
await page.locator('.carte-etab').first().click();
await page.waitForURL(/#\/e\//);
ok(true, 'clic sur une carte');

// 2. Parcours de chaque établissement
for (const id of ids) {
  console.log('Établissement', id);
  for (const r of RUBRIQUES) {
    await aller(`e/${id}${r ? '/' + r : ''}`);
    const introuvable = await page.getByText('Cette adresse ne mène à aucun dossier').count();
    ok(introuvable === 0, `${id}/${r} : page introuvable`);
    ok((await page.locator('h1').count()) > 0, `${id}/${r} : pas de titre h1`);
  }
  for (const v of VUES) {
    await aller(`e/${id}/finances/${v}`);
    ok((await page.locator('table, .recharts-wrapper').count()) > 0, `${id}/finances/${v} : ni tableau ni graphique`);
  }
  for (const n of [1, 2, 3, 4, 5]) {
    await aller(`e/${id}/missions/${n}`);
    ok((await page.locator('.espace-travail').count()) === 1, `${id}/missions/${n} : espace de travail absent`);
  }
  await aller(`e/${id}/documents`);
  const docs = await page.locator('.ligne-doc').all();
  for (const d of docs.slice(0, 40)) {
    const href = await d.getAttribute('href');
    await page.goto(BASE + href, { waitUntil: 'networkidle' });
    ok((await page.locator('.papier').count()) === 1, `${id} document ${href} : non affiché`);
    await page.goBack();
  }
}

// 3. Fonctionnalités de travail (sur le premier établissement approfondi)
const cible = ids.includes('clos-des-tilleuls') ? 'clos-des-tilleuls' : ids[0];
console.log('Fonctionnalités', cible);
await aller(`e/${cible}/missions/1`);
await page.locator('.swot__zone').first().getByRole('button', { name: '+ Ajouter une observation' }).click();
await page.locator('.swot__zone').first().locator('textarea').first().fill('Équipe enseignante stable et appréciée des familles');
await page.locator('.swot__zone').first().getByRole('button', { name: 'Enregistrer' }).click();
await page.locator('#m1-enjeux').fill('Synthèse de test : la cavalerie et les créneaux conditionnent le développement.');
await page.waitForTimeout(700);
await capture('10-mission-swot', true);
await page.reload({ waitUntil: 'networkidle' });
ok((await page.getByText('Équipe enseignante stable et appréciée des familles').count()) === 1, 'SWOT : observation non restaurée après rechargement');
ok((await page.locator('#m1-enjeux').inputValue()).includes('Synthèse de test'), 'SWOT : synthèse non restaurée');

await aller(`e/${cible}/missions/2`);
const ctrl = page.locator('.controle input').first();
if ((await ctrl.count()) > 0) {
  await ctrl.fill('1');
  await page.locator('.controle').first().getByRole('button', { name: 'Vérifier' }).click();
  ok((await page.locator('.controle__resultat').count()) === 1, 'contrôle de calcul : pas de retour');
}
await page.locator('.grille-3 input[type=checkbox]').first().check();
await capture('11-mission-diagnostic-financier', true);

await aller(`e/${cible}/simulateur`);
const vanAvant = await page.locator('.tuile').nth(1).locator('.tuile__valeur').innerText();
await page.getByRole('button', { name: 'Favorable' }).click();
const vanApres = await page.locator('.tuile').nth(1).locator('.tuile__valeur').innerText();
ok(vanAvant !== vanApres, 'simulateur : la VAN ne réagit pas au scénario');
await page.locator('input[aria-label="Nom de la simulation"]').fill('Test automatique');
await page.getByRole('button', { name: 'Enregistrer', exact: true }).click();
await page.waitForTimeout(600);
ok((await page.getByText('Test automatique').count()) >= 1, 'simulateur : simulation non enregistrée');
await capture('12-simulateur', true);

await aller(`e/${cible}/travaux`);
const [dl] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Télécharger en Markdown' }).click()]);
const md = readFileSync(await dl.path(), 'utf8');
ok(md.includes('Équipe enseignante stable'), 'export Markdown : contenu manquant');
const [dlj] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Télécharger la sauvegarde JSON' }).click()]);
const chemin = await dlj.path();
await page.getByRole('button', { name: 'Effacer mon travail' }).click();
await page.getByRole('button', { name: 'Oui, tout effacer' }).click();
await aller(`e/${cible}/missions/1`);
ok((await page.getByText('Équipe enseignante stable et appréciée des familles').count()) === 0, 'réinitialisation sans effet');
await aller(`e/${cible}/travaux`);
await page.locator('#import-json').setInputFiles(chemin);
await page.waitForTimeout(400);
await aller(`e/${cible}/missions/1`);
ok((await page.getByText('Équipe enseignante stable et appréciée des familles').count()) === 1, 'import JSON : travail non restauré');

// 4. Captures représentatives
if (CAPTURES) {
  const vues = [
    ['20-etab-accueil', `e/${cible}`, false],
    ['21-cavalerie', `e/${cible}/cavalerie`, false],
    ['22-tableau-de-bord', `e/${cible}/finances/tableau-de-bord`, true],
    ['23-compte-resultat', `e/${cible}/finances/compte-de-resultat`, false],
    ['24-bilan', `e/${cible}/finances/bilan`, false],
    ['25-analytique', `e/${cible}/finances/analytique`, false],
    ['26-tresorerie', `e/${cible}/finances/tresorerie`, false],
    ['27-document', `e/${cible}/documents`, false],
    ['28-missions', `e/${cible}/missions`, false],
  ];
  for (const [nom, ch, plein] of vues) {
    await aller(ch);
    await capture(nom, plein);
  }
  for (const id of ids.filter((x) => x !== cible)) {
    await aller(`e/${id}`);
    await capture(`30-${id}`);
  }
  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true });
  const pm = await mobile.newPage();
  for (const [nom, ch] of [
    ['40-mobile-accueil', ''],
    ['41-mobile-etab', `e/${cible}`],
    ['42-mobile-finances', `e/${cible}/finances`],
    ['43-mobile-mission', `e/${cible}/missions/1`],
  ]) {
    await pm.goto(BASE + '#/' + ch, { waitUntil: 'networkidle' });
    await pm.waitForTimeout(200);
    await pm.screenshot({ path: `${dossierCaptures}/${nom}.png` });
    const largeur = await pm.evaluate(() => document.documentElement.scrollWidth);
    ok(largeur <= 392, `${nom} : défilement horizontal (${largeur}px)`);
  }
  await mobile.close();
}

ok(erreurs.length === 0, `erreurs JavaScript : ${[...new Set(erreurs)].slice(0, 5).join(' | ')}`);
await browser.close();
console.log(echecs.length ? `\n${echecs.length} échec(s)` : '\nTous les contrôles de navigation sont passés.');
process.exit(echecs.length ? 1 : 0);
