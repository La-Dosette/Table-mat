import type { Attempt, CriteriaRatings } from '../types';

// ---------------------------------------------------------------------------
// LE PROTOCOLE TABLE-MAT
// ---------------------------------------------------------------------------
// Chaque essai est noté par son auteur sur 6 critères (0 à 5). Le « score de
// viabilité » de base est une moyenne pondérée de ces critères, ramenée sur 100.
// La communauté ajuste ensuite ce score via des votes (« ça marche aussi » /
// « ça n'a pas marché »), ce qui rend la note vivante et auto-corrective.
// ---------------------------------------------------------------------------

export interface Criterion {
  key: keyof CriteriaRatings;
  label: string;
  short: string;
  weight: number;
  help: string;
}

/** Pondérations choisies pour le protocole — leur somme vaut 1. */
export const CRITERIA: Criterion[] = [
  {
    key: 'interfaceAdhesion',
    label: 'Liaison à l’interface',
    short: 'Liaison',
    weight: 0.3,
    help: 'Solidité de l’adhérence entre les deux matériaux. Le critère n°1 en multi-matériaux.',
  },
  {
    key: 'printQuality',
    label: 'Qualité d’impression',
    short: 'Qualité',
    weight: 0.2,
    help: 'État de surface, précision dimensionnelle, propreté générale de la pièce.',
  },
  {
    key: 'reliability',
    label: 'Fiabilité / facilité',
    short: 'Fiabilité',
    weight: 0.18,
    help: 'Taux de réussite : l’impression passe-t-elle sans réimpression ni retouches lourdes ?',
  },
  {
    key: 'warpResistance',
    label: 'Tenue (warping / délamination)',
    short: 'Tenue',
    weight: 0.12,
    help: 'Résistance au gondolement et au décollement des couches/interfaces.',
  },
  {
    key: 'interfaceCleanliness',
    label: 'Propreté de l’interface',
    short: 'Propreté',
    weight: 0.12,
    help: 'Absence de bavure et de contamination de matière au niveau du changement.',
  },
  {
    key: 'separability',
    label: 'Séparabilité maîtrisée',
    short: 'Sépara.',
    weight: 0.08,
    help: 'Capacité à séparer proprement quand c’est voulu (supports solubles / détachables).',
  },
];

export function clamp(x: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, x));
}

/** Score de viabilité de base (0–100) à partir des notes de l'auteur. */
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
export function communityShift(a: Attempt): number {
  return communitySentiment(a.votesUp, a.votesDown) * MAX_COMMUNITY_SHIFT;
}

/** Score final affiché pour un essai (base + ajustement communautaire). */
export function effectiveScore(a: Attempt): number {
  return clamp(Math.round(baseScore(a.ratings) + communityShift(a)), 0, 100);
}

/** Nombre de corroborations = ampleur de la validation communautaire. */
export function corroborations(a: Attempt): number {
  return a.votesUp + a.votesDown;
}

export interface CellAggregate {
  attempts: Attempt[];
  /** Score moyen pondéré par la confiance, ou null si aucun essai. */
  score: number | null;
  /** Indice de confiance : essais + votes accumulés. */
  confidence: number;
}

/**
 * Agrège tous les essais d'une combinaison de matériaux.
 * Les essais les mieux corroborés pèsent davantage dans la moyenne.
 */
export function aggregateCell(attempts: Attempt[]): CellAggregate {
  if (attempts.length === 0) {
    return { attempts, score: null, confidence: 0 };
  }
  let weightedSum = 0;
  let weightTotal = 0;
  let confidence = 0;
  for (const a of attempts) {
    const weight = 1 + corroborations(a);
    weightedSum += effectiveScore(a) * weight;
    weightTotal += weight;
    confidence += 1 + corroborations(a);
  }
  return {
    attempts,
    score: Math.round(weightedSum / weightTotal),
    confidence,
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
