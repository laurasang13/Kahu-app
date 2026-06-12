import styles from './MenuCard.module.css'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/api'

export default function MenuCard({ plan, onDelete }) {
  const { usuario } = useAuth()
  
  const fecha = new Date(plan.fecha).toLocaleDateString('es-ES', {
    day: 'numeric', month: 'short', year: 'numeric'
  })

  const handleDownload = async () => {
    try {
      await api.post(`/api/planes/${plan.id}/email`, {
        usuario_email: usuario?.email
      })
      alert('📧 Plan enviado a tu correo')
    } catch (error) {
      alert('Error al enviar el email')
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.date}>{fecha}</span>
        <div className={styles.actions}>
          <button className={styles.downloadBtn} onClick={handleDownload}>⬇️</button>
          <button className={styles.deleteBtn} onClick={() => onDelete(plan.id)}>🗑️</button>
        </div>
      </div>
      <div className={styles.kcal}>
        <span className={styles.kcalNum}>{Math.round(plan.calorias_total)}</span>
        <span className={styles.kcalLabel}>kcal</span>
      </div>
      <p className={styles.ingredientes}>{plan.ingredientes}</p>
      {plan.notas_ia && <p className={styles.notas}>{plan.notas_ia}</p>}
    </div>
  )
}