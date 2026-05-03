/** 常用单位换算（相对 SI 基准量存储） */

export type UnitDimension = 'length' | 'mass' | 'volume' | 'area' | 'time'

const LENGTH_TO_M: Record<string, number> = {
  m: 1,
  km: 1000,
  cm: 0.01,
  mm: 0.001,
  mi: 1609.344,
  yd: 0.9144,
  ft: 0.3048,
  in: 0.0254,
}

const MASS_TO_KG: Record<string, number> = {
  kg: 1,
  g: 0.001,
  mg: 1e-6,
  t: 1000,
  lb: 0.45359237,
  oz: 0.028349523125,
}

const VOLUME_TO_L: Record<string, number> = {
  l: 1,
  ml: 0.001,
  'm3': 1000,
  gal_us: 3.785411784,
  ft3: 28.316846592e-3 * 1000,
}

const AREA_TO_M2: Record<string, number> = {
  m2: 1,
  km2: 1e6,
  cm2: 1e-4,
  ft2: 0.09290304,
  ac: 4046.8564224,
  ha: 10000,
}

const TIME_TO_S: Record<string, number> = {
  s: 1,
  min: 60,
  h: 3600,
  d: 86400,
  wk: 604800,
  y: 31557600,
}

const DIM_MAP: Record<UnitDimension, Record<string, number>> = {
  length: LENGTH_TO_M,
  mass: MASS_TO_KG,
  volume: VOLUME_TO_L,
  area: AREA_TO_M2,
  time: TIME_TO_S,
}

export function unitsForDimension(d: UnitDimension): string[] {
  return Object.keys(DIM_MAP[d])
}

export function convertUnit(
  value: number,
  dimension: UnitDimension,
  fromUnit: string,
  toUnit: string
): number | null {
  const map = DIM_MAP[dimension]
  const f = map[fromUnit]
  const t = map[toUnit]
  if (f == null || t == null || !Number.isFinite(value)) return null
  const base = value * f
  return base / t
}
