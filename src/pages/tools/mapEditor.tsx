import React, { Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, OrthographicCamera } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import type { Block } from '@/types/block'
import type { Floor } from '@/types/floor'
import type { Room } from '@/types/room'
import { Map } from '@/components/map/Map'
import { ModelErrorBoundary } from '@/components/map/ModelErrorBoundary'
import { GateComponent } from '@/components/map/Gate'
import { GatesEditor } from '@/components/map/GatesEditor'

const fetchMapConfig = async (): Promise<Block[]> => {
  const response = await fetch('/config/map_points.json')
  return response.json()
}

const MapEditor: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([])
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null)
  const [selectedFloor, setSelectedFloor] = useState<Floor | null>(null)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)

  useEffect(() => {
    fetchMapConfig()
      .then((data) => {
        setBlocks(data)
        if (data.length > 0) {
          setSelectedBlock(data[0])
          if (data[0].floors.length > 0) {
            setSelectedFloor(data[0].floors[0])
            if (data[0].floors[0].rooms.length > 0) {
              setSelectedRoom(data[0].floors[0].rooms[0])
            }
          }
        }
      })
      .catch((err) => console.error('Erro ao carregar map_points.json:', err))
  }, [])

  const handleSelectBlock = (block: Block) => {
    setSelectedBlock(block)
    if (block.floors.length === 1) {
      setSelectedFloor(block.floors[0])
      setSelectedRoom(block.floors[0].rooms[0] ?? null)
    } else {
      setSelectedFloor(null)
      setSelectedRoom(null)
    }
  }

  const handleSelectFloor = (floor: Floor) => {
    setSelectedFloor(floor)
    setSelectedRoom(floor.rooms[0] ?? null)
  }

  const updateRoom = (updatedRoom: Room) => {
    setSelectedRoom(updatedRoom)
    if (selectedBlock && selectedFloor) {
      const updatedFloors = selectedBlock.floors.map((floor) =>
        floor.id === selectedFloor.id
          ? { ...floor, rooms: floor.rooms.map((r) => (r.id === updatedRoom.id ? updatedRoom : r)) }
          : floor
      )
      setSelectedBlock({ ...selectedBlock, floors: updatedFloors })
    }
  }

  return (
    <div className="map-editor flex h-screen pt-16">
      <div className="sidebar w-1/4 overflow-y-auto border-r border-slate-200 p-4 dark:border-slate-700 dark:bg-slate-900">
        <h1 className="mb-4 text-2xl font-bold dark:text-slate-100">Map Editor</h1>
        <div className="mb-6">
          <h2 className="mb-2 text-xl dark:text-slate-200">Blocos</h2>
          <ul className="space-y-1">
            {blocks.map((block) => (
              <li key={block.id}>
                <button
                  className={`w-full rounded border p-2 text-left ${
                    selectedBlock?.id === block.id
                      ? 'border-blue-500 bg-blue-100 dark:bg-blue-900/30 dark:border-blue-600'
                      : 'border-slate-300 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800'
                  }`}
                  onClick={() => handleSelectBlock(block)}
                >
                  {block.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
        {selectedBlock && selectedBlock.floors.length > 1 && (
          <div className="mb-6">
            <h2 className="mb-2 text-xl dark:text-slate-200">
              Andares de {selectedBlock.name}
            </h2>
            <ul className="space-y-1">
              {selectedBlock.floors.map((floor) => (
                <li key={floor.id}>
                  <button
                    className={`w-full rounded border p-2 text-left ${
                      selectedFloor?.id === floor.id
                        ? 'border-blue-500 bg-blue-100 dark:bg-blue-900/30 dark:border-blue-600'
                        : 'border-slate-300 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800'
                    }`}
                    onClick={() => handleSelectFloor(floor)}
                  >
                    {floor.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {selectedFloor && (
          <div className="mb-6">
            <h2 className="mb-2 text-xl dark:text-slate-200">
              Salas de {selectedFloor.name}
            </h2>
            <ul className="space-y-1">
              {selectedFloor.rooms.map((room) => (
                <li key={room.id}>
                  <button
                    className={`w-full rounded border p-2 text-left ${
                      selectedRoom?.id === room.id
                        ? 'border-blue-500 bg-blue-100 dark:bg-blue-900/30 dark:border-blue-600'
                        : 'border-slate-300 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800'
                    }`}
                    onClick={() => setSelectedRoom(room)}
                  >
                    {room.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {selectedRoom && <GatesEditor room={selectedRoom} onUpdateRoom={updateRoom} />}
      </div>
      <div className="editor-canvas flex-1">
        <Canvas camera={{ position: [0, 5, 10] }} shadows>
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
          <OrbitControls />
          <Physics>
            <Suspense fallback={null}>
              {selectedRoom && (
                <ModelErrorBoundary>
                  <Map
                    model={`/models/${selectedRoom.model_path}.glb`}
                    scale={1}
                    position={[0, 0, 0]}
                  />
                </ModelErrorBoundary>
              )}
            </Suspense>
            {selectedRoom?.gates.map((gate, index) => (
              <GateComponent
                key={gate.id}
                gate={gate}
                onUpdate={(newGate) => {
                  const updatedGates = [...selectedRoom.gates]
                  updatedGates[index] = newGate
                  updateRoom({ ...selectedRoom, gates: updatedGates })
                }}
              />
            ))}
          </Physics>
        </Canvas>
      </div>
    </div>
  )
}

export default MapEditor
