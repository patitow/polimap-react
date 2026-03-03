import { useAnimations, useGLTF } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import type { Group } from 'three'

const CHARACTER_MODEL = '/models/character_rogue.glb'

/** Mapeia animações do controller (down_idle, up_walk, etc.) para nomes do modelo Rogue/KayKit */
function getRogueAnimationName(animation: string): string {
  const lower = animation.toLowerCase()
  if (lower.includes('walk')) return 'Walking_A'
  if (lower.includes('idle')) return 'Idle'
  return 'Idle'
}

/** Nomes alternativos de animação (KayKit Rogue usa Walking_A, Running_B) */
const WALK_ALTS = ['Walking_A', 'Walking', 'Walking_B', 'Walk', 'Run', 'Running', 'Running_B']
const IDLE_ALTS = ['Idle', 'idle']

// Objetos de arma presentes no modelo Rogue que devem ficar invisíveis
const WEAPON_OBJECT_NAMES = ['Knife_Offhand', '1H_Crossbow', '2H_Crossbow', 'Knife', 'Throwable']

interface CharacterProps {
  animation: string
  scale?: number
}

export function Character({ animation, scale = 0.4, ...props }: CharacterProps & React.ComponentProps<'group'>) {
  const groupRef = useRef<Group>(null)
  const { scene, animations } = useGLTF(CHARACTER_MODEL)
  const { actions } = useAnimations(animations, groupRef)

  const rogueAnim = getRogueAnimationName(animation)
  const isWalk = animation.toLowerCase().includes('walk')

  useEffect(() => {
    const candidates = isWalk ? WALK_ALTS : IDLE_ALTS
    let action = actions[rogueAnim]
    if (!action) {
      for (const name of candidates) {
        if (actions[name]) {
          action = actions[name]
          break
        }
      }
    }
    if (action) {
      action.reset().fadeIn(0.2).play()
      return () => {
        action!.fadeOut(0.2)
      }
    }
  }, [actions, rogueAnim, isWalk])

  useEffect(() => {
    scene.traverse((child) => {
      const obj = child as { isMesh?: boolean; name?: string; visible?: boolean }
      if (obj.isMesh) {
        const mesh = obj as { castShadow: boolean; receiveShadow: boolean }
        mesh.castShadow = true
        mesh.receiveShadow = true
      }
      if (obj.name && WEAPON_OBJECT_NAMES.includes(obj.name)) {
        obj.visible = false
      }
    })
  }, [scene])

  return (
    <group ref={groupRef} scale={scale} {...props}>
      <primitive object={scene} />
    </group>
  )
}

export function preloadCharacter() {
  useGLTF.preload(CHARACTER_MODEL)
}
