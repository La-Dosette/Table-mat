// ---------------------------------------------------------------------------
// Catalogue de marques de filament FDM (le plus exhaustif possible) avec, pour
// la plupart des fabricants, leurs gammes/références détaillées.
// - Le champ « marque » propose les noms de fabricants.
// - Le champ « réf. / couleur » est pré-filtré selon la marque choisie
//   (refsForBrand), complété par des finitions/couleurs communes.
// - La saisie libre reste possible partout.
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
      'PLA Basic', 'PLA Matte', 'PLA Silk+', 'PLA Silk Multi-Color', 'PLA Basic Gradient',
      'PLA Galaxy', 'PLA Sparkle', 'PLA Marble', 'PLA Metal', 'PLA Wood', 'PLA Aero',
      'PLA Translucent', 'PLA Tough+', 'PLA-CF', 'PETG HF', 'PETG Translucent', 'PETG-CF',
      'ABS', 'ABS-GF', 'ASA', 'ASA-CF', 'ASA Aero', 'PC', 'PC FR', 'TPU 95A HF', 'TPU for AMS',
      'PA6-GF', 'PA6-CF', 'PAHT-CF', 'PPA-CF', 'PPS-CF', 'PET-CF',
      'PVA Support', 'Support for PLA/PETG', 'Support for PA/PET',
    ],
  },
  {
    name: 'Creality',
    refs: [
      'Hyper PLA', 'Hyper PLA-CF', 'Hyper PETG', 'Hyper ABS', 'CR-PLA', 'CR-PETG',
      'CR-Silk', 'CR-Wood', 'Ender-PLA', 'Ender Fast PLA', 'HP Ultra PLA',
    ],
  },
  {
    name: 'Anycubic',
    refs: ['PLA', 'PLA+', 'High Speed PLA', 'Matte PLA', 'Silk PLA', 'PLA-CF', 'PETG', 'ASA', 'ABS', 'TPU'],
  },
  {
    name: 'Elegoo',
    refs: ['Rapid PLA+', 'PLA', 'Silk PLA', 'Matte PLA', 'PETG', 'ABS', 'TPU'],
  },
  {
    name: 'Prusament',
    refs: [
      'PLA', 'PLA Galaxy', 'PETG', 'PETG Tungsten 75%', 'ASA', 'ABS',
      'PC Blend', 'PC Blend CF', 'PVB', 'rPLA', 'rPETG', 'Flex (TPE)',
    ],
  },
  { name: 'FlashForge', refs: ['PLA', 'PLA Pro', 'Silk PLA', 'PETG Pro', 'ABS', 'ASA', 'TPU', 'PLA-CF'] },
  { name: 'QIDI', refs: ['Rapido PLA', 'PETG', 'ABS', 'Nylon', 'PA12-CF', 'PET-CF'] },
  { name: 'Sovol', refs: ['PLA', 'PLA+', 'PETG', 'Silk PLA', 'TPU'] },
  { name: 'Voxelab', refs: ['PLA', 'Silk PLA', 'PETG', 'ABS'] },
  { name: 'AnkerMake', refs: ['PLA', 'PLA+', 'PETG'] },
  { name: 'Ultimaker', refs: ['PLA', 'Tough PLA', 'ABS', 'Nylon', 'CPE', 'CPE+', 'PETG', 'PC', 'TPU 95A', 'PVA', 'Breakaway', 'PP'] },
  { name: 'Raise3D', refs: ['Premium PLA', 'Premium PETG', 'Premium ABS', 'Hyper Speed PLA', 'Hyper Speed PETG', 'Industrial PA12-CF', 'Industrial PPA-CF', 'ProAlloy'] },
  { name: 'Zortrax', refs: ['Z-ULTRAT', 'Z-ULTRAT Plus', 'Z-PLA Pro', 'Z-ASA Pro', 'Z-PETG', 'Z-NYLON', 'Z-PCABS', 'Z-GLASS', 'Z-ESD', 'Z-PEEK', 'Z-FLEX'] },
  { name: 'Tiertime / UP', refs: ['UP Fila PLA', 'UP Fila ABS', 'UP Fila PETG'] },
  { name: 'BCN3D', refs: ['PLA', 'PETG', 'TPU 98A', 'PAHT-CF', 'PP', 'PVA'] },
  { name: 'Snapmaker', refs: ['PLA', 'PLA+', 'Silk PLA', 'PETG', 'ABS', 'TPU', 'Breakaway Support'] },
  { name: 'Flsun', refs: ['PLA', 'High Speed PLA', 'PETG'] },
  { name: 'Two Trees', refs: ['PLA', 'Silk PLA', 'PETG'] },
  { name: 'Artillery', refs: ['PLA', 'Silk PLA', 'PETG'] },
  { name: 'Kingroon', refs: ['PLA', 'PLA+', 'High Speed PLA', 'Silk PLA', 'PETG', 'TPU'] },
  { name: 'Tronxy', refs: ['PLA', 'PETG', 'Wood PLA'] },
  { name: 'Wanhao', refs: ['PLA', 'PETG', 'ABS', 'Water Washable Resin'] },
  { name: 'Monoprice', refs: ['Premium PLA', 'PLA+', 'PETG', 'ABS'] },
  { name: 'Mingda', refs: ['PLA', 'PLA-CF', 'PETG'] },
  { name: 'Kywoo', refs: ['PLA', 'Silk PLA', 'PETG'] },
  { name: 'BIQU', refs: ['PLA', 'Silk PLA', 'PETG'] },
  { name: 'Longer', refs: ['PLA', 'PETG'] },
  { name: 'Dremel', refs: ['PLA', 'ECO-ABS', 'Nylon', 'PETG'] },
  { name: 'MakerBot', refs: ['PLA', 'Tough PLA', 'ABS', 'Nylon Carbon Fiber', 'PETG'] },
  { name: 'XYZprinting', refs: ['da Vinci PLA', 'PETG', 'Tough PLA', 'Antibacterial PLA'] },

  // --- Généralistes / best-sellers ---
  {
    name: 'Polymaker',
    refs: [
      'PolyTerra PLA', 'PolyTerra PLA Pro', 'PolyLite PLA', 'PolyLite PLA Pro', 'PolyLite PETG',
      'PolyLite ABS', 'PolyLite ASA', 'PolyMax PLA', 'PolyMax PETG', 'PolyMax PC',
      'PolySonic PLA', 'PolySonic PLA Pro', 'Panchroma PLA', 'HT-PLA', 'HT-PLA-GF',
      'PolyFlex TPU95', 'PolyFlex TPU90', 'PolyFlex TPU70',
      'PolyMide CoPA', 'PolyMide PA6-CF', 'PolyMide PA12-CF',
      'Fiberon PA6-CF20', 'Fiberon PA6-GF25', 'Fiberon PET-CF17', 'Fiberon PA612-CF15', 'Fiberon PETG-rCF08',
      'PolyWood', 'PC-FR', 'PC-ABS', 'PolySmooth (PVB)',
    ],
  },
  {
    name: 'eSUN',
    refs: [
      'PLA+', 'ePLA-Matte', 'ePLA-Silk', 'ePLA-HS', 'ePLA-Lite', 'ePLA-ST', 'ePLA-LW', 'PLA-CF',
      'ABS+', 'eABS-Max', 'ASA', 'ePETG', 'PETG', 'PETG-CF', 'eTPU-95A', 'eTPU-83A',
      'eNylon', 'ePA-CF', 'PA12-CF', 'eHIPS', 'ePVA', 'eSilk',
    ],
  },
  {
    name: 'SUNLU',
    refs: [
      'PLA', 'PLA+', 'PLA+ 2.0', 'PLA Meta', 'Silk PLA', 'Matte PLA', 'Marble PLA', 'Wood PLA',
      'High Speed PLA', 'PLA-CF', 'PETG', 'PETG Silk', 'ABS', 'ASA', 'TPU',
    ],
  },
  { name: 'Hatchbox', refs: ['PLA', 'PLA PRO', 'Matte PLA', 'Silk PLA', 'Wood PLA', 'PETG', 'ABS', 'TPU', 'Nylon'] },
  {
    name: 'Overture',
    refs: [
      'PLA', 'PLA Professional', 'Easy PLA', 'Matte PLA', 'Silk PLA', 'Rock PLA', 'Marble PLA',
      'High Speed PLA', 'PLA-CF', 'PETG', 'Matte PETG', 'PETG-CF', 'ABS', 'ASA', 'TPU', 'Nylon',
    ],
  },
  { name: 'Inland', refs: ['PLA', 'PLA+', 'Matte PLA', 'Silk PLA', 'PETG', 'ABS', 'TPU'] },
  { name: 'Amazon Basics', refs: ['PLA', 'PETG', 'ABS', 'TPU'] },
  { name: 'MatterHackers', refs: ['Build PLA', 'PRO PLA', 'Build PETG', 'PRO PETG', 'Build ABS', 'PRO ABS', 'NylonX', 'NylonG', 'PRO TPU'] },
  { name: 'Printed Solid (Jessie)', refs: ['Jessie PLA', 'Jessie PETG', 'Jessie PLA Matte'] },
  { name: '3D Solutech', refs: ['PLA', 'PLA+', 'PETG', 'ABS'] },
  { name: 'Push Plastic', refs: ['PLA', 'PETG', 'ABS', 'ASA', 'Nylon'] },
  { name: '3D Fuel', refs: ['Standard PLA', 'Pro PLA', 'Workday ABS', 'Pro PETG', 'Entwined Hemp', 'Wound Up Coffee', 'ESD PETG'] },
  { name: 'Coex', refs: ['PLA', 'PETG', 'ASA', 'Nylon'] },
  { name: 'Gizmo Dorks', refs: ['PLA', 'ABS', 'PETG', 'Conductive PLA'] },
  { name: 'IC3D', refs: ['PLA', 'ABS', 'PETG', 'Nylon'] },
  { name: 'Toner Plastics' },
  { name: 'MakerGeeks' },
  { name: 'Filament PM', refs: ['PLA', 'PETG', 'ABS-T', 'ASA', 'CPE', 'Flex 40D', 'PLA Industrial'] },
  { name: 'Polar Filament', refs: ['PLA', 'PETG', 'ABS', 'ASA'] },

  // --- Premium / spécialistes qualité ---
  {
    name: 'ColorFabb',
    refs: [
      'PLA/PHA', 'Economy PLA', 'nGen', 'nGen Flex', 'XT', 'XT-CF20', 'PA-CF Low Warp',
      'varioShore TPU', 'woodFill', 'corkFill', 'bronzeFill', 'copperFill', 'steelFill',
      'allPHA', 'LW-PLA', 'HT',
    ],
  },
  {
    name: 'Fillamentum',
    refs: [
      'PLA Extrafill', 'PLA Crystal Clear', 'ASA Extrafill', 'ABS Extrafill', 'PETG',
      'CPE HG100', 'Flexfill 92A', 'Flexfill 98A', 'Flexfill TPU', 'Nylon FX256',
      'Nylon CF15 Carbon', 'PC/ABS', 'Timberfill', 'Vinyl 303',
    ],
  },
  {
    name: 'Fiberlogy',
    refs: [
      'Easy PLA', 'Easy PETG', 'PLA', 'PLA Mineral', 'PCTG', 'FiberFlex 30D', 'FiberFlex 40D',
      'Nylon PA12', 'PA12+CF15', 'PA6+CF', 'ASA', 'ABS', 'HIPS', 'FiberSatin', 'FiberSilk',
      'FiberWood', 'R PLA', 'R PETG', 'Impact PLA', 'ESD',
    ],
  },
  {
    name: 'FormFutura',
    refs: [
      'EasyFil PLA', 'Premium PLA', 'ReForm rPLA', 'ApolloX (ASA)', 'CarbonFil', 'TitanX (ABS)',
      'Python Flex', 'FlexiFil', 'StoneFil', 'TimberFil', 'Centaur PP', 'EasyFil PETG', 'HDglass',
    ],
  },
  {
    name: 'Extrudr',
    refs: [
      'PLA NX1', 'PLA NX2', 'GreenTEC', 'GreenTEC Pro', 'PETG', 'DuraPro ABS', 'DuraPro ASA',
      'XPETG-CF', 'Flex Medium', 'Flex Hard', 'Pearl', 'Matt', 'BDP PLA',
    ],
  },
  {
    name: 'AddNorth',
    refs: ['E-PLA', 'PLA', 'Adura X', 'Adura Z', 'Reform rPETG', 'ESD-PETG', 'TPU 95A', 'Koltron G1', 'X-PETG-ESD'],
  },
  {
    name: 'Spectrum',
    refs: [
      'PLA Premium', 'PLA Pro', 'PLA Tough', 'PCTG Premium', 'PETG Premium', 'PETG HT100',
      'ASA 275', 'ABS-T', 's-Flex 90A', 's-Flex 85A', 'PA6 Low Warp', 'PA6 Neo',
      'Nylon PA6+CF15', 'PP', 'PC/ABS', 'GreenyPro', 'GreenyHT', 'r-PLA', 'WOOD',
    ],
  },
  { name: 'Devil Design', refs: ['PLA', 'PLA Matt', 'PLA Galaxy', 'PLA Silk', 'PETG', 'PETG Matt', 'ABS', 'ASA', 'TPU', 'PCTG', 'Nylon', 'HIPS', 'Wood'] },
  { name: 'Das Filament', refs: ['PLA', 'PETG', 'ABS', 'ASA', 'recycled PLA', 'recycled PETG'] },
  { name: 'Smart Materials 3D (Smartfil)', refs: ['PLA', 'PLA Reciclado', 'PETG', 'ABS', 'ASA', 'Flex', 'Nylon', 'PP'] },
  { name: 'ICE Filaments', refs: ['PLA', 'PETG', 'ABS', 'Flex', 'Tough PLA'] },
  { name: 'Real Filament', refs: ['PLA', 'PLA Recycled', 'PLA Matte', 'PETG', 'ABS', 'ASA', 'TPU', 'Flex'] },
  { name: '3DJAKE', refs: ['ecoPLA', 'ecoPLA Matt', 'ecoPLA Tough', 'ecoPLA Silk', 'niceABS', 'PETG', 'ecoPETG', 'ASA'] },
  { name: 'Verbatim', refs: ['PLA', 'PRIMALLOY', 'PETG', 'ABS', 'BVOH', 'Tough PLA'] },
  { name: 'Filalab', refs: ['PLA', 'PETG', 'PLA Silk'] },
  { name: 'Numakers', refs: ['PLA', 'PLA+', 'PETG', 'ABS', 'PA-CF', 'TPU'] },
  { name: 'Material4Print', refs: ['PLA', 'PETG', 'ABS', 'ASA'] },
  { name: 'GreenGate3D', refs: ['rPETG'] },
  { name: 'KVP (Keene Village Plastics)', refs: ['PLA', 'ABS', 'PETG', 'TPU'] },
  { name: 'Atomic Filament', refs: ['PLA', 'PETG', 'ABS', 'ASA', 'Silk PLA'] },
  { name: 'Proto-Pasta', refs: ['HTPLA', 'Conductive PLA', 'Carbon Fiber PLA', 'Steel PLA', 'Magnetic Iron PLA', 'Matte Fiber HTPLA', 'High Temp PLA'] },
  { name: '3D Prima', refs: ['PrimaSelect PLA', 'PrimaValue PLA', 'PrimaSelect PETG', 'PrimaSelect ABS'] },
  { name: 'Filamentive', refs: ['rPLA', 'rPETG', 'rABS', 'rTPU', 'Nylon CF'] },
  { name: 'Filaticum', refs: ['PLA', 'Engineering', 'PETG', 'Glass'] },

  // --- Européennes ---
  { name: 'AzureFilm', refs: ['PLA', 'Silk PLA', 'PETG', 'ABS Plus', 'ASA', 'Flexible', 'PVA'] },
  { name: 'Filamentree' },
  { name: 'GST3D' },
  { name: '3D4Makers', refs: ['PLA', 'PETG', 'PEEK', 'PEKK', 'PEI Ultem', 'PPSU', 'PCL Facilan'] },
  { name: 'Ockert' },
  { name: 'Jama3D', refs: ['PLA', 'PETG'] },
  { name: 'Octofiber', refs: ['PLA', 'PETG', 'ABS'] },
  { name: 'Herz' },
  { name: 'Nobufil', refs: ['PLA', 'PETG', 'ASA', 'ABS'] },
  { name: 'Treed Filaments', refs: ['PLA', 'PETG', 'Monumental', 'Thunder ASA'] },
  { name: 'FiloAlfa', refs: ['PLA', 'ABS', 'Grafylon', 'ALFAPRO', 'Thermec ZED'] },
  { name: 'Eumakers', refs: ['PLA', 'PETG', 'ABS'] },
  { name: 'Winkle', refs: ['PLA HD', 'PLA 870', 'PETG', 'TitanX', 'Flexible'] },
  { name: 'ROSA3D', refs: ['PLA Starter', 'PLA Speed', 'PETG Standard', 'ASA', 'ABS+', 'PLA Magic Silk', 'PCTG'] },
  { name: 'Noctuo', refs: ['PLA', 'PETG', 'ABS', 'Nylon'] },
  { name: 'Print-Me', refs: ['Ecoline PLA', 'Swift PETG', 'Smooth ABS', 'Nylon'] },
  { name: '3DGence', refs: ['PLA', 'PET-G', 'ABS', 'ESD', 'PA6/66'] },
  { name: 'Plasty Mladeč', refs: ['PLA', 'PETG', 'ABS'] },
  { name: 'Refil', refs: ['rPLA', 'rPETG', 'rABS', 'rHIPS'] },
  { name: 'Reflow', refs: ['PLA', 'rPETG', 'PETG'] },
  { name: 'Nefila' },
  { name: 'FilRight', refs: ['Pro PLA', 'Pro PETG', 'Eco PLA'] },
  { name: 'Fil-A-Gehr' },
  { name: 'Spoolworks', refs: ['Edge', 'Scaffold'] },
  { name: '123-3D', refs: ['Jupiter PLA', 'PETG', 'ABS'] },
  { name: 'Voolt3D', refs: ['PLA', 'PETG', 'ABS'] },

  // --- Françaises ---
  { name: 'Francofil', refs: ['PLA', 'PLA Recyclé', 'PETG', 'ABS', 'Coquille d’huître', 'Marc de café', 'TPU'] },
  { name: 'Arianeplast', refs: ['PLA', 'PLA Recyclé', 'PETG', 'ABS', 'TPU'] },
  { name: 'Dailyfil', refs: ['PLA', 'PETG', 'ABS'] },
  { name: 'Filimprimante3D', refs: ['PLA', 'PETG', 'ABS', 'TPU', 'Nylon'] },
  { name: 'Filo3D', refs: ['PLA', 'PETG'] },
  { name: 'FilamentOne', refs: ['PLA Pro', 'PETG', 'ABS'] },
  { name: 'Kimya (Armor)', refs: ['PLA-R', 'PETG-R', 'ABS Kimya', 'ABS-ESD', 'PC-FR', 'PEKK-A', 'PEKK-SC', 'TPU-92A'] },
  { name: 'Nanovia', refs: ['PLA', 'PETG', 'PC', 'PA Carbone', 'ABS ESD', 'PEKK', 'PEI'] },
  { name: 'Polyfab3D', refs: ['PLA', 'PETG'] },
  { name: 'Neofil3D', refs: ['PLA', 'PETG', 'ABS'] },
  { name: 'eMotion Tech', refs: ['PLA', 'PETG', 'ABS'] },

  // --- Chinoises / e-commerce grand public ---
  { name: 'Eryone', refs: ['PLA', 'Matte PLA', 'Silk PLA', 'Dual Color PLA', 'PETG', 'ABS', 'TPU', 'Wood', 'PLA-CF'] },
  { name: 'AMOLEN', refs: ['Silk PLA', 'Matte PLA', 'Marble PLA', 'Wood PLA', 'Glow PLA', 'PETG'] },
  { name: 'JAYO', refs: ['PLA', 'PLA Meta', 'Silk PLA', 'Matte PLA', 'PETG', 'ABS'] },
  { name: 'Geeetech', refs: ['PLA', 'Silk PLA', 'PETG'] },
  { name: 'GIANTARM', refs: ['PLA', 'PETG'] },
  { name: 'ZIRO', refs: ['PLA', 'Silk PLA', 'Marble PLA', 'TPU'] },
  { name: 'MIKA3D', refs: ['Silk PLA', 'Matte PLA', 'Glow PLA'] },
  { name: 'TTYT3D', refs: ['Silk PLA', 'Shiny Silk PLA'] },
  { name: 'DURAMIC 3D', refs: ['PLA', 'Matte PLA', 'Silk PLA', 'PETG', 'TPU'] },
  { name: 'TECBEARS', refs: ['PLA', 'PETG'] },
  { name: 'Comgrow', refs: ['PLA', 'Silk PLA', 'PETG'] },
  { name: 'YOUSU', refs: ['PLA', 'Silk PLA', 'Marble PLA', 'PETG'] },
  { name: 'HELLO3D', refs: ['PLA', 'Silk PLA'] },
  { name: 'R3D', refs: ['PLA', 'PLA+', 'PETG'] },
  { name: 'ZYLtech', refs: ['PLA', 'PETG', 'ABS'] },
  { name: 'Tinmorry', refs: ['PLA', 'PETG', 'ABS', 'PA-CF', 'PA12-CF'] },
  { name: 'Kexcelled', refs: ['PLA K5', 'PLA Silk', 'PETG K6', 'ABS K8', 'ASA', 'PA-CF', 'TPU'] },
  { name: 'iSANMATE', refs: ['PLA-CF', 'PETG-CF', 'PA-CF', 'PAHT-CF', 'PET-CF'] },
  { name: 'CCTREE', refs: ['PLA', 'Silk PLA', 'PETG', 'ABS'] },
  { name: 'Stronghero3D', refs: ['PLA', 'PETG', 'Marble PLA'] },
  { name: 'Pxmalion', refs: ['PLA', 'PETG'] },
  { name: 'Enotepad', refs: ['PLA', 'PETG'] },
  { name: 'Yoopai', refs: ['PLA', 'PETG'] },
  { name: 'Justmaker', refs: ['PLA', 'PETG'] },
  { name: 'Reprapper', refs: ['PLA', 'PETG', 'TPU'] },
  { name: 'Tianse', refs: ['PLA', 'PETG'] },
  { name: 'JAMGHE', refs: ['PLA', 'PETG'] },
  { name: '3D Best-Q', refs: ['PLA', 'PETG'] },
  { name: 'YOYI', refs: ['PLA', 'PETG'] },
  { name: 'Paramount 3D', refs: ['PLA', 'PETG', 'ABS'] },
  { name: 'IIID Max', refs: ['PLA', 'Silk PLA'] },
  { name: 'SainSmart', refs: ['PRO-3 PLA', 'TPU', 'PETG', 'PA-CF'] },

  // --- Flexibles / techniques spécialisés ---
  { name: 'NinjaTek', refs: ['NinjaFlex', 'Cheetah', 'Armadillo', 'Chinchilla', 'Eel', 'NinjaPLA'] },
  { name: 'Recreus (Filaflex)', refs: ['Filaflex 82A', 'Filaflex 95A', 'Filaflex 70A', 'Filaflex 60A', 'Filaflex ESD', 'PETG'] },
  { name: 'Taulman3D', refs: ['Nylon 645', 'Nylon 680', 'Bridge', 'Alloy 910', 'PCTPE', 'T-Glase'] },
  { name: 'Lay Filaments', refs: ['LayWood', 'LayFelt', 'LayBrick', 'Gel-Lay', 'PORO-LAY'] },
  { name: 'Multi3D (Electrifi)', refs: ['Electrifi Conductive'] },

  // --- Composites / haute performance / industriel ---
  {
    name: '3DXTech',
    refs: [
      'CarbonX PLA+CF', 'CarbonX Nylon+CF', 'CarbonX PETG+CF', 'CarbonX ABS+CF', 'CarbonX PC+CF',
      'CarbonX PEEK+CF', 'CarbonX PEKK+CF', 'ThermaX PEEK', 'ThermaX PEKK', 'ThermaX PEI 9085',
      'ThermaX PPSU', 'FibreX ABS+GF', 'FibreX Nylon+GF', 'EcoMax PLA', 'FluorX PVDF', 'ESD-SafeX',
    ],
  },
  { name: 'BASF Ultrafuse', refs: ['PLA', 'PET', 'PAHT CF15', 'PP GF30', 'TPU 64D', 'TPU 85A', '17-4 PH Metal', '316L Metal', 'rPET'] },
  { name: 'Forward AM', refs: ['Ultrafuse PA', 'Ultrafuse PAHT', 'Ultrafuse ASA', 'Ultrafuse PC/ABS'] },
  { name: 'Essentium', refs: ['PLA', 'PCTG', 'HTN-CF25', 'PEEK', 'PEKK', 'TPU 58D', 'Z-V0 PESU'] },
  { name: 'Roboze', refs: ['Carbon PA', 'Carbon PEEK', 'PEEK', 'ULTEM AM9085F', 'Helios PEEK 2005', 'PPS-CF'] },
  { name: 'Intamsys', refs: ['PEEK', 'PEKK', 'PEI Ultem', 'PPSU', 'PC', 'Nylon-CF'] },
  { name: 'Apium', refs: ['PEEK 450', 'PEEK-CF', 'PEI', 'PVDF'] },
  { name: 'Markforged', refs: ['Onyx', 'Onyx FR', 'Nylon White', 'Carbon Fiber', 'Kevlar', 'Fiberglass', 'HSHT Fiberglass'] },
  { name: 'Stratasys', refs: ['ABS-M30', 'ASA', 'ULTEM 9085', 'ULTEM 1010', 'Nylon 12CF', 'PC', 'Antero PEKK'] },
  { name: 'Nexa3D' },
  { name: 'Mitsubishi Chemical (KyronMAX)', refs: ['KyronMAX S-2032', 'KyronMAX P-6035'] },
  { name: 'Arkema', refs: ['Rilsan PA11', 'Kepstan PEKK', 'Pebax', 'FluoreX PVDF'] },
  { name: 'Solvay', refs: ['KetaSpire PEEK-CF', 'Radel PPSU', 'AvaSpire PAEK'] },
  { name: 'Victrex', refs: ['PEEK AM 200', 'PAEK'] },
  { name: 'DSM / Novamid', refs: ['Novamid ID1030', 'Novamid ID1070', 'Arnitel ID2045'] },
  { name: 'Lehvoss (Luvocom 3F)', refs: ['PAHT CF', 'PEEK CF', 'PET CF', 'PP CF'] },
  { name: 'Owens Corning (XSTRAND)', refs: ['GF30-PP', 'GF30-PA6', 'GF30-PA12'] },
  { name: 'Jabil', refs: ['PA4035', 'PETg 0800', 'TPE SEBS', 'PK 5000'] },
  { name: 'Covestro', refs: ['Addigy PC', 'Addigy TPU', 'Arnite PET'] },
  { name: 'SABIC', refs: ['ULTEM PEI', 'LEXAN PC', 'NORYL PPE'] },
  { name: 'Evonik', refs: ['INFINAM PEEK', 'VESTAMID PA12'] },
  { name: 'Ensinger', refs: ['TECAFIL PEEK CF', 'TECAFIL PA12'] },

  // --- Recyclé / durable ---
  { name: 'B-PET', refs: ['rPET'] },
  { name: 'Formfutura ReForm', refs: ['rPLA', 'rTitan ABS', 'rPETG'] },

  // --- Divers ---
  { name: 'Siraya Tech', refs: ['Apex PLA', 'Blu PETG', 'Ultra PETG'] },
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
