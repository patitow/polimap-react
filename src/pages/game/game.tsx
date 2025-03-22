import './game.css'
import { Canvas } from '@react-three/fiber'
import Experience from './elements/experience'
import { KeyboardControls } from '@react-three/drei'

const keyboardMap = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
  { name: 'run', keys: ['Shift'] },
]

function PolimapGame() {
  return (
    <KeyboardControls map={keyboardMap}>
      <Canvas
        style={{
          width: '100dvw',
          height: '100dvh',
          touchAction: 'none',
        }}
        shadows
        camera={{ position: [3, 3, 3], near: 0.1, fov: 40 }}
      >
        <color attach="background" args={['#ececec']} />
        <Experience />
      </Canvas>
    </KeyboardControls>
  )
}

export default PolimapGame
