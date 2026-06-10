import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useMascota } from '../../context/MascotaContext'
import styles from './PesoChart.module.css'

export default function PesoChart({ mascotaId, readOnly = false }) {
  const { fetchRegistrosPeso, addRegistroPeso } = useMascota()
  const [registros, setRegistros] = useState([])
  const [nuevoPeso, setNuevoPeso] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (mascotaId) cargarRegistros()
  }, [mascotaId])

  const cargarRegistros = async () => {
    try {
      const data = await fetchRegistrosPeso(mascotaId)
      setRegistros(data.map(r => ({
        ...r,
        fecha: new Date(r.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
        peso: r.peso_kg
      })))
    } catch (error) {
      console.error('Error al cargar registros de peso:', error)
    }
  }

  const handleAdd = async () => {
    if (!nuevoPeso || isNaN(nuevoPeso)) return
    setLoading(true)
    try {
      await addRegistroPeso(mascotaId, parseFloat(nuevoPeso))
      setNuevoPeso('')
      await cargarRegistros()
    } catch (error) {
      console.error('Error al añadir peso:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      {!readOnly && (
        <div className={styles.addRow}>
          <input
            className={styles.input}
            type="number"
            value={nuevoPeso}
            onChange={e => setNuevoPeso(e.target.value)}
            placeholder="Nuevo peso (kg)"
            step="0.1"
            min="0.1"
          />
          <button className={styles.addBtn} onClick={handleAdd} disabled={loading}>
            {loading ? '...' : '+ Añadir'}
          </button>
        </div>
      )}

      {registros.length === 0 ? (
        <p className={styles.empty}>Sin registros de peso aún</p>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={registros}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
            <XAxis dataKey="fecha" tick={{ fontSize: 11, fill: 'var(--muted)' }} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--muted)' }} unit="kg" />
            <Tooltip
              contentStyle={{
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: '12px',
                fontSize: 13
              }}
            />
            <Line
              type="monotone"
              dataKey="peso"
              stroke="var(--olive)"
              strokeWidth={2.5}
              dot={{ fill: 'var(--olive)', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}