import React, { useEffect, useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export function CustomSpriteAnimator({
  startFrame = 0,
  numberOfFrames = 1,
  fps = 12,
  loop = true,
  autoPlay = true,
  // frameName pode ser utilizado se seu JSON agrupar animações (aqui não implementado)
  spriteDataset, // objeto com { spriteTexture, spriteData }
  flipX = false,
  alphaTest = 0.001,
  scale = 1,
  ...props
}) {
  const { spriteTexture, spriteData } = spriteDataset
  const materialRef = useRef()
  const meshRef = useRef()

  // Estado para o frame atual
  const [currentFrame, setCurrentFrame] = useState(startFrame)
  const elapsedRef = useRef(0)

  // Prepara um array ordenado com as chaves dos frames (ex.: ["frame_0", "frame_1", ...])
  const framesKeys =
    spriteData && spriteData.frames
      ? Object.keys(spriteData.frames).sort((a, b) => {
          const numA = parseInt(a.split('_')[1])
          const numB = parseInt(b.split('_')[1])
          return numA - numB
        })
      : []

  useFrame((state, delta) => {
    if (!autoPlay || framesKeys.length === 0) return

    elapsedRef.current += delta
    if (elapsedRef.current >= 1 / fps) {
      elapsedRef.current = 0
      let nextFrame = currentFrame + 1
      if (nextFrame >= startFrame + numberOfFrames) {
        nextFrame = loop ? startFrame : currentFrame
      }
      setCurrentFrame(nextFrame)
    }

    // Atualiza os UVs do material com base no frame atual
    const frameKey = framesKeys[currentFrame]
    const frameData = spriteData.frames[frameKey]
    if (frameData && materialRef.current) {
      // frameData.frame contém x, y, w, h
      const { x, y, w, h } = frameData.frame
      const texWidth = spriteData.meta.size.w
      const texHeight = spriteData.meta.size.h

      // Ajuste: como ThreeJS usa (0,0) no canto inferior esquerdo, convertemos
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
      <meshBasicMaterial ref={materialRef} map={spriteTexture} transparent={true} alphaTest={alphaTest} />
    </mesh>
  )
}
