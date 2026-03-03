import { useKeyboardControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { CapsuleCollider, RigidBody, type RapierRigidBody } from '@react-three/rapier'
import { useEffect, useRef, useState } from 'react'
import { Raycaster, Vector3 } from 'three'
import type { Object3D } from 'three'
import type { Group } from 'three'
import { useInput } from '@/contexts/InputContext'
import { DEFAULT_SPAWN } from '@/config/spawn'
import { Character } from './Character'

const WALK_SPEED = 3
const RUN_SPEED = 5
const JUMP_IMPULSE = 2 / 300
const CHARACTER_SCALE = 0.24
const CAPSULE_HALF_HEIGHT = 0.12
const CAPSULE_RADIUS = 0.05
const CAMERA_DISTANCE = 4.5
const CAMERA_HEIGHT = 2.5
const LOOK_TARGET_HEIGHT = 0.4
const CAMERA_COLLISION_OFFSET = 0.3
const MOUSE_SENSITIVITY = 0.002
const PITCH_SENSITIVITY = 0.002
const PITCH_MIN = -0.7
const PITCH_MAX = 0.4

const AUTOPILOT_ARRIVAL_DISTANCE = 0.15
const AUTOPILOT_SPEED = 1.2
const INTERACTION_DISTANCE = 2.5
/** Lerp: 1-exp(-λ*dt) - Rory Driscoll. Maior = mais rápido. 15-20 evita travamentos. */
const CAMERA_SMOOTH_SPEED = 18
/** Suaviza aceleração/desaceleração - lerp da velocidade atual em direção ao alvo */
const VELOCITY_SMOOTHING = 12
/** Suaviza rotação do personagem em torno de Y */
const TURN_SMOOTH_SPEED = 18

export const CharacterController = ({
  teleportPosition,
  canMove = true,
  autopilotTarget,
  onAutopilotArrived,
  onWalkingChange,
  rooms = [],
  onInteract,
  onPositionChange,
}: {
  teleportPosition: { x: number; y: number; z: number } | null
  canMove?: boolean
  autopilotTarget?: { x: number; y: number; z: number } | null
  onAutopilotArrived?: () => void
  onWalkingChange?: (isWalking: boolean) => void
  rooms?: any[]
  onInteract?: (room: any) => void
  onPositionChange?: (pos: Vector3) => void
}) => {
  const rb = useRef<RapierRigidBody>(null)
  const [animation, setAnimation] = useState('down_idle')
  const canJump = useRef(true)
  const wasFalling = useRef(false)
  const { camera, scene } = useThree()
  const [, get] = useKeyboardControls()
  const { joystickInput } = useInput()
  const camRot = useRef(0)
  const camPitch = useRef(0)
  const lastDir = useRef('down')
  // facingAngle = alvo de rotação; visualFacingAngle = ângulo atual exibido
  const facingAngle = useRef(0)
  const visualFacingAngle = useRef(0)
  const prevWalkingRef = useRef(false)
  const raycaster = useRef(new Raycaster())
  const cameraCollisionTargets = useRef<Object3D[]>([])
  const characterGroupRef = useRef<Group>(null)
  const bodyGroupRef = useRef<Group>(null)
  const nearestRoomRef = useRef<any>(null)

  useEffect(() => {
    const collect = () => {
      const mapObj = scene.getObjectByName('MapCollision')
      if (mapObj && cameraCollisionTargets.current.length === 0) {
        const meshes: Object3D[] = []
        mapObj.traverse((child) => {
          if ((child as { isMesh?: boolean }).isMesh) meshes.push(child)
        })
        if (meshes.length > 0) cameraCollisionTargets.current = meshes
      }
    }
    collect()
    const id = setTimeout(collect, 500)
    return () => clearTimeout(id)
  }, [scene])

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement !== null && canMove) {
        camRot.current -= e.movementX * MOUSE_SENSITIVITY
        camPitch.current = Math.max(
          PITCH_MIN,
          Math.min(PITCH_MAX, camPitch.current + e.movementY * PITCH_SENSITIVITY)
        )
      }
    }
    window.addEventListener('mousemove', onMouseMove)
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [canMove])

  useEffect(() => {
    if (!teleportPosition || !rb.current) return

    // Garante que o spawn/teleporte fique apoiado no chão do mapa (não dentro de prédios)
    let targetX = teleportPosition.x
    let targetZ = teleportPosition.z
    let targetY = teleportPosition.y

    if (cameraCollisionTargets.current.length > 0) {
      const origin = new Vector3(targetX, teleportPosition.y + 50, targetZ)
      const dir = new Vector3(0, -1, 0)
      raycaster.current.set(origin, dir)
      raycaster.current.far = 100
      const hits = raycaster.current.intersectObjects(cameraCollisionTargets.current, true)
      if (hits.length > 0) {
        const hitY = hits[0].point.y
        // base da cápsula no chão + pequeno offset
        targetY = hitY + CAPSULE_HALF_HEIGHT + CAPSULE_RADIUS + 0.05
      }
    }

    rb.current.setTranslation({ x: targetX, y: targetY, z: targetZ }, true)
  }, [teleportPosition?.x, teleportPosition?.y, teleportPosition?.z])

  useFrame((_state, delta) => {
    if (!rb.current) return
    const rigidBody = rb.current

    // Report position for indicators
    const currentPos = rigidBody.translation()
    const posVec = new Vector3(currentPos.x, currentPos.y, currentPos.z)
    onPositionChange?.(posVec)

    // Check nearest room for interaction
    let minHighlightDist = INTERACTION_DISTANCE
    let bestRoom = null
    for (const room of rooms) {
      const roomPos = new Vector3(room.interest_point.x, room.interest_point.y, room.interest_point.z)
      const d = posVec.distanceTo(roomPos)
      if (d < minHighlightDist) {
        minHighlightDist = d
        bestRoom = room
      }
    }
    nearestRoomRef.current = bestRoom

    if (get().interact && nearestRoomRef.current && onInteract) {
      onInteract(nearestRoomRef.current)
    }

    if (!canMove) {
      const vel = rigidBody.linvel()
      vel.x = 0
      vel.z = 0
      rigidBody.setLinvel(vel, true)
      if (prevWalkingRef.current) {
        prevWalkingRef.current = false
        onWalkingChange?.(false)
      }
      return
    }

    if (autopilotTarget) {
      const pos = rigidBody.translation()
      const dx = autopilotTarget.x - pos.x
      const dz = autopilotTarget.z - pos.z
      const dist = Math.sqrt(dx * dx + dz * dz)

      if (dist < AUTOPILOT_ARRIVAL_DISTANCE) {
        const vel = rigidBody.linvel()
        vel.x = 0
        vel.z = 0
        rigidBody.setLinvel(vel, true)
        setAnimation(lastDir.current + '_idle')
        if (prevWalkingRef.current) {
          prevWalkingRef.current = false
          onWalkingChange?.(false)
        }
        onAutopilotArrived?.()
        return
      }

      const dirX = dx / dist
      const dirZ = dz / dist
      const vel = rigidBody.linvel()
      vel.x = dirX * AUTOPILOT_SPEED
      vel.z = dirZ * AUTOPILOT_SPEED
      rigidBody.setLinvel(vel, true)

      const deg = Math.atan2(dirX, dirZ) * (180 / Math.PI)
      facingAngle.current = Math.atan2(dirX, dirZ)
      let dir = 'down'
      if (deg > -45 && deg < 45) dir = 'up'
      else if (deg >= 45 && deg < 135) dir = 'right'
      else if (deg <= -45 && deg > -135) dir = 'left'
      lastDir.current = dir
      setAnimation(dir + '_walk')
      if (!prevWalkingRef.current) {
        prevWalkingRef.current = true
        onWalkingChange?.(true)
      }

      const playerPos = rigidBody.translation()
      const lookTarget = new Vector3(playerPos.x, playerPos.y + LOOK_TARGET_HEIGHT, playerPos.z)
      const camDist = CAMERA_DISTANCE * Math.cos(camPitch.current)
      const offsetX = camDist * Math.sin(camRot.current)
      const offsetZ = camDist * Math.cos(camRot.current)
      const offsetY = CAMERA_HEIGHT + CAMERA_DISTANCE * Math.sin(camPitch.current)
      let desiredCamPos = new Vector3(
        playerPos.x + offsetX,
        playerPos.y + offsetY,
        playerPos.z + offsetZ
      )
      if (cameraCollisionTargets.current.length > 0) {
        const dir = new Vector3().subVectors(desiredCamPos, lookTarget)
        const maxDist = dir.length()
        dir.normalize()
        raycaster.current.set(lookTarget, dir)
        raycaster.current.far = maxDist
        const hits = raycaster.current.intersectObjects(cameraCollisionTargets.current, true)
        if (hits.length > 0 && hits[0].distance < maxDist - CAMERA_COLLISION_OFFSET) {
          const hitPoint = hits[0].point.clone()
          desiredCamPos = hitPoint.add(dir.clone().multiplyScalar(-CAMERA_COLLISION_OFFSET))
        }
      }
      const safeDelta = Math.min(delta, 0.05)
      const camAlpha = 1 - Math.exp(-CAMERA_SMOOTH_SPEED * safeDelta)
      camera.position.lerp(desiredCamPos, camAlpha)
      camera.lookAt(lookTarget)

      // suaviza rotação mesmo em autopilot
      if (characterGroupRef.current) {
        const current = visualFacingAngle.current
        let diff = facingAngle.current - current
        // traz para o intervalo [-π, π] para pegar o menor caminho
        diff = ((diff + Math.PI) % (Math.PI * 2)) - Math.PI
        const turnAlpha = 1 - Math.exp(-TURN_SMOOTH_SPEED * safeDelta)
        visualFacingAngle.current = current + diff * turnAlpha
        characterGroupRef.current.rotation.y = visualFacingAngle.current
      }
      return
    }

    const horizontal =
      (get().left ? -1 : 0) + (get().right ? 1 : 0) + joystickInput.x
    const vertical =
      (get().forward ? 1 : 0) + (get().backward ? -1 : 0) + joystickInput.z
    const moveVec = new Vector3(horizontal, 0, vertical)

    const currentVel = rigidBody.linvel()
    let targetVelX: number
    let targetVelZ: number

    if (moveVec.lengthSq() === 0) {
      setAnimation(lastDir.current + '_idle')
      targetVelX = 0
      targetVelZ = 0
      if (prevWalkingRef.current) {
        prevWalkingRef.current = false
        onWalkingChange?.(false)
      }
    } else {
      moveVec.normalize()
      const speed = get().run ? RUN_SPEED : WALK_SPEED
      const playerPos = rigidBody.translation()
      const lookTarget = new Vector3(playerPos.x, playerPos.y + LOOK_TARGET_HEIGHT, playerPos.z)
      const camDist = CAMERA_DISTANCE * Math.cos(camPitch.current)
      const camPos = new Vector3(
        playerPos.x + camDist * Math.sin(camRot.current),
        playerPos.y + CAMERA_HEIGHT + CAMERA_DISTANCE * Math.sin(camPitch.current),
        playerPos.z + camDist * Math.cos(camRot.current)
      )
      const forwardDir = new Vector3().subVectors(lookTarget, camPos).setY(0).normalize()
      const rightDir = new Vector3().crossVectors(forwardDir, new Vector3(0, 1, 0)).normalize()
      const worldDir = forwardDir.multiplyScalar(moveVec.z).add(rightDir.multiplyScalar(moveVec.x)).normalize()
      targetVelX = worldDir.x * speed
      targetVelZ = worldDir.z * speed

      const relativeVec = worldDir.clone()
      const angle = Math.atan2(relativeVec.x, relativeVec.z)
      facingAngle.current = angle
      const deg = angle * (180 / Math.PI)
      let dir = 'down'
      if (deg > -45 && deg < 45) dir = 'up'
      else if (deg >= 45 && deg < 135) dir = 'right'
      else if (deg <= -45 && deg > -135) dir = 'left'
      lastDir.current = dir
      setAnimation(dir + '_walk')
      const onGround = Math.abs(currentVel.y) < 0.01
      if (onGround && !prevWalkingRef.current) {
        prevWalkingRef.current = true
        onWalkingChange?.(true)
      } else if (!onGround && prevWalkingRef.current) {
        prevWalkingRef.current = false
        onWalkingChange?.(false)
      }
    }

    const velAlpha = 1 - Math.exp(-VELOCITY_SMOOTHING * delta)
    const newVelX = currentVel.x + (targetVelX - currentVel.x) * velAlpha
    const newVelZ = currentVel.z + (targetVelZ - currentVel.z) * velAlpha
    rigidBody.setLinvel({ x: newVelX, y: currentVel.y, z: newVelZ }, true)

    if (get().jump && canJump.current) {
      rigidBody.applyImpulse({ x: 0, y: JUMP_IMPULSE, z: 0 }, true)
      canJump.current = false
    }

    const vel = rigidBody.linvel()
    if (vel.y < -0.1) wasFalling.current = true
    if (wasFalling.current && vel.y >= -0.05 && vel.y <= 0.15) {
      canJump.current = true
      wasFalling.current = false
    }

    const t = rigidBody.translation()
    const playerWorld = bodyGroupRef.current
      ? bodyGroupRef.current.getWorldPosition(new Vector3())
      : new Vector3(t.x, t.y, t.z)
    const lookTarget = new Vector3(
      playerWorld.x,
      playerWorld.y + LOOK_TARGET_HEIGHT,
      playerWorld.z
    )
    const camDist = CAMERA_DISTANCE * Math.cos(camPitch.current)
    const offsetX = camDist * Math.sin(camRot.current)
    const offsetZ = camDist * Math.cos(camRot.current)
    const offsetY = CAMERA_HEIGHT + CAMERA_DISTANCE * Math.sin(camPitch.current)
    let desiredCamPos = new Vector3(
      playerWorld.x + offsetX,
      playerWorld.y + offsetY,
      playerWorld.z + offsetZ
    )
    if (cameraCollisionTargets.current.length > 0) {
      const dir = new Vector3().subVectors(desiredCamPos, lookTarget)
      const maxDist = dir.length()
      dir.normalize()
      raycaster.current.set(lookTarget, dir)
      raycaster.current.far = maxDist
      raycaster.current.layers.set(0)
      const hits = raycaster.current.intersectObjects(cameraCollisionTargets.current, true)
      if (hits.length > 0 && hits[0].distance < maxDist - CAMERA_COLLISION_OFFSET) {
        const hitPoint = hits[0].point.clone()
        const pullBack = dir.clone().multiplyScalar(-CAMERA_COLLISION_OFFSET)
        desiredCamPos = hitPoint.add(pullBack)
      }
    }
    const safeDelta = Math.min(delta, 0.05)
    const camAlpha = 1 - Math.exp(-CAMERA_SMOOTH_SPEED * safeDelta)
    camera.position.lerp(desiredCamPos, camAlpha)
    camera.lookAt(lookTarget)

    // suaviza rotação do personagem em torno de Y
    if (characterGroupRef.current) {
      const current = visualFacingAngle.current
      let diff = facingAngle.current - current
      diff = ((diff + Math.PI) % (Math.PI * 2)) - Math.PI
      const turnAlpha = 1 - Math.exp(-TURN_SMOOTH_SPEED * safeDelta)
      visualFacingAngle.current = current + diff * turnAlpha
      characterGroupRef.current.rotation.y = visualFacingAngle.current
    }
  }, -1)

  const pos = teleportPosition ?? DEFAULT_SPAWN

  return (
    <RigidBody
      colliders={false}
      lockRotations
      ref={rb}
      {...(teleportPosition !== null && {
        position: [pos.x, pos.y, pos.z] as [number, number, number],
      })}
    >
      <group ref={bodyGroupRef}>
        <group ref={characterGroupRef}>
          <Character scale={CHARACTER_SCALE} animation={animation} />
        </group>
        <CapsuleCollider
          args={[CAPSULE_HALF_HEIGHT, CAPSULE_RADIUS]}
          position={[0, CAPSULE_HALF_HEIGHT, 0]}
        />
      </group>
    </RigidBody>
  )
}
