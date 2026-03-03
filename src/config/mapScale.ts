export interface MapConfig {
  scale: number
  position: [number, number, number]
}

let mapsCache: Record<string, MapConfig> | null = null

export async function getMapsConfig(): Promise<Record<string, MapConfig>> {
  if (mapsCache) return mapsCache
  const res = await fetch('/config/maps.json')
  const data = await res.json()
  mapsCache = (data.maps ?? {}) as Record<string, MapConfig>
  return mapsCache
}

/** Transforma coordenadas do modelo (Godot) para coordenadas de mundo (React/Three) aplicando escala e offset. */
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

/** @deprecated: usar modelToWorld com o config correto. */
export function scalePosition(p: { x: number; y: number; z: number }) {
  return p
}
