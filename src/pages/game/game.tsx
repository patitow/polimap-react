import './game.css'
import { Canvas } from '@react-three/fiber'

function PolimapGame() {
  return (
    <>
      <Canvas>
        <mesh>
          <boxGeometry args={[2, 2, 2]} />
          <meshPhongMaterial />
        </mesh>
        <ambientLight intensity={0.1} />
        <directionalLight position={[0, 0, 5]} color="white" />
      </Canvas>
    </>
  )
}

export default PolimapGame
