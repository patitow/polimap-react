import { Environment, OrthographicCamera } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import { useControls } from 'leva'
import { useRef } from 'react'
import { CharacterController } from './character/characterController'
import { Map } from './map'

const maps = {
  castle_on_hills: {
    scale: 3,
    position: [-6, -17, 0],
  },
}

export const Experience = () => {
  const shadowCameraRef = useRef()
  const { map } = useControls('Map', {
    map: {
      value: 'castle_on_hills',
      options: Object.keys(maps),
    },
  })

  return (
    <>
      {/* <OrbitControls /> */}
      <Environment preset="sunset" />
      <directionalLight
        intensity={0.65}
        castShadow
        position={[-15, 10, 15]}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.00005}
      >
        <OrthographicCamera
          left={-22}
          right={15}
          top={10}
          bottom={-20}
          ref={shadowCameraRef}
          attach={'shadow-camera'}
        />
      </directionalLight>
      <Physics key={map}>
        <Map scale={maps[map].scale} position={maps[map].position} model={`models/${map}.glb`} />
        <CharacterController />
      </Physics>
    </>
  )
}

export default Experience