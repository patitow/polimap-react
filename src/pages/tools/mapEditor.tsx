import React, { Suspense, useEffect, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Environment, OrbitControls, OrthographicCamera } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import type { Block } from '@/types/block'
import type { Room } from '@/types/room'
import type { Coordinate } from '@/types/coordinates'
import { Map } from '@/components/map/Map'
import { ModelErrorBoundary } from '@/components/map/ModelErrorBoundary'
import { GateComponent } from '@/components/map/Gate'
import { GatesEditor } from '@/components/map/GatesEditor'
import { PoiMarker } from '@/components/map/PoiMarker'

// -----------------------------
// Tipos de apoio e configuração
// -----------------------------

interface LogicalMapDef {
  id: 'overworld' | 'bloco_b' | 'bloco_c'
  name: string
  modelPaths: string[]
}

type LogicalMapId = LogicalMapDef['id']

const LOGICAL_MAPS: LogicalMapDef[] = [
  {
    id: 'overworld',
    name: 'Mapa Externo',
    modelPaths: ['model_poli_overworld', 'model_auditorio_a'],
  },
  {
    id: 'bloco_b',
    name: 'Mapa Bloco B (interno)',
    modelPaths: ['model_bloco_b'],
  },
  {
    id: 'bloco_c',
    name: 'Mapa Bloco C (interno)',
    modelPaths: ['model_bloco_c'],
  },
]

interface LogicalRoomRef {
  blockIndex: number
  floorIndex: number
  roomIndex: number
  roomId: string
  roomName: string
  floorName: string
  blockName: string
  modelPath: string
  interestPoint: Coordinate
}

interface LogicalMapUi extends LogicalMapDef {
  rooms: LogicalRoomRef[]
}

const fetchMapConfig = async (): Promise<Block[]> => {
  const response = await fetch('/config/map_points.json')
  return response.json()
}

// Monta estrutura de mapas lógicos a partir de blocks + índices
function buildMapsFromBlocks(blocks: Block[]): LogicalMapUi[] {
  return LOGICAL_MAPS.map<LogicalMapUi>((def) => {
    const rooms: LogicalRoomRef[] = []

    blocks.forEach((block, blockIndex) => {
      block.floors.forEach((floor, floorIndex) => {
        floor.rooms.forEach((room, roomIndex) => {
          if (def.modelPaths.includes(room.model_path)) {
            rooms.push({
              blockIndex,
              floorIndex,
              roomIndex,
              roomId: room.id,
              roomName: room.name,
              floorName: floor.name,
              blockName: block.name,
              modelPath: room.model_path,
              interestPoint: room.interest_point,
            })
          }
        })
      })
    })

    return { ...def, rooms }
  }).filter((m) => m.rooms.length > 0)
}

interface CameraFocusProps {
  target: Coordinate | null
}

const CameraFocus: React.FC<CameraFocusProps> = ({ target }) => {
  const { camera, controls } = useThree()

  useEffect(() => {
    if (!target) return
    const offset = 12
    camera.position.set(target.x + offset, target.y + offset * 0.7, target.z + offset)
    // @ts-expect-error controles vêm do OrbitControls com makeDefault
    controls?.target.set(target.x, target.y, target.z)
    // @ts-expect-error idem
    controls?.update?.()
  }, [camera, controls, target?.x, target?.y, target?.z])

  return null
}

const MapEditor: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([])
  const [selectedMapId, setSelectedMapId] = useState<LogicalMapId | null>(null)
  const [selectedRoomRef, setSelectedRoomRef] = useState<{
    blockIndex: number
    floorIndex: number
    roomIndex: number
  } | null>(null)
  const [editingAxis, setEditingAxis] = useState<'x' | 'y' | 'z' | null>(null)

  // Carrega configuração inicial
  useEffect(() => {
    fetchMapConfig()
      .then((data) => {
        setBlocks(data)
        const maps = buildMapsFromBlocks(data)
        if (maps.length > 0 && maps[0].rooms.length > 0) {
          const firstMap = maps[0]
          const firstRoom = firstMap.rooms[0]
          setSelectedMapId(firstMap.id)
          setSelectedRoomRef({
            blockIndex: firstRoom.blockIndex,
            floorIndex: firstRoom.floorIndex,
            roomIndex: firstRoom.roomIndex,
          })
        }
      })
      .catch((err) => console.error('Erro ao carregar map_points.json:', err))
  }, [])

  const mapsForUi = buildMapsFromBlocks(blocks)
  const selectedMap = mapsForUi.find((m) => m.id === selectedMapId) ?? null

  // Room atual SEMPRE derivado de blocks + índices (fonte única de verdade)
  let currentRoom: Room | null = null
  if (selectedRoomRef) {
    const block = blocks[selectedRoomRef.blockIndex]
    if (block) {
      const floor = block.floors[selectedRoomRef.floorIndex]
      if (floor) {
        currentRoom = floor.rooms[selectedRoomRef.roomIndex] ?? null
      }
    }
  }

  const handleSelectMap = (mapId: LogicalMapId) => {
    setSelectedMapId(mapId)
    const maps = buildMapsFromBlocks(blocks)
    const map = maps.find((m) => m.id === mapId)
    const firstRoom = map?.rooms[0]
    if (firstRoom) {
      setSelectedRoomRef({
        blockIndex: firstRoom.blockIndex,
        floorIndex: firstRoom.floorIndex,
        roomIndex: firstRoom.roomIndex,
      })
    } else {
      setSelectedRoomRef(null)
    }
    setEditingAxis(null)
  }

  const handleSelectRoom = (ref: LogicalRoomRef) => {
    setSelectedRoomRef({
      blockIndex: ref.blockIndex,
      floorIndex: ref.floorIndex,
      roomIndex: ref.roomIndex,
    })
    setEditingAxis(null)
  }

  const updateRoom = (updatedRoom: Room) => {
    if (!selectedRoomRef) return
    const { blockIndex, floorIndex, roomIndex } = selectedRoomRef
    setBlocks((prev) =>
      prev.map((block, bi) => {
        if (bi !== blockIndex) return block
        return {
          ...block,
          floors: block.floors.map((floor, fi) => {
            if (fi !== floorIndex) return floor
            return {
              ...floor,
              rooms: floor.rooms.map((room, ri) =>
                ri === roomIndex ? updatedRoom : room
              ),
            }
          }),
        }
      })
    )
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

  const handleSaveDirect = async () => {
    try {
      const res = await fetch('http://localhost:4175/save-map-points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blocks, null, 2),
      })
      if (!res.ok) {
        // eslint-disable-next-line no-alert
        alert('Falha ao salvar no map_points.json (veja console).')
        return
      }
      // eslint-disable-next-line no-alert
      alert('map_points.json salvo diretamente no projeto.')
    } catch (err) {
      console.error('Erro ao salvar no servidor local de mapas:', err)
      // eslint-disable-next-line no-alert
      alert(
        'Não foi possível contatar o servidor de salvamento.\n\nCertifique-se de rodar: yarn map-save-server'
      )
    }
  }

  return (
    <div className="map-editor flex h-screen pt-16">
      <div className="sidebar w-1/4 overflow-y-auto border-r border-slate-200 dark:border-slate-700 dark:bg-slate-900">
        <div className="sticky top-0 z-10 border-b border-slate-800 bg-slate-900/95 p-4 backdrop-blur">
          <h1 className="mb-2 text-2xl font-bold dark:text-slate-100">Map Editor</h1>
          <div className="mb-3 text-[0.7rem] text-slate-400">
            Escolha um mapa, selecione um ponto de interesse, ajuste portais/posição e clique em
            &quot;Exportar&quot; para baixar o JSON ou em &quot;Salvar direto&quot; para gravar no
            arquivo do projeto (requer servidor local rodando).
          </div>

          <button
            onClick={handleExportJson}
            className="w-full rounded border border-emerald-500 px-3 py-2 text-sm font-medium text-emerald-100 hover:bg-emerald-500/10"
          >
            Exportar map_points.json
          </button>

          <button
            onClick={handleSaveDirect}
            className="mt-2 w-full rounded border border-blue-500 px-3 py-2 text-sm font-medium text-blue-100 hover:bg-blue-500/10"
          >
            Salvar direto no map_points.json
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 p-4">
          {/* Coluna de mapas */}
          <div>
            <h2 className="mb-2 text-xl dark:text-slate-200">Mapas</h2>
            <ul className="space-y-1">
              {mapsForUi.map((map) => (
                <li key={map.id}>
                  <button
                    className={`w-full rounded border p-2 text-left ${
                      selectedMapId === map.id
                        ? 'border-blue-500 bg-blue-100 dark:bg-blue-900/30 dark:border-blue-600'
                        : 'border-slate-300 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800'
                    }`}
                    onClick={() => handleSelectMap(map.id)}
                  >
                    {map.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna de pontos de interesse + portais */}
          <div>
            {selectedMap && (
              <div className="mb-4">
                <h2 className="mb-2 text-xl dark:text-slate-200">
                  Pontos de interesse
                </h2>
                <ul className="space-y-1">
                  {selectedMap.rooms.map((ref) => {
                    const isSelected =
                      selectedRoomRef &&
                      selectedRoomRef.blockIndex === ref.blockIndex &&
                      selectedRoomRef.floorIndex === ref.floorIndex &&
                      selectedRoomRef.roomIndex === ref.roomIndex
                    return (
                      <li key={ref.roomId}>
                        <button
                          className={`w-full rounded border p-2 text-left ${
                            isSelected
                              ? 'border-blue-500 bg-blue-100 dark:bg-blue-900/30 dark:border-blue-600'
                              : 'border-slate-300 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800'
                          }`}
                          onClick={() => handleSelectRoom(ref)}
                        >
                          <div className="font-medium">{ref.roomName}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {ref.blockName} · {ref.floorName}
                          </div>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}

            {currentRoom && (
              <div className="mb-4">
                <h2 className="mb-2 text-xl dark:text-slate-200">
                  Portais do ponto selecionado
                </h2>
                <GatesEditor room={currentRoom} onUpdateRoom={updateRoom} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Canvas 3D */}
      <div className="editor-canvas relative flex-1">
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
          <OrbitControls makeDefault />

          <CameraFocus target={currentRoom?.interest_point ?? null} />

          <Physics>
            <Suspense fallback={null}>
              {currentRoom && (
                <ModelErrorBoundary>
                  <Map
                    model={`/models/${currentRoom.model_path}.glb`}
                    scale={1}
                    position={[0, 0, 0]}
                  />
                </ModelErrorBoundary>
              )}
            </Suspense>
          </Physics>

          {/* Elementos do Editor (fora da simulação física) */}
          <group name="EditorHelpers">
            {/* Cubos para todos os POIs do mapa selecionado */}
            {selectedMap &&
              selectedMap.rooms.map((ref) => (
                <mesh
                  key={`poi-${ref.roomId}`}
                  position={[
                    ref.interestPoint.x,
                    ref.interestPoint.y,
                    ref.interestPoint.z,
                  ]}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSelectRoom(ref)
                  }}
                >
                  <boxGeometry args={[0.6, 0.6, 0.6]} />
                  <meshStandardMaterial
                    color={
                      selectedRoomRef &&
                      selectedRoomRef.blockIndex === ref.blockIndex &&
                      selectedRoomRef.floorIndex === ref.floorIndex &&
                      selectedRoomRef.roomIndex === ref.roomIndex
                        ? '#22d3ee'
                        : '#64748b'
                    }
                    emissive={
                      selectedRoomRef &&
                      selectedRoomRef.blockIndex === ref.blockIndex &&
                      selectedRoomRef.floorIndex === ref.floorIndex &&
                      selectedRoomRef.roomIndex === ref.roomIndex
                        ? '#22d3ee'
                        : '#000000'
                    }
                    emissiveIntensity={
                      selectedRoomRef &&
                      selectedRoomRef.blockIndex === ref.blockIndex &&
                      selectedRoomRef.floorIndex === ref.floorIndex &&
                      selectedRoomRef.roomIndex === ref.roomIndex
                        ? 0.7
                        : 0
                    }
                  />
                </mesh>
              ))}

            {/* Gizmo do ponto selecionado */}
            {currentRoom && (
              <PoiMarker
                key={currentRoom.id}
                position={currentRoom.interest_point as Coordinate}
                color="#22d3ee"
                onChange={(position) => {
                  updateRoom({ ...currentRoom, interest_point: position })
                }}
              />
            )}

            {/* Gates visuais, se existirem */}
            {currentRoom?.gates.map((gate, index) => (
              <GateComponent
                // biome-ignore lint/suspicious/noArrayIndexKey: índice é estável dentro da sala
                key={gate.id ?? index}
                gate={gate}
                onUpdate={(newGate) => {
                  if (!currentRoom) return
                  const updatedGates = [...currentRoom.gates]
                  updatedGates[index] = newGate
                  updateRoom({ ...currentRoom, gates: updatedGates })
                }}
              />
            ))}
          </group>
        </Canvas>

        {/* Painel de coordenadas do POI */}
        {currentRoom && (
          <div className="pointer-events-auto absolute right-4 top-4 w-64 space-y-2 rounded border border-slate-700 bg-slate-900/90 p-3 text-xs text-slate-200 shadow-lg">
            <div className="font-semibold">Interest point (POI)</div>
            <div className="space-y-1">
              {/* X */}
              <div className="flex items-center justify-between gap-2">
                <span className="w-4">x</span>
                {editingAxis === 'x' ? (
                  <input
                    type="number"
                    autoFocus
                    className="w-32 rounded border border-slate-700 bg-slate-800 px-2 py-0.5 text-right"
                    step="0.01"
                    defaultValue={currentRoom.interest_point.x}
                    onBlur={(e) => {
                      const next = Number.parseFloat(e.target.value)
                      if (!Number.isNaN(next)) {
                        const point = { ...currentRoom.interest_point, x: next }
                        updateRoom({ ...currentRoom, interest_point: point })
                      }
                      setEditingAxis(null)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        ;(e.target as HTMLInputElement).blur()
                      }
                    }}
                  />
                ) : (
                  <span
                    className="w-32 cursor-text rounded border border-transparent px-2 py-0.5 text-right hover:border-slate-700 hover:bg-slate-800/60"
                    onDoubleClick={() => setEditingAxis('x')}
                  >
                    {currentRoom.interest_point.x.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Y */}
              <div className="flex items-center justify-between gap-2">
                <span className="w-4">y</span>
                {editingAxis === 'y' ? (
                  <input
                    type="number"
                    autoFocus
                    className="w-32 rounded border border-slate-700 bg-slate-800 px-2 py-0.5 text-right"
                    step="0.01"
                    defaultValue={currentRoom.interest_point.y}
                    onBlur={(e) => {
                      const next = Number.parseFloat(e.target.value)
                      if (!Number.isNaN(next)) {
                        const point = { ...currentRoom.interest_point, y: next }
                        updateRoom({ ...currentRoom, interest_point: point })
                      }
                      setEditingAxis(null)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        ;(e.target as HTMLInputElement).blur()
                      }
                    }}
                  />
                ) : (
                  <span
                    className="w-32 cursor-text rounded border border-transparent px-2 py-0.5 text-right hover:border-slate-700 hover:bg-slate-800/60"
                    onDoubleClick={() => setEditingAxis('y')}
                  >
                    {currentRoom.interest_point.y.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Z */}
              <div className="flex items-center justify-between gap-2">
                <span className="w-4">z</span>
                {editingAxis === 'z' ? (
                  <input
                    type="number"
                    autoFocus
                    className="w-32 rounded border border-slate-700 bg-slate-800 px-2 py-0.5 text-right"
                    step="0.01"
                    defaultValue={currentRoom.interest_point.z}
                    onBlur={(e) => {
                      const next = Number.parseFloat(e.target.value)
                      if (!Number.isNaN(next)) {
                        const point = { ...currentRoom.interest_point, z: next }
                        updateRoom({ ...currentRoom, interest_point: point })
                      }
                      setEditingAxis(null)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        ;(e.target as HTMLInputElement).blur()
                      }
                    }}
                  />
                ) : (
                  <span
                    className="w-32 cursor-text rounded border border-transparent px-2 py-0.5 text-right hover:border-slate-700 hover:bg-slate-800/60"
                    onDoubleClick={() => setEditingAxis('z')}
                  >
                    {currentRoom.interest_point.z.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
            <p className="text-[0.7rem] text-slate-400">
              Dê duplo clique em um valor para editar ou arraste o marcador ciano na cena.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MapEditor
