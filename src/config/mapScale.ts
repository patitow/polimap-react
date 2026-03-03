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
