import { useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { Vector3 } from 'three'
import type { Room } from '@/types/room'

interface PoiIndicatorProps {
  room: Room
  isNearest: boolean
  distance: number
}

const INTERACTION_DISTANCE = 3.5
const LABEL_DISTANCE = 10

export function PoiIndicator({ room, isNearest, distance }: PoiIndicatorProps) {
  const pos = useMemo(() => new Vector3(room.interest_point.x, room.interest_point.y + 0.5, room.interest_point.z), [room.interest_point])

  const isNear = isNearest && distance < INTERACTION_DISTANCE
  const showLabel = distance < LABEL_DISTANCE

  if (!showLabel) return null

  return (
    <group position={pos}>
      {/* Marcador Visual */}
      <mesh>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial 
          color={isNear ? "#fbbf24" : "#22d3ee"} 
          emissive={isNear ? "#fbbf24" : "#22d3ee"} 
          emissiveIntensity={isNear ? 4 : 1.5} 
        />
      </mesh>

      {/* Label UI - zIndexRange baixo para ficar SEMPRE abaixo de modais/menus (z >= 100) */}
      <Html
        distanceFactor={10}
        position={[0, 0.4, 0]}
        center
        zIndexRange={[0, 10]}
        style={{ pointerEvents: 'none' }}
      >
        <div
          className={`flex flex-col items-center gap-1 transition-all duration-300 ${
            isNear ? 'scale-110 opacity-100' : 'opacity-60'
          }`}
        >
          <div
            className={`rounded-lg px-2 py-1 backdrop-blur-md border transition-colors ${
              isNear
                ? 'bg-amber-500/90 border-amber-400'
                : 'bg-black/50 border-white/10'
            }`}
          >
            <p className={`whitespace-nowrap text-[10px] font-black tracking-tight shadow-sm ${isNear ? 'text-slate-900' : 'text-white'}`}>
              {room.name}
            </p>
          </div>
          {isNear && (
            <div className="animate-bounce rounded-full bg-amber-400 px-2 py-0.5 text-[8px] font-black text-slate-900 shadow-xl border-2 border-white/30">
              [E] INTERAGIR
            </div>
          )}
        </div>
      </Html>
    </group>
  )
}

export function PoiIndicators({ rooms, playerPositionRef }: { 
  rooms: Room[], 
  playerPositionRef: React.RefObject<Vector3>,
  onInteract?: (room: Room) => void 
}) {
  const [nearestId, setNearestId] = useState<string | null>(null)
  const [distances, setDistances] = useState<Record<string, number>>({})

  useFrame(() => {
    if (!playerPositionRef.current) return
    const playerPos = playerPositionRef.current

    let minHighlightDist = Infinity
    let bestId = null
    const newDistances: Record<string, number> = {}

    for (const room of rooms) {
      const roomPos = new Vector3(room.interest_point.x, room.interest_point.y, room.interest_point.z)
      const d = playerPos.distanceTo(roomPos)
      newDistances[room.id] = d

      if (d < minHighlightDist) {
        minHighlightDist = d
        bestId = room.id
      }
    }

    if (bestId !== nearestId) {
      setNearestId(bestId)
    }
    
    // Solo atualizamos o estado se houve uma mudança "perceptível" na distância para evitar over-renders
    // ou se cruzamos o limite de interação/label
    const hasSignificantChange = Object.keys(newDistances).some(id => {
      const oldD = distances[id] || 0
      const newD = newDistances[id]
      return Math.abs(oldD - newD) > 0.1 // 10cm de precisão é suficiente para a UI
    })

    if (hasSignificantChange || bestId !== nearestId) {
      setDistances(newDistances)
    }
  })

  return (
    <>
      {rooms.map((room) => (
        <PoiIndicator 
          key={room.id} 
          room={room} 
          isNearest={room.id === nearestId}
          distance={distances[room.id] || 100}
        />
      ))}
    </>
  )
}
