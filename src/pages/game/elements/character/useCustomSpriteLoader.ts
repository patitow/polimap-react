import { useEffect, useState } from 'react'
import { useLoader } from '@react-three/fiber'
import { TextureLoader, NearestFilter } from 'three'

interface SpriteFrame {
  frame: { x: number; y: number; w: number; h: number }
}

interface SpriteData {
  frames: Record<string, SpriteFrame>
  meta: { size: { w: number; h: number } }
}

export default function useCustomSpriteLoader(textureURL: string, jsonURL: string) {
  const texture = useLoader(TextureLoader, textureURL)
  texture.magFilter = NearestFilter
  texture.minFilter = NearestFilter
  texture.generateMipmaps = false
  texture.needsUpdate = true

  const [spriteData, setSpriteData] = useState<SpriteData | null>(null)

  useEffect(() => {
    fetch(jsonURL)
      .then((res) => res.json())
      .then((data) => setSpriteData(data))
      .catch((err) => console.error('Erro ao carregar JSON:', err))
  }, [jsonURL])

  return { spriteTexture: texture, spriteData }
}
