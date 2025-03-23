import React, { useState, useEffect } from 'react'
import './game.css'
import { Canvas } from '@react-three/fiber'
import Experience from './elements/experience'
import { KeyboardControls } from '@react-three/drei'
import { Client, Room } from 'colyseus.js'
import { Chat, IChatMessage} from './elements/chat/chat'

const keyboardMap = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
  { name: 'run', keys: ['Shift'] },
  { name: 'jump', keys: ['Space'] },
]


// Se o componente Experience precisar receber a sala, defina uma interface para as props
interface ExperienceProps {
  room: Room<any> | null
}

// Caso o componente Experience ainda não esteja tipado, podemos encapsulá-lo para passar a prop "room"
const ExperienceWithRoom: React.FC<ExperienceProps> = ({ room }) => {
  return <Experience room={room} />
}

const PolimapGame: React.FC = () => {
  // Tipagem para room e chatMessages
  const [room, setRoom] = useState<Room<any> | null>(null)
  const [chatMessages, setChatMessages] = useState<IChatMessage[]>([])

  useEffect(() => {
    const client = new Client('ws://localhost:2567')
    client
      .joinOrCreate('game_room', { mapId: 'map1' })
      .then((joinedRoom: Room<any>) => {
        setRoom(joinedRoom)

        joinedRoom.onMessage('chat', (msg: IChatMessage) => {
          setChatMessages((prevMessages: IChatMessage[]) => [...prevMessages, msg])
        })

        // Retorna a função de limpeza ao desmontar
        return () => {
          joinedRoom.leave()
        }
      })
      .catch((err: any) => {
        console.error('Erro ao conectar à sala:', err)
      })
  }, [])

  return (
    <div className="game-wrapper">
      <KeyboardControls map={keyboardMap}>
        <Canvas
          style={{
            width: '100dvw',
            height: '100dvh',
            touchAction: 'none',
          }}
          shadows
          camera={{ position: [3, 3, 3], near: 0.1, fov: 40 }}
        >
          <color attach="background" args={['#ececec']} />
          <ExperienceWithRoom room={room} />
        </Canvas>
      </KeyboardControls>
      <Chat room={room} chatMessages={chatMessages} />
    </div>
  )
}

export default PolimapGame
