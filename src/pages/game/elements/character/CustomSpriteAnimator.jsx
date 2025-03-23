import React, { useEffect, useState, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Euler, Vector3 } from 'three'

export function CustomSpriteAnimator({
  autoPlay = true,
  loop = true,
  fps = 12,
  spriteDataset, // { spriteTexture, spriteData }
  frameName = 'down_idle', // exemplo: "up_idle", "up_walk", etc.
  flipX = false,
  alphaTest = 0.001,
  scale = 1,
  ...props
}) {
  const { spriteTexture, spriteData } = spriteDataset
  const materialRef = useRef()
  const meshRef = useRef()
  const { camera } = useThree()

  // Define os frames a partir do frameName.
  // Se for idle, usamos apenas o frame "<dir>_idle"
  // Se for walk, assumimos que queremos usar os frames "<dir>_walk1" e "<dir>_walk2"
  const [framesForAnim, setFramesForAnim] = useState([])
  useEffect(() => {
    let animFrames = []
    const parts = frameName.split('_')
    const dir = parts[0] // "up", "down", "left", "right"
    const type = parts[1] // "idle" ou "walk"
    if (type === 'idle') {
      animFrames = [`${dir}_idle`]
    } else if (type === 'walk') {
      animFrames = [`${dir}_walk1`, `${dir}_walk2`]
    }
    setFramesForAnim(animFrames)
  }, [frameName])

  const [currentFrameIdx, setCurrentFrameIdx] = useState(0)
  const elapsedRef = useRef(0)

  useFrame((state, delta) => {
    // Atualiza a animação se autoPlay estiver ativo
    if (autoPlay && framesForAnim.length > 0) {
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
      if (frameData && materialRef.current) {
        const { x, y, w, h } = frameData.frame
        const texWidth = spriteData.meta.size.w
        const texHeight = spriteData.meta.size.h
        // Como Three.js tem (0,0) no canto inferior esquerdo:
        const offsetX = x / texWidth
        const offsetY = 1 - (y + h) / texHeight
        const repeatX = w / texWidth
        const repeatY = h / texHeight
        materialRef.current.map.offset.set(offsetX, offsetY)
        materialRef.current.map.repeat.set(repeatX, repeatY)
        materialRef.current.map.needsUpdate = true
      }
    }

    // Força o sprite a ficar de frente para a câmera.
    // Como o sprite foi desenhado para apontar para +Z,
    // copiamos a quaternion da câmera, mas removemos a rotação em Y.
    if (meshRef.current && camera) {
      meshRef.current.quaternion.copy(camera.quaternion)
      const euler = new Euler().setFromQuaternion(meshRef.current.quaternion)
      // Zera a rotação em Y para manter o sprite alinhado com +Z
      euler.y = 0
      // Se necessário, ajuste o eixo Z para corrigir o "flip"
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
