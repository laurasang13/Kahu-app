import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMascota } from '../../context/MascotaContext'
import { useLanguage } from '../../hooks/useLanguage'
import { MdPets } from 'react-icons/md'
import styles from './NewPetPage.module.css'

export default function NewPetPage() {
  const navigate = useNavigate()
  const { crearMascota } = useMascota()
  const { lang, t, toggleLang } = useLanguage()
  const [form, setForm] = useState({
    nombre: '',
    raza: '',
    peso_kg: '',
    edad_meses: '',
    sexo: '',
    alergias: '',
    tipo_dieta: 'BARF',
    num_tomas: 2
  })
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
      await crearMascota({
        ...form,
        peso_kg: parseFloat(form.peso_kg),
        edad_meses: parseInt(form.edad_meses)
      })
      navigate('/home')
    } catch (err) {
      setError(t.petError)
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
        <div className={styles.header}>
          <MdPets className={styles.emoji} />
          <h1 className={styles.title}>{t.newPetTitle}</h1>
          <p className={styles.subtitle}>{t.newPetSubtitle}</p>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>{t.petName}</label>
            <input className={styles.input} type="text" name="nombre"
              value={form.nombre} onChange={handleChange} placeholder="Luna" required />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>{t.breed}</label>
            <input className={styles.input} type="text" name="raza"
              value={form.raza} onChange={handleChange} placeholder="Border Collie" required />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>{t.weight}</label>
              <input className={styles.input} type="number" name="peso_kg"
                value={form.peso_kg} onChange={handleChange} placeholder="10" step="0.1" min="0.1" required />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>{t.ageMonths}</label>
              <input className={styles.input} type="number" name="edad_meses"
                value={form.edad_meses} onChange={handleChange} placeholder="36" min="0" required />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>{t.sex}</label>
            <div className={styles.sexBtns}>
              <button type="button"
                className={`${styles.sexBtn} ${form.sexo === 'macho' ? styles.sexActive : ''}`}
                onClick={() => setForm(prev => ({ ...prev, sexo: 'macho' }))}>
                ♂ {t.male}
              </button>
              <button type="button"
                className={`${styles.sexBtn} ${form.sexo === 'hembra' ? styles.sexActive : ''}`}
                onClick={() => setForm(prev => ({ ...prev, sexo: 'hembra' }))}>
                ♀ {t.female}
              </button>
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>{t.allergies}</label>
            <input className={styles.input} type="text" name="alergias"
              value={form.alergias} onChange={handleChange} placeholder={t.allergiesPlaceholder} />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>{t.dietType}</label>
            <div className={styles.sexBtns}>
              <button type="button"
                className={`${styles.sexBtn} ${form.tipo_dieta === 'BARF' ? styles.sexActive : ''}`}
                onClick={() => setForm(prev => ({ ...prev, tipo_dieta: 'BARF' }))}>
                🥩 BARF
              </button>
              <button type="button"
                className={`${styles.sexBtn} ${form.tipo_dieta === 'cocinada' ? styles.sexActive : ''}`}
                onClick={() => setForm(prev => ({ ...prev, tipo_dieta: 'cocinada' }))}>
                🍳 {t.cooked}
              </button>
              <button type="button"
                className={`${styles.sexBtn} ${form.tipo_dieta === 'mixta' ? styles.sexActive : ''}`}
                onClick={() => setForm(prev => ({ ...prev, tipo_dieta: 'mixta' }))}>
                🔀 {t.mixed}
              </button>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>{t.mealsPerDay}</label>
              <div className={styles.sexBtns}>
                {[1, 2, 3].map(n => (
                  <button key={n} type="button"
                    className={`${styles.sexBtn} ${form.num_tomas === n ? styles.sexActive : ''}`}
                    onClick={() => setForm(prev => ({ ...prev, num_tomas: n }))}>
                    {n} {n === 1 ? t.meal : t.meals}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button className={styles.btnPrimary} type="submit" disabled={loading || !form.sexo}>
            {loading ? t.loading : t.savePet}
          </button>
        </form>
      </div>
    </div>
  )
}