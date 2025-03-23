import { useKeyboardControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { CapsuleCollider, RigidBody } from '@react-three/rapier'
import { useControls } from 'leva'
import { useEffect, useRef, useState } from 'react'
import { Vector3 } from 'three'
import { Character } from './character'

export const CharacterController = () => {
  const { WALK_SPEED, RUN_SPEED, JUMP_FORCE } = useControls('Character Control', {
    WALK_SPEED: { value: 0.8, min: 0.1, max: 4, step: 0.1 },
    RUN_SPEED: { value: 1.6, min: 0.2, max: 12, step: 0.1 },
    JUMP_FORCE: { value: 5, min: 1, max: 10, step: 0.1 },
  })

  const rb = useRef()
  const characterRef = useRef()
  const [animation, setAnimation] = useState('down_idle')
  const lastDirection = useRef('down')
  const canJump = useRef(true)
  const { camera } = useThree()

  const [, get] = useKeyboardControls()

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase()
      if (key === 'w' || key === 'arrowup') {
        lastDirection.current = 'up'
      } else if (key === 's' || key === 'arrowdown') {
        lastDirection.current = 'down'
      } else if (key === 'a' || key === 'arrowleft') {
        lastDirection.current = 'left'
      } else if (key === 'd' || key === 'arrowright') {
        lastDirection.current = 'right'
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useFrame(() => {
    if (rb.current) {
      // Processa os inputs de movimento
      const horizontal = (get().left ? -1 : 0) + (get().right ? 1 : 0)
      const vertical = (get().forward ? 1 : 0) + (get().backward ? -1 : 0)
      const moveVec = new Vector3(horizontal, 0, vertical)

      if (moveVec.lengthSq() === 0) {
        // Sem movimento: animação idle baseada na última direção
        setAnimation(lastDirection.current + '_idle')
        const vel = rb.current.linvel()
        vel.x = 0
        vel.z = 0
        rb.current.setLinvel(vel, true)
      } else {
        moveVec.normalize()
        const speed = get().run ? RUN_SPEED : WALK_SPEED
        moveVec.multiplyScalar(speed)
        const vel = rb.current.linvel()
        vel.x = moveVec.x
        vel.z = moveVec.z
        rb.current.setLinvel(vel, true)
        // Define a animação de walk com base na última direção
        setAnimation(lastDirection.current + '_walk')
      }

      // Lógica de pulo
      if (get().jump && canJump.current) {
        rb.current.applyImpulse({ x: 0, y: JUMP_FORCE, z: 0 })
        canJump.current = false
      }
      const currentVel = rb.current.linvel()
      if (Math.abs(currentVel.y) < 0.1) {
        canJump.current = true
      }

      // Atualiza a câmera para seguir o jogador, mantendo seu ângulo fixo.
      // Define um offset fixo que posiciona a câmera a uma distância desejada.
      const playerPos = rb.current.translation()
      // Exemplo de offset: 10 unidades atrás e 10 unidades acima do jogador,
      // considerando o sistema de coordenadas: ajuste conforme necessário.
      const cameraZoom = 5
      const offset = new Vector3(cameraZoom, cameraZoom, cameraZoom)
      const desiredCamPos = new Vector3().addVectors(playerPos, offset)
      camera.position.lerp(desiredCamPos, 0.1)
      // Não chamamos camera.lookAt, para não alterar a rotação fixa.
    }
  })

  return (
    <RigidBody colliders={true} lockRotations ref={rb}>
      <group ref={characterRef}>
        <Character scale={0.5} position-y={-0.25} animation={animation} />
      </group>
      <CapsuleCollider args={[0.08, 0.42]} />
    </RigidBody>
  )
}
