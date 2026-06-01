import type { Recipe } from '../types';
import { getMachine, getMaterial } from '../data/materials';

// ---------------------------------------------------------------------------
// EXPORT DES RÉGLAGES — résumé des paramètres à appliquer, adapté au slicer.
// On ne fait que mettre en forme les données de la recette ; le slicer choisi
// change surtout le vocabulaire (purge, température) et l'astuce associée.
// ---------------------------------------------------------------------------

export interface Slicer {
  id: string;
  label: string;
  /** Terme du slicer pour le volume de purge entre matériaux. */
  purgeTerm: string;
  /** Terme du slicer pour la température buse du filament. */
  tempTerm: string;
  /** Astuce courte, spécifique au slicer. */
  tip: string;
}

export const SLICERS: Slicer[] = [
  {
    id: 'orca',
    label: 'OrcaSlicer',
    purgeTerm: 'Flushing volumes',
    tempTerm: 'Nozzle temperature',
    tip: 'Filament → Setting Overrides pour la temp ; purge réglable par paire dans « Flushing volumes ».',
  },
  {
    id: 'bambu',
    label: 'Bambu Studio',
    purgeTerm: 'Flushing volumes',
    tempTerm: 'Nozzle temperature',
    tip: 'Filament → « Flushing volumes » pour la purge entre couleurs (AMS). Pense au séchage des filaments.',
  },
  {
    id: 'prusa',
    label: 'PrusaSlicer',
    purgeTerm: 'Purging volumes (Wipe tower)',
    tempTerm: 'Filament → Temperature',
    tip: 'Active la « Wipe tower » et règle « Purging volumes » par paire de filaments (Printer Settings).',
  },
  {
    id: 'cura',
    label: 'Cura',
    purgeTerm: 'Prime tower (pas de purge par paire)',
    tempTerm: 'Printing temperature',
    tip: 'Active « Prime Tower » ; Cura ne gère pas la purge par paire, surdimensionne la tour de purge.',
  },
];

/** Code d'inventaire stable d'une recette, ex. 1 -> "TM-001". */
export function inventoryCode(no: number): string {
  return `TM-${String(no).padStart(3, '0')}`;
}

/** Construit le résumé texte des réglages à appliquer pour un slicer donné. */
export function buildSettingsText(
  recipe: Recipe,
  slicer: Slicer,
  inventoryNo?: number,
): string {
  const machine = getMachine(recipe.machineId);
  const p = recipe.params;
  const L: string[] = [];

  L.push('TM · FICHE DE RÉGLAGES');
  L.push(`Recette : ${recipe.title}${inventoryNo ? `   (${inventoryCode(inventoryNo)})` : ''}`);
  L.push(`Machine : ${machine?.name ?? recipe.machineId}`);
  L.push(`Slicer  : ${slicer.label}`);
  L.push('='.repeat(46));
  L.push('');

  L.push(`MATÉRIAUX & TEMPÉRATURES BUSE  (${slicer.tempTerm})`);
  recipe.slots.forEach((s) => {
    const m = getMaterial(s.material);
    const role = s.label ? ` (${s.label})` : '';
    L.push(`  • ${m?.name ?? s.material} — ${s.brand}${role} : ${s.nozzleTemp} °C`);
  });
  L.push('');

  L.push('PLATEAU / CAISSON');
  L.push(`  • Plateau : ${p.bedTemp} °C`);
  L.push(`  • Caisson : ${p.chamberTemp ? `${p.chamberTemp} °C` : '— (non requis)'}`);
  L.push('');

  L.push('QUALITÉ & VITESSE');
  L.push(`  • Hauteur de couche : ${p.layerHeight} mm`);
  L.push(`  • Vitesse d’impression : ${p.printSpeed} mm/s`);
  L.push(`  • Diamètre buse : ${p.nozzleDiameter} mm`);
  L.push('');

  L.push('CHANGEMENTS DE MATÉRIAU');
  L.push(`  • Volume de purge — ${slicer.purgeTerm} : ${p.purgeVolume ? `${p.purgeVolume} mm³` : '— (à ajuster)'}`);
  if (p.interfaceLayers) {
    L.push(`  • Couches d’interface (support) : ${p.interfaceLayers}`);
  }
  L.push('');

  L.push(`ASTUCE ${slicer.label.toUpperCase()}`);
  L.push(`  ${slicer.tip}`);

  if (recipe.notes) {
    L.push('');
    L.push('NOTES DE L’AUTEUR');
    L.push(`  ${recipe.notes}`);
  }

  L.push('');
  L.push('— TM · réf. interne');
  return L.join('\n');
}

/** Variante « checklist à cocher » des réglages. */
export function buildChecklistText(
  recipe: Recipe,
  slicer: Slicer,
  inventoryNo?: number,
): string {
  const machine = getMachine(recipe.machineId);
  const p = recipe.params;
  const L: string[] = [];

  L.push(`CHECKLIST · ${recipe.title}${inventoryNo ? `  (${inventoryCode(inventoryNo)})` : ''}`);
  L.push(`${machine?.name ?? recipe.machineId} · ${slicer.label}`);
  L.push('');
  L.push('Filaments & températures buse');
  recipe.slots.forEach((s) => {
    const m = getMaterial(s.material);
    const role = s.label ? ` (${s.label})` : '';
    L.push(`  [ ] ${m?.name ?? s.material} — ${s.brand}${role} → ${s.nozzleTemp} °C`);
  });
  L.push('');
  L.push('Réglages d’impression');
  L.push(`  [ ] Plateau : ${p.bedTemp} °C`);
  if (p.chamberTemp) L.push(`  [ ] Caisson : ${p.chamberTemp} °C`);
  L.push(`  [ ] Hauteur de couche : ${p.layerHeight} mm`);
  L.push(`  [ ] Vitesse : ${p.printSpeed} mm/s`);
  L.push(`  [ ] Diamètre buse : ${p.nozzleDiameter} mm`);
  L.push(`  [ ] ${slicer.purgeTerm}${p.purgeVolume ? ` ≈ ${p.purgeVolume} mm³` : ''}`);
  if (p.interfaceLayers) L.push(`  [ ] Couches d’interface (support) : ${p.interfaceLayers}`);
  L.push('');
  L.push(`Astuce ${slicer.label} : ${slicer.tip}`);
  return L.join('\n');
}

/** Sérialise une recette en JSON portable (sans id/votes, ré-importable). */
export function recipeToJson(recipe: Recipe): string {
  const { id: _id, votesUp: _u, votesDown: _d, ...rest } = recipe;
  return JSON.stringify({ _format: 'tm/recipe@1', ...rest }, null, 2);
}

/** Reconstruit une recette depuis un JSON exporté (nouvelle id, votes remis à 0). */
export function parseRecipeJson(text: string): Recipe {
  let obj: Record<string, unknown>;
  try {
    obj = JSON.parse(text);
  } catch {
    throw new Error('JSON illisible : vérifie le copier-coller.');
  }
  const r = ((obj as { recipe?: unknown }).recipe ?? obj) as Record<string, unknown>;
  if (typeof r.title !== 'string' || !Array.isArray(r.slots) || !Array.isArray(r.interfaces)) {
    throw new Error('JSON invalide : il manque « title », « slots » ou « interfaces ».');
  }
  return {
    id: `r${Date.now()}`,
    title: r.title as string,
    slots: r.slots as Recipe['slots'],
    interfaces: r.interfaces as Recipe['interfaces'],
    machineId: (r.machineId as string) ?? 'x1c',
    author: (r.author as string) ?? 'importé',
    date: (r.date as string) ?? new Date().toISOString().slice(0, 10),
    global: (r.global as Recipe['global']) ?? {
      printQuality: 3, reliability: 3, warpResistance: 3, interfaceCleanliness: 3, separability: 3,
    },
    params: (r.params as Recipe['params']) ?? {
      bedTemp: 60, layerHeight: 0.2, printSpeed: 80, nozzleDiameter: 0.4,
    },
    notes: (r.notes as string) ?? '',
    votesUp: 0,
    votesDown: 0,
  };
}

export type ExportFormat = 'fiche' | 'checklist' | 'json';
