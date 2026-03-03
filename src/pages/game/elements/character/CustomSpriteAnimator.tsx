import { useEffect, useState, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Euler } from 'three'
import type { Texture, Mesh, MeshBasicMaterial } from 'three'

interface SpriteDataset {
  spriteTexture: Texture
  spriteData: {
    frames: Record<string, { frame: { x: number; y: number; w: number; h: number } }>
    meta: { size: { w: number; h: number } }
  }
}

interface CustomSpriteAnimatorProps {
  autoPlay?: boolean
  loop?: boolean
  fps?: number
  spriteDataset: SpriteDataset
  frameName?: string
  flipX?: boolean
  alphaTest?: number
  scale?: number
}

export function CustomSpriteAnimator({
  autoPlay = true,
  loop = true,
  fps = 12,
  spriteDataset,
  frameName = 'down_idle',
  flipX = false,
  alphaTest = 0.001,
  scale = 1,
  ...props
}: CustomSpriteAnimatorProps & React.ComponentProps<'group'>) {
  const { spriteTexture, spriteData } = spriteDataset
  const materialRef = useRef<MeshBasicMaterial | null>(null)
  const meshRef = useRef<Mesh | null>(null)
  const { camera } = useThree()

  const [framesForAnim, setFramesForAnim] = useState<string[]>([])
  useEffect(() => {
    const parts = frameName.split('_')
    const dir = parts[0]
    const type = parts[1]
    if (type === 'idle') {
      setFramesForAnim([`${dir}_idle`])
    } else if (type === 'walk') {
      setFramesForAnim([`${dir}_walk1`, `${dir}_walk2`])
    } else {
      setFramesForAnim([`${dir}_idle`])
    }
  }, [frameName])

  const [currentFrameIdx, setCurrentFrameIdx] = useState(0)
  const elapsedRef = useRef(0)

  useFrame((_state, delta) => {
    if (autoPlay && framesForAnim.length > 0 && spriteData) {
      elapsedRef.current += delta
      if (elapsedRef.current >= 1 / fps) {
        elapsedRef.current = 0
        let nextIdx = currentFrameIdx + 1
        if (nextIdx >= framesForAnim.length) {
          nextIdx = loop ? 0 : currentFrameIdx
        }
        setCurrentFrameIdx(nextIdx)
      }

      const frameKey = framesForAnim[currentFrameIdx]
      const frameData = spriteData.frames[frameKey]
      if (frameData && materialRef.current?.map) {
        const { x, y, w, h } = frameData.frame
        const texWidth = spriteData.meta.size.w
        const texHeight = spriteData.meta.size.h
        const offsetX = x / texWidth
        const offsetY = 1 - (y + h) / texHeight
        const repeatX = w / texWidth
        const repeatY = h / texHeight
        materialRef.current.map.offset.set(offsetX, offsetY)
        materialRef.current.map.repeat.set(repeatX, repeatY)
        materialRef.current.map.needsUpdate = true
      }
    }

    if (meshRef.current && camera) {
      meshRef.current.quaternion.copy(camera.quaternion)
      const euler = new Euler().setFromQuaternion(meshRef.current.quaternion)
      euler.y = 0
      meshRef.current.quaternion.setFromEuler(euler)
    }
  })

  return (
    <group {...props} scale={flipX ? [-scale, scale, scale] : [scale, scale, scale]}>
      <mesh ref={meshRef}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          ref={materialRef}
          map={spriteTexture}
          transparent
          alphaTest={alphaTest}
        />
      </mesh>
    </group>
  )
}
