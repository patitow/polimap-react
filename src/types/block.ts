import { Floor } from './floor'

export interface Block {
  id: string
  name: string
  floors: Floor[]
}
