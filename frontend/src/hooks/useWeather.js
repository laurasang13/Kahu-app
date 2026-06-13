import { useState, useEffect } from 'react'

const API_KEY = import.meta.env.VITE_OPENWEATHER_KEY

function getAlerta(temp) {
  if (temp === null) return null
  if (temp >= 26) return 'danger'
  if (temp >= 23) return 'warning'
  return 'ok'
}

export function useWeather(ciudad) {
  const [temperatura, setTemperatura] = useState(null)
  const [alerta, setAlerta] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!ciudad || !API_KEY) return

    setLoading(true)
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(ciudad)}&units=metric&lang=es&appid=${API_KEY}`
    )
      .then(res => {
        if (!res.ok) throw new Error('Ciudad no encontrada')
        return res.json()
      })
      .then(data => {
        const temp = Math.round(data.main.temp)
        setTemperatura(temp)
        setAlerta(getAlerta(temp))
      })
      .catch(() => {
        setTemperatura(null)
        setAlerta(null)
      })
      .finally(() => setLoading(false))
  }, [ciudad])

  return { temperatura, alerta, loading }
}
