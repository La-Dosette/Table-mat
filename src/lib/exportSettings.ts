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

  L.push('TABLE-MAT · FICHE DE RÉGLAGES');
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
  L.push('— Généré depuis Table-Mat · https://la-dosette.github.io/Table-mat/');
  return L.join('\n');
}
