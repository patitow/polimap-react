import { Coordinate } from './coordinates'
import { Gate } from './gate'

export interface Room {
  id: string
  name: string
  model_path: string
  interest_point: Coordinate
  gates: Gate[]
}
