import React from 'react'
import { CustomSpriteAnimator } from './CustomSpriteAnimator'
import useCustomSpriteLoader from './useCustomSpriteLoader'

export function Character({ animation, ...props }) {
  const spriteDataset = useCustomSpriteLoader(
    '/models/character_sprites.png',
    '/models/character_sprites.json',
  )

  if (!spriteDataset.spriteData || !spriteDataset.spriteTexture) return null

  // Se necessário, ajuste flipX – por exemplo, se a animação para "left" já está desenhada corretamente, flipX pode ser false.
  const flipX = false // ajuste conforme a necessidade

  return (
    <CustomSpriteAnimator
      {...props}
      autoPlay={true}
      loop={true}
      fps={4}
      spriteDataset={spriteDataset}
      frameName={animation}
      flipX={flipX}
      alphaTest={0.001}
    />
  )
}
