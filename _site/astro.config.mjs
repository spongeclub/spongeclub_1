// @ts-check
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';

import tailwindcss from '@tailwindcss/vite';

const astroPrerenderEntry = fileURLToPath(import.meta.resolve('astro/entrypoints/prerender'));

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        'astro/entrypoints/prerender': astroPrerenderEntry
      }
    }
  }
});
