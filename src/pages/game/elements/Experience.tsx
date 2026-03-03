import { useEffect, useState } from 'react'
import { Environment, OrthographicCamera, useGLTF } from '@react-three/drei'
import { Physics } from '@react-three/rapier'

useGLTF.preload('/models/character_rogue.glb')
import { Map } from '@/components/map/Map'
import { ModelErrorBoundary } from '@/components/map/ModelErrorBoundary'
import { CharacterController } from './character/CharacterController'

interface MapConfig {
  scale: number
  position: [number, number, number]
}

const defaultMaps: Record<string, MapConfig> = {
  model_poli_overworld: {
    scale: 0.3,
    position: [-0.6, -0.8, 0],
  },
}

interface ExperienceProps {
  currentScene: string
  teleportPosition: { x: number; y: number; z: number } | null
  canMove?: boolean
  autopilotTarget?: { x: number; y: number; z: number } | null
  onAutopilotArrived?: () => void
  onWalkingChange?: (isWalking: boolean) => void
}

export const Experience: React.FC<ExperienceProps> = ({
  currentScene,
  teleportPosition,
  canMove = true,
  autopilotTarget,
  onAutopilotArrived,
  onWalkingChange,
}) => {
  const [maps, setMaps] = useState<Record<string, MapConfig>>(defaultMaps)

  useEffect(() => {
    fetch('/config/maps.json')
      .then((res) => res.json())
      .then((data) => {
        if (data.maps) {
          setMaps((prev) => ({ ...prev, ...data.maps }))
        }
      })
      .catch(() => {})
  }, [])

  const defaultConfig: MapConfig = { scale: 1, position: [0, 0, 0] }
  const mapConfig = maps[currentScene] || defaultConfig
  const modelPath = `/models/${currentScene}.glb`

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
          attach="shadow-camera"
        />
      </directionalLight>
      <Physics key={currentScene} interpolate>
        <ModelErrorBoundary>
          <Map
            scale={mapConfig.scale}
            position={mapConfig.position}
            model={modelPath}
          />
        </ModelErrorBoundary>
        <CharacterController
          teleportPosition={teleportPosition}
          canMove={canMove}
          autopilotTarget={autopilotTarget}
          onAutopilotArrived={onAutopilotArrived}
          onWalkingChange={onWalkingChange}
        />
      </Physics>
    </>
  )
}
