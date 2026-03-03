import { useGLTF } from '@react-three/drei'
import { RigidBody } from '@react-three/rapier'
import { useEffect } from 'react'

interface MapProps {
  model: string
  scale?: number | [number, number, number]
  position?: [number, number, number]
}

export const Map: React.FC<MapProps> = ({
  model,
  scale = 1,
  position = [0, 0, 0],
  ...props
}) => {
  const { scene } = useGLTF(model)

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as { isMesh?: boolean }).isMesh) {
        const mesh = child as { castShadow: boolean; receiveShadow: boolean }
        mesh.castShadow = true
        mesh.receiveShadow = true
      }
    })
  }, [scene])

  return (
    <group name="MapCollision" scale={Array.isArray(scale) ? scale : [scale, scale, scale]} position={position} {...props}>
      <RigidBody type="fixed" colliders="trimesh">
        <primitive object={scene} />
      </RigidBody>
    </group>
  )
}
