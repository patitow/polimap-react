import { Button } from '@/components/ui/button'

interface InteractionPromptProps {
  visible: boolean
  onInteract: () => void
}

export function InteractionPrompt({ visible, onInteract }: InteractionPromptProps) {
  if (!visible) return null

  return (
    <div className="absolute bottom-8 left-1/2 z-30 -translate-x-1/2">
      <Button
        onClick={onInteract}
        variant="secondary"
        className="flex items-center gap-2 shadow-lg"
      >
        <kbd className="rounded bg-slate-200 px-1.5 py-0.5 text-xs font-mono dark:bg-slate-700">
          E
        </kbd>
        Interagir
      </Button>
    </div>
  )
}
