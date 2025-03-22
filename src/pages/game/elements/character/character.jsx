import React from 'react'
import { CustomSpriteAnimator } from './CustomSpriteAnimator'
import { useCustomSpriteLoader } from './useCustomSpriteLoader'

export function Character({ animation, ...props }) {
  // Ajuste os caminhos para que os arquivos estejam na pasta public (ou conforme sua configuração)
  const spriteDataset = useCustomSpriteLoader(
    '/models/character_sprites.png',
    '/models/character_sprites.json',
  )

  // Aguarda o carregamento dos dados
  if (!spriteDataset.spriteData || !spriteDataset.spriteTexture) return null

  // Exemplo: se a animação começar com "left", flip horizontalmente
  const flipX = animation.startsWith('left')

  return (
    <CustomSpriteAnimator
      {...props}
      startFrame={0}
      autoPlay={true}
      loop={true}
      numberOfFrames={12} // ajuste conforme sua animação
      fps={12}
      spriteDataset={spriteDataset}
      frameName={animation}
      flipX={flipX}
      alphaTest={0.001}
    />
  )
}
