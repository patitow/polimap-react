import { useRef } from 'react'
import { TransformControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import type { Gate } from '@/types/gate'

interface GateProps {
  gate: Gate
  onUpdate: (newGate: Gate) => void
}

export const GateComponent: React.FC<GateProps> = ({ gate, onUpdate }) => {
  const meshRef = useRef<import('three').Mesh>(null)

  useFrame(() => {
    if (meshRef.current) {
      const pos = meshRef.current.position
      onUpdate({ ...gate, coordinate: { x: pos.x, y: pos.y, z: pos.z } })
    }
  })

  return (
    <TransformControls>
      <mesh
        ref={meshRef}
        position={[gate.coordinate.x, gate.coordinate.y, gate.coordinate.z]}
      >
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="yellow" />
      </mesh>
    </TransformControls>
  )
}
