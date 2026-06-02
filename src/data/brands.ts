// ---------------------------------------------------------------------------
// Catalogue de marques de filament FDM (grand public → spécialistes).
// Sert à alimenter l'autocomplétion du champ « marque » dans le formulaire :
// la saisie reste libre (on peut taper une marque absente de la liste).
// Objectif : couvrir le maximum de marques mainstream et au-delà.
// L'ordre va globalement des plus répandues vers la longue traîne.
// ---------------------------------------------------------------------------

export const FILAMENT_BRANDS: string[] = [
  // --- Marques d'imprimantes (filaments maison, très répandus) ---
  'Bambu Lab',
  'Creality',
  'Creality Hyper',
  'Anycubic',
  'Elegoo',
  'Prusament',
  'FlashForge',
  'QIDI',
  'Sovol',
  'Voxelab',
  'AnkerMake',
  'Ultimaker',
  'Raise3D',
  'Zortrax',
  'Tiertime',
  'BCN3D',
  'Snapmaker',

  // --- Grandes marques généralistes / best-sellers ---
  'Polymaker',
  'eSUN',
  'SUNLU',
  'Hatchbox',
  'Overture',
  'Inland',
  'Amazon Basics',
  'MatterHackers',
  'Printed Solid (Jessie)',
  '3D Solutech',
  'Push Plastic',
  '3D Fuel',
  'Coex',
  'Gizmo Dorks',

  // --- Premium / spécialistes qualité ---
  'ColorFabb',
  'Fillamentum',
  'Fiberlogy',
  'FormFutura',
  'Extrudr',
  'AddNorth',
  'Spectrum',
  'Devil Design',
  'Das Filament',
  'Smart Materials 3D (Smartfil)',
  'ICE Filaments',
  'Real Filament',
  '3DJAKE',
  'Verbatim',
  'Filalab',
  'Numakers',
  'Material4Print',
  'GreenGate3D',
  'KVP (Keene Village Plastics)',
  'Atomic Filament',
  'Proto-Pasta',

  // --- Flexibles / techniques spécialisés ---
  'NinjaTek',
  'Recreus (Filaflex)',
  'Taulman3D',
  'SainSmart',

  // --- Composites / haute performance / ingénierie ---
  '3DXTech',
  'BASF Ultrafuse',
  'Forward AM',
  'Kimya',
  'Nanovia',
  'IEMAI',
  'Essentium',
  'Intamsys',
  'Roboze',
  'PolyMide', // gamme nylon Polymaker (haute perf)

  // --- Marques européennes / françaises ---
  'Francofil',
  'Arianeplast',
  'Dailyfil',
  'Filimprimante3D',
  'Octofiber',
  'Filo3D',
  'FilamentOne',

  // --- Budget / e-commerce grand public ---
  'Eryone',
  'AMOLEN',
  'JAYO',
  'Geeetech',
  'GIANTARM',
  'ZIRO',
  'MIKA3D',
  'TTYT3D',
  'DURAMIC 3D',
  'TECBEARS',
  'Kingroon',
  'Tronxy',
  'Comgrow',
  'YOUSU',
  'HELLO3D',
  'R3D',
  'ZYLtech',
  'Paramount 3D',
  'IIID Max',
  'GST3D',

  // --- Divers / historiques ---
  'MakerBot',
  'XYZprinting',
  'Dremel',
  'Siraya Tech',
];
