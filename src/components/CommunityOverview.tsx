import { useMemo, type CSSProperties } from 'react';
import type { Material, Recipe } from '../types';
import { aggregateCell, scoreColor, scoreLabel, type InterfacePoint } from '../lib/scoring';

interface PairInsight {
  a: Material;
  b: Material;
  points: InterfacePoint[];
  score: number | null;
  confidence: number;
  recipeCount: number;
}

interface Props {
  recipes: Recipe[];
  filteredRecipes: Recipe[];
  materials: Material[];
  pointsFor: (a: string, b: string) => InterfacePoint[];
  onSelectPair: (a: string, b: string) => void;
  onOpenRecipes: () => void;
  onAddRecipe: () => void;
}

function pairName(a: Material, b: Material): string {
  return a.id === b.id ? `${a.name} multicolore` : `${a.name} ↔ ${b.name}`;
}

function PairDots({ a, b }: { a: Material; b: Material }) {
  return (
    <span className="pair-dots" aria-hidden="true">
      <span style={{ background: a.accent }} />
      <span style={{ background: b.accent }} />
    </span>
  );
}

export function CommunityOverview({
  recipes,
  filteredRecipes,
  materials,
  pointsFor,
  onSelectPair,
  onOpenRecipes,
  onAddRecipe,
}: Props) {
  const stats = useMemo(() => {
    const pairs: PairInsight[] = [];
    for (let i = 0; i < materials.length; i++) {
      for (let j = i; j < materials.length; j++) {
        const a = materials[i];
        const b = materials[j];
        const points = pointsFor(a.id, b.id);
        const agg = aggregateCell(points);
        pairs.push({
          a,
          b,
          points,
          score: agg.score,
          confidence: agg.confidence,
          recipeCount: agg.recipeCount,
        });
      }
    }

    const tested = pairs.filter((p) => p.points.length > 0);
    const missing = pairs.filter((p) => p.points.length === 0);
    const best = [...tested].sort(
      (a, b) => (b.score ?? 0) - (a.score ?? 0) || b.confidence - a.confidence,
    )[0];
    const risky = [...tested]
      .filter((p) => (p.score ?? 100) < 65)
      .sort((a, b) => (a.score ?? 0) - (b.score ?? 0) || b.confidence - a.confidence)[0];

    const materialUses = new Map<string, number>();
    for (const recipe of filteredRecipes) {
      for (const slot of recipe.slots) {
        materialUses.set(slot.material, (materialUses.get(slot.material) ?? 0) + 1);
      }
    }
    const mostUsed = materials
      .map((m) => ({ material: m, count: materialUses.get(m.id) ?? 0 }))
      .sort((a, b) => b.count - a.count)[0];

    return {
      pairs,
      tested,
      missing,
      best,
      risky,
      mostUsed: mostUsed?.count ? mostUsed : null,
    };
  }, [filteredRecipes, materials, pointsFor]);

  const coverage = stats.pairs.length
    ? Math.round((stats.tested.length / stats.pairs.length) * 100)
    : 0;
  const best = stats.best;
  const risky = stats.risky;
  const nextMissing = stats.missing[0];
  const hiddenByFilters = recipes.length - filteredRecipes.length;

  return (
    <section className="community-overview" aria-label="Priorites communautaires">
      <div className="overview-main">
        <div className="coverage-ring" style={{ '--coverage': `${coverage}%` } as CSSProperties}>
          <b>{coverage}%</b>
          <span>couvert</span>
        </div>
        <div>
          <p className="eyebrow">Carte communautaire</p>
          <h2>{stats.tested.length} liaisons testees sur {stats.pairs.length}</h2>
          <p>
            {filteredRecipes.length} recette{filteredRecipes.length > 1 ? 's' : ''} visibles
            {hiddenByFilters > 0 ? `, ${hiddenByFilters} masquee${hiddenByFilters > 1 ? 's' : ''} par les filtres` : ''}.
            Priorite: combler les cases vides et confirmer les liaisons fragiles.
          </p>
          <div className="overview-actions">
            <button className="btn-primary" onClick={onAddRecipe}>Ajouter un essai</button>
            <button className="btn-secondary" onClick={onOpenRecipes}>Voir les recettes</button>
          </div>
        </div>
      </div>

      <div className="overview-cards">
        {best && (
          <button className="overview-card" onClick={() => onSelectPair(best.a.id, best.b.id)}>
            <span className="card-label">Meilleure liaison</span>
            <strong>
              <PairDots a={best.a} b={best.b} />
              {pairName(best.a, best.b)}
            </strong>
            <span className="score-line" style={{ color: scoreColor(best.score) }}>
              {best.score} · {scoreLabel(best.score)} · {best.recipeCount} recette{best.recipeCount > 1 ? 's' : ''}
            </span>
          </button>
        )}

        {risky && (
          <button className="overview-card warning" onClick={() => onSelectPair(risky.a.id, risky.b.id)}>
            <span className="card-label">A confirmer</span>
            <strong>
              <PairDots a={risky.a} b={risky.b} />
              {pairName(risky.a, risky.b)}
            </strong>
            <span className="score-line" style={{ color: scoreColor(risky.score) }}>
              {risky.score} · {scoreLabel(risky.score)} · {risky.points.length} interface{risky.points.length > 1 ? 's' : ''}
            </span>
          </button>
        )}

        {nextMissing && (
          <button className="overview-card missing" onClick={onAddRecipe}>
            <span className="card-label">Case vide</span>
            <strong>
              <PairDots a={nextMissing.a} b={nextMissing.b} />
              {pairName(nextMissing.a, nextMissing.b)}
            </strong>
            <span className="score-line">
              Aucune recette pour cette paire. Bon candidat pour un prochain test.
            </span>
          </button>
        )}

        {stats.mostUsed && (
          <div className="overview-card passive">
            <span className="card-label">Matiere la plus documentee</span>
            <strong>
              <span className="mat-dot" style={{ background: stats.mostUsed.material.accent }} />
              {stats.mostUsed.material.name}
            </strong>
            <span className="score-line">
              {stats.mostUsed.count} apparition{stats.mostUsed.count > 1 ? 's' : ''} dans les recettes visibles.
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
