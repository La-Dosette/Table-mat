# Table-Mat

Table-Mat est une matrice communautaire pour documenter les essais
d'impression 3D multi-materiaux.

Le but est simple : aider les makers a savoir quelles matieres accrochent,
se separent, bavent, warpent, ou demandent des reglages particuliers quand on
imprime avec AMS, MMU, toolchanger, IDEX, ERCF ou double extrudeur.

## Fonctionnalites

- Matrice de compatibilite par paire de materiaux.
- Recettes completes avec machine, marques, temperatures, purges et notes.
- Score de viabilite calcule par interface et ajuste par les votes.
- Filtres par systeme machine, nombre de materiaux et recherche texte.
- Panneau de priorites communautaires pour trouver les cases a tester.
- Formulaire d'ajout de recette.
- Mode local par defaut, backend Supabase optionnel pour partager les donnees.

## Demo

GitHub Pages :

```text
https://la-dosette.github.io/Table-mat/
```

## Lancer en local

```bash
npm install
npm run dev
```

Build de production :

```bash
npm run build
```

## Backend Supabase optionnel

Sans configuration, l'app utilise les donnees locales de `src/data/recipes.ts`.

Pour activer une base partagee :

1. Creer un projet Supabase.
2. Executer `supabase/schema.sql` dans le SQL Editor.
3. Copier `.env.example` en `.env`.
4. Renseigner `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`.
5. Relancer l'app.

Seed initial :

```bash
npm run seed
```

## Structure

```text
src/App.tsx                         orchestration de l'app
src/components/CompatibilityMatrix  matrice des liaisons
src/components/CommunityOverview    priorites communautaires
src/components/RecipeForm           ajout d'une recette
src/components/RecipeGallery        galerie des recettes
src/data/materials.ts               materiaux et machines
src/data/recipes.ts                 exemples locaux
src/lib/scoring.ts                  calcul des scores
src/lib/dataSource.ts               local ou Supabase
supabase/schema.sql                 schema PostgreSQL
```

## Contribuer

Les contributions utiles sont surtout :

- ajouter des recettes reelles avec marques et temperatures;
- completer les cases vides de la matrice;
- confirmer les liaisons fragiles avec plusieurs machines;
- enrichir la liste des materiaux;
- proposer des criteres de scoring plus precis.

MIT
