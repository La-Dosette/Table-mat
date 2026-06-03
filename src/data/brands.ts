// ---------------------------------------------------------------------------
// Catalogue de marques de filament FDM (le plus exhaustif possible) avec, pour
// les principaux fabricants, leurs gammes/références.
// - Le champ « marque » propose les noms de fabricants.
// - Le champ « réf. / couleur » est pré-filtré selon la marque choisie
//   (refsForBrand) ; la saisie libre reste possible partout.
// ---------------------------------------------------------------------------

export interface FilamentBrand {
  name: string;
  /** Gammes / références connues, proposées une fois la marque choisie. */
  refs?: string[];
}

export const FILAMENT_CATALOG: FilamentBrand[] = [
  // --- Marques d'imprimantes (filaments maison) ---
  {
    name: 'Bambu Lab',
    refs: [
      'PLA Basic', 'PLA Matte', 'PLA Silk+', 'PLA-CF', 'PETG HF', 'PETG-CF',
      'ABS', 'ASA', 'PA-CF', 'PAHT-CF', 'PC', 'TPU for AMS', 'Support',
    ],
  },
  {
    name: 'Creality',
    refs: ['Hyper PLA', 'Hyper PETG', 'CR-PLA', 'Ender-PLA', 'HP Ultra PLA'],
  },
  {
    name: 'Anycubic',
    refs: ['PLA', 'PLA+', 'High Speed PLA', 'PETG', 'ASA', 'Silk PLA'],
  },
  {
    name: 'Elegoo',
    refs: ['Rapid PLA+', 'PLA', 'PETG', 'ABS'],
  },
  {
    name: 'Prusament',
    refs: ['PLA', 'PETG', 'ASA', 'PC Blend', 'PVB', 'rPLA'],
  },
  { name: 'FlashForge' },
  { name: 'QIDI' },
  { name: 'Sovol' },
  { name: 'Voxelab' },
  { name: 'AnkerMake' },
  { name: 'Ultimaker', refs: ['Tough PLA', 'PLA', 'ABS', 'CPE', 'CPE+', 'Nylon', 'TPU 95A', 'PETG'] },
  { name: 'Raise3D', refs: ['Premium PLA', 'Premium PETG', 'Hyper Speed PLA', 'Industrial ABS'] },
  { name: 'Zortrax', refs: ['Z-ULTRAT', 'Z-PLA Pro', 'Z-ASA Pro', 'Z-PETG', 'Z-NYLON'] },
  { name: 'Tiertime / UP' },
  { name: 'BCN3D' },
  { name: 'Snapmaker' },
  { name: 'Flsun' },
  { name: 'Two Trees' },
  { name: 'Artillery' },
  { name: 'Kingroon' },
  { name: 'Tronxy' },
  { name: 'Wanhao' },
  { name: 'Monoprice' },
  { name: 'Mingda' },
  { name: 'Kywoo' },
  { name: 'BIQU' },
  { name: 'Longer' },
  { name: 'Dremel' },
  { name: 'MakerBot' },
  { name: 'XYZprinting' },

  // --- Généralistes / best-sellers ---
  {
    name: 'Polymaker',
    refs: [
      'PolyTerra PLA', 'PolyLite PLA', 'PolyLite PETG', 'PolyMax PLA', 'PolyMax PC',
      'PolySonic PLA', 'PolyMide PA6-CF', 'PolyMide CoPA', 'PolyFlex TPU95',
      'Fiberon PA6-CF', 'PolyWood',
    ],
  },
  {
    name: 'eSUN',
    refs: ['PLA+', 'ePLA-HS', 'eABS+', 'ePETG', 'eSilk PLA', 'eTPU-95A', 'ePA-CF'],
  },
  {
    name: 'SUNLU',
    refs: ['PLA Meta', 'PLA+', 'Silk PLA', 'PETG', 'TPU', 'Marble PLA'],
  },
  { name: 'Hatchbox', refs: ['PLA', 'PETG', 'ABS', 'Wood PLA'] },
  { name: 'Overture', refs: ['PLA Professional', 'Easy PLA', 'Matte PLA', 'PETG', 'Rock PLA'] },
  { name: 'Inland' },
  { name: 'Amazon Basics' },
  { name: 'MatterHackers', refs: ['Build PLA', 'PRO PLA', 'Build PETG', 'PRO PETG', 'NylonX'] },
  { name: 'Printed Solid (Jessie)' },
  { name: '3D Solutech' },
  { name: 'Push Plastic' },
  { name: '3D Fuel' },
  { name: 'Coex' },
  { name: 'Gizmo Dorks' },
  { name: 'IC3D' },
  { name: 'Toner Plastics' },
  { name: 'MakerGeeks' },
  { name: 'Filament PM' },

  // --- Premium / spécialistes qualité ---
  { name: 'ColorFabb', refs: ['PLA/PHA', 'nGen', 'XT', 'woodFill', 'varioShore TPU', 'PA-CF Low Warp'] },
  { name: 'Fillamentum', refs: ['PLA Extrafill', 'ASA Extrafill', 'PETG', 'Flexfill 98A', 'Nylon FX256'] },
  { name: 'Fiberlogy', refs: ['Easy PLA', 'Easy PETG', 'FiberFlex 40D', 'Nylon PA12', 'PCTG', 'FiberSatin'] },
  { name: 'FormFutura', refs: ['EasyFil PLA', 'ReForm rPLA', 'ApolloX ASA', 'CarbonFil', 'TitanX ABS', 'Python Flex'] },
  { name: 'Extrudr', refs: ['GreenTEC Pro', 'PLA NX2', 'PETG', 'DuraPro ASA', 'XPETG-CF'] },
  { name: 'AddNorth', refs: ['E-PLA', 'Adura X', 'Reform rPETG', 'ESD-PETG'] },
  { name: 'Spectrum' },
  { name: 'Devil Design' },
  { name: 'Das Filament' },
  { name: 'Smart Materials 3D (Smartfil)' },
  { name: 'ICE Filaments' },
  { name: 'Real Filament' },
  { name: '3DJAKE', refs: ['ecoPLA', 'ecoPLA Matt', 'ecoPLA Tough', 'niceABS', 'PETG'] },
  { name: 'Verbatim' },
  { name: 'Filalab' },
  { name: 'Numakers' },
  { name: 'Material4Print' },
  { name: 'GreenGate3D' },
  { name: 'KVP (Keene Village Plastics)' },
  { name: 'Atomic Filament' },
  { name: 'Proto-Pasta', refs: ['HTPLA', 'Conductive PLA', 'Carbon Fiber PLA', 'Steel PLA', 'Magnetic Iron PLA'] },
  { name: '3D Prima' },
  { name: 'Filamentive' },

  // --- Européennes ---
  { name: 'AzureFilm' },
  { name: 'Filamentree' },
  { name: 'GST3D' },
  { name: '3D4Makers' },
  { name: 'Ockert' },
  { name: 'Jama3D' },
  { name: 'Octofiber' },
  { name: 'Herz' },
  { name: 'Nobufil' },
  { name: 'Treed Filaments' },
  { name: 'FiloAlfa' },
  { name: 'Eumakers' },
  { name: 'Winkle' },
  { name: 'ROSA3D' },
  { name: 'Noctuo' },
  { name: 'Print-Me' },
  { name: '3DGence' },
  { name: 'Plasty Mladeč' },
  { name: 'Refil' },
  { name: 'Reflow' },
  { name: 'Nefila' },
  { name: 'FilRight' },
  { name: 'Fil-A-Gehr' },
  { name: 'Spoolworks' },
  { name: '123-3D' },

  // --- Françaises ---
  { name: 'Francofil' },
  { name: 'Arianeplast' },
  { name: 'Dailyfil' },
  { name: 'Filimprimante3D' },
  { name: 'Filo3D' },
  { name: 'FilamentOne' },
  { name: 'Kimya (Armor)', refs: ['PLA-R', 'PETG-R', 'ABS Kimya', 'PC-FR', 'PEKK-A', 'ABS ESD'] },
  { name: 'Nanovia', refs: ['PLA', 'PETG', 'PC', 'PA Carbone', 'ABS ESD'] },
  { name: 'Polyfab3D' },
  { name: 'Neofil3D' },
  { name: 'eMotion Tech' },

  // --- Chinoises / e-commerce grand public ---
  { name: 'Eryone' },
  { name: 'AMOLEN' },
  { name: 'JAYO' },
  { name: 'Geeetech' },
  { name: 'GIANTARM' },
  { name: 'ZIRO' },
  { name: 'MIKA3D' },
  { name: 'TTYT3D' },
  { name: 'DURAMIC 3D' },
  { name: 'TECBEARS' },
  { name: 'Comgrow' },
  { name: 'YOUSU' },
  { name: 'HELLO3D' },
  { name: 'R3D' },
  { name: 'ZYLtech' },
  { name: 'Tinmorry' },
  { name: 'Kexcelled' },
  { name: 'iSANMATE' },
  { name: 'CCTREE' },
  { name: 'Stronghero3D' },
  { name: 'Pxmalion' },
  { name: 'Enotepad' },
  { name: 'Yoopai' },
  { name: 'Justmaker' },
  { name: 'Reprapper' },
  { name: 'Tianse' },
  { name: 'JAMGHE' },
  { name: 'Paramount 3D' },
  { name: 'IIID Max' },
  { name: 'SainSmart' },

  // --- Flexibles / techniques spécialisés ---
  { name: 'NinjaTek', refs: ['NinjaFlex', 'Cheetah', 'Armadillo', 'Chinchilla', 'Eel'] },
  { name: 'Recreus (Filaflex)', refs: ['Filaflex 82A', 'Filaflex 95A', 'Filaflex 70A', 'PETG'] },
  { name: 'Taulman3D', refs: ['Nylon 645', 'Bridge', 'Alloy 910', 'PCTPE'] },
  { name: 'Lay Filaments' },
  { name: 'Multi3D (Electrifi)' },

  // --- Composites / haute performance / industriel ---
  { name: '3DXTech', refs: ['CarbonX CF Nylon', 'ThermaX PEEK', 'ThermaX PEKK', 'FibreX GF', 'EcoMax PLA'] },
  { name: 'BASF Ultrafuse' },
  { name: 'Forward AM' },
  { name: 'Essentium' },
  { name: 'Roboze' },
  { name: 'Intamsys' },
  { name: 'Apium' },
  { name: 'Markforged' },
  { name: 'Stratasys' },
  { name: 'Nexa3D' },
  { name: 'Mitsubishi Chemical (KyronMAX)' },
  { name: 'Arkema' },
  { name: 'Solvay' },
  { name: 'Victrex' },
  { name: 'DSM / Novamid' },
  { name: 'Lehvoss (Luvocom 3F)' },
  { name: 'Owens Corning (XSTRAND)' },
  { name: 'Jabil' },
  { name: 'Covestro' },
  { name: 'SABIC' },
  { name: 'Evonik' },
  { name: 'Ensinger' },

  // --- Recyclé / durable ---
  { name: 'B-PET' },
  { name: 'Formfutura ReForm' },

  // --- Divers ---
  { name: 'Siraya Tech' },
];

/** Noms de fabricants pour l'autocomplétion du champ « marque ». */
export const FILAMENT_BRANDS: string[] = FILAMENT_CATALOG.map((b) => b.name);

/** Suggestions génériques (finitions + couleurs) toujours proposées en réf. */
export const COMMON_FILAMENT_REFS: string[] = [
  // Finitions / familles
  'Basic', 'Matte', 'Silk', 'Standard', 'Tough', 'High Speed', 'Transparent',
  // Couleurs
  'Blanc', 'Noir', 'Gris', 'Argent', 'Rouge', 'Orange', 'Jaune',
  'Vert', 'Bleu', 'Violet', 'Rose', 'Marron', 'Or', 'Naturel',
];

const byName = new Map(FILAMENT_CATALOG.map((b) => [b.name.toLowerCase(), b]));

/**
 * Réfs proposées pour une marque donnée. Correspondance souple : nom exact, ou
 * marque dont le libellé commence par un nom du catalogue. Renvoie [] si
 * inconnue (le champ reste en saisie libre).
 */
export function refsForBrand(brand: string): string[] {
  const q = brand.trim().toLowerCase();
  if (!q) return [];
  const exact = byName.get(q);
  if (exact?.refs) return exact.refs;
  const partial = FILAMENT_CATALOG.find(
    (b) => b.refs && (q.startsWith(b.name.toLowerCase()) || b.name.toLowerCase().startsWith(q)),
  );
  return partial?.refs ?? [];
}
