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

/** Mantido por compatibilidade, mas os interest_point já estão em coordenadas de mundo (Godot). */
export function modelToWorld(
  p: { x: number; y: number; z: number },
  _config: MapConfig
): { x: number; y: number; z: number } {
  return p
}

/** @deprecated: interest_point já estão em world space; usar direto. */
export function scalePosition(p: { x: number; y: number; z: number }) {
  return p
}
