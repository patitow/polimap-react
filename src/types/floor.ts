import { Room } from './room'

export interface Floor {
  id: string
  name: string
  rooms: Room[]
}
