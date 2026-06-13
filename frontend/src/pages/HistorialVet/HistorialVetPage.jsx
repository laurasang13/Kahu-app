import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMascota } from '../../context/MascotaContext'
import { useLanguage } from '../../hooks/useLanguage'
import { api } from '../../services/api'
import { MdArrowBack, MdMedicalServices, MdCalendarToday, MdEvent, MdDeleteOutline } from 'react-icons/md'
import { CiHospital1 } from 'react-icons/ci'
import Navbar from '../../components/Navbar/Navbar'
import Tratamientos from '../../components/Tratamientos/Tratamientos'
import styles from './HistorialVetPage.module.css'

export default function HistorialVetPage() {
  const navigate = useNavigate()
  const { mascotaId } = useParams()
  const { mascotas } = useMascota()
  const { t } = useLanguage()
  const mascota = mascotas.find(m => m.id === mascotaId)

  const [registros, setRegistros] = useState([])
  const [loading, setLoading] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const emptyForm = {
    fecha_visita: '',
    motivo: '',
    descripcion: '',
    tratamiento: '',
    proxima_cita: ''
  }
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    if (mascotaId) cargarHistorial()
  }, [mascotaId])

  const cargarHistorial = async () => {
    setLoading(true)
    try {
      const res = await api.get(`/api/historial-vet/${mascotaId}`)
      setRegistros(res.data)
    } catch (err) {
      console.error('Error al cargar historial:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      await api.post('/api/historial-vet', {
        mascota_id: mascotaId,
        ...form,
        proxima_cita: form.proxima_cita || undefined
      })
      setForm(emptyForm)
      setFormOpen(false)
      await cargarHistorial()
    } catch (err) {
      setError('Error al guardar el registro. Inténtalo de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este registro?')) return
    try {
      await api.delete(`/api/historial-vet/${id}`)
      setRegistros(prev => prev.filter(r => r.id !== id))
    } catch (err) {
      console.error('Error al eliminar:', err)
    }
  }

  const formatDate = (iso) => {
    if (!iso) return ''
    return new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate('/home')}><MdArrowBack /></button>
        <div className={styles.headerInfo}>
          <h1 className={styles.headerTitle}>{t.vetHistory}</h1>
          {mascota && <span className={styles.headerSub}>{mascota.nombre}</span>}
        </div>
      </header>

      <main className={styles.main}>
        <Tratamientos mascotaId={mascotaId} />
        <div className={styles.divider} />

        <div className={styles.visitasHeader}>
          <h2 className={styles.visitasTitle}><MdMedicalServices /> {t.vetVisits}</h2>
          <button
            className={styles.addBtn}
            onClick={() => { setFormOpen(v => !v); setError('') }}
          >
            {formOpen ? '✕' : t.newVisit}
          </button>
        </div>

        {formOpen && (
          <div className={styles.formCard}>
            <h2 className={styles.formTitle}>{t.newVisit}</h2>
            {error && <p className={styles.error}>{error}</p>}
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>{t.visitDate}</label>
                  <input
                    className={styles.input}
                    type="date"
                    name="fecha_visita"
                    value={form.fecha_visita}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>{t.nextAppointment}</label>
                  <input
                    className={styles.input}
                    type="date"
                    name="proxima_cita"
                    value={form.proxima_cita}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>{t.reason}</label>
                <input
                  className={styles.input}
                  type="text"
                  name="motivo"
                  value={form.motivo}
                  onChange={handleChange}
                  placeholder={t.reasonPlaceholder}
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>{t.description}</label>
                <textarea
                  className={styles.textarea}
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleChange}
                  placeholder={t.descriptionPlaceholder}
                  rows={3}
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>{t.treatment}</label>
                <textarea
                  className={styles.textarea}
                  name="tratamiento"
                  value={form.tratamiento}
                  onChange={handleChange}
                  placeholder={t.treatmentPlaceholder}
                  rows={3}
                  required
                />
              </div>

              <button className={styles.btnPrimary} type="submit" disabled={saving}>
                {saving ? t.loading : t.saveRecord}
              </button>
            </form>
          </div>
        )}

        {loading && <p className={styles.loadingText}>Cargando...</p>}

        {!loading && registros.length === 0 && !formOpen && (
          <div className={styles.empty}>
            <CiHospital1 className={styles.emptyEmoji} />
            <p className={styles.emptyText}>{t.noVetRecords}</p>
            <button className={styles.btnPrimary} onClick={() => setFormOpen(true)}>
              {t.addFirstVisit}
            </button>
          </div>
        )}

        {!loading && registros.length > 0 && (
          <div className={styles.list}>
            {registros.map(r => (
              <div key={r.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div>
                    <span className={styles.cardDate}><MdCalendarToday /> {formatDate(r.fecha_visita)}</span>
                    <h3 className={styles.cardMotivo}>{r.motivo}</h3>
                  </div>
                  <button className={styles.deleteBtn} onClick={() => handleDelete(r.id)}><MdDeleteOutline /></button>
                </div>

                <div className={styles.cardSection}>
                  <span className={styles.cardLabel}>Descripción</span>
                  <p className={styles.cardText}>{r.descripcion}</p>
                </div>

                <div className={styles.cardSection}>
                  <span className={styles.cardLabel}>Tratamiento</span>
                  <p className={styles.cardText}>{r.tratamiento}</p>
                </div>

                {r.proxima_cita && (
                  <div className={styles.nextVisit}>
                    <MdEvent /> {t.nextVisit}: {formatDate(r.proxima_cita)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <Navbar />
    </div>
  )
}
