import type { Material, Machine } from '../types';

// ---------------------------------------------------------------------------
// Catalogue des matériaux imprimables (FDM), du standard au haute performance.
// Les pastilles couleur ne servent qu'à identifier visuellement la matière.
// ---------------------------------------------------------------------------

export const MATERIALS: Material[] = [
  // --- Standards ---
  { id: 'pla', name: 'PLA', fullName: 'Acide polylactique', family: 'standard', accent: '#22c55e' },
  { id: 'plaplus', name: 'PLA+', fullName: 'PLA renforcé', family: 'standard', accent: '#16a34a' },
  { id: 'petg', name: 'PETG', fullName: 'Polyéthylène téréphtalate glycolisé', family: 'standard', accent: '#38bdf8' },
  { id: 'pet', name: 'PET', fullName: 'Polyéthylène téréphtalate', family: 'standard', accent: '#0ea5e9' },
  { id: 'pctg', name: 'PCTG', fullName: 'Copolyester PCTG', family: 'standard', accent: '#22d3ee' },
  { id: 'cpe', name: 'CPE', fullName: 'Copolyester (type Ultimaker CPE)', family: 'standard', accent: '#7dd3fc' },
  { id: 'pvb', name: 'PVB', fullName: 'Polyvinyl butyral (lissable à l’alcool)', family: 'standard', accent: '#86efac' },
  { id: 'pha', name: 'PHA', fullName: 'Polyhydroxyalcanoate (biosourcé)', family: 'standard', accent: '#65a30d' },

  // --- Flexibles ---
  { id: 'tpu', name: 'TPU', fullName: 'Polyuréthane thermoplastique (95A)', family: 'flexible', accent: '#a78bfa' },
  { id: 'tpu85', name: 'TPU 85A', fullName: 'Polyuréthane thermoplastique très souple', family: 'flexible', accent: '#9333ea' },
  { id: 'tpe', name: 'TPE', fullName: 'Élastomère thermoplastique', family: 'flexible', accent: '#c084fc' },
  { id: 'tpc', name: 'TPC', fullName: 'Copolyester thermoplastique flexible', family: 'flexible', accent: '#8b5cf6' },
  { id: 'peba', name: 'PEBA', fullName: 'Polyéther bloc amide (flexible technique)', family: 'flexible', accent: '#7c3aed' },

  // --- Techniques / ingénierie ---
  { id: 'abs', name: 'ABS', fullName: 'Acrylonitrile butadiène styrène', family: 'technique', accent: '#f97316' },
  { id: 'asa', name: 'ASA', fullName: 'Acrylonitrile styrène acrylate', family: 'technique', accent: '#fb7185' },
  { id: 'pa', name: 'PA', fullName: 'Polyamide (Nylon)', family: 'technique', accent: '#eab308' },
  { id: 'pa6', name: 'PA6', fullName: 'Polyamide 6', family: 'technique', accent: '#ca8a04' },
  { id: 'pa11', name: 'PA11', fullName: 'Polyamide 11 (biosourcé)', family: 'technique', accent: '#d97706' },
  { id: 'pa12', name: 'PA12', fullName: 'Polyamide 12', family: 'technique', accent: '#a16207' },
  { id: 'pc', name: 'PC', fullName: 'Polycarbonate', family: 'technique', accent: '#60a5fa' },
  { id: 'pcabs', name: 'PC-ABS', fullName: 'Alliage polycarbonate / ABS', family: 'technique', accent: '#3b82f6' },
  { id: 'pom', name: 'POM', fullName: 'Polyoxyméthylène (acétal / Delrin)', family: 'technique', accent: '#f59e0b' },
  { id: 'pp', name: 'PP', fullName: 'Polypropylène', family: 'technique', accent: '#4ade80' },
  { id: 'pmma', name: 'PMMA', fullName: 'Polyméthacrylate de méthyle (acrylique)', family: 'technique', accent: '#e879f9' },
  { id: 'pvdf', name: 'PVDF', fullName: 'Polyfluorure de vinylidène', family: 'technique', accent: '#2dd4bf' },

  // --- Composites (chargés fibres / matière) ---
  { id: 'placf', name: 'PLA-CF', fullName: 'PLA chargé fibre de carbone', family: 'composite', accent: '#475569' },
  { id: 'petgcf', name: 'PETG-CF', fullName: 'PETG chargé fibre de carbone', family: 'composite', accent: '#334155' },
  { id: 'petcf', name: 'PET-CF', fullName: 'PET chargé fibre de carbone', family: 'composite', accent: '#1f2937' },
  { id: 'abscf', name: 'ABS-CF', fullName: 'ABS chargé fibre de carbone', family: 'composite', accent: '#7c2d12' },
  { id: 'asacf', name: 'ASA-CF', fullName: 'ASA chargé fibre de carbone', family: 'composite', accent: '#9f1239' },
  { id: 'pacf', name: 'PA-CF', fullName: 'Nylon chargé fibre de carbone', family: 'composite', accent: '#1e293b' },
  { id: 'paht', name: 'PAHT-CF', fullName: 'Nylon haute température fibre de carbone', family: 'composite', accent: '#292524' },
  { id: 'pagf', name: 'PA-GF', fullName: 'Nylon chargé fibre de verre', family: 'composite', accent: '#64748b' },
  { id: 'pccf', name: 'PC-CF', fullName: 'Polycarbonate chargé fibre de carbone', family: 'composite', accent: '#0f172a' },
  { id: 'ppacf', name: 'PPA-CF', fullName: 'Polyphtalamide chargé fibre de carbone', family: 'composite', accent: '#3f3f46' },
  { id: 'ppcf', name: 'PP-CF', fullName: 'Polypropylène chargé fibre de carbone', family: 'composite', accent: '#3f6212' },
  { id: 'ppgf', name: 'PP-GF', fullName: 'Polypropylène chargé fibre de verre', family: 'composite', accent: '#52525b' },
  { id: 'peekcf', name: 'PEEK-CF', fullName: 'PEEK chargé fibre de carbone', family: 'composite', accent: '#57534e' },
  { id: 'wood', name: 'Bois', fullName: 'PLA chargé fibres de bois', family: 'composite', accent: '#b45309' },
  { id: 'metal', name: 'Métal', fullName: 'Filament chargé poudre métallique', family: 'composite', accent: '#9ca3af' },

  // --- Haute température / hautes performances ---
  { id: 'ppa', name: 'PPA', fullName: 'Polyphtalamide (nylon haute température)', family: 'haute-température', accent: '#c2410c' },
  { id: 'peek', name: 'PEEK', fullName: 'Polyétheréthercétone', family: 'haute-température', accent: '#dc2626' },
  { id: 'pekk', name: 'PEKK', fullName: 'Polyéthercétonecétone', family: 'haute-température', accent: '#b91c1c' },
  { id: 'pei', name: 'PEI', fullName: 'Polyétherimide (ULTEM)', family: 'haute-température', accent: '#ea580c' },
  { id: 'ppsu', name: 'PPSU', fullName: 'Polyphénylsulfone', family: 'haute-température', accent: '#d97706' },
  { id: 'psu', name: 'PSU', fullName: 'Polysulfone', family: 'haute-température', accent: '#facc15' },
  { id: 'pesu', name: 'PESU', fullName: 'Polyéthersulfone', family: 'haute-température', accent: '#fbbf24' },
  { id: 'pps', name: 'PPS', fullName: 'Sulfure de polyphénylène', family: 'haute-température', accent: '#78350f' },
  { id: 'lcp', name: 'LCP', fullName: 'Polymère à cristaux liquides', family: 'haute-température', accent: '#831843' },

  // --- Spéciaux (fonctionnels) ---
  { id: 'conductive', name: 'Conducteur', fullName: 'Filament conducteur (chargé carbone)', family: 'spécial', accent: '#1c1917' },
  { id: 'esd', name: 'ESD', fullName: 'Matière dissipative ESD-safe', family: 'spécial', accent: '#374151' },
  { id: 'fr', name: 'Ignifuge', fullName: 'Matière ignifugée (FR / V0)', family: 'spécial', accent: '#7f1d1d' },

  // --- Supports ---
  { id: 'pva', name: 'PVA', fullName: 'Alcool polyvinylique (support soluble)', family: 'support', accent: '#34d399' },
  { id: 'bvoh', name: 'BVOH', fullName: 'Butènediol-alcool vinylique (support soluble)', family: 'support', accent: '#5eead4' },
  { id: 'hips', name: 'HIPS', fullName: 'Polystyrène choc (support, soluble au limonène)', family: 'support', accent: '#94a3b8' },
  { id: 'breakaway', name: 'Breakaway', fullName: 'Support détachable mécaniquement', family: 'support', accent: '#cbd5e1' },
];

// ---------------------------------------------------------------------------
// Machines & systèmes multi-matériaux.
// ---------------------------------------------------------------------------

export const MACHINES: Machine[] = [
  // --- Bambu Lab (AMS / AMS 2 Pro / AMS lite) ---
  { id: 'x1c', name: 'Bambu Lab X1 Carbon + AMS', system: 'AMS', maxMaterials: 16 },
  { id: 'x1e', name: 'Bambu Lab X1E + AMS', system: 'AMS', maxMaterials: 16 },
  { id: 'x2d', name: 'Bambu Lab X2D + AMS 2 Pro (double buse)', system: 'AMS', maxMaterials: 16 },
  { id: 'p2s', name: 'Bambu Lab P2S + AMS 2 Pro', system: 'AMS', maxMaterials: 16 },
  { id: 'p1s', name: 'Bambu Lab P1S + AMS', system: 'AMS', maxMaterials: 16 },
  { id: 'p1p', name: 'Bambu Lab P1P + AMS', system: 'AMS', maxMaterials: 16 },
  { id: 'a1', name: 'Bambu Lab A1 + AMS lite', system: 'AMS', maxMaterials: 4 },
  { id: 'a1mini', name: 'Bambu Lab A1 mini + AMS lite', system: 'AMS', maxMaterials: 4 },
  { id: 'a2l', name: 'Bambu Lab A2L + AMS lite', system: 'AMS', maxMaterials: 4 },
  { id: 'h2d', name: 'Bambu Lab H2D (double buse + AMS)', system: 'AMS', maxMaterials: 16 },
  { id: 'h2s', name: 'Bambu Lab H2S + AMS', system: 'AMS', maxMaterials: 16 },
  { id: 'h2dpro', name: 'Bambu Lab H2D Pro + AMS', system: 'AMS', maxMaterials: 16 },

  // --- Creality (CFS — Creality Filament System) ---
  { id: 'k2plus', name: 'Creality K2 Plus + CFS', system: 'AMS', maxMaterials: 16 },
  { id: 'k2pro', name: 'Creality K2 Pro + CFS', system: 'AMS', maxMaterials: 16 },
  { id: 'k2se', name: 'Creality K2 SE + CFS', system: 'AMS', maxMaterials: 4 },
  { id: 'k1cfs', name: 'Creality K1C + CFS', system: 'AMS', maxMaterials: 16 },
  { id: 'k1maxcfs', name: 'Creality K1 Max + CFS', system: 'AMS', maxMaterials: 16 },
  { id: 'k1secfs', name: 'Creality K1 SE + CFS', system: 'AMS', maxMaterials: 16 },
  { id: 'hicfs', name: 'Creality Hi + CFS', system: 'AMS', maxMaterials: 16 },

  // --- Anycubic (ACE Pro / ACE 2 Pro) ---
  { id: 'kobras1', name: 'Anycubic Kobra S1 + ACE 2 Pro', system: 'AMS', maxMaterials: 8 },
  { id: 'kobras1max', name: 'Anycubic Kobra S1 Max + ACE 2 Pro', system: 'AMS', maxMaterials: 8 },
  { id: 'kobra3', name: 'Anycubic Kobra 3 + ACE Pro', system: 'AMS', maxMaterials: 8 },
  { id: 'kobra3max', name: 'Anycubic Kobra 3 Max + ACE Pro', system: 'AMS', maxMaterials: 8 },

  // --- Elegoo (système couleur Centauri) ---
  { id: 'centauri', name: 'Elegoo Centauri Carbon (multicouleur)', system: 'AMS', maxMaterials: 4 },
  { id: 'centauri2', name: 'Elegoo Centauri Carbon 2 Combo', system: 'AMS', maxMaterials: 4 },

  // --- FlashForge (IFS — Intelligent Filament System) ---
  { id: 'ffad5x', name: 'FlashForge AD5X (IFS)', system: 'AMS', maxMaterials: 4 },
  { id: 'ff5mpro', name: 'FlashForge Adventurer 5M Pro + IFS', system: 'AMS', maxMaterials: 4 },

  // --- Prusa (MMU3 / MMU2S) ---
  { id: 'mk4', name: 'Prusa MK4 + MMU3', system: 'MMU', maxMaterials: 5 },
  { id: 'mk4s', name: 'Prusa MK4S + MMU3', system: 'MMU', maxMaterials: 5 },
  { id: 'mk3s', name: 'Prusa MK3S+ + MMU2S', system: 'MMU', maxMaterials: 5 },
  { id: 'coreone', name: 'Prusa Core One + MMU3', system: 'MMU', maxMaterials: 5 },

  // --- Toolchangers (têtes indépendantes) ---
  { id: 'xl', name: 'Prusa XL (toolchanger 5 têtes)', system: 'Toolchanger', maxMaterials: 5 },
  { id: 'xl2', name: 'Prusa XL (2 têtes)', system: 'Toolchanger', maxMaterials: 2 },
  { id: 'snapu1', name: 'Snapmaker U1 (4 têtes SnapSwap)', system: 'Toolchanger', maxMaterials: 4 },
  { id: 'ffcreator5', name: 'FlashForge Creator 5 (4 têtes)', system: 'Toolchanger', maxMaterials: 4 },
  { id: 'h2c', name: 'Bambu Lab H2C (6 buses Vortek)', system: 'Toolchanger', maxMaterials: 6 },
  { id: 'e3dtc', name: 'E3D Toolchanger', system: 'Toolchanger', maxMaterials: 4 },

  // --- Voron / changeurs de filament (ERCF, BoxTurtle, type AMS DIY) ---
  { id: 'voron', name: 'Voron 2.4 + ERCF', system: 'ERCF', maxMaterials: 12 },
  { id: 'trident', name: 'Voron Trident + ERCF', system: 'ERCF', maxMaterials: 12 },
  { id: 'boxturtle', name: 'Voron + BoxTurtle (AFC)', system: 'ERCF', maxMaterials: 8 },
  { id: 'sv08ercf', name: 'Sovol SV08 + ERCF / BoxTurtle', system: 'ERCF', maxMaterials: 8 },
  { id: 'ratrig', name: 'RatRig V-Core / VCore + ERCF', system: 'ERCF', maxMaterials: 12 },

  // --- IDEX (double extrudeur indépendant) ---
  { id: 'sovol', name: 'Sovol SV04 (IDEX)', system: 'IDEX', maxMaterials: 2 },
  { id: 'snapmakerj1', name: 'Snapmaker J1 (IDEX)', system: 'IDEX', maxMaterials: 2 },
  { id: 'bcn3d', name: 'BCN3D Epsilon (IDEX)', system: 'IDEX', maxMaterials: 2 },
  { id: 'bcn3dsigma', name: 'BCN3D Sigma D25 (IDEX)', system: 'IDEX', maxMaterials: 2 },
  { id: 'flashforge2', name: 'FlashForge Creator Pro 2 (IDEX)', system: 'IDEX', maxMaterials: 2 },
  { id: 'ffcreator4', name: 'FlashForge Creator 4 (IDEX industriel)', system: 'IDEX', maxMaterials: 2 },
  { id: 'raise3de2', name: 'Raise3D E2 (IDEX)', system: 'IDEX', maxMaterials: 2 },
  { id: 'tenlogtl', name: 'Tenlog TL-D3 Pro (IDEX)', system: 'IDEX', maxMaterials: 2 },

  // --- Double extrudeur classique ---
  { id: 'ums5', name: 'Ultimaker S5', system: 'Dual', maxMaterials: 2 },
  { id: 'ums7', name: 'Ultimaker S7', system: 'Dual', maxMaterials: 2 },
  { id: 'ums8', name: 'UltiMaker S8', system: 'Dual', maxMaterials: 2 },
  { id: 'raise3dpro3', name: 'Raise3D Pro3', system: 'Dual', maxMaterials: 2 },
  { id: 'qidiplus4', name: 'QIDI Plus4 (double buse)', system: 'Dual', maxMaterials: 2 },

  // --- Splicers (Mosaic Palette / Element — branchables sur quasi toute imprimante) ---
  { id: 'palette3', name: 'Mosaic Palette 3', system: 'Palette', maxMaterials: 8 },
  { id: 'palette3pro', name: 'Mosaic Palette 3 Pro', system: 'Palette', maxMaterials: 8 },
  { id: 'element', name: 'Mosaic Element HT', system: 'Palette', maxMaterials: 8 },
];

const materialById = new Map(MATERIALS.map((m) => [m.id, m]));
const machineById = new Map(MACHINES.map((m) => [m.id, m]));

export function getMaterial(id: string): Material | undefined {
  return materialById.get(id);
}

export function getMachine(id: string): Machine | undefined {
  return machineById.get(id);
}
