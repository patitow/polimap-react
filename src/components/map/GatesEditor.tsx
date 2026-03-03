import type { Room } from '@/types/room'

interface GatesEditorProps {
  room: Room
  onUpdateRoom: (room: Room) => void
}

export const GatesEditor: React.FC<GatesEditorProps> = ({ room, onUpdateRoom }) => {
  const addGate = () => {
    const newGate = {
      id: `${room.id}_gate${room.gates.length + 1}`,
      coordinate: { x: 0, y: 0, z: 0 },
      destination: null,
    }
    onUpdateRoom({ ...room, gates: [...room.gates, newGate] })
  }

  return (
    <div className="gates-editor mt-4 rounded-lg bg-slate-100 p-4 dark:bg-slate-800">
      <h3 className="mb-2 text-lg font-bold dark:text-slate-100">Gates Editor</h3>
      <button
        onClick={addGate}
        className="mb-2 rounded bg-blue-500 px-3 py-1.5 text-white hover:bg-blue-600"
      >
        Adicionar Gate
      </button>
      <ul className="space-y-1">
        {room.gates.map((gate) => (
          <li key={gate.id} className="text-sm text-slate-700 dark:text-slate-300">
            {gate.id} ({gate.coordinate.x.toFixed(2)}, {gate.coordinate.y.toFixed(2)},{' '}
            {gate.coordinate.z.toFixed(2)})
          </li>
        ))}
      </ul>
    </div>
  )
}
