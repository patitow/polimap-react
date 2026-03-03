import { modelToWorld } from './mapScale'

/**
 * Spawn na Entrada principal - área externa aberta, longe de prédios.
 * Y alto para nascer acima do chão e cair (evita spawn dentro do mapa).
 */
const SPAWN_MODEL = { x: -8.43, y: 5, z: -16.75 } as const
const POLI_OVERWORLD_CONFIG = { scale: 0.3, position: [-0.6, -0.8, 0] as const }
export const DEFAULT_SPAWN = modelToWorld(SPAWN_MODEL, POLI_OVERWORLD_CONFIG)
