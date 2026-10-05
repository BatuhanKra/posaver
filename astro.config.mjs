// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: process.env.SITE_URL || 'https://batuhankra.github.io',
  base: process.env.BASE_PATH || '/',
  integrations: [sitemap()],
  vite: {
    build: { chunkSizeWarningLimit: 800 },
  },
});
