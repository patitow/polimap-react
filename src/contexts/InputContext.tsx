import { createContext, useContext, useState, useCallback } from 'react'

interface InputContextValue {
  joystickInput: { x: number; z: number }
  setJoystickInput: (x: number, z: number) => void
  isTouchDevice: boolean
}

const InputContext = createContext<InputContextValue | null>(null)

export function InputProvider({ children }: { children: React.ReactNode }) {
  const [joystickInput, setJoystickInputState] = useState({ x: 0, z: 0 })
  const isTouchDevice =
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0)

  const setJoystickInput = useCallback((x: number, z: number) => {
    setJoystickInputState({ x, z })
  }, [])

  return (
    <InputContext.Provider
      value={{ joystickInput, setJoystickInput, isTouchDevice }}
    >
      {children}
    </InputContext.Provider>
  )
}

export function useInput() {
  const ctx = useContext(InputContext)
  if (!ctx) throw new Error('useInput must be used within InputProvider')
  return ctx
}
