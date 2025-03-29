import React, { useRef, useState, useEffect } from 'react'
import { Environment, OrthographicCamera } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import { useControls } from 'leva'
import { CharacterController } from './character/characterController'
import { Map } from './map'
import { Room } from 'colyseus.js'

// Define an interface for each map's configuration.
interface MapConfig {
  scale: number
  position: [number, number, number]
}

// Provide an initial maps object to guarantee a default value.
const defaultMaps: Record<string, MapConfig> = {
  castle_on_hills: {
    scale: 3,
    position: [-6, -8, 0],
  },
}

interface ExperienceProps {
  room: Room<any> | null
}

export const Experience: React.FC<ExperienceProps> = ({ room }) => {
  console.log(room)
  const shadowCameraRef = useRef<any>(null)
  const [maps, setMaps] = useState<Record<string, MapConfig>>(defaultMaps)

  // Asynchronously load maps from a JSON file.
  useEffect(() => {
    async function loadMaps() {
      try {
        // Adjust the path as needed; here we assume the JSON is in "public/config/maps.json"
        const response = await fetch('/config/rooms.json')
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const data = await response.json()
        // Expecting data to have a "maps" property in the same format as defaultMaps.
        if (data.maps) {
          setMaps(data.maps)
        }
      } catch (error) {
        console.error('Failed to load maps:', error)
      }
    }
    loadMaps()
  }, [])

  // Use leva's useControls to allow map selection.
  const { map } = useControls('Map', {
    map: {
      value: Object.keys(maps)[0], // default to the first key from the maps object
      options: Object.keys(maps),
    },
  })

  return (
    <>
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
          top={15}
          bottom={-20}
          ref={shadowCameraRef}
          attach="shadow-camera"
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
