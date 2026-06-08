import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../hooks/useLanguage'
import styles from './RegisterPage.module.css'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const { lang, t, toggleLang } = useLanguage()
  const [form, setForm] = useState({ nombre: '', email: '', password: '', ciudad: '' })
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
      await register(form.nombre, form.email, form.password, form.ciudad)
      navigate('/newpet')
    } catch (err) {
      setError(t.registerError)
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
        <h1 className={styles.title}>{t.registerTitle}</h1>

        {error && <p className={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>{t.name}</label>
            <input
              className={styles.input}
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Laura"
              required
            />
          </div>
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
          <div className={styles.field}>
            <label className={styles.label}>{t.city}</label>
            <input
              className={styles.input}
              type="text"
              name="ciudad"
              value={form.ciudad}
              onChange={handleChange}
              placeholder="Las Palmas"
            />
          </div>
          <button className={styles.btnPrimary} type="submit" disabled={loading}>
            {loading ? t.loading : t.registerBtn}
          </button>
        </form>

        <p className={styles.footer}>
          {t.hasAccount} <Link to="/login" className={styles.link}>{t.loginLink}</Link>
        </p>
      </div>
    </div>
  )
}