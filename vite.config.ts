import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// En production (GitHub Pages), le site est servi sous le sous-chemin du
// dépôt : https://la-dosette.github.io/Table-mat/. La `base` doit donc
// pointer vers ce sous-dossier (sensible à la casse) pour que les fichiers
// JS/CSS se chargent. En dev local, on reste à la racine `/`.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/Table-mat/' : '/',
}));
