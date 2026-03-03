import { TransformControls } from '@react-three/drei'
import { useState, useEffect, useRef } from 'react'
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
  const [mesh, setMesh] = useState<Mesh | null>(null)
  const isDragging = useRef(false)

  // Sincroniza a posição do mesh quando a prop 'position' mudar externamente (ex: via sidebar)
  useEffect(() => {
    if (mesh && !isDragging.current) {
      mesh.position.set(position.x, position.y, position.z)
    }
  }, [mesh, position.x, position.y, position.z])

  return (
    <>
      <mesh 
        ref={setMesh}
        position={[position.x, position.y, position.z]}
      >
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color={color} />
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
              onChange({ x, y, z })
            }
          }}
        />
      )}
    </>
  )
}