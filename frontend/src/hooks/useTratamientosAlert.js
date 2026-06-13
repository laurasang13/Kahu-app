import { useState, useEffect } from 'react'
import { api } from '../services/api'

export function useTratamientosAlert(mascotaId) {
  const [alertas, setAlertas] = useState([])

  useEffect(() => {
    if (!mascotaId) return

    api.get(`/api/tratamientos/${mascotaId}`)
      .then(res => {
        const urgentes = res.data
          .filter(t => t.proxima_dosis)
          .map(t => {
            const diff = new Date(t.proxima_dosis) - new Date()
            const dias = Math.ceil(diff / (1000 * 60 * 60 * 24))
            return { ...t, diasRestantes: dias }
          })
          .filter(t => t.diasRestantes <= 7)
          .sort((a, b) => a.diasRestantes - b.diasRestantes)

        setAlertas(urgentes)
      })
      .catch(() => setAlertas([]))
  }, [mascotaId])

  return { alertas }
}
