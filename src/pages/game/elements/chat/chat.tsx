import { Button } from '@/components/ui/button'
import { Room } from 'colyseus.js'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

export interface IChatMessage {
  sender: string
  message: string
  mapId: string
}

export const Chat: React.FC<{ room: Room<any> | null; chatMessages: IChatMessage[] }> = ({
  room,
  chatMessages,
}) => {
  const [message, setMessage] = useState<string>('')

  const handleSend = () => {
    if (room && message.trim()) {
      room.send('chat', { text: message, mapId: 'map1' })
      setMessage('')
    }
  }

  return (
    <div className="absolute right-2 bottom-2 flex h-1/4 w-1/4 flex-col items-baseline justify-end">
      <Card className="mb-2 h-full w-full bg-[rgba(0,0,0,0.35)] p-2">
        <div className="[&::-webkit-scrollbar-thumb]:bg-secondary [&::-webkit-scrollbar-track]:bg-secondary-foreground max-h-64 min-h-64 overflow-y-auto [&::-webkit-scrollbar]:right-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-lg [&::-webkit-scrollbar-track]:rounded-full">
          {chatMessages.map((msg: IChatMessage, index: number) => (
            <div key={index} className="chat-message">
              <strong>{msg.sender}:</strong> {msg.message}
            </div>
          ))}
        </div>
      </Card>
      <Card className="flex w-full flex-row bg-[rgba(0,0,0,0.35)] p-2">
        <Input
          className="mr-2 w-3/4"
          type="text"
          value={message}
          placeholder="Digite sua mensagem..."
          onChange={e => setMessage(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') handleSend()
          }}
        />
        <Button className="w-1/4 opacity-100" onClick={handleSend}>
          Enviar
        </Button>
      </Card>
    </div>
  )
}
