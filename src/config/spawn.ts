/**
 * Spawn na Entrada principal - área externa aberta, longe de prédios.
 * Y alto para nascer acima do chão e cair (evita spawn dentro do mapa).
 */
const SPAWN_MODEL = { x: -8.43, y: 5, z: -16.75 }

// Coordenadas já estão em world space (Godot); usamos direto.
export const DEFAULT_SPAWN = SPAWN_MODEL
