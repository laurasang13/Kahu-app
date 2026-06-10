import styles from './MenuCard.module.css'

export default function MenuCard({ plan, onDelete }) {
  const fecha = new Date(plan.fecha).toLocaleDateString('es-ES', {
    day: 'numeric', month: 'short', year: 'numeric'
  })

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.date}>{fecha}</span>
        <button className={styles.deleteBtn} onClick={() => onDelete(plan.id)}>🗑️</button>
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