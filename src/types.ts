// Modèle de données de Table-Mat.
// Tout est typé pour faciliter le futur branchement à un vrai backend.

export type MaterialId = string;

export type MaterialFamily =
  | 'standard'
  | 'technique'
  | 'flexible'
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
  | 'ERCF' // Enraged Rabbit Carrot Feeder (Voron)
  | 'Dual'; // double extrudeur classique

export interface Machine {
  id: string;
  name: string;
  system: MachineSystem;
}

/** Critères du protocole de notation, chacun noté de 0 à 5. */
export interface CriteriaRatings {
  /** Adhérence/solidité de la liaison entre les deux matériaux. */
  interfaceAdhesion: number;
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

export interface PrintParams {
  nozzleTempA: number; // °C
  nozzleTempB: number; // °C
  bedTemp: number; // °C
  chamberTemp?: number; // °C (caisson)
  layerHeight: number; // mm
  printSpeed: number; // mm/s
  nozzleDiameter: number; // mm
  purgeVolume?: number; // mm³ purgés au changement
  interfaceLayers?: number; // nb de couches d'interface
}

export interface Attempt {
  id: string;
  materialA: MaterialId;
  materialB: MaterialId;
  brandA: string;
  brandB: string;
  machineId: string;
  author: string;
  date: string; // ISO 8601
  ratings: CriteriaRatings;
  params: PrintParams;
  notes: string;
  /** Votes communautaires « ça marche aussi chez moi ». */
  votesUp: number;
  /** Votes communautaires « ça n'a pas marché / trop de retouches ». */
  votesDown: number;
}

/** Vote de l'utilisateur courant pour cette session (état local). */
export type UserVote = 'up' | 'down' | null;
