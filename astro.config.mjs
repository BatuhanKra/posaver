// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  base: process.env.BASE_PATH || '/',
  vite: {
    build: { chunkSizeWarningLimit: 800 },
  },
});
