import React, { useRef } from 'react'
import { TransformControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Gate } from '@/types/gate'

interface GateProps {
  gate: Gate
  onUpdate: (newGate: Gate) => void
}

export const GateComponent: React.FC<GateProps> = ({ gate, onUpdate }) => {
  const transformRef = useRef({ object: { position: { x: 0, y: 0, z: 0 } } })

  useFrame(() => {
    if (transformRef.current) {
      const pos = transformRef.current.object.position
      onUpdate({ ...gate, coordinate: { x: pos.x, y: pos.y, z: pos.z } })
    }
  })

  return (
    <TransformControls>
      <mesh ref={transformRef} position={[gate.coordinate.x, gate.coordinate.y, gate.coordinate.z]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="yellow" />
      </mesh>
    </TransformControls>
  )
}
