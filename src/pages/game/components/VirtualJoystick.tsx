import { useRef, useState, useCallback, useEffect } from 'react'
import { useInput } from '@/contexts/InputContext'

export function VirtualJoystick() {
  const { setJoystickInput, isTouchDevice } = useInput()
  const containerRef = useRef<HTMLDivElement>(null)
  const [isActive, setIsActive] = useState(false)
  const touchIdRef = useRef<number | null>(null)

  const DEADZONE = 0.2

  const updateOutput = useCallback(
    (clientX: number, clientY: number) => {
      const container = containerRef.current
      if (!container) return

      const rect = container.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      let dx = (clientX - centerX) / (rect.width / 2)
      let dy = (clientY - centerY) / (rect.height / 2)

      dx = Math.max(-1, Math.min(1, dx))
      dy = Math.max(-1, Math.min(1, dy))

      const len = Math.sqrt(dx * dx + dy * dy)
      if (len < DEADZONE) {
        setJoystickInput(0, 0)
        return
      }

      const normalized = ((len - DEADZONE) / (1 - DEADZONE)) / len
      const outX = dx * normalized
      const outZ = -dy * normalized

      setJoystickInput(outX, outZ)
    },
    [setJoystickInput]
  )

  const handleStart = useCallback(
    (clientX: number, clientY: number, id?: number) => {
      setIsActive(true)
      touchIdRef.current = id ?? null
      updateOutput(clientX, clientY)
    },
    [updateOutput]
  )

  const handleMove = useCallback(
    (clientX: number, clientY: number) => {
      updateOutput(clientX, clientY)
    },
    [updateOutput]
  )

  const handleEnd = useCallback(() => {
    setIsActive(false)
    touchIdRef.current = null
    setJoystickInput(0, 0)
  }, [setJoystickInput])

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (isActive) handleMove(e.clientX, e.clientY)
    }
    const onMouseUp = () => {
      if (isActive) handleEnd()
    }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [isActive, handleMove, handleEnd])

  if (!isTouchDevice) return null

  return (
    <div
      ref={containerRef}
      className="virtual-joystick fixed bottom-28 left-8 z-40 flex h-28 w-28 touch-none select-none items-center justify-center rounded-full border-4 border-white/40 bg-black/40"
      onTouchStart={(e) => {
        e.preventDefault()
        const t = e.changedTouches[0]
        if (t) handleStart(t.clientX, t.clientY, t.identifier)
      }}
      onTouchMove={(e) => {
        const t = Array.from(e.changedTouches).find(
          (x) => x.identifier === touchIdRef.current
        )
        if (t) {
          e.preventDefault()
          handleMove(t.clientX, t.clientY)
        }
      }}
      onTouchEnd={(e) => {
        const t = Array.from(e.changedTouches).find(
          (x) => x.identifier === touchIdRef.current
        )
        if (t) handleEnd()
      }}
      onTouchCancel={handleEnd}
      onMouseDown={(e) => {
        e.preventDefault()
        handleStart(e.clientX, e.clientY)
      }}
    >
      <div
        className={`h-14 w-14 rounded-full bg-white/90 shadow-lg transition-transform ${
          isActive ? 'scale-110' : ''
        }`}
        style={{ pointerEvents: 'none' }}
      />
    </div>
  )
}
