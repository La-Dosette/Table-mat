# Table-Mat 🧩

**La matrice communautaire de compatibilité pour l'impression 3D multi-matériaux.**

Table-Mat regroupe sur une page web ouverte à tous les essais d'impression
multi-matériaux de la communauté : quel filament, quelle machine, quels
réglages — et **ça a marché ou pas ?** À partir d'un protocole de notation
commun, chaque essai reçoit un **score de viabilité**, et la communauté fait
vivre ces notes en votant selon ses propres résultats.

La pièce maîtresse est une **matrice de compatibilité** Matériau A × Matériau B :
chaque case est colorée du rouge (déconseillé) au vert (excellent). On survole
pour un aperçu, on clique pour voir tous les réglages détaillés, on vote pour
corriger la note.

### Recettes & multi-matériaux (3, 4… jusqu'à 16)

Un print peut mêler bien plus de deux matériaux (AMS chaînable, MMU3, Voron ERCF…).
L'unité partagée est donc une **recette** : un essai à **2 à N matériaux**, avec
sa machine et ses réglages. Chaque contact entre deux matériaux est une
**interface** (liaison) avec sa propre note d'adhérence. Une recette à 4
matériaux se **décompose en interfaces** qui alimentent automatiquement
plusieurs cases de la matrice. Une vue **Recettes** liste les configurations
complètes (chaîne de matériaux, liaisons, réglages, votes).

> État actuel : **prototype front-end** avec des données d'exemple. Toute la
> logique de scoring et de vote est déjà fonctionnelle en local, prête à être
> branchée à un vrai backend.

## Démarrer

```bash
npm install
npm run dev      # serveur de dev (Vite)
npm run build    # type-check + build de production dans dist/
npm run preview  # prévisualiser le build
```

Stack : **React + TypeScript + Vite**. Aucun backend requis pour le prototype —
hébergeable tel quel sur GitHub Pages / Netlify / Vercel.

## Le protocole de notation

Chaque essai est noté par son auteur sur 6 critères (0 à 5). Le **score de
viabilité** (0–100) est la moyenne pondérée suivante :

| Critère | Poids | Ce qu'il mesure |
|---|---|---|
| Liaison à l'interface | 30 % | Solidité de l'adhérence entre deux matériaux — **noté par interface** |
| Qualité d'impression | 20 % | État de surface, précision dimensionnelle |
| Fiabilité / facilité | 18 % | Taux de réussite, peu de retouches |
| Tenue (warping / délamination) | 12 % | Résistance au gondolement et au décollement |
| Propreté de l'interface | 12 % | Absence de bavure / contamination de matière |
| Séparabilité maîtrisée | 8 % | Séparation propre voulue (supports solubles/détachables) |

### Ajustement communautaire

Le score de base est ensuite **ajusté par les votes** : qui reproduit un réglage
peut voter « ça marche » 👍 ou « pas concluant » 👎. Un lissage bayésien évite
qu'un seul vote ne fasse basculer la note, et l'ajustement est plafonné à
±15 points. Plus une combinaison est testée, plus son score gagne en confiance.

Toute la logique vit dans [`src/lib/scoring.ts`](src/lib/scoring.ts) — c'est le
seul endroit à modifier pour faire évoluer le protocole.

## Structure du code

```
src/
  types.ts                # modèle de données (matériaux, machines, recettes, interfaces)
  lib/scoring.ts          # LE protocole : critères, pondérations, décomposition en interfaces
  data/
    materials.ts          # catalogue matériaux & machines (avec maxMaterials)
    recipes.ts            # recettes d'exemple, 2 à 4 matériaux (à remplacer par l'API)
  components/
    CompatibilityMatrix.tsx  # la matrice (score de liaison par paire) + tooltip
    CellDetailDrawer.tsx     # panneau latéral des recettes touchant une paire
    RecipeCard.tsx           # fiche d'une recette (slots, interfaces, réglages, votes)
    RecipeGallery.tsx        # vue galerie des recettes complètes
    RecipeForm.tsx           # formulaire d'ajout d'une recette (modale)
    Filters.tsx              # recherche + filtres système / nombre de matériaux
    ProtocolPanel.tsx        # explication du protocole
  App.tsx                 # assemblage, état, vues, filtres, votes
scripts/
  render-preview.tsx      # génère un aperçu SVG depuis les vraies données
```

## Feuille de route

- [x] Matrice de compatibilité interactive (survol + détail au clic)
- [x] Protocole de scoring pondéré + ajustement communautaire par votes
- [x] Recettes multi-matériaux (3, 4… N) décomposées en interfaces + vue galerie
- [x] Filtres (recherche, système, nombre de matériaux)
- [x] Formulaire de soumission de recette (matériaux dynamiques, liaisons auto, critères, réglages)
- [ ] Backend partagé + base de données (ex. Supabase/Postgres)
- [ ] Comptes utilisateurs (persistance des recettes soumises et des votes)
- [ ] Photos des pièces et galerie par combinaison
- [ ] Modération et anti-spam des votes
- [ ] Export / partage d'un réglage (preset slicer)

## Contribuer

Le projet est pensé pour être communautaire. Pour l'instant, les essais
d'exemple sont dans `src/data/attempts.ts`. Les idées de critères, de matériaux
et d'améliorations de l'interface sont les bienvenues via issues et PRs.
