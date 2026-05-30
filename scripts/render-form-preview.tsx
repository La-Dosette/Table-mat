// Aperçu SVG du formulaire d'ajout de recette (représentation statique).
// Usage : npx tsx scripts/render-form-preview.tsx
import { writeFileSync, mkdirSync } from 'node:fs';

const W = 560, H = 720;
const o: string[] = [];
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
o.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="Inter, Segoe UI, sans-serif">`);
o.push(`<rect width="${W}" height="${H}" fill="#0f1a2e"/>`);
o.push(`<rect x="0" y="0" width="${W}" height="64" fill="#0f1a2e"/><line x1="0" y1="64" x2="${W}" y2="64" stroke="#1a2842"/>`);
o.push(`<text x="24" y="34" fill="#e6edf6" font-size="18" font-weight="800">➕ Nouvelle recette</text>`);
o.push(`<text x="24" y="52" fill="#9fb0c8" font-size="12">Partage un essai multi-matériaux avec la communauté.</text>`);
o.push(`<rect x="${W - 56}" y="18" width="32" height="32" rx="8" fill="#14223c" stroke="#1f3052"/><text x="${W - 40}" y="39" fill="#9fb0c8" font-size="14" text-anchor="middle">✕</text>`);

let y = 86;
const label = (t: string) => { o.push(`<text x="24" y="${y}" fill="#9fb0c8" font-size="12">${esc(t)}</text>`); y += 8; };
const input = (val: string, ph = false) => {
  o.push(`<rect x="24" y="${y}" width="${W - 48}" height="34" rx="7" fill="#14223c" stroke="#1f3052"/>`);
  o.push(`<text x="34" y="${y + 22}" fill="${ph ? '#64748b' : '#e6edf6'}" font-size="13">${esc(val)}</text>`);
  y += 44;
};
const section = (t: string) => { y += 8; o.push(`<text x="24" y="${y}" fill="#64748b" font-size="11" font-weight="700" letter-spacing="1">${esc(t.toUpperCase())}</text>`); y += 14; };

label('Titre de la recette *');
input('Figurine multicolore + support PVA');

// pseudo + machine
o.push(`<text x="24" y="${y}" fill="#9fb0c8" font-size="12">Pseudo</text>`);
o.push(`<text x="${24 + (W - 48) / 2 + 8}" y="${y}" fill="#9fb0c8" font-size="12">Machine</text>`); y += 8;
o.push(`<rect x="24" y="${y}" width="${(W - 56) / 2}" height="34" rx="7" fill="#14223c" stroke="#1f3052"/><text x="34" y="${y + 22}" fill="#e6edf6" font-size="13">mini_sculpt</text>`);
o.push(`<rect x="${24 + (W - 56) / 2 + 8}" y="${y}" width="${(W - 56) / 2}" height="34" rx="7" fill="#14223c" stroke="#1f3052"/><text x="${34 + (W - 56) / 2 + 8}" y="${y + 22}" fill="#e6edf6" font-size="13">Prusa MK4 + MMU3 ▾</text>`);
y += 48;

section('Matériaux (4)');
const slots = [['#22c55e', 'PLA', 'Polymaker · Peau', '210°C'], ['#22c55e', 'PLA', 'Polymaker · Cheveux', '210°C'], ['#22c55e', 'PLA', 'Polymaker · Yeux', '210°C'], ['#34d399', 'PVA', 'Verbatim · Support', '200°C']] as const;
for (const [c, mat, brand, temp] of slots) {
  o.push(`<rect x="24" y="${y}" width="${W - 48}" height="32" rx="7" fill="#14223c" stroke="#1f3052"/>`);
  o.push(`<circle cx="38" cy="${y + 16}" r="4" fill="${c}"/>`);
  o.push(`<text x="50" y="${y + 21}" fill="#e6edf6" font-size="12" font-weight="700">${mat}</text>`);
  o.push(`<text x="92" y="${y + 21}" fill="#cdd9ea" font-size="12">${esc(brand)}</text>`);
  o.push(`<text x="${W - 90}" y="${y + 21}" fill="#9fb0c8" font-size="12">${temp}</text>`);
  o.push(`<text x="${W - 38}" y="${y + 21}" fill="#64748b" font-size="13">✕</text>`);
  y += 38;
}
o.push(`<rect x="24" y="${y}" width="${W - 48}" height="32" rx="7" fill="none" stroke="#1f3052" stroke-dasharray="4 3"/><text x="${W / 2}" y="${y + 21}" fill="#9fb0c8" font-size="12" text-anchor="middle">+ Ajouter un matériau</text>`);
y += 46;

section('Liaisons — note l’adhérence de chaque contact');
const ifaces = [['#22c55e', 'PLA', '#22c55e', 'PLA', 5], ['#22c55e', 'PLA', '#34d399', 'PVA', 4]] as const;
for (const [ca, a, cb, b, v] of ifaces) {
  o.push(`<rect x="24" y="${y}" width="${W - 48}" height="34" rx="7" fill="#14223c"/>`);
  o.push(`<circle cx="38" cy="${y + 17}" r="4" fill="${ca}"/><text x="48" y="${y + 22}" fill="#e6edf6" font-size="12.5">${a}</text>`);
  o.push(`<text x="78" y="${y + 22}" fill="#64748b" font-size="12">↔</text>`);
  o.push(`<circle cx="92" cy="${y + 17}" r="4" fill="${cb}"/><text x="102" y="${y + 22}" fill="#e6edf6" font-size="12.5">${b}</text>`);
  // slider
  const sx = 200, sw = 230;
  o.push(`<line x1="${sx}" y1="${y + 17}" x2="${sx + sw}" y2="${y + 17}" stroke="#1f3052" stroke-width="4" stroke-linecap="round"/>`);
  const px = sx + (v / 5) * sw;
  o.push(`<line x1="${sx}" y1="${y + 17}" x2="${px}" y2="${y + 17}" stroke="#38bdf8" stroke-width="4" stroke-linecap="round"/>`);
  o.push(`<circle cx="${px}" cy="${y + 17}" r="7" fill="#38bdf8"/>`);
  const hue = (v / 5) * 125;
  o.push(`<text x="${W - 38}" y="${y + 22}" fill="hsl(${hue},62%,52%)" font-size="13" font-weight="700" text-anchor="end">${v}/5</text>`);
  y += 40;
}

section('Critères globaux');
const crits = [['Qualité d’impression', 5], ['Fiabilité / facilité', 3], ['Séparabilité maîtrisée', 5]] as const;
for (const [name, v] of crits) {
  o.push(`<text x="24" y="${y + 14}" fill="#9fb0c8" font-size="12.5">${esc(name)}</text>`);
  const sx = 230, sw = 200;
  o.push(`<line x1="${sx}" y1="${y + 10}" x2="${sx + sw}" y2="${y + 10}" stroke="#1f3052" stroke-width="4" stroke-linecap="round"/>`);
  const px = sx + (v / 5) * sw;
  o.push(`<line x1="${sx}" y1="${y + 10}" x2="${px}" y2="${y + 10}" stroke="#38bdf8" stroke-width="4" stroke-linecap="round"/>`);
  o.push(`<circle cx="${px}" cy="${y + 10}" r="7" fill="#38bdf8"/>`);
  const hue = (v / 5) * 125;
  o.push(`<text x="${W - 38}" y="${y + 15}" fill="hsl(${hue},62%,52%)" font-size="13" font-weight="700" text-anchor="end">${v}/5</text>`);
  y += 28;
}

// boutons
y += 14;
o.push(`<rect x="${W - 320}" y="${y}" width="120" height="38" rx="19" fill="#14223c" stroke="#1f3052"/><text x="${W - 260}" y="${y + 24}" fill="#9fb0c8" font-size="13" text-anchor="middle">Annuler</text>`);
o.push(`<rect x="${W - 188}" y="${y}" width="164" height="38" rx="19" fill="#0ea5e9"/><text x="${W - 106}" y="${y + 24}" fill="#04121f" font-size="13" font-weight="700" text-anchor="middle">Publier la recette</text>`);

o.push('</svg>');
mkdirSync('preview', { recursive: true });
writeFileSync('preview/recipe-form.svg', o.join('\n'));
console.log('OK -> preview/recipe-form.svg');
