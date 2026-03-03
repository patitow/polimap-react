import { useKeyboardControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { CapsuleCollider, RigidBody, type RapierRigidBody } from '@react-three/rapier'
import { useEffect, useRef, useState } from 'react'
import { Raycaster, Vector3 } from 'three'
import type { Object3D, Group } from 'three'
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
const INTERACTION_DISTANCE = 3.5

// Suavização da câmera (1-exp(-λ*dt)) – 18 equilibra bem responsividade/estabilidade.
const CAMERA_SMOOTH_SPEED = 18
const VELOCITY_SMOOTHING = 12
// Velocidade de giro do personagem – mantemos mais baixa para evitar snaps em low-FPS.
const TURN_SMOOTH_SPEED = 14

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
  const facingAngle = useRef(0)
  const visualFacingAngle = useRef(0)
  const prevWalkingRef = useRef(false)
  const raycaster = useRef(new Raycaster())
  const cameraCollisionTargets = useRef<Object3D[]>([])
  const characterGroupRef = useRef<Group>(null)
  const bodyGroupRef = useRef<Group>(null)
  const nearestRoomRef = useRef<any>(null)
  const [isReady, setIsReady] = useState(false)

  // Persistent vectors to avoid GC pressure
  const _v1 = useRef(new Vector3())
  const _v2 = useRef(new Vector3())
  const _v3 = useRef(new Vector3())
  const _lookTarget = useRef(new Vector3())
  const _desiredCamPos = useRef(new Vector3())
  const _camDir = useRef(new Vector3())

  // Coleta colisores do mapa
  useEffect(() => {
    const collect = () => {
      const mapObj = scene.getObjectByName('MapCollision')
      if (mapObj && cameraCollisionTargets.current.length === 0) {
        const meshes: Object3D[] = []
        mapObj.traverse((child) => {
          if ((child as { isMesh?: boolean }).isMesh) meshes.push(child)
        })
        if (meshes.length > 0) {
          cameraCollisionTargets.current = meshes
          setIsReady(true)
        }
      }
    }
    collect()
    const id = setTimeout(collect, 500)
    return () => clearTimeout(id)
  }, [scene])

  // Mouse Move listener
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

  // Teleporte e Spawn
  useEffect(() => {
    if (!teleportPosition || !rb.current) return

    let targetX = teleportPosition.x
    let targetZ = teleportPosition.z
    let targetY = teleportPosition.y

    if (isReady && cameraCollisionTargets.current.length > 0) {
      _v1.current.set(targetX, teleportPosition.y + 50, targetZ)
      _v2.current.set(0, -1, 0)
      raycaster.current.set(_v1.current, _v2.current)
      raycaster.current.far = 100
      const hits = raycaster.current.intersectObjects(cameraCollisionTargets.current, true)
      if (hits.length > 0) {
        const hitY = hits[0].point.y
        targetY = hitY + CAPSULE_HALF_HEIGHT + CAPSULE_RADIUS + 0.05
      }
    } else {
      targetY += 5
    }

    rb.current.setTranslation({ x: targetX, y: targetY, z: targetZ }, true)
    rb.current.setLinvel({ x: 0, y: 0, z: 0 }, true)
  }, [teleportPosition?.x, teleportPosition?.y, teleportPosition?.z, isReady])

  useFrame((_state, delta) => {
    if (!rb.current) return
    const rigidBody = rb.current

    const currentPos = rigidBody.translation()
    _v1.current.set(currentPos.x, currentPos.y, currentPos.z)
    
    if (onPositionChange) {
      onPositionChange(_v1.current)
    }

    let minHighlightDist = INTERACTION_DISTANCE
    let bestRoom = null
    for (const room of rooms) {
      _v2.current.set(room.interest_point.x, room.interest_point.y, room.interest_point.z)
      const d = _v1.current.distanceTo(_v2.current)
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

    // Clamp de delta para evitar "saltos" grandes em frames lentos
    const safeDelta = Math.min(delta, 0.1)
    const velAlpha = 1 - Math.exp(-VELOCITY_SMOOTHING * safeDelta)
    const camAlpha = 1 - Math.exp(-CAMERA_SMOOTH_SPEED * safeDelta)
    // Para rotação usamos um delta menor, para não virar rápido demais em FPS baixo
    const turnSafeDelta = Math.min(delta, 1 / 60)
    const turnAlpha = 1 - Math.exp(-TURN_SMOOTH_SPEED * turnSafeDelta)

    if (autopilotTarget) {
      const dx = autopilotTarget.x - currentPos.x
      const dz = autopilotTarget.z - currentPos.z
      const dist = Math.sqrt(dx * dx + dz * dz)

      if (dist < AUTOPILOT_ARRIVAL_DISTANCE) {
        const vel = rigidBody.linvel()
        vel.x = 0
        vel.z = 0
        rigidBody.setLinvel(vel, true)
        const nextAnim = lastDir.current + '_idle'
        if (animation !== nextAnim) setAnimation(nextAnim)
        if (prevWalkingRef.current) {
          prevWalkingRef.current = false
          onWalkingChange?.(false)
        }
        onAutopilotArrived?.()
      } else {
        const dirX = dx / dist
        const dirZ = dz / dist
        const currentVel = rigidBody.linvel()
        const targetVelX = dirX * AUTOPILOT_SPEED
        const targetVelZ = dirZ * AUTOPILOT_SPEED
        
        rigidBody.setLinvel({ 
          x: currentVel.x + (targetVelX - currentVel.x) * velAlpha, 
          y: currentVel.y, 
          z: currentVel.z + (targetVelZ - currentVel.z) * velAlpha 
        }, true)

        facingAngle.current = Math.atan2(dirX, dirZ)
        const deg = facingAngle.current * (180 / Math.PI)
        let dir = 'down'
        if (deg > -45 && deg < 45) dir = 'up'
        else if (deg >= 45 && deg < 135) dir = 'right'
        else if (deg <= -45 && deg > -135) dir = 'left'
        lastDir.current = dir
        const nextAnim = dir + '_walk'
        if (animation !== nextAnim) setAnimation(nextAnim)
        if (!prevWalkingRef.current) {
          prevWalkingRef.current = true
          onWalkingChange?.(true)
        }
      }
    } else {
      const horizontal = (get().left ? -1 : 0) + (get().right ? 1 : 0) + joystickInput.x
      const vertical = (get().forward ? 1 : 0) + (get().backward ? -1 : 0) + joystickInput.z
      
      const currentVel = rigidBody.linvel()
      let targetVelX = 0
      let targetVelZ = 0

      if (horizontal !== 0 || vertical !== 0) {
        const speed = get().run ? RUN_SPEED : WALK_SPEED
        const camDist = CAMERA_DISTANCE * Math.cos(camPitch.current)
        _v2.current.set(
          currentPos.x + camDist * Math.sin(camRot.current),
          currentPos.y + CAMERA_HEIGHT + CAMERA_DISTANCE * Math.sin(camPitch.current),
          currentPos.z + camDist * Math.cos(camRot.current)
        )
        
        _v3.current.set(currentPos.x, currentPos.y + LOOK_TARGET_HEIGHT, currentPos.z)
        const forwardDir = _v1.current.subVectors(_v3.current, _v2.current).setY(0).normalize()
        const rightDir = _v2.current.crossVectors(forwardDir, new Vector3(0, 1, 0)).normalize()
        
        const worldDir = forwardDir.multiplyScalar(vertical).add(rightDir.multiplyScalar(horizontal)).normalize()
        targetVelX = worldDir.x * speed
        targetVelZ = worldDir.z * speed

        const angle = Math.atan2(worldDir.x, worldDir.z)
        facingAngle.current = angle
        const deg = angle * (180 / Math.PI)
        let dir = 'down'
        if (deg > -45 && deg < 45) dir = 'up'
        else if (deg >= 45 && deg < 135) dir = 'right'
        else if (deg <= -45 && deg > -135) dir = 'left'
        lastDir.current = dir
        
        const nextAnim = dir + '_walk'
        if (animation !== nextAnim) setAnimation(nextAnim)
        
        const onGround = Math.abs(currentVel.y) < 0.1
        if (onGround && !prevWalkingRef.current) {
          prevWalkingRef.current = true
          onWalkingChange?.(true)
        }
      } else {
        const nextAnim = lastDir.current + '_idle'
        if (animation !== nextAnim) setAnimation(nextAnim)
        if (prevWalkingRef.current) {
          prevWalkingRef.current = false
          onWalkingChange?.(false)
        }
      }

      rigidBody.setLinvel({ 
        x: currentVel.x + (targetVelX - currentVel.x) * velAlpha, 
        y: currentVel.y, 
        z: currentVel.z + (targetVelZ - currentVel.z) * velAlpha 
      }, true)

      if (get().jump && canJump.current) {
        rigidBody.applyImpulse({ x: 0, y: JUMP_IMPULSE, z: 0 }, true)
        canJump.current = false
      }

      const vel = rigidBody.linvel()
      if (vel.y < -0.5) wasFalling.current = true
      if (wasFalling.current && Math.abs(vel.y) < 0.1) {
        canJump.current = true
        wasFalling.current = false
      }
    }

    _lookTarget.current.set(currentPos.x, currentPos.y + LOOK_TARGET_HEIGHT, currentPos.z)
    const camDistXZ = CAMERA_DISTANCE * Math.cos(camPitch.current)
    const offsetX = camDistXZ * Math.sin(camRot.current)
    const offsetZ = camDistXZ * Math.cos(camRot.current)
    const offsetY = CAMERA_HEIGHT + CAMERA_DISTANCE * Math.sin(camPitch.current)
    
    _desiredCamPos.current.set(currentPos.x + offsetX, currentPos.y + offsetY, currentPos.z + offsetZ)

    if (cameraCollisionTargets.current.length > 0) {
      _camDir.current.subVectors(_desiredCamPos.current, _lookTarget.current)
      const maxDist = _camDir.current.length()
      _camDir.current.normalize()

      raycaster.current.set(_lookTarget.current, _camDir.current)
      raycaster.current.far = maxDist

      const hits = raycaster.current.intersectObjects(
        cameraCollisionTargets.current,
        true
      )
      if (hits.length > 0) {
        const hitDist = hits[0].distance
        // Pequena histerese (0.15) para evitar oscilar entre "colidido" e "livre"
        if (hitDist < maxDist - CAMERA_COLLISION_OFFSET - 0.15) {
          const hitPoint = hits[0].point
          _desiredCamPos.current
            .copy(hitPoint)
            .add(_camDir.current.multiplyScalar(-CAMERA_COLLISION_OFFSET))
        }
      }
    }

    camera.position.lerp(_desiredCamPos.current, camAlpha)
    camera.lookAt(_lookTarget.current)

    if (characterGroupRef.current) {
      const current = visualFacingAngle.current
      let diff = facingAngle.current - current
      diff = ((diff + Math.PI) % (Math.PI * 2)) - Math.PI
      visualFacingAngle.current = current + diff * turnAlpha
      characterGroupRef.current.rotation.y = visualFacingAngle.current
    }
  })

  const pos = teleportPosition ?? DEFAULT_SPAWN

  return (
    <RigidBody
      colliders={false}
      lockRotations
      ref={rb}
      gravityScale={isReady ? 1 : 0}
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