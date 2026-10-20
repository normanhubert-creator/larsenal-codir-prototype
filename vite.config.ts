/// <reference types="vitest" />
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Le gabarit source s'appelle source.html : la racine du dépôt peut ainsi accueillir
 * le site construit (index.html + assets/), servi tel quel par GitHub Pages.
 * Ce greffon renomme la page construite en index.html.
 */
function pageIndex(): Plugin {
  return {
    name: 'page-index',
    enforce: 'post',
    generateBundle(_options, bundle) {
      const page = bundle['source.html'];
      if (page) page.fileName = 'index.html';
    },
  };
}

// base relative : le site fonctionne dans n'importe quel sous-répertoire GitHub Pages
export default defineConfig({
  base: './',
  plugins: [react(), pageIndex()],
  server: { open: '/source.html' },
  build: { outDir: 'dist', chunkSizeWarningLimit: 1500, rollupOptions: { input: 'source.html' } },
  test: { environment: 'node', include: ['tests/**/*.test.ts'] },
});
