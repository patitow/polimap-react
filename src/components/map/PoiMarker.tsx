import { TransformControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef, useEffect } from 'react'
import type { Mesh } from 'three'
import type { Coordinate } from '@/types/coordinates'

interface PoiMarkerProps {
  position: Coordinate
  color?: string
  onChange: (position: Coordinate) => void
}

export const PoiMarker: React.FC<PoiMarkerProps> = ({ position, color = '#22d3ee', onChange }) => {
  const meshRef = useRef<Mesh>(null)

  // Mantém a posição inicial em sincronia com o estado
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.position.set(position.x, position.y, position.z)
    }
  }, [position.x, position.y, position.z])

  // Sempre que o usuário arrasta o marcador, refletimos no estado
  useFrame(() => {
    if (!meshRef.current) return
    const pos = meshRef.current.position
    if (pos.x !== position.x || pos.y !== position.y || pos.z !== position.z) {
      onChange({ x: pos.x, y: pos.y, z: pos.z })
    }
  })

  return (
    <TransformControls>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </TransformControls>
  )
}

