import { createContext, useContext, useState } from 'react'
import { aiApi, api } from '../services/api'
import { useMascota } from './MascotaContext'
import { useAuth } from './AuthContext'

const ChatContext = createContext(null)

export function ChatProvider({ children }) {
  const { mascotaActiva } = useMascota()
  const { usuario } = useAuth()
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
      await api.post('/api/chat', {
        mascota_id: mascotaActiva.id,
        rol: 'user',
        mensaje: texto
      })

      const mascotaInfo = `Mascota: ${mascotaActiva.nombre}, ${mascotaActiva.raza}, ${mascotaActiva.edad_meses} meses, ${mascotaActiva.peso_kg}kg, alergias: ${mascotaActiva.alergias || 'ninguna'}, tipo de dieta: ${mascotaActiva.tipo_dieta || 'BARF'}, tomas al día: ${mascotaActiva.num_tomas || 2}`

      const historialFormateado = mensajes.map(m => ({
        rol: m.rol,
        mensaje: m.mensaje
      }))

      const res = await aiApi.post('/api/chat', {
        mascota_id: mascotaActiva.id,
        mensaje: `[Contexto: ${mascotaInfo}] ${texto}`,
        historial: historialFormateado,
        usuario_email: usuario?.email || '',
        nombre_perro: mascotaActiva.nombre
      })

      const mensajeIA = { rol: 'assistant', mensaje: res.data.respuesta }
      setMensajes(prev => [...prev, mensajeIA])

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

  const limpiarChat = async () => {
    if (mascotaActiva) {
      await api.delete(`/api/chat/${mascotaActiva.id}`)
    }
    setMensajes([])
  }

  
  const resetLocal = () => setMensajes([])

  return (
    <ChatContext.Provider value={{ mensajes, loading, enviarMensaje, fetchHistorial, limpiarChat, resetLocal }}>
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => useContext(ChatContext)