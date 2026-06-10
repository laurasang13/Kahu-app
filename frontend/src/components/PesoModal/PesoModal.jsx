import { useUI } from '../../context/UIContext'
import { useMascota } from '../../context/MascotaContext'
import PesoChart from '../PesoChart/PesoChart'
import styles from './PesoModal.module.css'

export default function PesoModal() {
  const { pesoModal, setPesoModal } = useUI()
  const { mascotaActiva } = useMascota()

  if (!pesoModal || !mascotaActiva) return null

  return (
    <div className={styles.overlay} onClick={() => setPesoModal(false)}>
      <div className={styles.content} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>⚖️ {mascotaActiva.nombre}</h2>
          <button className={styles.close} onClick={() => setPesoModal(false)}>✕</button>
        </div>
        <PesoChart mascotaId={mascotaActiva.id} />
      </div>
    </div>
  )
}