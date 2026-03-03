import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useGameState } from '@/contexts/GameStateContext'

interface PauseMenuProps {
  onClose: () => void
}

export function PauseMenu({ onClose }: PauseMenuProps) {
  const { setPauseMenuClosed, footstepEnabled, setFootstepEnabled } = useGameState()

  const handleClose = () => {
    setPauseMenuClosed()
    onClose()
  }

  const handleRestart = () => {
    handleClose()
    window.location.reload()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60">
      <div className="relative mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-2xl dark:bg-slate-800">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Menu de Pausa
          </h2>
          <button
            onClick={handleClose}
            className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-700"
            aria-label="Fechar"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="flex flex-col gap-3">
          <label className="flex cursor-pointer items-center justify-between gap-2 rounded-lg border border-slate-200 px-4 py-3 dark:border-slate-600">
            <span className="text-sm text-slate-700 dark:text-slate-300">Som de passos</span>
            <input
              type="checkbox"
              checked={footstepEnabled}
              onChange={(e) => setFootstepEnabled(e.target.checked)}
              className="h-4 w-4"
            />
          </label>
          <Button onClick={handleClose} className="w-full" size="lg">
            Continuar
          </Button>
          <Button
            variant="outline"
            onClick={() => window.open('/tutorial', '_blank')}
            className="w-full"
            size="lg"
          >
            Instruções
          </Button>
          <Button variant="outline" onClick={handleRestart} className="w-full" size="lg">
            Reiniciar
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = '/')}
            className="w-full border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/20"
            size="lg"
          >
            Sair
          </Button>
        </div>
      </div>
    </div>
  )
}
