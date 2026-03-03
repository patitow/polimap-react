import { Coordinate } from './coordinates'
import { Gate } from './gate'

export interface PoiInfo {
  description?: string
  photos?: string[]
  curiosity?: string
  dates?: string
  sectors?: string
}

export interface Room {
  id: string
  name: string
  model_path: string
  interest_point: Coordinate
  gates: Gate[]
  poi?: PoiInfo
}
