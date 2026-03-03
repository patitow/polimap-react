import { createContext, useContext, useState, useCallback } from 'react'

export type GameState =
  | 'WALKING'
  | 'PAUSE_MENU'
  | 'NAVIGATION_MENU'
  | 'MAP_MENU'
  | 'IN_DIALOG'
  | 'TELEPORTING'
  | 'NAVIGATING'

const FOOTSTEP_STORAGE_KEY = 'polimap-footstep-enabled'

interface GameStateContextValue {
  state: GameState
  setState: (s: GameState) => void
  footstepEnabled: boolean
  setFootstepEnabled: (v: boolean) => void
  setWalking: () => void
  setPauseMenuOpen: () => void
  setPauseMenuClosed: () => void
  setNavMenuOpen: () => void
  setMapMenuOpen: () => void
  setInDialog: () => void
  setDialogClosed: () => void
  canPlayerMove: () => boolean
  isPauseMenuOpen: () => boolean
  isNavMenuOpen: () => boolean
  isMapMenuOpen: () => boolean
  isInDialog: () => boolean
}

const GameStateContext = createContext<GameStateContextValue | null>(null)

export function GameStateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>('WALKING')
  const [footstepEnabled, setFootstepEnabledState] = useState(() => {
    try {
      return localStorage.getItem(FOOTSTEP_STORAGE_KEY) !== 'false'
    } catch {
      return true
    }
  })

  const setFootstepEnabled = useCallback((v: boolean) => {
    setFootstepEnabledState(v)
    try {
      localStorage.setItem(FOOTSTEP_STORAGE_KEY, String(v))
    } catch {}
  }, [])

  const setWalking = useCallback(() => setState('WALKING'), [])
  const setPauseMenuOpen = useCallback(() => {
    setState((s) => (s === 'IN_DIALOG' ? s : 'PAUSE_MENU'))
  }, [])
  const setPauseMenuClosed = useCallback(() => {
    setState((s) => (s === 'PAUSE_MENU' ? 'WALKING' : s))
  }, [])
  const setNavMenuOpen = useCallback(() => {
    setState((s) => (s === 'IN_DIALOG' ? s : 'NAVIGATION_MENU'))
  }, [])
  const setMapMenuOpen = useCallback(() => {
    setState((s) => (s === 'IN_DIALOG' ? s : 'MAP_MENU'))
  }, [])
  const setInDialog = useCallback(() => setState('IN_DIALOG'), [])
  const setDialogClosed = useCallback(() => {
    setState((s) => (s === 'IN_DIALOG' ? 'WALKING' : s))
  }, [])

  const canPlayerMove = useCallback(() => state === 'WALKING', [state])
  const isPauseMenuOpen = useCallback(() => state === 'PAUSE_MENU', [state])
  const isNavMenuOpen = useCallback(() => state === 'NAVIGATION_MENU', [state])
  const isMapMenuOpen = useCallback(() => state === 'MAP_MENU', [state])
  const isInDialog = useCallback(() => state === 'IN_DIALOG', [state])

  const value: GameStateContextValue = {
    state,
    setState,
    footstepEnabled,
    setFootstepEnabled,
    setWalking,
    setPauseMenuOpen,
    setPauseMenuClosed,
    setNavMenuOpen,
    setMapMenuOpen,
    setInDialog,
    setDialogClosed,
    canPlayerMove,
    isPauseMenuOpen,
    isNavMenuOpen,
    isMapMenuOpen,
    isInDialog,
  }

  return (
    <GameStateContext.Provider value={value}>{children}</GameStateContext.Provider>
  )
}

export function useGameState() {
  const ctx = useContext(GameStateContext)
  if (!ctx) throw new Error('useGameState must be used within GameStateProvider')
  return ctx
}
