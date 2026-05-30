// Génère un aperçu SVG fidèle de l'interface, à partir des VRAIES données et de
// la VRAIE logique de scoring du projet (pas un mockup inventé).
// Usage : npx tsx scripts/render-preview.tsx
import { writeFileSync, mkdirSync } from 'node:fs';
import { MATERIALS, getMachine, getMaterial } from '../src/data/materials';
import { ATTEMPTS } from '../src/data/attempts';
import {
  CRITERIA,
  aggregateCell,
  effectiveScore,
  clamp,
} from '../src/lib/scoring';
import type { Attempt } from '../src/types';

function pairKey(a: string, b: string) {
  return [a, b].sort().join('|');
}
const byPair = new Map<string, Attempt[]>();
for (const a of ATTEMPTS) {
  const k = pairKey(a.materialA, a.materialB);
  (byPair.get(k) ?? byPair.set(k, []).get(k)!).push(a);
}
const attemptsFor = (a: string, b: string) => byPair.get(pairKey(a, b)) ?? [];

// Couleur SVG-safe (syntaxe à virgules).
function color(score: number | null) {
  if (score === null) return 'hsl(220, 14%, 22%)';
  const hue = (clamp(score, 0, 100) / 100) * 125;
  return `hsl(${hue}, 62%, 42%)`;
}
const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const W = 1200;
const mats = MATERIALS;
const CELL = 74;
const GAP = 9;
const STEP = CELL + GAP;
const gridX = 150;
const gridY = 210;
const gridW = mats.length * STEP - GAP;
const H = gridY + mats.length * STEP + 70;

const out: string[] = [];
out.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="Inter, Segoe UI, sans-serif">`);
out.push(`<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#0b1220"/><stop offset="1" stop-color="#0c1426"/>
  </linearGradient>
  <linearGradient id="legend" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="hsl(0,62%,42%)"/>
    <stop offset="0.5" stop-color="hsl(60,62%,42%)"/>
    <stop offset="1" stop-color="hsl(125,62%,42%)"/>
  </linearGradient>
</defs>`);
out.push(`<rect width="${W}" height="${H}" fill="url(#bg)"/>`);

// Bandeau / titre
out.push(`<rect x="40" y="36" width="40" height="40" rx="9" fill="#0e1626"/>`);
const sw = [['#22c55e', 46, 42], ['#eab308', 62, 42], ['#eab308', 46, 58], ['#ef4444', 62, 58]] as const;
for (const [c, x, y] of sw) out.push(`<rect x="${x}" y="${y}" width="12" height="12" rx="2" fill="${c}"/>`);
out.push(`<text x="92" y="56" fill="#e6edf6" font-size="24" font-weight="800">Table-Mat</text>`);
out.push(`<text x="92" y="76" fill="#9fb0c8" font-size="13">La matrice communautaire de l’impression multi-matériaux</text>`);
const pills = [`${ATTEMPTS.length} essais`, `${ATTEMPTS.reduce((s, a) => s + a.votesUp + a.votesDown, 0)} votes`, `${mats.length} matériaux`];
let px = W - 40;
for (const p of [...pills].reverse()) {
  const w = 22 + p.length * 7.3;
  px -= w + 8;
  out.push(`<rect x="${px}" y="46" width="${w}" height="30" rx="15" fill="#0f1a2e" stroke="#1a2842"/>`);
  out.push(`<text x="${px + w / 2}" y="65" fill="#cdd9ea" font-size="13" text-anchor="middle">${esc(p)}</text>`);
}

// Sous-titre matrice
out.push(`<text x="40" y="130" fill="#e6edf6" font-size="16" font-weight="700">Matrice de compatibilité — Matériau A × Matériau B</text>`);
out.push(`<text x="40" y="150" fill="#64748b" font-size="12">Score de viabilité communautaire · survol = aperçu · clic = réglages détaillés</text>`);

// En-têtes de colonnes
mats.forEach((m, j) => {
  const cx = gridX + j * STEP + CELL / 2;
  out.push(`<circle cx="${cx - 16}" cy="${gridY - 16}" r="4.5" fill="${m.accent}"/>`);
  out.push(`<text x="${cx - 6}" y="${gridY - 12}" fill="#9fb0c8" font-size="13" font-weight="600" text-anchor="middle">${esc(m.name)}</text>`);
});
out.push(`<text x="${gridX - 12}" y="${gridY - 12}" fill="#64748b" font-size="11" text-anchor="end">A ＼ B</text>`);

// Cellules
mats.forEach((rowM, i) => {
  const cy = gridY + i * STEP;
  out.push(`<circle cx="${gridX - 30}" cy="${cy + CELL / 2}" r="4.5" fill="${rowM.accent}"/>`);
  out.push(`<text x="${gridX - 40}" y="${cy + CELL / 2 + 4}" fill="#9fb0c8" font-size="13" font-weight="600" text-anchor="end">${esc(rowM.name)}</text>`);
  mats.forEach((colM, j) => {
    const x = gridX + j * STEP;
    const attempts = attemptsFor(rowM.id, colM.id);
    const agg = aggregateCell(attempts);
    const diag = rowM.id === colM.id;
    out.push(`<rect x="${x}" y="${cy}" width="${CELL}" height="${CELL}" rx="8" fill="${color(agg.score)}" stroke="${diag ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.06)'}" stroke-width="${diag ? 2 : 1}"/>`);
    if (attempts.length) {
      out.push(`<text x="${x + CELL / 2}" y="${cy + CELL / 2 + 1}" fill="#06121a" font-size="19" font-weight="800" text-anchor="middle">${agg.score}</text>`);
      out.push(`<text x="${x + CELL / 2}" y="${cy + CELL / 2 + 17}" fill="#06121a" font-size="10" font-weight="600" text-anchor="middle" opacity="0.85">${attempts.length} essai${attempts.length > 1 ? 's' : ''}</text>`);
    } else {
      out.push(`<text x="${x + CELL / 2}" y="${cy + CELL / 2 + 4}" fill="#64748b" font-size="13" text-anchor="middle">—</text>`);
    }
  });
});

// Légende
const ly = gridY + mats.length * STEP + 14;
out.push(`<text x="${gridX}" y="${ly + 11}" fill="#9fb0c8" font-size="12">Score&#160;:</text>`);
out.push(`<text x="${gridX + 56}" y="${ly + 11}" fill="#9fb0c8" font-size="12">0</text>`);
out.push(`<rect x="${gridX + 70}" y="${ly + 1}" width="180" height="11" rx="5" fill="url(#legend)"/>`);
out.push(`<text x="${gridX + 258}" y="${ly + 11}" fill="#9fb0c8" font-size="12">100</text>`);
out.push(`<rect x="${gridX + 300}" y="${ly + 1}" width="14" height="11" rx="3" fill="#14223c" stroke="rgba(255,255,255,0.45)" stroke-width="2"/>`);
out.push(`<text x="${gridX + 320}" y="${ly + 11}" fill="#64748b" font-size="12">diagonale = même matériau (multicolore)</text>`);

// ---- Panneau détail (aperçu du drawer) à droite ----
const px0 = gridX + gridW + 40;
const pw = W - px0 - 40;
if (pw > 200) {
  const best = [...attemptsFor('pla', 'pla')].sort((a, b) => effectiveScore(b) - effectiveScore(a))[0];
  const ph = 360;
  const py0 = gridY - 30;
  out.push(`<rect x="${px0}" y="${py0}" width="${pw}" height="${ph}" rx="12" fill="#0f1a2e" stroke="#1f3052"/>`);
  const sc = effectiveScore(best);
  out.push(`<circle cx="${px0 + 32}" cy="${py0 + 34}" r="22" fill="${color(sc)}"/>`);
  out.push(`<text x="${px0 + 32}" y="${py0 + 40}" fill="#fff" font-size="17" font-weight="800" text-anchor="middle">${sc}</text>`);
  const mA = getMaterial(best.materialA)!, mB = getMaterial(best.materialB)!;
  out.push(`<text x="${px0 + 64}" y="${py0 + 28}" fill="#e6edf6" font-size="15" font-weight="700">${esc(mA.name)} ＋ ${esc(mB.name)} — meilleur essai</text>`);
  out.push(`<text x="${px0 + 64}" y="${py0 + 46}" fill="#9fb0c8" font-size="12">@${esc(best.author)} · ${esc(getMachine(best.machineId)!.name)}</text>`);
  // critères
  let yy = py0 + 78;
  out.push(`<text x="${px0 + 20}" y="${yy}" fill="#64748b" font-size="11" font-weight="600">CRITÈRES (0–5)</text>`);
  yy += 14;
  CRITERIA.forEach((c) => {
    const v = best.ratings[c.key];
    out.push(`<text x="${px0 + 20}" y="${yy + 9}" fill="#9fb0c8" font-size="12">${esc(c.label)}</text>`);
    out.push(`<rect x="${px0 + pw - 130}" y="${yy}" width="80" height="8" rx="4" fill="#14223c"/>`);
    out.push(`<rect x="${px0 + pw - 130}" y="${yy}" width="${(v / 5) * 80}" height="8" rx="4" fill="${color((v / 5) * 100)}"/>`);
    out.push(`<text x="${px0 + pw - 24}" y="${yy + 9}" fill="#e6edf6" font-size="12" font-weight="600" text-anchor="end">${v}/5</text>`);
    yy += 22;
  });
  // params
  yy += 6;
  const params = [`Buse ${best.params.nozzleTempA}/${best.params.nozzleTempB}°C`, `Plateau ${best.params.bedTemp}°C`, `Couche ${best.params.layerHeight}mm`, `Vitesse ${best.params.printSpeed}mm/s`, `Purge ${best.params.purgeVolume}mm³`, `Buse Ø${best.params.nozzleDiameter}mm`];
  params.forEach((p, k) => {
    const cxp = px0 + 20 + (k % 3) * ((pw - 40) / 3);
    const cyp = yy + Math.floor(k / 3) * 36;
    out.push(`<rect x="${cxp}" y="${cyp}" width="${(pw - 56) / 3}" height="28" rx="6" fill="#14223c"/>`);
    out.push(`<text x="${cxp + 8}" y="${cyp + 18}" fill="#cdd9ea" font-size="11" font-weight="600">${esc(p)}</text>`);
  });
  yy += 84;
  // vote buttons
  out.push(`<rect x="${px0 + 20}" y="${yy}" width="120" height="30" rx="15" fill="rgba(34,197,94,0.16)" stroke="#22c55e"/>`);
  out.push(`<text x="${px0 + 80}" y="${yy + 20}" fill="#22c55e" font-size="12" font-weight="600" text-anchor="middle">👍 Ça marche · ${best.votesUp}</text>`);
  out.push(`<rect x="${px0 + 150}" y="${yy}" width="140" height="30" rx="15" fill="#14223c" stroke="#1f3052"/>`);
  out.push(`<text x="${px0 + 220}" y="${yy + 20}" fill="#9fb0c8" font-size="12" text-anchor="middle">👎 Pas concluant · ${best.votesDown}</text>`);
}

out.push('</svg>');

mkdirSync('preview', { recursive: true });
writeFileSync('preview/table-mat.svg', out.join('\n'));
console.log('OK -> preview/table-mat.svg');
