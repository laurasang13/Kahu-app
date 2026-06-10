import { useNavigate, useLocation } from 'react-router-dom'
import { useUI } from '../../context/UIContext'
import { useMascota } from '../../context/MascotaContext'
import styles from './Navbar.module.css'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setPesoModal } = useUI()
  const { mascotaActiva } = useMascota()

  return (
    <nav className={styles.navbar}>
      <button
        className={`${styles.navItem} ${location.pathname === '/home' ? styles.active : ''}`}
        onClick={() => navigate('/home')}>
        <span className={styles.navIcon}>🏠</span>
      </button>
      <button
        className={`${styles.navItem} ${location.pathname === '/chat' ? styles.active : ''}`}
        onClick={() => navigate('/chat')}>
        <span className={styles.navIcon}>💬</span>
      </button>
      <button
        className={styles.navItem}
        onClick={() => setPesoModal(true)}
        disabled={!mascotaActiva}>
        <span className={styles.navIcon}>⚖️</span>
      </button>
      <button
        className={`${styles.navItem} ${location.pathname === '/profile' ? styles.active : ''}`}
        onClick={() => navigate('/profile')}>
        <span className={styles.navIcon}>👤</span>
      </button>
    </nav>
  )
}