'use client'

import { useAnimations, useGLTF } from '@react-three/drei'
import { RigidBody } from '@react-three/rapier'
import { useEffect, useRef } from 'react'

interface MapProps {
  model: string
  scale?: number | [number, number, number]
  position?: [number, number, number]
}

export const Map: React.FC<MapProps> = ({ model, scale = 1, position = [0, 0, 0], ...props }) => {
  const { scene, animations } = useGLTF(model)
  const group = useRef<any>(null)
  const { actions } = useAnimations(animations, group)

  useEffect(() => {
    scene.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
  }, [scene])

  useEffect(() => {
    if (actions && animations.length > 0) {
      // Toca a primeira animação encontrada
      actions[animations[0].name]?.play()
    }
  }, [actions, animations])

  return (
    <group scale={scale} position={position} {...props}>
      <RigidBody type="fixed" colliders="trimesh">
        <primitive object={scene} ref={group} />
      </RigidBody>
    </group>
  )
}

export default Map
