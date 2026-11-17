// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// URL définitive du site, à remplacer avant la mise en ligne.
// Elle sert au sitemap, aux URL canoniques et aux balises Open Graph.
const SITE_URL = 'https://www.exemple-sculpteur.fr';

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  image: {
    layout: 'constrained',
    responsiveStyles: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
