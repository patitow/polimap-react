import { useEffect, useRef } from 'react'

const STEP_INTERVAL_MS = 500
const MIN_PLAY_INTERVAL_MS = 200
const FOOTSTEP_PATH = '/sounds/footstep.ogg'

/** Singleton AudioContext - evita limite de WebMediaPlayers (extensões podem causar content.js errors) */
let audioContext: AudioContext | null = null
let audioBuffer: AudioBuffer | null = null
let lastPlayTime = 0
let playErrorCount = 0
const MAX_PLAY_ERRORS = 3

async function getAudioBuffer(): Promise<AudioBuffer | null> {
  if (audioBuffer) return audioBuffer
  if (playErrorCount >= MAX_PLAY_ERRORS) return null
  try {
    audioContext ??= new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    const res = await fetch(FOOTSTEP_PATH)
    const arrayBuffer = await res.arrayBuffer()
    audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
    return audioBuffer
  } catch {
    playErrorCount++
    return null
  }
}

function canPlay(): boolean {
  return document.hasFocus() && playErrorCount < MAX_PLAY_ERRORS
}

export function FootstepSound({ isWalking, enabled = true }: { isWalking: boolean; enabled?: boolean }) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    if (!isWalking || !enabled) return

    const play = async () => {
      const now = Date.now()
      if (now - lastPlayTime < MIN_PLAY_INTERVAL_MS) return
      if (!canPlay()) return
      lastPlayTime = now

      const buffer = await getAudioBuffer()
      if (!buffer || !audioContext) return

      try {
        if (audioContext.state === 'suspended') await audioContext.resume()
        const source = audioContext.createBufferSource()
        source.buffer = buffer
        source.connect(audioContext.destination)
        source.start(0)
      } catch {
        playErrorCount++
        // SecurityError / NotAllowedError - extensões (content.js) podem interferir
      }
    }

    play()
    intervalRef.current = setInterval(play, STEP_INTERVAL_MS)
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isWalking, enabled])

  return null
}
