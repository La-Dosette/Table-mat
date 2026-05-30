import type { Recipe, UserVote } from '../types';
import { RecipeCard } from './RecipeCard';

interface Props {
  recipes: Recipe[];
  userVotes: Record<string, UserVote>;
  onVote: (id: string, dir: 'up' | 'down') => void;
}

export function RecipeGallery({ recipes, userVotes, onVote }: Props) {
  if (recipes.length === 0) {
    return (
      <div className="matrix-wrap">
        <div className="empty-state">Aucune recette ne correspond à ces filtres.</div>
      </div>
    );
  }
  return (
    <div className="gallery">
      {recipes.map((r) => (
        <RecipeCard key={r.id} recipe={r} userVote={userVotes[r.id] ?? null} onVote={onVote} />
      ))}
    </div>
  );
}
