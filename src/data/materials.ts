import type { Material, Machine } from '../types';

export const MATERIALS: Material[] = [
  { id: 'pla', name: 'PLA', fullName: 'Acide polylactique', family: 'standard', accent: '#22c55e' },
  { id: 'petg', name: 'PETG', fullName: 'Polyéthylène téréphtalate glycolisé', family: 'standard', accent: '#38bdf8' },
  { id: 'abs', name: 'ABS', fullName: 'Acrylonitrile butadiène styrène', family: 'technique', accent: '#f97316' },
  { id: 'asa', name: 'ASA', fullName: 'Acrylonitrile styrène acrylate', family: 'technique', accent: '#fb7185' },
  { id: 'tpu', name: 'TPU', fullName: 'Polyuréthane thermoplastique', family: 'flexible', accent: '#a78bfa' },
  { id: 'pa', name: 'PA', fullName: 'Polyamide (Nylon)', family: 'technique', accent: '#eab308' },
  { id: 'pc', name: 'PC', fullName: 'Polycarbonate', family: 'technique', accent: '#60a5fa' },
  { id: 'pva', name: 'PVA', fullName: 'Alcool polyvinylique (support soluble)', family: 'support', accent: '#34d399' },
];

export const MACHINES: Machine[] = [
  { id: 'x1c', name: 'Bambu Lab X1 Carbon + AMS', system: 'AMS' },
  { id: 'p1s', name: 'Bambu Lab P1S + AMS', system: 'AMS' },
  { id: 'mk4', name: 'Prusa MK4 + MMU3', system: 'MMU' },
  { id: 'xl', name: 'Prusa XL (toolchanger 5T)', system: 'Toolchanger' },
  { id: 'voron', name: 'Voron 2.4 + ERCF', system: 'ERCF' },
  { id: 'sovol', name: 'Sovol SV04 (IDEX)', system: 'IDEX' },
  { id: 'ums5', name: 'Ultimaker S5', system: 'Dual' },
];

const materialById = new Map(MATERIALS.map((m) => [m.id, m]));
const machineById = new Map(MACHINES.map((m) => [m.id, m]));

export function getMaterial(id: string): Material | undefined {
  return materialById.get(id);
}

export function getMachine(id: string): Machine | undefined {
  return machineById.get(id);
}
