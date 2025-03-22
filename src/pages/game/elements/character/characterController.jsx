import { useKeyboardControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { CapsuleCollider, RigidBody } from '@react-three/rapier'
import { useControls } from 'leva'
import { useEffect, useRef, useState } from 'react'
import { Vector3 } from 'three'
import { Character } from './character'

// Helper to normalize a vector if needed (not used here, since we use Vector3.normalize)

export const CharacterController = () => {
  // Control parameters (you can adjust via leva)
  const { WALK_SPEED, RUN_SPEED, JUMP_FORCE } = useControls('Character Control', {
    WALK_SPEED: { value: 0.8, min: 0.1, max: 4, step: 0.1 },
    RUN_SPEED: { value: 1.6, min: 0.2, max: 12, step: 0.1 },
    JUMP_FORCE: { value: 5, min: 1, max: 10, step: 0.1 },
  })

  // References to the rigid body and the character group.
  const rb = useRef()
  const character = useRef()

  // State to control the current animation. For a 2D sprite, we assume names like "up_walk", "down_idle", etc.
  const [animation, setAnimation] = useState('down_idle')

  // This ref will hold the last direction key pressed.
  // We consider only four directions: "up", "down", "left", "right". Default is "down".
  const lastDirection = useRef('down')

  // A simple flag to allow jumping only when on “ground”
  const canJump = useRef(true)

  // Get the keyboard control state
  const [, get] = useKeyboardControls()

  // Track keydown events to update the last direction.
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
      // Compute horizontal and vertical inputs.
      // Use get() from useKeyboardControls which should return an object with booleans.
      const horizontal = (get().left ? -1 : 0) + (get().right ? 1 : 0)
      const vertical = (get().forward ? 1 : 0) + (get().backward ? -1 : 0)

      // Create the movement vector on the XZ plane.
      const moveVec = new Vector3(horizontal, 0, vertical)

      // Check if there is any input.
      if (moveVec.lengthSq() === 0) {
        // No horizontal movement: cancel x/z velocity (but preserve y for gravity)
        const vel = rb.current.linvel()
        vel.x = 0
        vel.z = 0
        rb.current.setLinvel(vel, true)
        // Set idle animation based on last pressed direction.
        setAnimation(lastDirection.current + '_idle')
      } else {
        // If opposing keys are pressed (e.g., left and right), the sum will be 0 automatically.
        // Normalize to keep constant speed.
        moveVec.normalize()
        const speed = get().run ? RUN_SPEED : WALK_SPEED
        moveVec.multiplyScalar(speed)

        // Apply the horizontal velocity while preserving vertical (y) velocity.
        const vel = rb.current.linvel()
        vel.x = moveVec.x
        vel.z = moveVec.z
        rb.current.setLinvel(vel, true)
        // Set walking animation based on the last pressed directional key.
        setAnimation(lastDirection.current + '_walk')
      }

      // Jump logic: if jump key is pressed and the character can jump.
      if (get().jump && canJump.current) {
        rb.current.applyImpulse({ x: 0, y: JUMP_FORCE, z: 0 })
        canJump.current = false
      }
      // Simple ground check: if vertical velocity is near 0, allow jumping.
      const currentVel = rb.current.linvel()
      if (Math.abs(currentVel.y) < 0.1) {
        canJump.current = true
      }
    }
    // Note: We intentionally do not modify any camera rotation here.
    // The camera is assumed to be locked in one direction.
  })

  return (
    <RigidBody colliders={false} lockRotations ref={rb}>
      <group ref={character}>
        {/* The <Character /> component is assumed to switch its sprite animation based on the "animation" prop.
            For a 2D character, you might have sprite sequences like "up_walk", "up_idle", "down_walk", etc. */}
        <Character scale={0.18} position-y={-0.25} animation={animation} />
      </group>
      <CapsuleCollider args={[0.08, 0.15]}/>
    </RigidBody>
  )
}
