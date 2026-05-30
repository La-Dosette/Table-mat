import type {
  CriteriaRatings,
  MaterialInterface,
  Recipe,
} from '../types';

// ---------------------------------------------------------------------------
// LE PROTOCOLE TABLE-MAT
// ---------------------------------------------------------------------------
// Une recette est notée sur 6 critères (0 à 5). L'adhérence est mesurée par
// INTERFACE (contact entre deux matériaux), les 5 autres critères sont globaux.
// Le score (0–100) est une moyenne pondérée, puis ajustée par les votes de la
// communauté. Une recette à N matériaux se décompose en interfaces : chaque
// interface alimente une case de la matrice de compatibilité.
// ---------------------------------------------------------------------------

export interface Criterion {
  key: keyof CriteriaRatings;
  label: string;
  short: string;
  weight: number;
  help: string;
  /** true = mesuré par interface ; false = global à la recette. */
  perInterface: boolean;
}

/** Pondérations choisies pour le protocole — leur somme vaut 1. */
export const CRITERIA: Criterion[] = [
  {
    key: 'interfaceAdhesion',
    label: 'Liaison à l’interface',
    short: 'Liaison',
    weight: 0.3,
    help: 'Solidité de l’adhérence entre deux matériaux. Mesurée pour chaque contact.',
    perInterface: true,
  },
  {
    key: 'printQuality',
    label: 'Qualité d’impression',
    short: 'Qualité',
    weight: 0.2,
    help: 'État de surface, précision dimensionnelle, propreté générale de la pièce.',
    perInterface: false,
  },
  {
    key: 'reliability',
    label: 'Fiabilité / facilité',
    short: 'Fiabilité',
    weight: 0.18,
    help: 'Taux de réussite : l’impression passe-t-elle sans réimpression ni retouches lourdes ?',
    perInterface: false,
  },
  {
    key: 'warpResistance',
    label: 'Tenue (warping / délamination)',
    short: 'Tenue',
    weight: 0.12,
    help: 'Résistance au gondolement et au décollement des couches/interfaces.',
    perInterface: false,
  },
  {
    key: 'interfaceCleanliness',
    label: 'Propreté de l’interface',
    short: 'Propreté',
    weight: 0.12,
    help: 'Absence de bavure et de contamination de matière au niveau du changement.',
    perInterface: false,
  },
  {
    key: 'separability',
    label: 'Séparabilité maîtrisée',
    short: 'Sépara.',
    weight: 0.08,
    help: 'Capacité à séparer proprement quand c’est voulu (supports solubles / détachables).',
    perInterface: false,
  },
];

export function clamp(x: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, x));
}

/** Score de viabilité de base (0–100) à partir des 6 critères. */
export function baseScore(r: CriteriaRatings): number {
  const weighted = CRITERIA.reduce(
    (acc, c) => acc + c.weight * (r[c.key] / 5),
    0,
  );
  return Math.round(weighted * 100);
}

// Lissage bayésien : évite qu'un seul vote fasse basculer le score.
const VOTE_SMOOTHING = 3;
// Amplitude maximale (en points) de l'ajustement communautaire.
const MAX_COMMUNITY_SHIFT = 15;

/** Sentiment communautaire entre -1 (rejeté) et +1 (plébiscité). */
export function communitySentiment(up: number, down: number): number {
  const total = up + down;
  if (total === 0) return 0;
  return (up - down) / (total + VOTE_SMOOTHING);
}

/** Décalage (en points) appliqué par la communauté. */
export function communityShift(up: number, down: number): number {
  return communitySentiment(up, down) * MAX_COMMUNITY_SHIFT;
}

/** Score (0–100) à partir de notes + votes. */
export function scoreFromRatings(
  r: CriteriaRatings,
  votesUp: number,
  votesDown: number,
): number {
  return clamp(Math.round(baseScore(r) + communityShift(votesUp, votesDown)), 0, 100);
}

// --- Niveau recette --------------------------------------------------------

/** Adhérence moyenne sur toutes les interfaces d'une recette. */
export function avgAdhesion(r: Recipe): number {
  if (r.interfaces.length === 0) return 0;
  return r.interfaces.reduce((s, i) => s + i.adhesion, 0) / r.interfaces.length;
}

/** Notes complètes d'une recette (adhérence = moyenne des interfaces). */
export function recipeCriteria(r: Recipe): CriteriaRatings {
  return { ...r.global, interfaceAdhesion: avgAdhesion(r) };
}

/** Notes vues depuis une interface précise (son adhérence + le global). */
export function interfaceCriteria(
  r: Recipe,
  iface: MaterialInterface,
): CriteriaRatings {
  return { ...r.global, interfaceAdhesion: iface.adhesion };
}

export function recipeScore(r: Recipe): number {
  return scoreFromRatings(recipeCriteria(r), r.votesUp, r.votesDown);
}

export function interfaceScore(r: Recipe, iface: MaterialInterface): number {
  return scoreFromRatings(interfaceCriteria(r, iface), r.votesUp, r.votesDown);
}

/** Nombre de corroborations = ampleur de la validation communautaire. */
export function corroborations(r: Recipe): number {
  return r.votesUp + r.votesDown;
}

// --- Agrégation d'une case de la matrice -----------------------------------

/** Un point de donnée = une interface d'une recette, projetée sur une paire. */
export interface InterfacePoint {
  recipe: Recipe;
  iface: MaterialInterface;
  score: number;
}

export interface CellAggregate {
  points: InterfacePoint[];
  /** Score moyen pondéré par la confiance, ou null si aucun essai. */
  score: number | null;
  /** Indice de confiance : interfaces + votes accumulés. */
  confidence: number;
  /** Nombre de recettes distinctes qui touchent cette paire. */
  recipeCount: number;
}

export function aggregateCell(points: InterfacePoint[]): CellAggregate {
  if (points.length === 0) {
    return { points, score: null, confidence: 0, recipeCount: 0 };
  }
  let weightedSum = 0;
  let weightTotal = 0;
  let confidence = 0;
  const recipes = new Set<string>();
  for (const p of points) {
    const weight = 1 + corroborations(p.recipe);
    weightedSum += p.score * weight;
    weightTotal += weight;
    confidence += weight;
    recipes.add(p.recipe.id);
  }
  return {
    points,
    score: Math.round(weightedSum / weightTotal),
    confidence,
    recipeCount: recipes.size,
  };
}

/** Couleur d'un score sur l'échelle rouge → ambre → vert. */
export function scoreColor(score: number | null): string {
  if (score === null) return 'hsl(220 14% 22%)';
  const hue = (clamp(score, 0, 100) / 100) * 125; // 0 = rouge, 125 = vert
  return `hsl(${hue} 62% 42%)`;
}

/** Libellé qualitatif d'un score. */
export function scoreLabel(score: number | null): string {
  if (score === null) return 'Aucun essai';
  if (score >= 80) return 'Excellent';
  if (score >= 65) return 'Bon';
  if (score >= 50) return 'Correct';
  if (score >= 35) return 'Difficile';
  return 'Déconseillé';
}
