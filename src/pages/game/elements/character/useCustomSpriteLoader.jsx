import { useEffect, useState } from 'react'
import { useLoader } from '@react-three/fiber'
import { TextureLoader} from 'three'

export const useCustomSpriteLoader = (textureURL, jsonURL) => {
  const texture = useLoader(TextureLoader, textureURL)
  const [spriteData, setSpriteData] = useState(null)

  useEffect(() => {
    fetch(jsonURL)
      .then((res) => res.json())
      .then((data) => {
        setSpriteData(data)
      })
      .catch((err) => console.error('Erro ao carregar JSON:', err))
  }, [jsonURL])

  return { spriteTexture: texture, spriteData }
}
