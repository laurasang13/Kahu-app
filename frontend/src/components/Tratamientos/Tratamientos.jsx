import { useState, useEffect } from 'react'
import { api } from '../../services/api'
import styles from './Tratamientos.module.css'

const FRECUENCIAS = [
  { label: 'Mensual (30 días)', dias: 30 },
  { label: 'Trimestral (90 días)', dias: 90 },
  { label: 'Semestral (180 días)', dias: 180 },
  { label: 'Anual (365 días)', dias: 365 },
  { label: 'Personalizado', dias: null },
]

export default function Tratamientos({ mascotaId }) {
  const [tratamientos, setTratamientos] = useState([])
  const [formOpen, setFormOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const emptyForm = { nombre: '', frecuenciaPreset: 30, frecuencia_dias: 30, ultima_dosis: '', notas: '' }
  const [form, setForm] = useState(emptyForm)
  const [customFreq, setCustomFreq] = useState(false)

  useEffect(() => {
    cargar()
  }, [mascotaId])

  const cargar = async () => {
    try {
      const res = await api.get(`/api/tratamientos/${mascotaId}`)
      setTratamientos(res.data)
    } catch (err) {
      console.error('Error al cargar tratamientos:', err)
    }
  }

  const handlePreset = (e) => {
    const val = parseInt(e.target.value)
    if (isNaN(val)) {
      setCustomFreq(true)
      setForm(prev => ({ ...prev, frecuenciaPreset: null }))
    } else {
      setCustomFreq(false)
      setForm(prev => ({ ...prev, frecuenciaPreset: val, frecuencia_dias: val }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      await api.post('/api/tratamientos', {
        mascota_id: mascotaId,
        nombre: form.nombre,
        frecuencia_dias: form.frecuencia_dias,
        ultima_dosis: form.ultima_dosis || undefined,
        notas: form.notas || undefined
      })
      setForm(emptyForm)
      setCustomFreq(false)
      setFormOpen(false)
      await cargar()
    } catch (err) {
      setError('Error al guardar. Inténtalo de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  const handleAdministrar = async (id) => {
    try {
      const res = await api.patch(`/api/tratamientos/${id}/administrar`)
      setTratamientos(prev => prev.map(t => t.id === id ? res.data : t))
    } catch (err) {
      console.error('Error al administrar:', err)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este tratamiento?')) return
    try {
      await api.delete(`/api/tratamientos/${id}`)
      setTratamientos(prev => prev.filter(t => t.id !== id))
    } catch (err) {
      console.error('Error al eliminar:', err)
    }
  }

  const formatDate = (iso) => {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  const getStatus = (proximaDosis) => {
    if (!proximaDosis) return 'pending'
    const diff = new Date(proximaDosis) - new Date()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    if (days < 0) return 'overdue'
    if (days <= 7) return 'soon'
    return 'ok'
  }

  const getDaysLabel = (proximaDosis) => {
    if (!proximaDosis) return 'Sin fecha programada'
    const diff = new Date(proximaDosis) - new Date()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    if (days < 0) return `Atrasado ${Math.abs(days)} días`
    if (days === 0) return 'Hoy'
    if (days === 1) return 'Mañana'
    return `En ${days} días`
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>💊 Tratamientos</h2>
        <button className={styles.addBtn} onClick={() => { setFormOpen(v => !v); setError('') }}>
          {formOpen ? '✕' : '+ Añadir'}
        </button>
      </div>

      {formOpen && (
        <div className={styles.formCard}>
          {error && <p className={styles.error}>{error}</p>}
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>Nombre del tratamiento</label>
              <input
                className={styles.input}
                type="text"
                value={form.nombre}
                onChange={e => setForm(prev => ({ ...prev, nombre: e.target.value }))}
                placeholder="Ej: Pastilla antiparasitaria, Vacuna rabia..."
                required
              />
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Frecuencia</label>
                <select
                  className={styles.input}
                  value={customFreq ? 'custom' : form.frecuenciaPreset}
                  onChange={handlePreset}
                >
                  {FRECUENCIAS.map(f => (
                    <option key={f.label} value={f.dias ?? 'custom'}>{f.label}</option>
                  ))}
                </select>
              </div>

              {customFreq && (
                <div className={styles.field}>
                  <label className={styles.label}>Días entre dosis</label>
                  <input
                    className={styles.input}
                    type="number"
                    min="1"
                    value={form.frecuencia_dias}
                    onChange={e => setForm(prev => ({ ...prev, frecuencia_dias: parseInt(e.target.value) }))}
                    required
                  />
                </div>
              )}

              <div className={styles.field}>
                <label className={styles.label}>Última dosis (opcional)</label>
                <input
                  className={styles.input}
                  type="date"
                  value={form.ultima_dosis}
                  onChange={e => setForm(prev => ({ ...prev, ultima_dosis: e.target.value }))}
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Notas (opcional)</label>
              <input
                className={styles.input}
                type="text"
                value={form.notas}
                onChange={e => setForm(prev => ({ ...prev, notas: e.target.value }))}
                placeholder="Marca, dosis, observaciones..."
              />
            </div>

            <button className={styles.btnPrimary} type="submit" disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar tratamiento'}
            </button>
          </form>
        </div>
      )}

      {tratamientos.length === 0 && !formOpen && (
        <p className={styles.empty}>Sin tratamientos registrados.</p>
      )}

      {tratamientos.length > 0 && (
        <div className={styles.list}>
          {tratamientos.map(t => {
            const status = getStatus(t.proxima_dosis)
            return (
              <div key={t.id} className={`${styles.card} ${styles[status]}`}>
                <div className={styles.cardTop}>
                  <div className={styles.cardMain}>
                    <span className={styles.cardName}>{t.nombre}</span>
                    {t.notas && <span className={styles.cardNotas}>{t.notas}</span>}
                  </div>
                  <button className={styles.deleteBtn} onClick={() => handleDelete(t.id)}>🗑</button>
                </div>

                <div className={styles.cardDates}>
                  <div className={styles.dateItem}>
                    <span className={styles.dateLabel}>Última dosis</span>
                    <span className={styles.dateVal}>{formatDate(t.ultima_dosis)}</span>
                  </div>
                  <div className={styles.dateItem}>
                    <span className={styles.dateLabel}>Próxima dosis</span>
                    <span className={styles.dateVal}>{formatDate(t.proxima_dosis)}</span>
                  </div>
                  <div className={`${styles.badge} ${styles[`badge_${status}`]}`}>
                    {getDaysLabel(t.proxima_dosis)}
                  </div>
                </div>

                <button className={styles.adminBtn} onClick={() => handleAdministrar(t.id)}>
                  ✓ Administrado hoy
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
