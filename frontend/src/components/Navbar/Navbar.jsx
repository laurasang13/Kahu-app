import { useNavigate, useLocation } from 'react-router-dom'
import { useUI } from '../../context/UIContext'
import { useMascota } from '../../context/MascotaContext'
import { MdHome, MdChat, MdSmartToy, MdMonitorWeight, MdPerson } from 'react-icons/md'
import { PiChefHatLight } from "react-icons/pi";
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
        <MdHome className={styles.navIcon} />
      </button>
      <button
        className={`${styles.navItem} ${location.pathname === '/chat' ? styles.active : ''}`}
        onClick={() => navigate('/chat')}>
        <PiChefHatLight className={styles.navIcon} />
      </button>
      <button
        className={styles.navItem}
        onClick={() => setPesoModal(true)}
        disabled={!mascotaActiva}>
        <MdMonitorWeight className={styles.navIcon} />
      </button>
      <button
        className={`${styles.navItem} ${location.pathname === '/profile' ? styles.active : ''}`}
        onClick={() => navigate('/profile')}>
        <MdPerson className={styles.navIcon} />
      </button>
    </nav>
  )
}