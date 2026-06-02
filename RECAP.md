# 🖨️ Table‑Mat — Récapitulatif

> Matrice de compatibilité & recettes communautaires pour l'impression 3D multi‑matériaux (FDM).

## 🔗 Lien du tool

**https://la-dosette.github.io/Table-mat/**

Déployé automatiquement sur **GitHub Pages** à chaque push de la branche
`claude/multimat-printing-community-nVYGk` (workflow `.github/workflows/deploy.yml`).

---

## ✅ Fonctionnalités

### 1. 💾 Persistance + temps réel
- Recettes (ajout / édition / suppression) et **votes** enregistrés dans le navigateur → **survivent au rechargement**.
- **Synchro en direct entre onglets** via `BroadcastChannel` (repli sur l'événement `storage`) : un changement dans un onglet met à jour les autres sans rafraîchir.
- Le sens du vote personnel (👍/👎) est mémorisé.
- Voie **Supabase** (partage entre utilisateurs) prête : renseigner `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` dans `.env`.

### 2. 🖨️ Catalogue d'imprimantes — 58 machines
Couverture grand public 2025‑2026, par système multi‑matériaux :

| Système | Exemples |
|---|---|
| **AMS** (Bambu) | X1C/X1E, X2D, P2S, P1S/P1P, A1/mini, A2L, H2D/H2S/H2D Pro |
| **CFS** (Creality) | K2 Plus/Pro/SE, K1C, K1 Max, K1 SE, Hi |
| **ACE 2 Pro** (Anycubic) | Kobra S1/S1 Max/3/3 Max |
| **IFS** (FlashForge) | AD5X, Adventurer 5M Pro |
| **MMU** (Prusa) | MK4/MK4S, MK3S+, Core One |
| **Toolchanger** | Prusa XL, Snapmaker U1, FlashForge Creator 5, Bambu H2C, E3D |
| **ERCF / DIY** | Voron 2.4/Trident, BoxTurtle, Sovol SV08, RatRig |
| **IDEX** | Sovol SV04, Snapmaker J1, BCN3D, Raise3D E2, Tenlog |
| **Dual** | UltiMaker S5/S7/S8, Raise3D Pro3, QIDI Plus4 |
| **Palette** | Mosaic Palette 3 / 3 Pro / Element HT |

### 3. 🧵 Catalogue de marques de filament — ~100 marques
`src/data/brands.ts` : du grand public (Bambu Lab, Polymaker, eSUN, SUNLU, Hatchbox, Overture…)
aux spécialistes (ColorFabb, Fillamentum, Fiberlogy, 3DXTech, BASF Ultrafuse, NinjaTek…)
et marques françaises (Francofil, Arianeplast, Dailyfil…).

### 4. 🎛️ Menus déroulants soignés
- Sélecteurs **machine** et **matière** regroupés par catégorie (`<optgroup>`).
- Flèche personnalisée (chevron SVG) adaptée aux thèmes clair / sombre.

### 5. 🔡 Comboboxes d'autocomplétion
- Composant `Combobox` : liste filtrée stylée, navigation clavier (↑/↓/Entrée/Échap), fermeture au clic extérieur, **saisie libre conservée**.
- Appliqué au champ **marque** (catalogue complet) et au champ **pseudo** (suggère les auteurs déjà présents).

### 6. 📱 Responsive mobile
- **Matrice à volets figés** : 1ʳᵉ colonne (matériaux) + ligne d'en‑tête restent visibles au scroll horizontal et vertical (vraie vue tableur).
- **Drawer / formulaire** adapté : `field-row` empilés, ligne matériau sur plusieurs lignes au lieu de déborder.

### 7. 🌐 Bilingue & thème
- Interface **FR / EN** persistante.
- **Mode sombre** persistant (sans flash au chargement).

---

## 🧱 Stack & structure

- **React + TypeScript + Vite**
- `src/data/` — catalogues (`materials.ts`, `brands.ts`, `recipes.ts`)
- `src/lib/` — couche de données (`dataSource.ts`), i18n, scoring, persistance
- `src/components/` — matrice, galerie, formulaire, comboboxes, drawers…

## 🚀 Développement

```bash
npm install
npm run dev      # serveur local (http://localhost:5173)
npm run build    # build de production
```
