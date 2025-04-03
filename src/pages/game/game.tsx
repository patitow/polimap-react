'use client'

import type React from 'react'
import { useState } from 'react'
import './game.css'
import { Canvas } from '@react-three/fiber'
import Experience from './elements/experience'
import { KeyboardControls } from '@react-three/drei'
import { Map, Search } from 'lucide-react'
import NavigationModal from './elements/navigation/modal'

const keyboardMap = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
  { name: 'run', keys: ['Shift'] },
  { name: 'jump', keys: ['Space'] },
]

const PolimapGame: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const handleNavigateTo = (block: string, room: string) => {
    console.log(`Navegando para o Bloco ${block}, Sala ${room}`)
    // Aqui você pode adicionar a lógica para navegar até o local selecionado
    closeModal()
  }

  return (
    <div className="game-wrapper">
      <KeyboardControls map={keyboardMap}>
        <Canvas
          style={{
            width: '100dvw',
            height: '100dvh',
            touchAction: 'none',
          }}
          shadows
          camera={{ position: [3, 3, 3], near: 0.1, fov: 40 }}
        >
          <color attach="background" args={['#ececec']} />
          <Experience />
        </Canvas>
      </KeyboardControls>
      <div className="from-slate-900/50 absolute top-[4rem] left-0 z-40 flex h-20 w-full flex-row items-center justify-start gap-2 bg-gradient-to-b to-transparent px-4">
        {/* Botão de Mapa */}
        <button
          onClick={openModal}
          className="relative z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary-foreground text-primary shadow-lg transition-transform hover:scale-105 hover:bg-primary-foreground/90"
          aria-label="Abrir mapa"
        >
          <div className="relative">
            <Map className="h-6 w-6" />
            <Search className="absolute -top-1 -right-1 h-5 w-5" />
          </div>
        </button>
      </div>

      {/* Modal de Navegação */}
      <NavigationModal isOpen={isModalOpen} onClose={closeModal} onNavigate={handleNavigateTo} />
    </div>
  )
}

export default PolimapGame
