// Modèle de données de Table-Mat.
// Une "Recette" est un essai d'impression complet impliquant 2 à N matériaux.
// Chaque contact entre deux matériaux est une "Interface" (liaison), qui
// alimente une case de la matrice de compatibilité.

export type MaterialId = string;

export type MaterialFamily =
  | 'standard'
  | 'technique'
  | 'flexible'
  | 'composite'
  | 'haute-température'
  | 'spécial'
  | 'support';

export interface Material {
  id: MaterialId;
  /** Nom court affiché dans la matrice, ex. "PLA". */
  name: string;
  /** Nom complet, ex. "Acide polylactique". */
  fullName: string;
  family: MaterialFamily;
  /** Couleur d'accent de la pastille du matériau. */
  accent: string;
}

export type MachineSystem =
  | 'AMS' // Bambu Lab Automatic Material System
  | 'MMU' // Prusa Multi Material Unit
  | 'Toolchanger' // têtes interchangeables (Prusa XL, E3D)
  | 'IDEX' // double extrudeur indépendant
  | 'ERCF' // changeurs de filament type ERCF / BoxTurtle (Voron)
  | 'Dual' // double extrudeur classique
  | 'Palette'; // splicers Mosaic Palette / Element

export interface Machine {
  id: string;
  name: string;
  system: MachineSystem;
  /** Nombre maximum de matériaux gérés en un seul print. */
  maxMaterials: number;
}

/** Critères globaux d'une recette (l'adhérence est gérée par interface). */
export interface GlobalRatings {
  /** Qualité d'impression : état de surface, précision dimensionnelle. */
  printQuality: number;
  /** Fiabilité : taux de réussite, peu de retouches/réimpressions. */
  reliability: number;
  /** Tenue : résistance au warping et à la délamination. */
  warpResistance: number;
  /** Propreté de l'interface : absence de bavure / contamination de matière. */
  interfaceCleanliness: number;
  /** Séparabilité maîtrisée (utile pour supports solubles/détachables). */
  separability: number;
}

/** Notes complètes utilisées pour calculer un score (6 critères, 0–5). */
export interface CriteriaRatings extends GlobalRatings {
  /** Adhérence/solidité de la liaison entre deux matériaux. */
  interfaceAdhesion: number;
}

/** Un matériau utilisé dans une recette, avec sa marque et sa température buse. */
export interface MaterialSlot {
  material: MaterialId;
  brand: string;
  /** Température buse pour CE matériau (°C). */
  nozzleTemp: number;
  /** Référence / gamme du filament, ex. "PLA Basic", "Silk", "PolyTerra". */
  label?: string;
  /** Couleur du filament, ex. "rouge", "galaxy black". */
  color?: string;
}

/** Contact entre deux matériaux au sein d'une recette + sa note d'adhérence. */
export interface MaterialInterface {
  a: MaterialId;
  b: MaterialId;
  /** Adhérence de CE contact précis (0–5). */
  adhesion: number;
}

export interface PrintParams {
  bedTemp: number; // °C
  chamberTemp?: number; // °C (caisson)
  layerHeight: number; // mm
  printSpeed: number; // mm/s
  nozzleDiameter: number; // mm
  purgeVolume?: number; // mm³ purgés au changement
  interfaceLayers?: number; // nb de couches d'interface
}

export interface Recipe {
  id: string;
  /** Nom court de la recette, ex. "Buste multicolore + support". */
  title: string;
  /** Matériaux utilisés (2 à N). */
  slots: MaterialSlot[];
  /** Contacts réels entre matériaux + leur adhérence. */
  interfaces: MaterialInterface[];
  machineId: string;
  author: string;
  date: string; // ISO 8601
  /** Notes globales de la recette (hors adhérence). */
  global: GlobalRatings;
  params: PrintParams;
  notes: string;
  /** Votes communautaires « ça marche aussi chez moi ». */
  votesUp: number;
  /** Votes communautaires « ça n'a pas marché / trop de retouches ». */
  votesDown: number;
}

/** Vote de l'utilisateur courant pour cette session (état local). */
export type UserVote = 'up' | 'down' | null;
