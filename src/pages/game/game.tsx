import { useState, Suspense, useEffect, useCallback, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { KeyboardControls } from '@react-three/drei'
import { Map, Search } from 'lucide-react'
import { Experience } from './elements/Experience'
import NavigationModal from './elements/navigation/NavigationModal'
import { GameStateProvider, useGameState } from '@/contexts/GameStateContext'
import { InputProvider } from '@/contexts/InputContext'
import { VirtualJoystick } from './components/VirtualJoystick'
import { FootstepSound } from './components/FootstepSound'
import { PauseMenu } from './components/PauseMenu'
import { InspectMenu } from './components/InspectMenu'
import type { PoiInfo, Room } from '@/types/room'
import type { NavigateMode } from './elements/navigation/NavigationModal'
import { DEFAULT_SPAWN } from '@/config/spawn'
import { useMapConfig } from '@/hooks/useMapConfig'

const keyboardMap = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
  { name: 'run', keys: ['Shift'] },
  { name: 'jump', keys: ['Space'] },
  { name: 'interact', keys: ['KeyE'] },
]

function PolimapGameInner() {
  const [isNavModalOpen, setIsNavModalOpen] = useState(false)
  const [isPauseOpen, setIsPauseOpen] = useState(false)
  const [inspectPoi, setInspectPoi] = useState<{ name: string; data: PoiInfo } | null>(null)
  const [currentScene, setCurrentScene] = useState('model_poli_overworld')
  const [teleportPosition, setTeleportPosition] = useState<{
    x: number
    y: number
    z: number
  } | null>(DEFAULT_SPAWN)
  const [autopilotTarget, setAutopilotTarget] = useState<{
    x: number
    y: number
    z: number
  } | null>(null)
  const [isWalking, setIsWalking] = useState(false)

  const { getRoomsForScene } = useMapConfig()
  const sceneRooms = getRoomsForScene(currentScene)

  const {
    setNavMenuOpen,
    setPauseMenuOpen,
    setWalking,
    isInDialog,
    isPauseMenuOpen,
    canPlayerMove,
    footstepEnabled,
    setInDialog,
  } = useGameState()

  const openNavModal = useCallback(() => {
    if (!isInDialog()) {
      setIsNavModalOpen(true)
      setNavMenuOpen()
    }
  }, [setNavMenuOpen, isInDialog])

  const closeNavModal = useCallback(() => {
    setIsNavModalOpen(false)
    setWalking()
  }, [setWalking])

  const handleInteract = useCallback(
    (room: Room) => {
      if (room.poi) {
        setInspectPoi({ name: room.name, data: room.poi })
        setInDialog()
        // Libera o mouse do pointer lock para o usuário interagir com o modal (fotos, scroll, etc.)
        if (document.exitPointerLock) {
          document.exitPointerLock()
        }
      }
    },
    [setInDialog]
  )

  const handleNavigate = useCallback(
    (
      _blockId: string,
      _floorId: string,
      _roomId: string,
      modelPath: string,
      interestPoint: { x: number; y: number; z: number },
      mode: NavigateMode
    ) => {
      // interest_point já está em coordenadas de mundo (mesmo sistema da cena Godot)
      const point = interestPoint
      const sameScene = currentScene === modelPath

      if (mode === 'teleport') {
        setAutopilotTarget(null)
        setCurrentScene(modelPath)
        setTeleportPosition(point)
      } else {
        if (sameScene) {
          setTeleportPosition(null)
          setAutopilotTarget(point)
        } else {
          setAutopilotTarget(null)
          setCurrentScene(modelPath)
          setTeleportPosition(point)
        }
      }
      closeNavModal()
    },
    [closeNavModal, currentScene]
  )

  const handleAutopilotArrived = useCallback(() => {
    setAutopilotTarget(null)
  }, [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        if (inspectPoi) {
          setInspectPoi(null)
        } else if (isPauseMenuOpen()) {
          setIsPauseOpen(false)
        } else {
          setIsPauseOpen(true)
          setPauseMenuOpen()
        }
      }
      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault()
        openNavModal()
      }
      if (e.key === 'b' || e.key === 'B') {
        e.preventDefault()
        openNavModal()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [openNavModal, setPauseMenuOpen, isPauseMenuOpen, inspectPoi])

  const canvasContainerRef = useRef<HTMLDivElement>(null)

  const handleCanvasClick = useCallback(() => {
    if (!inspectPoi && !isPauseMenuOpen() && !isNavModalOpen) {
      canvasContainerRef.current?.requestPointerLock?.()
    }
  }, [inspectPoi, isNavModalOpen, isPauseMenuOpen])

  return (
    <div className="game-wrapper relative h-dvh w-full">
      <KeyboardControls map={keyboardMap}>
        <div
          ref={canvasContainerRef}
          className="absolute inset-0"
          onClick={handleCanvasClick}
          style={{ cursor: 'grab' }}
        >
        <Canvas
          style={{ width: '100%', height: '100%', touchAction: 'none', cursor: 'grab' }}
          shadows
          camera={{ position: [3, 3, 3], near: 0.1, fov: 40 }}
        >
          <color attach="background" args={['#ececec']} />
          <Suspense fallback={null}>
            <Experience
              currentScene={currentScene}
              teleportPosition={teleportPosition}
              canMove={canPlayerMove()}
              autopilotTarget={autopilotTarget}
              onAutopilotArrived={handleAutopilotArrived}
              onWalkingChange={setIsWalking}
              rooms={sceneRooms}
              onInteract={handleInteract}
            />
          </Suspense>
        </Canvas>
        </div>
      </KeyboardControls>

      <div className="absolute top-[4rem] left-0 z-30 flex h-20 w-full flex-row items-center justify-start gap-2 bg-gradient-to-b from-slate-900/50 to-transparent px-4">
        <button
          type='button'
          onClick={openNavModal}
          className="relative z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary-foreground text-primary shadow-lg transition-transform hover:scale-105 hover:bg-primary-foreground/90"
          aria-label="Abrir mapa (M ou B)"
          title="Navegação (M ou B)"
        >
          <div className="relative">
            <Map className="h-6 w-6" />
            <Search className="absolute -top-1 -right-1 h-5 w-5" />
          </div>
        </button>
        <span className="text-xs text-white/80">
          M/B: Mapa · ESC: Pausa · E: Interagir
        </span>
      </div>

      <NavigationModal
        isOpen={isNavModalOpen}
        onClose={closeNavModal}
        onNavigate={handleNavigate}
        onInspectPoi={(name, data) => {
          if (data) {
            setInspectPoi({ name, data })
            setInDialog()
            if (document.exitPointerLock) {
              document.exitPointerLock()
            }
          }
        }}
      />

      {isPauseOpen && (
        <PauseMenu onClose={() => setIsPauseOpen(false)} />
      )}

      {inspectPoi && (
        <InspectMenu
          poiName={inspectPoi.name}
          poiData={inspectPoi.data}
          onClose={() => setInspectPoi(null)}
        />
      )}

      <FootstepSound isWalking={isWalking} enabled={footstepEnabled} />
    </div>
  )
}

const PolimapGame = () => (
  <GameStateProvider>
    <InputProvider>
      <PolimapGameInner />
      <VirtualJoystick />
    </InputProvider>
  </GameStateProvider>
)

export default PolimapGame
