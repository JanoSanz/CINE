import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://cinecerca.vercel.app',
  output: 'static',
  build: {
    assets: 'assets'
  }
});