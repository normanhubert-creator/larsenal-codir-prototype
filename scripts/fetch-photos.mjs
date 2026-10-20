/**
 * Télécharge et optimise les photographies du manifeste src/data/photos.json.
 * Produit public/photos/<clé>-800.webp et public/photos/<clé>-1600.webp.
 * Exécuté automatiquement par le workflow de publication GitHub Pages ;
 * peut être lancé en local : npm run photos (accès à unsplash.com requis).
 * Les fichiers déjà présents ne sont pas retéléchargés. Un échec n'interrompt pas la construction :
 * le site affiche alors un aplat de couleur à la place de l'image.
 */
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import sharp from 'sharp';

const manifeste = JSON.parse(readFileSync(new URL('../src/data/photos.json', import.meta.url), 'utf8'));
const dossier = new URL('../public/photos/', import.meta.url);
mkdirSync(dossier, { recursive: true });

let ok = 0;
const echecs = [];
for (const p of manifeste) {
  const cible1600 = new URL(`${p.cle}-1600.webp`, dossier);
  const cible800 = new URL(`${p.cle}-800.webp`, dossier);
  if (existsSync(cible1600) && existsSync(cible800)) {
    ok++;
    continue;
  }
  try {
    const rep = await fetch(`https://unsplash.com/photos/${p.unsplashId}/download?force=true&w=2000`, { redirect: 'follow' });
    if (!rep.ok) throw new Error(`HTTP ${rep.status}`);
    const tampon = Buffer.from(await rep.arrayBuffer());
    await sharp(tampon).rotate().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 74 }).toFile(cible1600.pathname);
    await sharp(tampon).rotate().resize({ width: 800, withoutEnlargement: true }).webp({ quality: 72 }).toFile(cible800.pathname);
    ok++;
    console.log('✓', p.cle);
  } catch (e) {
    echecs.push(`${p.cle} (${p.unsplashId}) : ${e.message}`);
    console.warn('✗', p.cle, e.message);
  }
}
console.log(`\n${ok}/${manifeste.length} photographies disponibles.`);
if (echecs.length) console.warn('Échecs :\n' + echecs.join('\n'));
