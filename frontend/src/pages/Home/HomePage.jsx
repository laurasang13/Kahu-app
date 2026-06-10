import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useMascota } from '../../context/MascotaContext'
import { useLanguage } from '../../hooks/useLanguage'
import styles from './HomePage.module.css'
import Navbar from '../../components/Navbar/Navbar'

export default function HomePage() {
  const navigate = useNavigate()
  const { usuario, logout } = useAuth()
  const { mascotas, mascotaActiva, setMascotaActiva } = useMascota()
  const { lang, t, toggleLang } = useLanguage()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <img src="/Kahu_Logo_transparente.png" alt="Kahu" className={styles.logo} />
        <div className={styles.headerRight}>
          <button className={styles.langBtn} onClick={toggleLang}>{lang === 'es' ? 'EN' : 'ES'}</button>
          <button className={styles.logoutBtn} onClick={handleLogout}>{t.logout}</button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.greeting}>
          <h1 className={styles.title}>{t.hello}, {usuario?.nombre} 👋</h1>
          <p className={styles.subtitle}>{t.homeSubtitle}</p>
        </div>

        {mascotas.length > 0 ? (
          <>
            <div className={styles.petsSection}>
              <h2 className={styles.sectionTitle}>{t.myPets}</h2>
              <div className={styles.petsList}>
                {mascotas.map(m => (
                  <div
                    key={m.id}
                    className={`${styles.petCard} ${mascotaActiva?.id === m.id ? styles.petActive : ''}`}
                    onClick={() => setMascotaActiva(m)}
                  >
                    <span className={styles.petEmoji}>🐾</span>
                    <div>
                      <div className={styles.petName}>{m.nombre}</div>
                      <div className={styles.petBreed}>{m.raza}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {mascotaActiva && (
              <div className={styles.activeCard}>
                <div className={styles.activeInfo}>
                  <h3 className={styles.activeName}>{mascotaActiva.nombre}</h3>
                  <p className={styles.activeMeta}>{mascotaActiva.raza} · {mascotaActiva.peso_kg}kg · {mascotaActiva.edad_meses} {t.months}</p>
                  {mascotaActiva.alergias && <p className={styles.activeAllergy}>⚠️ {t.allergies}: {mascotaActiva.alergias}</p>}
                </div>
                <button className={styles.chatBtn} onClick={() => navigate('/chat')}>
                  🤖 {t.chatWithKahu}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className={styles.emptyState}>
            <span className={styles.emptyEmoji}>🐕</span>
            <p className={styles.emptyText}>{t.noPets}</p>
            <button className={styles.addBtn} onClick={() => navigate('/newpet')}>{t.addPet}</button>
          </div>
        )}

        <div className={styles.quickActions}>
          <h2 className={styles.sectionTitle}>{t.quickActions}</h2>
          <div className={styles.actionsGrid}>
            <button className={styles.actionCard} onClick={() => navigate('/chat')}>
              <span className={styles.actionIcon}>💬</span>
              <span className={styles.actionLabel}>{t.chat}</span>
            </button>
            <button className={styles.actionCard} onClick={() => navigate('/profile')}>
              <span className={styles.actionIcon}>🐾</span>
              <span className={styles.actionLabel}>{t.profile}</span>
            </button>
            <button className={styles.actionCard} onClick={() => navigate('/newpet')}>
              <span className={styles.actionIcon}>➕</span>
              <span className={styles.actionLabel}>{t.addPet}</span>
            </button>
          </div>
        </div>
      </main>

      <Navbar />
      
    </div>
  )
}