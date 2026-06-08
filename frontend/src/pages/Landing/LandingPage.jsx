import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import styles from './LandingPage.module.css'

export default function LandingPage() {
  const navigate = useNavigate()
  const { lang, t, toggleLang } = useLanguage()

  return (
    <div className={styles.container}>
      <button className={styles.langBtn} onClick={toggleLang}>
        {lang === 'es' ? 'EN' : 'ES'}
      </button>
      <div className={styles.content}>
        <img src="/Kahu_Logo_transparente.png" alt="Kahu" className={styles.logo} />
        <p className={styles.tagline}>{t.tagline}</p>
        <div className={styles.buttons}>
          <button className={styles.btnPrimary} onClick={() => navigate('/register')}>
            {t.createAccount}
          </button>
          <button className={styles.btnSecondary} onClick={() => navigate('/login')}>
            {t.login}
          </button>
        </div>
      </div>
    </div>
  )
}