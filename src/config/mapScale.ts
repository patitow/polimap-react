/**
 * Fator de escala para alinhar com Godot (mapa React era ~10x maior).
 * interest_point está em coordenadas locais do modelo.
 * world = model_local * scale + position
 */
export const MAP_SCALE_FACTOR = 0.1

export interface MapConfig {
  scale: number
  position: [number, number, number]
}

let mapsCache: Record<string, MapConfig> | null = null

export async function getMapsConfig(): Promise<Record<string, MapConfig>> {
  if (mapsCache) return mapsCache
  const res = await fetch('/config/maps.json')
  const data = await res.json()
  mapsCache = data.maps ?? {}
  return mapsCache
}

/** Converte coordenadas locais do modelo para mundo usando config do mapa */
export function modelToWorld(
  p: { x: number; y: number; z: number },
  config: MapConfig
): { x: number; y: number; z: number } {
  return {
    x: p.x * config.scale + config.position[0],
    y: p.y * config.scale + config.position[1],
    z: p.z * config.scale + config.position[2],
  }
}

/** @deprecated Use modelToWorld com config do mapa. Mantido para spawn. */
export function scalePosition(p: { x: number; y: number; z: number }) {
  return {
    x: p.x * MAP_SCALE_FACTOR,
    y: p.y * MAP_SCALE_FACTOR,
    z: p.z * MAP_SCALE_FACTOR,
  }
}
