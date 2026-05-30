// Pré-remplit une base Supabase avec les recettes d'exemple.
//
// Usage :
//   SUPABASE_URL=https://xxx.supabase.co \
//   SUPABASE_ANON_KEY=eyJ... \
//   npx tsx scripts/seed-supabase.ts
//
// Prérequis : avoir exécuté supabase/schema.sql au préalable.
import { RECIPES } from '../src/data/recipes';
import { recipeToRow } from '../src/lib/dataSource';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_ANON_KEY ?? process.env.SUPABASE_SERVICE_KEY;

if (!url || !key) {
  console.error('Définissez SUPABASE_URL et SUPABASE_ANON_KEY (ou SUPABASE_SERVICE_KEY).');
  process.exit(1);
}

const rows = RECIPES.map(recipeToRow);

const res = await fetch(`${url}/rest/v1/recipes`, {
  method: 'POST',
  headers: {
    apikey: key,
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
    Prefer: 'resolution=merge-duplicates,return=minimal',
  },
  body: JSON.stringify(rows),
});

if (!res.ok) {
  console.error(`Échec du seed (${res.status}) :`, await res.text());
  process.exit(1);
}

console.log(`OK — ${rows.length} recettes insérées dans Supabase.`);
