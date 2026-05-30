import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `base: './'` produit des chemins relatifs pour un hébergement statique
// simple (GitHub Pages, Netlify, Vercel...).
export default defineConfig({
  plugins: [react()],
  base: './',
});
