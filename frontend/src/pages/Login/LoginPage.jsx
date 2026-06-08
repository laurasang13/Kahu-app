import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../hooks/useLanguage'
import styles from './LoginPage.module.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { lang, t, toggleLang } = useLanguage()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/home')
    } catch (err) {
      setError(t.loginError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <button className={styles.langBtn} onClick={toggleLang}>
        {lang === 'es' ? 'EN' : 'ES'}
      </button>
      <div className={styles.card}>
        <img src="/Kahu_Logo_transparente.png" alt="Kahu" className={styles.logo} />
        <h1 className={styles.title}>{t.loginTitle}</h1>

        {error && <p className={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>{t.email}</label>
            <input
              className={styles.input}
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="hola@kahu.com"
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>{t.password}</label>
            <input
              className={styles.input}
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>
          <button className={styles.btnPrimary} type="submit" disabled={loading}>
            {loading ? t.loading : t.loginBtn}
          </button>
        </form>

        <p className={styles.footer}>
          {t.noAccount} <Link to="/register" className={styles.link}>{t.registerLink}</Link>
        </p>
      </div>
    </div>
  )
}