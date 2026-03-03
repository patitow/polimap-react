import { useState, useEffect } from 'react'
import { X, Search, MapPin, ChevronRight, Info } from 'lucide-react'
import { useMapConfig } from '@/hooks/useMapConfig'

interface Room {
  id: string
  name: string
  model_path: string
  interest_point: { x: number; y: number; z: number }
}

interface Floor {
  id: string
  name: string
  rooms: Room[]
}

interface Block {
  id: string
  name: string
  floors: Floor[]
}

interface RoomWithPoi extends Room {
  poi?: { description?: string; photos?: string[]; curiosity?: string; dates?: string; sectors?: string }
}

export type NavigateMode = 'teleport' | 'navigate'

interface NavigationModalProps {
  isOpen: boolean
  onClose: () => void
  onNavigate: (
    blockId: string,
    floorId: string,
    roomId: string,
    modelPath: string,
    interestPoint: { x: number; y: number; z: number },
    mode: NavigateMode
  ) => void
  onInspectPoi?: (name: string, data: RoomWithPoi['poi']) => void
}

const NavigationModal: React.FC<NavigationModalProps> = ({ isOpen, onClose, onNavigate, onInspectPoi }) => {
  const { blocks } = useMapConfig()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBlock, setSelectedBlock] = useState('')
  const [selectedFloor, setSelectedFloor] = useState('')
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)

  const getRoomData = (): RoomWithPoi | null => {
    if (!selectedBlock || !selectedFloor || !selectedRoom) return null
    const block = blocks.find((b) => b.id === selectedBlock)
    const floor = block?.floors?.find((f) => f.id === selectedFloor)
    return (floor?.rooms?.find((r) => r.id === selectedRoom.id) as RoomWithPoi) || null
  }

  const handleBlockSelection = (block: Block) => {
    setSelectedBlock(block.id)
    setSelectedRoom(null)
    if (block.floors?.length === 1) {
      setSelectedFloor(block.floors[0].id)
    } else {
      setSelectedFloor('')
    }
  }

  const filteredBlocks = searchQuery
    ? blocks.filter((block) => {
        const query = searchQuery.toLowerCase()
        return (
          block.name.toLowerCase().includes(query) ||
          block.floors?.some(
            (floor) =>
              floor.name.toLowerCase().includes(query) ||
              floor.rooms?.some((room) => room.name.toLowerCase().includes(query))
          )
        )
      })
    : blocks

  const floorsOfSelectedBlock = selectedBlock
    ? blocks.find((b) => b.id === selectedBlock)?.floors || []
    : []

  const roomsOfSelectedFloor = selectedFloor
    ? floorsOfSelectedBlock.find((f) => f.id === selectedFloor)?.rooms || []
    : []

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('')
      setSelectedBlock('')
      setSelectedFloor('')
      setSelectedRoom(null)
    }
  }, [isOpen])

  const handleAction = (mode: NavigateMode) => {
    const roomData = getRoomData()
    if (selectedBlock && selectedFloor && selectedRoom && roomData) {
      onNavigate(
        selectedBlock,
        selectedFloor,
        selectedRoom.id,
        roomData.model_path,
        roomData.interest_point,
        mode
      )
      onClose()
    }
  }

  const roomData = getRoomData()
  const previewPhoto = roomData?.poi?.photos?.[0]

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header com mapa */}
        <div className="relative h-36 shrink-0 overflow-hidden bg-gradient-to-r from-amber-900/40 via-slate-800 to-amber-900/40">
          <img
            src="/images/mapa_da_poli.png"
            alt="Mapa da POLI"
            className="h-full w-full object-cover object-top opacity-90"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-amber-900/20 to-transparent pointer-events-none" />
          <div className="absolute inset-0 flex items-start justify-between p-4">
            <div className="flex items-center gap-2 rounded-lg bg-black/40 px-3 py-1.5 backdrop-blur-sm">
              <MapPin className="h-5 w-5 text-amber-400" />
              <span className="font-semibold text-white">Navegação</span>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
              aria-label="Fechar"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Busca */}
        <div className="shrink-0 border-b border-white/10 p-3">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Pesquisar bloco, andar ou sala..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-800/80 py-2.5 pl-10 pr-4 text-white placeholder-slate-500 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/30 focus:outline-none"
            />
          </div>
        </div>

        {/* Conteúdo: seleção + preview */}
        <div className="flex min-h-0 flex-1 gap-4 overflow-hidden p-4">
          <div className="flex min-w-0 flex-1 flex-col gap-4 overflow-y-auto">
            {/* Blocos */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Bloco
              </label>
              <div className="flex flex-wrap gap-2">
                {filteredBlocks.map((block) => (
                  <button
                    key={block.id}
                    onClick={() => handleBlockSelection(block)}
                    className={`rounded-xl px-3 py-2 text-sm font-medium transition-all ${
                      selectedBlock === block.id
                        ? 'bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/30'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 hover:text-white'
                    }`}
                  >
                    {block.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Andares */}
            {selectedBlock && floorsOfSelectedBlock.length > 1 && (
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Andar
                </label>
                <div className="flex flex-wrap gap-2">
                  {floorsOfSelectedBlock.map((floor) => (
                    <button
                      key={floor.id}
                      onClick={() => {
                        setSelectedFloor(floor.id)
                        setSelectedRoom(null)
                      }}
                      className={`rounded-xl px-3 py-2 text-sm font-medium transition-all ${
                        selectedFloor === floor.id
                          ? 'bg-amber-500/80 text-slate-900'
                          : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 hover:text-white'
                      }`}
                    >
                      {floor.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Salas */}
            {selectedFloor && (
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Sala / Local
                </label>
                <div className="flex flex-col gap-1.5">
                  {roomsOfSelectedFloor.map((room) => (
                    <button
                      key={room.id}
                      onClick={() => setSelectedRoom(room)}
                      className={`flex items-center justify-between rounded-xl px-4 py-3 text-left text-sm transition-all ${
                        selectedRoom?.id === room.id
                          ? 'bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/50'
                          : 'bg-slate-800/60 text-slate-300 hover:bg-slate-700/60 hover:text-white'
                      }`}
                    >
                      <span className="font-medium">{room.name}</span>
                      <ChevronRight
                        className={`h-5 w-5 transition-transform ${
                          selectedRoom?.id === room.id ? 'translate-x-0 opacity-100' : 'opacity-50'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {filteredBlocks.length === 0 && (
              <div className="py-8 text-center text-slate-500">
                Nenhum resultado para &quot;{searchQuery}&quot;
              </div>
            )}
          </div>

          {/* Preview lateral */}
          <div className="hidden w-48 shrink-0 flex-col sm:flex">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Preview
            </label>
            <div className="flex-1 overflow-hidden rounded-xl border border-white/10 bg-slate-800/50">
              {previewPhoto ? (
                <img
                  src={previewPhoto}
                  alt={selectedRoom?.name ?? ''}
                  className="h-28 w-full object-cover"
                />
              ) : (
                <div className="flex h-28 items-center justify-center bg-slate-800/80">
                  <MapPin className="h-10 w-10 text-slate-600" />
                </div>
              )}
              <div className="p-2">
                <p className="truncate text-xs font-bold text-slate-200">
                  {selectedRoom?.name ?? 'Selecione um local'}
                </p>
                {roomData?.poi?.description && (
                  <p className="mt-1 line-clamp-3 text-[10px] leading-relaxed text-slate-400">
                    {roomData.poi.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="shrink-0 border-t border-white/10 bg-slate-900/80 p-4">
          <div className="flex flex-wrap items-center gap-2">
            {onInspectPoi && roomData?.poi && (
              <button
                onClick={() => {
                  const room = getRoomData()
                  if (room?.poi) {
                    onInspectPoi(selectedRoom?.name ?? room.name, room.poi)
                  }
                }}
                className="flex items-center gap-2 rounded-xl border border-amber-500/50 bg-transparent px-4 py-2.5 text-sm font-medium text-amber-400 transition-colors hover:bg-amber-500/10"
              >
                <Info className="h-4 w-4" />
                Ver informações
              </button>
            )}
            <button
              onClick={() => handleAction('teleport')}
              disabled={!selectedBlock || !selectedFloor || !selectedRoom}
              className="rounded-xl bg-slate-700 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
              title="Teleportar instantaneamente"
            >
              Reposicionar
            </button>
            <button
              onClick={() => handleAction('navigate')}
              disabled={!selectedBlock || !selectedFloor || !selectedRoom}
              className="flex-1 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-medium text-slate-900 transition-colors hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
              title="Caminhar até o destino"
            >
              Navegar
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Reposicionar: teleporte · Navegar: caminhada automática
          </p>
        </div>
      </div>
    </div>
  )
}

export default NavigationModal