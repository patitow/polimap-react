import React from 'react'
import { Room } from '@/types/room'

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
    <div className="gates-editor mt-4 bg-gray-100 p-2">
      <h3 className="mb-2 text-lg font-bold">Gates Editor</h3>
      <button onClick={addGate} className="mb-2 rounded bg-blue-500 px-2 py-1 text-white">
        Adicionar Gate
      </button>
      <ul>
        {room.gates.map(gate => (
          <li key={gate.id} className="mb-1">
            <span>{gate.id}</span>
            {/* Aqui você pode adicionar inputs para editar destino, etc. */}
          </li>
        ))}
      </ul>
    </div>
  )
}
