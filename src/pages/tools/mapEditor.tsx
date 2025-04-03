'use client'

import React, { Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, OrthographicCamera } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import { Block } from '@/types/block'
import { Floor } from '@/types/floor'
import { Room } from '@/types/room'
import { Map } from '@/components/map/map'
import { ModelErrorBoundary } from '@/components/map/modelErrorBoundary' // ou importe de onde você definiu
import { GateComponent } from '@/components/map/gate'
import { GatesEditor } from '@/components/map/gatesEditor'

// Função para carregar a configuração do mapa (JSON) da pasta public
const fetchMapConfig = async (): Promise<Block[]> => {
  const response = await fetch('/config/map_points.json')
  const data = await response.json()
  return data
}

const MapEditor: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([])
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null)
  const [selectedFloor, setSelectedFloor] = useState<Floor | null>(null)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)

  useEffect(() => {
    fetchMapConfig()
      .then(data => {
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
      .catch(error => console.error('Erro ao carregar a configuração do mapa:', error))
  }, [])

  // Handlers para seleção
  const handleSelectBlock = (block: Block) => {
    setSelectedBlock(block)
    if (block.floors.length === 1) {
      setSelectedFloor(block.floors[0])
      if (block.floors[0].rooms.length > 0) {
        setSelectedRoom(block.floors[0].rooms[0])
      } else {
        setSelectedRoom(null)
      }
    } else {
      setSelectedFloor(null)
      setSelectedRoom(null)
    }
  }

  const handleSelectFloor = (floor: Floor) => {
    setSelectedFloor(floor)
    if (floor.rooms.length > 0) {
      setSelectedRoom(floor.rooms[0])
    } else {
      setSelectedRoom(null)
    }
  }

  const handleSelectRoom = (room: Room) => {
    setSelectedRoom(room)
  }

  // Atualiza a sala (por exemplo, quando um gate é editado)
  const updateRoom = (updatedRoom: Room) => {
    setSelectedRoom(updatedRoom)
    if (selectedBlock && selectedFloor) {
      const updatedFloors = selectedBlock.floors.map(floor => {
        if (floor.id === selectedFloor.id) {
          return {
            ...floor,
            rooms: floor.rooms.map(r => (r.id === updatedRoom.id ? updatedRoom : r)),
          }
        }
        return floor
      })
      const updatedBlock = { ...selectedBlock, floors: updatedFloors }
      setSelectedBlock(updatedBlock)
    }
  }

  return (
    <div className="map-editor flex h-screen pt-16">
      {/* Sidebar */}
      <div className="sidebar w-1/4 overflow-y-auto border-r border-gray-200 p-4">
        <h1 className="mb-4 text-2xl font-bold">Map Editor</h1>
        <div className="mb-6">
          <h2 className="mb-2 text-xl">Blocos</h2>
          <ul>
            {blocks.map(block => (
              <li key={block.id} className="mb-1">
                <button
                  className={`w-full rounded border p-2 text-left ${
                    selectedBlock?.id === block.id
                      ? 'border-blue-500 bg-blue-100'
                      : 'border-gray-300'
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
            <h2 className="mb-2 text-xl">Andares de {selectedBlock.name}</h2>
            <ul>
              {selectedBlock.floors.map(floor => (
                <li key={floor.id} className="mb-1">
                  <button
                    className={`w-full rounded border p-2 text-left ${
                      selectedFloor?.id === floor.id
                        ? 'border-blue-500 bg-blue-100'
                        : 'border-gray-300'
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
            <h2 className="mb-2 text-xl">Salas de {selectedFloor.name}</h2>
            <ul>
              {selectedFloor.rooms.map(room => (
                <li key={room.id} className="mb-1">
                  <button
                    className={`w-full rounded border p-2 text-left ${
                      selectedRoom?.id === room.id
                        ? 'border-blue-500 bg-blue-100'
                        : 'border-gray-300'
                    }`}
                    onClick={() => handleSelectRoom(room)}
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
      {/* Área 3D */}
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
            {selectedRoom &&
              selectedRoom.gates.map((gate, index) => (
                <GateComponent
                  key={gate.id}
                  gate={gate}
                  onUpdate={newGate => {
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
