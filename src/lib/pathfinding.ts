import { Pathfinding } from 'three-pathfinding'
import type { BufferGeometry } from 'three'
import { Vector3 } from 'three'

const ZONE_ID = 'level'

let pathfindingInstance: Pathfinding | null = null

export function getPathfinding(): Pathfinding {
  if (!pathfindingInstance) {
    pathfindingInstance = new Pathfinding()
  }
  return pathfindingInstance
}

export function setNavmesh(geometry: BufferGeometry): boolean {
  try {
    const pf = getPathfinding()
    const zone = Pathfinding.createZone(geometry)
    pf.setZoneData(ZONE_ID, zone)
    return true
  } catch {
    return false
  }
}

export function findPath(
  start: { x: number; y: number; z: number },
  end: { x: number; y: number; z: number },
  mapScale: number,
  mapPosition: [number, number, number]
): { x: number; y: number; z: number }[] | null {
  const pf = getPathfinding()
  try {
    const startVec = new Vector3(start.x, start.y, start.z)
    const endVec = new Vector3(end.x, end.y, end.z)
    const groupID = pf.getGroup(ZONE_ID, startVec)
    const path = pf.findPath(startVec, endVec, ZONE_ID, groupID)
    if (!path || path.length === 0) return null
    return path.map((p) => ({
      x: p.x * mapScale + mapPosition[0],
      y: p.y * mapScale + mapPosition[1],
      z: p.z * mapScale + mapPosition[2],
    }))
  } catch {
    return null
  }
}

export function toMapLocal(
  world: { x: number; y: number; z: number },
  mapScale: number,
  mapPosition: [number, number, number]
): { x: number; y: number; z: number } {
  return {
    x: (world.x - mapPosition[0]) / mapScale,
    y: (world.y - mapPosition[1]) / mapScale,
    z: (world.z - mapPosition[2]) / mapScale,
  }
}

export function hasNavmesh(): boolean {
  try {
    const pf = getPathfinding()
    return (pf as { zones?: Record<string, unknown> }).zones?.[ZONE_ID] != null
  } catch {
    return false
  }
}
