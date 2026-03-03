import { useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { PoiInfo } from '@/types/room'
import { useGameState } from '@/contexts/GameStateContext'

interface InspectMenuProps {
  poiName: string
  poiData: PoiInfo
  onClose: () => void
}

export function InspectMenu({ poiName, poiData, onClose }: InspectMenuProps) {
  const { setDialogClosed } = useGameState()
  const photos = poiData?.photos ?? []
  const [imgIdx, setImgIdx] = useState(0)

  const handleClose = () => {
    setDialogClosed()
    onClose()
  }

  const prevImg = () => {
    setImgIdx((i) => (i > 0 ? i - 1 : photos.length - 1))
  }
  const nextImg = () => {
    setImgIdx((i) => (i < photos.length - 1 ? i + 1 : 0))
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60">
      <div className="relative mx-4 max-h-[90vh] w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-slate-800">
        <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            {poiName}
          </h2>
          <button
            onClick={handleClose}
            className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-700"
            aria-label="Fechar"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="max-h-[calc(90vh-140px)] overflow-y-auto p-4">
          {photos.length > 0 && photos[imgIdx] && (
            <div className="relative mb-4 aspect-video overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-700">
              <img
                src={photos[imgIdx]}
                alt={`${poiName} - foto ${imgIdx + 1}`}
                className="h-full w-full object-cover"
              />
              {photos.length > 1 && (
                <>
                  <button
                    onClick={prevImg}
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextImg}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded bg-black/50 px-2 py-1 text-sm text-white">
                    {imgIdx + 1} / {photos.length}
                  </span>
                </>
              )}
            </div>
          )}
          {poiData?.description && (
            <p className="mb-3 text-slate-600 dark:text-slate-300">
              {poiData.description}
            </p>
          )}
          {poiData?.curiosity && (
            <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
              <strong>Curiosidade:</strong> {poiData.curiosity}
            </p>
          )}
          {poiData?.dates && (
            <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
              <strong>Datas:</strong> {poiData.dates}
            </p>
          )}
          {poiData?.sectors && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              <strong>Setores:</strong> {poiData.sectors}
            </p>
          )}
        </div>
        <div className="border-t border-slate-200 p-4 dark:border-slate-700">
          <Button onClick={handleClose} className="w-full">
            Fechar
          </Button>
        </div>
      </div>
    </div>
  )
}
