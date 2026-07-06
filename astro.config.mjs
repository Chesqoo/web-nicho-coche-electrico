import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Dominio del sitio (necesario para sitemap y URLs canónicas)
export default defineConfig({
  site: 'https://vatiosencasa.com',
  integrations: [sitemap()],
});
