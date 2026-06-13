import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMascota } from '../../context/MascotaContext'
import { useLanguage } from '../../hooks/useLanguage'
import { MdArrowBack, MdRestaurant } from 'react-icons/md'
import MenuCard from '../../components/MenuCard/MenuCard'
import Navbar from '../../components/Navbar/Navbar'
import styles from './MenusPage.module.css'

export default function MenusPage() {
  const navigate = useNavigate()
  const { mascotaId } = useParams()
  const { mascotas, fetchPlanes, eliminarPlan } = useMascota()
  const { lang, t, toggleLang } = useLanguage()
  const [planes, setPlanes] = useState([])
  const [loading, setLoading] = useState(false)

  const mascota = mascotas.find(m => m.id === mascotaId)

  useEffect(() => {
    if (mascotaId) cargarPlanes()
  }, [mascotaId])

  const cargarPlanes = async () => {
    setLoading(true)
    try {
      const data = await fetchPlanes(mascotaId)
      setPlanes(data)
    } catch (error) {
      console.error('Error al cargar planes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm(t.confirmDeletePlan)) {
      await eliminarPlan(id)
      setPlanes(prev => prev.filter(p => p.id !== id))
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate('/profile')}><MdArrowBack /></button>
        <div className={styles.headerInfo}>
          <h1 className={styles.headerTitle}>{t.savedMenus}</h1>
          {mascota && <span className={styles.headerSub}>{mascota.nombre}</span>}
        </div>
        <button className={styles.langBtn} onClick={toggleLang}>{lang === 'es' ? 'EN' : 'ES'}</button>
      </header>

      <main className={styles.main}>
        {loading && <p className={styles.loading}>Cargando...</p>}

        {!loading && planes.length === 0 && (
          <div className={styles.empty}>
            <MdRestaurant className={styles.emptyEmoji} />
            <p className={styles.emptyText}>{t.noMenus}</p>
            <button className={styles.chatBtn} onClick={() => navigate('/chat')}>
              {t.goToChat}
            </button>
          </div>
        )}

        {!loading && planes.length > 0 && (
          <div className={styles.grid}>
            {planes.map(plan => (
              <MenuCard key={plan.id} plan={plan} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </main>

      <Navbar />
    </div>
  )
}