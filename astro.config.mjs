// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// URL définitive du site, à remplacer avant la mise en ligne.
// Elle sert au sitemap, aux URL canoniques et aux balises Open Graph.
const SITE_URL = 'https://www.exemple-sculpteur.fr';

export default defineConfig({
  // Surchargés par le workflow GitHub Pages (sous-dossier /<repo>/).
  site: process.env.SITE_URL ?? SITE_URL,
  base: process.env.BASE_PATH ?? '/',
  trailingSlash: 'ignore',
  integrations: [sitemap({ filter: (page) => !/\/(merci|404)\/?$/.test(page) })],
  image: {
    layout: 'constrained',
    responsiveStyles: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
