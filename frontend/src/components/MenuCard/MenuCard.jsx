import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeSanitize from 'rehype-sanitize'
import { MdFileDownload, MdDeleteOutline } from 'react-icons/md'
import styles from './MenuCard.module.css'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/api'

export default function MenuCard({ plan, onDelete }) {
  const { usuario } = useAuth()
  const [expanded, setExpanded] = useState(false)

  const fecha = new Date(plan.fecha).toLocaleDateString('es-ES', {
    day: 'numeric', month: 'short', year: 'numeric'
  })

  const handleDownload = async (e) => {
    e.stopPropagation()
    try {
      await api.post(`/api/planes/${plan.id}/email`, {})
      alert('📧 Plan enviado a tu correo')
    } catch (error) {
      alert('Error al enviar el email')
    }
  }

  const handleDelete = (e) => {
    e.stopPropagation()
    onDelete(plan.id)
  }

  return (
    <div className={`${styles.card} ${expanded ? styles.expanded : ''}`} onClick={() => setExpanded(prev => !prev)}>
      <div className={styles.header}>
        <span className={styles.date}>{fecha}</span>
        <div className={styles.actions}>
          <button className={styles.downloadBtn} onClick={handleDownload}><MdFileDownload /></button>
          <button className={styles.deleteBtn} onClick={handleDelete}><MdDeleteOutline /></button>
        </div>
      </div>
      <div className={styles.kcal}>
        <span className={styles.kcalNum}>{Math.round(plan.calorias_total)}</span>
        <span className={styles.kcalLabel}>kcal</span>
      </div>

      {!expanded && (
        <>
          <p className={styles.ingredientes}>{plan.ingredientes}</p>
          <span className={styles.expandHint}>Ver plan completo ↓</span>
        </>
      )}

      {expanded && plan.notas_ia && (
        <div className={styles.planCompleto}>
          <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{plan.notas_ia}</ReactMarkdown>
        </div>
      )}
    </div>
  )
}
