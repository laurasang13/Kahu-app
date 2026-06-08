import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../services/api'
import { useAuth } from './AuthContext'

const MascotaContext = createContext(null)

export function MascotaProvider({ children }) {
  const { usuario } = useAuth()
  const [mascotas, setMascotas] = useState([])
  const [mascotaActiva, setMascotaActiva] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (usuario) {
      fetchMascotas()
    } else {
      setMascotas([])
      setMascotaActiva(null)
    }
  }, [usuario])

  const fetchMascotas = async () => {
    setLoading(true)
    try {
      const res = await api.get('/api/mascotas')
      setMascotas(res.data)
      if (res.data.length > 0 && !mascotaActiva) {
        setMascotaActiva(res.data[0])
      }
    } catch (error) {
      console.error('Error al cargar mascotas:', error)
    } finally {
      setLoading(false)
    }
  }

  const crearMascota = async (datos) => {
    const res = await api.post('/api/mascotas', datos)
    setMascotas(prev => [...prev, res.data])
    setMascotaActiva(res.data)
    return res.data
  }

  const actualizarMascota = async (id, datos) => {
    const res = await api.put(`/api/mascotas/${id}`, datos)
    setMascotas(prev => prev.map(m => m.id === id ? res.data : m))
    if (mascotaActiva?.id === id) setMascotaActiva(res.data)
    return res.data
  }

  const eliminarMascota = async (id) => {
    await api.delete(`/api/mascotas/${id}`)
    const nuevas = mascotas.filter(m => m.id !== id)
    setMascotas(nuevas)
    if (mascotaActiva?.id === id) {
      setMascotaActiva(nuevas[0] || null)
    }
  }

  return (
    <MascotaContext.Provider value={{
      mascotas,
      mascotaActiva,
      setMascotaActiva,
      loading,
      fetchMascotas,
      crearMascota,
      actualizarMascota,
      eliminarMascota
    }}>
      {children}
    </MascotaContext.Provider>
  )
}

export const useMascota = () => useContext(MascotaContext)