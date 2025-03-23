import React, { useEffect, useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export function CustomSpriteAnimator({
  autoPlay = true,
  loop = true,
  fps = 12,
  spriteDataset, // { spriteTexture, spriteData }
  frameName = 'down_idle', // valor padrão
  flipX = false,
  alphaTest = 0.001,
  scale = 1,
  ...props
}) {
  const { spriteTexture, spriteData } = spriteDataset
  const materialRef = useRef()
  const meshRef = useRef()

  // Define os frames a partir do frameName.
  // Se o frameName termina com "_idle", usamos apenas esse frame.
  // Se termina com "_walk", assumimos que queremos os frames walk1 e walk2.
  const [framesForAnim, setFramesForAnim] = useState([])
  useEffect(() => {
    let animFrames = []
    const parts = frameName.split('_')
    const dir = parts[0] // "up", "down", etc.
    const type = parts[1] // "idle" ou "walk"
    if (type === 'idle') {
      animFrames = [`${dir}_idle`]
    } else if (type === 'walk') {
      animFrames = [`${dir}_walk1`, `${dir}_walk2`]
    }
    setFramesForAnim(animFrames)
  }, [frameName])

  // Controle do frame atual da animação
  const [currentFrameIdx, setCurrentFrameIdx] = useState(0)
  const elapsedRef = useRef(0)

  useFrame((state, delta) => {
    if (!autoPlay || framesForAnim.length === 0) return

    elapsedRef.current += delta
    if (elapsedRef.current >= 1 / fps) {
      elapsedRef.current = 0
      let nextIdx = currentFrameIdx + 1
      if (nextIdx >= framesForAnim.length) {
        nextIdx = loop ? 0 : currentFrameIdx
      }
      setCurrentFrameIdx(nextIdx)
    }

    // Obtem os dados do frame atual a partir do JSON
    const frameKey = framesForAnim[currentFrameIdx]
    const frameData = spriteData.frames[frameKey]
    if (frameData && materialRef.current) {
      const { x, y, w, h } = frameData.frame
      const texWidth = spriteData.meta.size.w
      const texHeight = spriteData.meta.size.h

      // Como o Three.js usa (0,0) no canto inferior esquerdo,
      // convertemos as coordenadas: offsetX e offsetY.
      const offsetX = x / texWidth
      const offsetY = 1 - (y + h) / texHeight
      const repeatX = w / texWidth
      const repeatY = h / texHeight

      materialRef.current.map.offset.set(offsetX, offsetY)
      materialRef.current.map.repeat.set(repeatX, repeatY)
      materialRef.current.map.needsUpdate = true
    }
  })

  return (
    <mesh ref={meshRef} {...props} scale={flipX ? [-scale, scale, 1] : [scale, scale, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        ref={materialRef}
        map={spriteTexture}
        transparent={true}
        alphaTest={alphaTest}
      />
    </mesh>
  )
}
