import { useWeather } from '../../hooks/useWeather'
import styles from './WeatherAlert.module.css'

const MENSAJES = {
  ok:      (n) => `🐾 Temperatura perfecta para pasear con ${n}`,
  warning: (n) => `⚠️ Cuidado con las patitas de ${n}, el suelo puede estar caliente`,
  danger:  (n) => `🚫 Evita salir ahora con ${n}, riesgo de golpe de calor`,
}

export default function WeatherAlert({ ciudad, nombreMascota }) {
  const { temperatura, alerta, loading } = useWeather(ciudad)

  if (loading || !alerta || !temperatura) return null

  return (
    <div className={`${styles.banner} ${styles[alerta]}`}>
      <span className={styles.temp}>{temperatura}°C</span>
      <span className={styles.msg}>{MENSAJES[alerta](nombreMascota)}</span>
    </div>
  )
}
