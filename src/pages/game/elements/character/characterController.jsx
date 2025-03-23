import { useKeyboardControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { CapsuleCollider, RigidBody } from '@react-three/rapier'
import { useControls } from 'leva'
import { useEffect, useRef, useState } from 'react'
import { Vector3, Euler } from 'three'
import { Character } from './character'

export const CharacterController = () => {
  const { WALK_SPEED, RUN_SPEED, JUMP_FORCE, cameraDistance, cameraHeight, showCollider } =
    useControls('Character Control', {
      WALK_SPEED: { value: 1, min: 0.1, max: 5, step: 0.25 },
      RUN_SPEED: { value: 1.25, min: 0.2, max: 5, step: 0.25 },
      JUMP_FORCE: { value: 5, min: 1, max: 10, step: 0.1 },
      cameraDistance: { value: 2.5, min: 0.5, max: 5, step: 0.5 },
      cameraHeight: { value: 2.5, min: 0.5, max: 5, step: 0.5 },
      showCollider: { value: false },
    })

  const rb = useRef()
  const characterRef = useRef()
  const [animation, setAnimation] = useState('down_idle')
  const canJump = useRef(true)
  const { camera } = useThree()
  const [, get] = useKeyboardControls()
  const isClicking = useRef(false)

  // Variável para controlar a rotação da câmera ao redor do jogador (em radianos)
  const camRot = useRef(0)

  // Suporte a toque
  useEffect(() => {
    const onMouseDown = () => {
      isClicking.current = true
    }
    const onMouseUp = () => {
      isClicking.current = false
    }

    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('mouseup', onMouseUp)
    document.addEventListener('touchstart', onMouseDown)
    document.addEventListener('touchend', onMouseUp)

    return () => {
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('touchstart', onMouseDown)
      document.removeEventListener('touchend', onMouseUp)
    }
  }, [])

  useFrame(() => {
    if (!rb.current) return

    // Obtém o vetor de movimento a partir dos controles
    const horizontal = (get().left ? -1 : 0) + (get().right ? 1 : 0)
    const vertical = (get().forward ? 1 : 0) + (get().backward ? -1 : 0)
    const moveVec = new Vector3(horizontal, 0, vertical)

    // Se não houver movimento, define animação idle com base na última direção registrada
    if (moveVec.lengthSq() === 0) {
      setAnimation(lastDir + '_idle')
      const vel = rb.current.linvel()
      vel.x = 0
      vel.z = 0
      rb.current.setLinvel(vel, true)
    } else {
      moveVec.normalize()
      const speed = get().run ? RUN_SPEED : WALK_SPEED
      moveVec.multiplyScalar(speed)
      const vel = rb.current.linvel()
      // Aplique a velocidade diretamente (ajuste sinal se necessário para seu sistema de coordenadas)
      vel.x = moveVec.x
      vel.z = moveVec.z * -1
      rb.current.setLinvel(vel, true)

      // Para definir a direção do sprite, transformamos o vetor de movimento para o espaço da câmera.
      // Isso é feito rotacionando o vetor pelo ângulo negativo da rotação da câmera (camRot).
      const relativeVec = moveVec.clone().applyAxisAngle(new Vector3(0, 1, 0), -camRot.current)
      const angle = Math.atan2(relativeVec.x, relativeVec.z) // ângulo relativo à câmera

      // Mapeamento: se angle entre -45° e 45° → "up"; entre 45° e 135° → "right"; entre -135° e -45° → "left"; caso contrário → "down".
      let dir = 'down'
      const deg = angle * (180 / Math.PI)
      if (deg > -45 && deg < 45) {
        dir = 'up'
      } else if (deg >= 45 && deg < 135) {
        dir = 'right'
      } else if (deg <= -45 && deg > -135) {
        dir = 'left'
      }
      // Salva a última direção para o idle
      lastDir = dir
      setAnimation(dir + '_walk')
    }

    // Lógica de pulo (suporte ao botão "jump", que deve estar mapeado)
    if (get().jump && canJump.current) {
      rb.current.applyImpulse({ x: 0, y: JUMP_FORCE * 0.002, z: 0 })
      canJump.current = false
    }

    const currentVel = rb.current.linvel()
    if (Math.abs(currentVel.y) < 0.001) {
      canJump.current = true
    }

    // Atualiza a posição da câmera para seguir o jogador com um offset fixo baseado na rotação camRot
    const playerPos = rb.current.translation()
    const offsetX = cameraDistance * Math.sin(camRot.current)
    const offsetZ = cameraDistance * Math.cos(camRot.current)
    const desiredCamPos = new Vector3(
      playerPos.x + offsetX,
      playerPos.y + cameraHeight,
      playerPos.z + offsetZ,
    )
    camera.position.lerp(desiredCamPos, 1)
    camera.lookAt(playerPos.x, playerPos.y, playerPos.z)

  })

  // Variável para armazenar a última direção para o idle
  let lastDir = 'down'

  return (
    <RigidBody colliders={false} lockRotations ref={rb}>
      <group ref={characterRef}>
        <Character scale={0.3} animation={animation} />
        <CapsuleCollider args={[0.08, 0.08, 3]} />
        {showCollider && (
          <mesh position={[0, 0, 0]}>
            <capsuleGeometry args={[0.08, 0.15, 8, 16]} />
            <meshBasicMaterial color="red" wireframe />
          </mesh>
        )}
      </group>
    </RigidBody>
  )
}
