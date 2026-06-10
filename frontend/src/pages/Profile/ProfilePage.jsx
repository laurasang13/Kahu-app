import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useMascota } from '../../context/MascotaContext'
import { useLanguage } from '../../hooks/useLanguage'
import styles from './ProfilePage.module.css'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { usuario, logout } = useAuth()
  const { mascotas, mascotaActiva, setMascotaActiva, actualizarMascota, eliminarMascota } = useMascota()
  const { lang, t, toggleLang } = useLanguage()
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState({})

  const handleEdit = (mascota) => {
    setEditando(mascota.id)
    setForm({
      nombre: mascota.nombre,
      raza: mascota.raza,
      peso_kg: mascota.peso_kg,
      edad_meses: mascota.edad_meses,
      sexo: mascota.sexo,
      alergias: mascota.alergias || '',
      tipo_dieta: mascota.tipo_dieta || 'BARF'
    })
  }

  const handleSave = async () => {
    await actualizarMascota(editando, {
      ...form,
      peso_kg: parseFloat(form.peso_kg),
      edad_meses: parseInt(form.edad_meses)
    })
    setEditando(null)
  }

  const handleDelete = async (id) => {
    if (window.confirm(t.confirmDelete)) {
      await eliminarMascota(id)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate('/home')}>←</button>
        <h1 className={styles.headerTitle}>{t.profile}</h1>
        <button className={styles.langBtn} onClick={toggleLang}>{lang === 'es' ? 'EN' : 'ES'}</button>
      </header>

      <main className={styles.main}>
        <div className={styles.userCard}>
          <div className={styles.userAvatar}>{usuario?.nombre?.[0]?.toUpperCase()}</div>
          <div>
            <div className={styles.userName}>{usuario?.nombre}</div>
            <div className={styles.userEmail}>{usuario?.email}</div>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{t.myPets}</h2>
            <button className={styles.addBtn} onClick={() => navigate('/newpet')}>+ {t.addPet}</button>
          </div>

          {mascotas.map(mascota => (
            <div key={mascota.id} className={styles.petCard}>
              {editando === mascota.id ? (
                <div className={styles.editForm}>
                  <input className={styles.input} value={form.nombre}
                    onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))} />
                  <input className={styles.input} value={form.raza}
                    onChange={e => setForm(p => ({ ...p, raza: e.target.value }))} />
                  <div className={styles.row}>
                    <input className={styles.input} type="number" value={form.peso_kg}
                      onChange={e => setForm(p => ({ ...p, peso_kg: e.target.value }))} />
                    <input className={styles.input} type="number" value={form.edad_meses}
                      onChange={e => setForm(p => ({ ...p, edad_meses: e.target.value }))} />
                  </div>
                  <input className={styles.input} value={form.alergias}
                    onChange={e => setForm(p => ({ ...p, alergias: e.target.value }))} />
                  <div className={styles.sexBtns}>
                    {['BARF', 'cocinada', 'mixta'].map(tipo => (
                      <button key={tipo} type="button"
                        className={`${styles.sexBtn} ${form.tipo_dieta === tipo ? styles.sexActive : ''}`}
                        onClick={() => setForm(p => ({ ...p, tipo_dieta: tipo }))}>
                        {tipo}
                      </button>
                    ))}
                  </div>
                  <div className={styles.editBtns}>
                    <button className={styles.saveBtn} onClick={handleSave}>{t.save}</button>
                    <button className={styles.cancelBtn} onClick={() => setEditando(null)}>{t.cancel}</button>
                  </div>
                </div>
              ) : (
                <div className={styles.petInfo}>
                  <div className={styles.petHeader}>
                    <span className={styles.petName}>{mascota.nombre}</span>
                    <div className={styles.petActions}>
                      <button className={styles.editBtn} onClick={() => handleEdit(mascota)}>✏️</button>
                      <button className={styles.deleteBtn} onClick={() => handleDelete(mascota.id)}>🗑️</button>
                    </div>
                  </div>
                  <p className={styles.petMeta}>{mascota.raza} · {mascota.peso_kg}kg · {mascota.edad_meses} {t.months}</p>
                  {mascota.alergias && <p className={styles.petAllergy}>⚠️ {mascota.alergias}</p>}
                </div>
              )}
            </div>
          ))}
        </div>

        <button className={styles.logoutBtn} onClick={handleLogout}>
          {t.logout}
        </button>
      </main>

      <Navbar />
      
    </div>
  )
}