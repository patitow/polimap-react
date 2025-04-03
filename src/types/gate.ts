import { Coordinate } from "./coordinates"

export interface Gate {
  id: string
  coordinate: Coordinate
  destination: {
    room: string
    gate: string
  } | null
}