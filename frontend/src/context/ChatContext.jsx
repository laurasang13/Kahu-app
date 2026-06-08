import { createContext, useContext, useState } from 'react'
import { aiApi, api } from '../services/api'
import { useMascota } from './MascotaContext'

const ChatContext = createContext(null)

export function ChatProvider({ children }) {
  const { mascotaActiva } = useMascota()
  const [mensajes, setMensajes] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchHistorial = async (mascotaId) => {
    try {
      const res = await api.get(`/api/chat/${mascotaId}`)
      setMensajes(res.data)
    } catch (error) {
      console.error('Error al cargar historial:', error)
    }
  }

  const enviarMensaje = async (texto) => {
    if (!mascotaActiva) return

    const mensajeUsuario = { rol: 'user', mensaje: texto }
    setMensajes(prev => [...prev, mensajeUsuario])
    setLoading(true)

    try {
      // Guardar mensaje del usuario en BD
      await api.post('/api/chat', {
        mascota_id: mascotaActiva.id,
        rol: 'user',
        mensaje: texto
      })

      // Enviar al agente IA con contexto de la mascota
      const mascotaInfo = `Mascota: ${mascotaActiva.nombre}, ${mascotaActiva.raza}, ${mascotaActiva.edad_meses} meses, ${mascotaActiva.peso_kg}kg, alergias: ${mascotaActiva.alergias || 'ninguna'}`

      const historialFormateado = mensajes.map(m => ({
        rol: m.rol,
        mensaje: m.mensaje
      }))

      const res = await aiApi.post('/api/chat', {
        mascota_id: mascotaActiva.id,
        mensaje: `[Contexto: ${mascotaInfo}] ${texto}`,
        historial: historialFormateado
      })

      const mensajeIA = { rol: 'assistant', mensaje: res.data.respuesta }
      setMensajes(prev => [...prev, mensajeIA])

      // Guardar respuesta IA en BD
      await api.post('/api/chat', {
        mascota_id: mascotaActiva.id,
        rol: 'assistant',
        mensaje: res.data.respuesta
      })

    } catch (error) {
      console.error('Error al enviar mensaje:', error)
      setMensajes(prev => [...prev, {
        rol: 'assistant',
        mensaje: 'Lo siento, ha ocurrido un error. Inténtalo de nuevo.'
      }])
    } finally {
      setLoading(false)
    }
  }

  const limpiarChat = () => setMensajes([])

  return (
    <ChatContext.Provider value={{ mensajes, loading, enviarMensaje, fetchHistorial, limpiarChat }}>
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => useContext(ChatContext)