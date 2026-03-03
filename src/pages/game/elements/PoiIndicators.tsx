import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { Vector3 } from 'three'
import type { Room } from '@/types/room'
import { MapPin } from 'lucide-react'

interface PoiIndicatorProps {
  room: Room
  playerPosition: Vector3
  onInteract: (room: Room) => void
}

const INTERACTION_DISTANCE = 3
const LABEL_DISTANCE = 8

export function PoiIndicator({ room, playerPosition, onInteract }: PoiIndicatorProps) {
  const [dist, setDistance] = useState(100)
  const pos = new Vector3(room.interest_point.x, room.interest_point.y + 0.5, room.interest_point.z)

  useFrame(() => {
    setDistance(playerPosition.distanceTo(pos))
  })

  const isNear = dist < INTERACTION_DISTANCE
  const showLabel = dist < LABEL_DISTANCE

  if (!showLabel) return null

  return (
    <group position={pos}>
      {/* Marcador Visual */}
      <mesh>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial 
          color={isNear ? "#fbbf24" : "#22d3ee"} 
          emissive={isNear ? "#fbbf24" : "#22d3ee"} 
          emissiveIntensity={2} 
        />
      </mesh>

      {/* Label UI */}
      <Html distanceFactor={10} position={[0, 0.5, 0]} center>
        <div className={`flex flex-col items-center gap-1 transition-opacity duration-300 ${isNear ? 'opacity-100' : 'opacity-70'}`}>
          <div className="rounded-lg bg-black/60 px-2 py-1 backdrop-blur-sm">
            <p className="whitespace-nowrap text-[10px] font-bold text-white shadow-sm">
              {room.name}
            </p>
          </div>
          {isNear && (
            <div className="animate-bounce rounded bg-amber-500 px-1.5 py-0.5 text-[8px] font-black text-slate-900 shadow-lg">
              [E] INTERAGIR
            </div>
          )}
        </div>
      </Html>
    </group>
  )
}

export function PoiIndicators({ rooms, playerPosition, onInteract }: { 
  rooms: Room[], 
  playerPosition: Vector3,
  onInteract: (room: Room) => void 
}) {
  return (
    <>
      {rooms.map((room) => (
        <PoiIndicator 
          key={room.id} 
          room={room} 
          playerPosition={playerPosition} 
          onInteract={onInteract}
        />
      ))}
    </>
  )
}
