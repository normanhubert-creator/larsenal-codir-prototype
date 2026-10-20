/**
 * Copie le site construit (dist/) à la racine du dépôt, où GitHub Pages le sert
 * directement (réglage « Deploy from a branch », branche main, dossier racine).
 * Usage : npm run build && node scripts/publier-racine.mjs
 */
import { cpSync, existsSync, rmSync, writeFileSync } from 'node:fs';

if (!existsSync('dist/index.html')) throw new Error('Lancer d’abord npm run build');
rmSync('assets', { recursive: true, force: true });
cpSync('dist/assets', 'assets', { recursive: true });
if (existsSync('dist/photos')) cpSync('dist/photos', 'photos', { recursive: true });
cpSync('dist/index.html', 'index.html');
writeFileSync('.nojekyll', '');
console.log('Site construit copié à la racine (index.html, assets/, photos/).');
