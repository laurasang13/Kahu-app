import { useWeather } from '../../hooks/useWeather'
import styles from './WeatherAlert.module.css'

const MENSAJES = {
  ok:      (nombre) => `🐾 Temperatura perfecta para pasear con ${nombre}`,
  warning: (nombre) => `⚠️ Cuidado con las patitas de ${nombre}, el suelo puede estar caliente`,
  danger:  (nombre) => `🚫 Evita salir ahora con ${nombre}, riesgo de golpe de calor`,
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
