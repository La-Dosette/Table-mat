-- Schéma Table-Mat pour Supabase / PostgreSQL.
-- À coller dans l'éditeur SQL de Supabase (SQL Editor → New query → Run).

-- Table des recettes -------------------------------------------------------
create table if not exists public.recipes (
  id          text primary key,
  title       text not null,
  slots       jsonb not null default '[]'::jsonb,   -- [{material, brand, nozzleTemp, label}]
  interfaces  jsonb not null default '[]'::jsonb,   -- [{a, b, adhesion}]
  machine_id  text not null,
  author      text not null default 'anonyme',
  date        date not null default current_date,
  global      jsonb not null default '{}'::jsonb,   -- {printQuality, reliability, ...}
  params      jsonb not null default '{}'::jsonb,   -- {bedTemp, layerHeight, ...}
  notes       text not null default '',
  votes_up    integer not null default 0,
  votes_down  integer not null default 0,
  created_at  timestamptz not null default now()
);

-- Sécurité au niveau des lignes (RLS) --------------------------------------
alter table public.recipes enable row level security;

-- Lecture publique (tout le monde peut consulter les recettes).
drop policy if exists "recipes_select_public" on public.recipes;
create policy "recipes_select_public"
  on public.recipes for select
  using (true);

-- Insertion publique (n'importe qui peut proposer une recette).
-- Pour exiger un compte, remplacer `true` par `auth.role() = 'authenticated'`.
drop policy if exists "recipes_insert_public" on public.recipes;
create policy "recipes_insert_public"
  on public.recipes for insert
  with check (true);

-- Vote atomique ------------------------------------------------------------
-- Les votes passent UNIQUEMENT par cette fonction (pas de policy UPDATE
-- ouverte), ce qui évite la modification arbitraire des recettes.
create or replace function public.apply_vote(
  p_recipe_id text,
  p_up integer,
  p_down integer
)
returns void
language sql
security definer
set search_path = public
as $$
  update public.recipes
  set votes_up   = greatest(0, votes_up + p_up),
      votes_down = greatest(0, votes_down + p_down)
  where id = p_recipe_id;
$$;

grant execute on function public.apply_vote(text, integer, integer) to anon, authenticated;
