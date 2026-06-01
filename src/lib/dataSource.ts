import type { Recipe } from '../types';
import { RECIPES } from '../data/recipes';

// ---------------------------------------------------------------------------
// Couche d'accès aux données.
// Deux implémentations interchangeables :
//   - LocalDataSource  : en mémoire (par défaut, prototype hors-ligne)
//   - SupabaseDataSource : base partagée via l'API REST de Supabase
// Le choix est automatique selon la présence des variables d'environnement
// VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY (voir .env.example).
// ---------------------------------------------------------------------------

export interface DataSource {
  /** true si les données sont partagées (Supabase), false si locales. */
  readonly isRemote: boolean;
  /** Libellé lisible de la source (affiché en pied de page). */
  readonly label: string;
  listRecipes(): Promise<Recipe[]>;
  addRecipe(recipe: Recipe): Promise<Recipe>;
  /** Met à jour une recette existante (mêmes id et votes conservés). */
  updateRecipe(recipe: Recipe): Promise<Recipe>;
  /** Supprime une recette. */
  deleteRecipe(recipeId: string): Promise<void>;
  /** Applique un delta de votes (ex. +1 up, -1 down) de façon atomique. */
  applyVote(recipeId: string, upDelta: number, downDelta: number): Promise<void>;
}

// --- Implémentation locale (mémoire) ---------------------------------------

class LocalDataSource implements DataSource {
  readonly isRemote = false;
  readonly label = 'local (mémoire) — branchez Supabase pour partager';
  private recipes: Recipe[] = RECIPES.map((r) => ({ ...r }));

  async listRecipes(): Promise<Recipe[]> {
    return this.recipes.map((r) => ({ ...r }));
  }
  async addRecipe(recipe: Recipe): Promise<Recipe> {
    this.recipes = [recipe, ...this.recipes];
    return recipe;
  }
  async updateRecipe(recipe: Recipe): Promise<Recipe> {
    this.recipes = this.recipes.map((r) => (r.id === recipe.id ? { ...recipe } : r));
    return recipe;
  }
  async deleteRecipe(recipeId: string): Promise<void> {
    this.recipes = this.recipes.filter((r) => r.id !== recipeId);
  }
  async applyVote(recipeId: string, upDelta: number, downDelta: number): Promise<void> {
    this.recipes = this.recipes.map((r) =>
      r.id === recipeId
        ? {
            ...r,
            votesUp: Math.max(0, r.votesUp + upDelta),
            votesDown: Math.max(0, r.votesDown + downDelta),
          }
        : r,
    );
  }
}

// --- Implémentation Supabase (API REST / PostgREST) ------------------------

interface RecipeRow {
  id: string;
  title: string;
  slots: Recipe['slots'];
  interfaces: Recipe['interfaces'];
  machine_id: string;
  author: string;
  date: string;
  global: Recipe['global'];
  params: Recipe['params'];
  notes: string;
  votes_up: number;
  votes_down: number;
}

function rowToRecipe(row: RecipeRow): Recipe {
  return {
    id: row.id,
    title: row.title,
    slots: row.slots,
    interfaces: row.interfaces,
    machineId: row.machine_id,
    author: row.author,
    date: row.date,
    global: row.global,
    params: row.params,
    notes: row.notes,
    votesUp: row.votes_up,
    votesDown: row.votes_down,
  };
}

export function recipeToRow(r: Recipe): RecipeRow {
  return {
    id: r.id,
    title: r.title,
    slots: r.slots,
    interfaces: r.interfaces,
    machine_id: r.machineId,
    author: r.author,
    date: r.date,
    global: r.global,
    params: r.params,
    notes: r.notes,
    votes_up: r.votesUp,
    votes_down: r.votesDown,
  };
}

class SupabaseDataSource implements DataSource {
  readonly isRemote = true;
  readonly label = 'Supabase (partagé)';
  constructor(private url: string, private key: string) {}

  private headers(extra: Record<string, string> = {}): Record<string, string> {
    return {
      apikey: this.key,
      Authorization: `Bearer ${this.key}`,
      'Content-Type': 'application/json',
      ...extra,
    };
  }

  async listRecipes(): Promise<Recipe[]> {
    const res = await fetch(
      `${this.url}/rest/v1/recipes?select=*&order=created_at.desc`,
      { headers: this.headers() },
    );
    if (!res.ok) throw new Error(`Supabase listRecipes ${res.status}`);
    const rows: RecipeRow[] = await res.json();
    return rows.map(rowToRecipe);
  }

  async addRecipe(recipe: Recipe): Promise<Recipe> {
    const res = await fetch(`${this.url}/rest/v1/recipes`, {
      method: 'POST',
      headers: this.headers({ Prefer: 'return=representation' }),
      body: JSON.stringify(recipeToRow(recipe)),
    });
    if (!res.ok) throw new Error(`Supabase addRecipe ${res.status}`);
    const [row]: RecipeRow[] = await res.json();
    return rowToRecipe(row);
  }

  async updateRecipe(recipe: Recipe): Promise<Recipe> {
    const res = await fetch(`${this.url}/rest/v1/recipes?id=eq.${encodeURIComponent(recipe.id)}`, {
      method: 'PATCH',
      headers: this.headers({ Prefer: 'return=representation' }),
      body: JSON.stringify(recipeToRow(recipe)),
    });
    if (!res.ok) throw new Error(`Supabase updateRecipe ${res.status}`);
    const [row]: RecipeRow[] = await res.json();
    return rowToRecipe(row);
  }

  async deleteRecipe(recipeId: string): Promise<void> {
    const res = await fetch(`${this.url}/rest/v1/recipes?id=eq.${encodeURIComponent(recipeId)}`, {
      method: 'DELETE',
      headers: this.headers(),
    });
    if (!res.ok) throw new Error(`Supabase deleteRecipe ${res.status}`);
  }

  async applyVote(recipeId: string, upDelta: number, downDelta: number): Promise<void> {
    const res = await fetch(`${this.url}/rest/v1/rpc/apply_vote`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({ p_recipe_id: recipeId, p_up: upDelta, p_down: downDelta }),
    });
    if (!res.ok) throw new Error(`Supabase applyVote ${res.status}`);
  }
}

// --- Sélection automatique --------------------------------------------------

function createDataSource(): DataSource {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (url && key) return new SupabaseDataSource(url, key);
  return new LocalDataSource();
}

export const dataSource: DataSource = createDataSource();
