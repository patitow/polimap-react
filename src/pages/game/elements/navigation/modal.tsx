'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import { X, Search } from 'lucide-react'

interface NavigationModalProps {
  isOpen: boolean
  onClose: () => void
  onNavigate: (block: string, room: string) => void
}

interface Block {
  id: string
  name: string
  rooms: Room[]
}

interface Room {
  id: string
  name: string
}

const NavigationModal: React.FC<NavigationModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBlock, setSelectedBlock] = useState<string>('')
  const [selectedRoom, setSelectedRoom] = useState<string>('')

  // Dados de exemplo - substitua por seus dados reais
  const blocks: Block[] = [
    {
      id: 'A',
      name: 'Bloco A',
      rooms: [
        { id: 'A101', name: 'Sala A101' },
        { id: 'A102', name: 'Sala A102' },
        { id: 'A103', name: 'Laboratório de Informática' },
      ],
    },
    {
      id: 'B',
      name: 'Bloco B',
      rooms: [
        { id: 'B201', name: 'Sala B201' },
        { id: 'B202', name: 'Sala B202' },
        { id: 'B203', name: 'Auditório' },
      ],
    },
    {
      id: 'C',
      name: 'Bloco C',
      rooms: [
        { id: 'C301', name: 'Sala C301' },
        { id: 'C302', name: 'Sala C302' },
        { id: 'C303', name: 'Laboratório de Química' },
      ],
    },
  ]

  // Filtrar blocos e salas com base na pesquisa
  const filteredBlocks = searchQuery
    ? blocks.filter(
        block =>
          block.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          block.rooms.some(room => room.name.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    : blocks

  // Obter as salas do bloco selecionado
  const roomsOfSelectedBlock = selectedBlock
    ? blocks.find(block => block.id === selectedBlock)?.rooms || []
    : []

  // Resetar a seleção quando o modal é fechado
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('')
      setSelectedBlock('')
      setSelectedRoom('')
    }
  }, [isOpen])

  // Lidar com a navegação
  const handleNavigate = () => {
    if (selectedBlock && selectedRoom) {
      onNavigate(selectedBlock, selectedRoom)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative mx-4 max-h-[90vh] w-full max-w-md overflow-hidden rounded-lg bg-white shadow-xl">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <h2 className="text-xl font-semibold text-gray-800">Navegação</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            aria-label="Fechar"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Barra de pesquisa */}
        <div className="border-b border-gray-200 p-4">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar bloco ou sala..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-gray-300 py-2 pr-4 pl-10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Conteúdo */}
        <div className="max-h-[calc(90vh-180px)] overflow-y-auto p-4">
          {/* Seleção de Bloco */}
          <div className="mb-4">
            <label className="mb-2 block font-medium text-gray-700">Selecione o Bloco:</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {filteredBlocks.map(block => (
                <button
                  key={block.id}
                  onClick={() => {
                    setSelectedBlock(block.id)
                    setSelectedRoom('')
                  }}
                  className={`rounded-lg border p-2 text-center transition-colors ${
                    selectedBlock === block.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  {block.name}
                </button>
              ))}
            </div>
          </div>

          {/* Seleção de Sala (apenas se um bloco estiver selecionado) */}
          {selectedBlock && (
            <div className="mb-4">
              <label className="mb-2 block font-medium text-gray-700">Selecione a Sala:</label>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {roomsOfSelectedBlock.map(room => (
                  <button
                    key={room.id}
                    onClick={() => setSelectedRoom(room.id)}
                    className={`rounded-lg border p-2 text-center transition-colors ${
                      selectedRoom === room.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    {room.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Mensagem se não houver resultados */}
          {filteredBlocks.length === 0 && (
            <div className="py-4 text-center text-gray-500">
              Nenhum resultado encontrado para "{searchQuery}"
            </div>
          )}
        </div>

        {/* Rodapé com botão de navegação */}
        <div className="border-t border-gray-200 p-4">
          <button
            onClick={handleNavigate}
            disabled={!selectedBlock || !selectedRoom}
            className="w-full rounded-lg bg-blue-500 py-2 font-medium text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:opacity-70"
          >
            Navegar para o local selecionado
          </button>
        </div>
      </div>
    </div>
  )
}

export default NavigationModal
