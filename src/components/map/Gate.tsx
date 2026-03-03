import { useState, useEffect, useRef } from 'react'
import { TransformControls } from '@react-three/drei'
import type { Mesh } from 'three'
import type { Gate } from '@/types/gate'

interface GateProps {
  gate: Gate
  onUpdate: (newGate: Gate) => void
}

export const GateComponent: React.FC<GateProps> = ({ gate, onUpdate }) => {
  const [mesh, setMesh] = useState<Mesh | null>(null)
  const isDragging = useRef(false)

  // Sincroniza a posição do mesh quando a coordenada do gate mudar externamente
  useEffect(() => {
    if (mesh && !isDragging.current) {
      mesh.position.set(gate.coordinate.x, gate.coordinate.y, gate.coordinate.z)
    }
  }, [mesh, gate.coordinate.x, gate.coordinate.y, gate.coordinate.z])

  return (
    <>
      <mesh
        ref={setMesh}
        position={[gate.coordinate.x, gate.coordinate.y, gate.coordinate.z]}
      >
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="yellow" />
      </mesh>

      {mesh && (
        <TransformControls
          object={mesh}
          onMouseDown={() => {
            isDragging.current = true
          }}
          onMouseUp={() => {
            isDragging.current = false
            if (mesh) {
              const { x, y, z } = mesh.position
              onUpdate({ ...gate, coordinate: { x, y, z } })
            }
          }}
        />
      )}
    </>
  )
}