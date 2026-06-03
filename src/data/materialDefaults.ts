// ---------------------------------------------------------------------------
// Températures buse indicatives par matière (°C), pour pré-remplir le champ
// d'une recette à la sélection du matériau. Valeurs courantes « point de
// départ » — l'utilisateur ajuste toujours selon sa marque / machine.
// ---------------------------------------------------------------------------

export const NOZZLE_DEFAULTS: Record<string, number> = {
  // Standards
  pla: 210, plaplus: 215, petg: 240, pet: 250, pctg: 250, cpe: 250, pvb: 215, pha: 200,
  // Flexibles
  tpu: 230, tpu85: 230, tpe: 230, tpc: 240, peba: 240,
  // Techniques
  abs: 250, asa: 250, pa: 260, pa6: 270, pa11: 250, pa12: 260,
  pc: 270, pcabs: 260, pom: 240, pp: 230, pmma: 250, pvdf: 250,
  // Composites
  placf: 215, petgcf: 250, petcf: 260, abscf: 255, asacf: 255, pacf: 270,
  paht: 290, pagf: 270, pccf: 280, ppacf: 300, ppcf: 240, ppgf: 240,
  peekcf: 400, wood: 210, metal: 215,
  // Haute température
  ppa: 300, peek: 400, pekk: 360, pei: 380, ppsu: 380, psu: 370, pesu: 370, pps: 320, lcp: 350,
  // Spéciaux
  conductive: 230, esd: 250, fr: 250,
  // Supports
  pva: 200, bvoh: 215, hips: 240, breakaway: 240,
};

export function defaultNozzle(materialId: string): number | undefined {
  return NOZZLE_DEFAULTS[materialId];
}
