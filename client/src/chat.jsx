import { useEffect } from "react"
import {io} from 'socket.io-client'

export default function Chat() {
    useEffect(() => {
        const socket = io(import.meta.env.VITE_API_URI)
        console.log(123)
        socket.on('connect', () => {
            console.log(socket.id)
            socket.emit('hello', 'Hello world')
        })
        socket.on('disconnect', () => {
            console.log(socket.id)
        })
        socket.on('hi', (data) => {
            console.log(data)
        })
        return () => {
            socket.disconnect() 
        }
    }, [])  
  return (
    <div>chat</div>
  )
}
