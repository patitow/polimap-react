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

export const PoiMarker: React.FC<PoiMarkerProps> = ({
  position,
  color = '#22d3ee',
  onChange,
}) => {
  const meshRef = useRef<Mesh>(null)
  const readyRef = useRef(false)

  // Mantém a posição do gizmo sempre em sincronia com o estado
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.position.set(position.x, position.y, position.z)
      // Marca que já sincronizamos pelo menos uma vez com o estado,
      // evitando sobrescrever o interest_point com (0,0,0) no primeiro frame.
      readyRef.current = true
    }
  }, [position.x, position.y, position.z])

  // Atualiza o estado apenas quando o usuário efetivamente move o gizmo
  useFrame(() => {
    if (!meshRef.current || !readyRef.current) return
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
