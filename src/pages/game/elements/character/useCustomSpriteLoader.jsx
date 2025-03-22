import { useEffect, useState } from 'react'
import { useLoader } from '@react-three/fiber'
import * as THREE from 'three'

export function useCustomSpriteLoader(textureURL, jsonURL) {
  const texture = useLoader(THREE.TextureLoader, textureURL)
  const [spriteData, setSpriteData] = useState(null)

  useEffect(() => {
    fetch(jsonURL)
      .then((res) => res.json())
      .then((data) => {
        console.log('Sprite JSON data loaded:', data)
        setSpriteData(data)
      })
      .catch((err) => console.error('Erro ao carregar JSON:', err))
  }, [jsonURL])

  return { spriteTexture: texture, spriteData }
}
