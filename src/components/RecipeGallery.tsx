import type { Recipe, UserVote } from '../types';
import { RecipeCard } from './RecipeCard';

interface Props {
  recipes: Recipe[];
  userVotes: Record<string, UserVote>;
  onVote: (id: string, dir: 'up' | 'down') => void;
  /** id de recette -> numéro d'inventaire stable. */
  inventoryNos: Map<string, number>;
  onExport: (recipe: Recipe) => void;
  onEdit: (recipe: Recipe) => void;
  onDelete: (recipe: Recipe) => void;
}

export function RecipeGallery({ recipes, userVotes, onVote, inventoryNos, onExport, onEdit, onDelete }: Props) {
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
        <RecipeCard
          key={r.id}
          recipe={r}
          userVote={userVotes[r.id] ?? null}
          onVote={onVote}
          inventoryNo={inventoryNos.get(r.id)}
          onExport={onExport}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
