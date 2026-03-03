import { useState, useEffect } from 'react'
import type { Block } from '@/types/block'
import type { Room } from '@/types/room'

let mapConfigCache: Block[] | null = null

export function useMapConfig() {
  const [blocks, setBlocks] = useState<Block[]>(mapConfigCache || [])
  const [loading, setLoading] = useState(!mapConfigCache)

  useEffect(() => {
    if (mapConfigCache) {
      setLoading(false)
      return
    }

    fetch('/config/map_points.json')
      .then((res) => res.json())
      .then((data) => {
        mapConfigCache = data
        setBlocks(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Erro ao carregar map_points.json:', err)
        setLoading(false)
      })
  }, [])

  const getRoomsForScene = (sceneId: string) => {
    const rooms: Room[] = []
    blocks.forEach((block) => {
      block.floors.forEach((floor) => {
        floor.rooms.forEach((room) => {
          if (room.model_path === sceneId) {
            rooms.push(room)
          }
        })
      })
    })
    return rooms
  }

  return { blocks, loading, getRoomsForScene }
}
