import React from 'react'
import { CustomSpriteAnimator } from './CustomSpriteAnimator'
import useCustomSpriteLoader from './useCustomSpriteLoader'

export function Character({ animation, ...props }) {
  const spriteDataset = useCustomSpriteLoader(
    '/models/character_sprites.png',
    '/models/character_sprites.json',
  )

  if (!spriteDataset.spriteData || !spriteDataset.spriteTexture) return null

  // Se a animação for do tipo "left_walk", por exemplo, pode ser interessante flipar.
  // Mas como agora usamos nomes diferenciados, você pode definir a lógica:
  const flipX = animation === 'right_idle' ? false : animation.startsWith('left')

  return (
    <CustomSpriteAnimator
      {...props}
      autoPlay={true}
      loop={true}
      fps={12}
      spriteDataset={spriteDataset}
      frameName={animation}
      flipX={flipX}
      alphaTest={0.001}
    />
  )
}
