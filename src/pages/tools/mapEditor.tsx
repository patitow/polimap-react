import React, { Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, OrthographicCamera } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import type { Block } from '@/types/block'
import type { Floor } from '@/types/floor'
import type { Room } from '@/types/room'
import type { Coordinate } from '@/types/coordinates'
import { Map } from '@/components/map/Map'
import { ModelErrorBoundary } from '@/components/map/ModelErrorBoundary'
import { GateComponent } from '@/components/map/Gate'
import { GatesEditor } from '@/components/map/GatesEditor'
import { PoiMarker } from '@/components/map/PoiMarker'

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
      const updatedBlock: Block = { ...selectedBlock, floors: updatedFloors }
      setSelectedBlock(updatedBlock)
      setBlocks((prev) => prev.map((b) => (b.id === updatedBlock.id ? updatedBlock : b)))
    }
  }

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(blocks, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'map_points.edited.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="map-editor flex h-screen pt-16">
      <div className="sidebar w-1/4 overflow-y-auto border-r border-slate-200 p-4 dark:border-slate-700 dark:bg-slate-900">
        <h1 className="mb-4 text-2xl font-bold dark:text-slate-100">Map Editor</h1>
        <button
          onClick={handleExportJson}
          className="mb-4 w-full rounded border border-emerald-500 px-3 py-2 text-sm font-medium text-emerald-100 hover:bg-emerald-500/10"
        >
          Exportar map_points.json
        </button>
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

        {selectedRoom && (
          <div className="mt-4 space-y-2 rounded border border-slate-700 p-3 text-xs text-slate-200">
            <div className="font-semibold">Interest point (POI)</div>
            <div>
              x: {selectedRoom.interest_point.x.toFixed(2)} · y:{' '}
              {selectedRoom.interest_point.y.toFixed(2)} · z:{' '}
              {selectedRoom.interest_point.z.toFixed(2)}
            </div>
            <p className="text-[0.7rem] text-slate-400">
              Arraste o marcador ciano na cena para ajustar a posição deste ponto de interesse.
              Depois clique em &quot;Exportar map_points.json&quot; e substitua o arquivo no
              repositório.
            </p>
          </div>
        )}
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
            {selectedRoom && (
              <PoiMarker
                position={selectedRoom.interest_point as Coordinate}
                color="#22d3ee"
                onChange={(p) => updateRoom({ ...selectedRoom, interest_point: p })}
              />
            )}
          </Physics>
        </Canvas>
      </div>
    </div>
  )
}

export default MapEditor
