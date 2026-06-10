import { useNavigate, useLocation } from 'react-router-dom'
import styles from './Navbar.module.css'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  const items = [
    { path: '/home', icon: '🏠' },
    { path: '/chat', icon: '💬' },
    { path: '/profile', icon: '👤' },
  ]

  return (
    <nav className={styles.navbar}>
      {items.map(item => (
        <button
          key={item.path}
          className={`${styles.navItem} ${location.pathname === item.path ? styles.active : ''}`}
          onClick={() => navigate(item.path)}
        >
          <span className={styles.navIcon}>{item.icon}</span>
        </button>
      ))}
    </nav>
  )
}