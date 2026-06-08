import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_NODE_URL || 'http://localhost:3001',
})

const aiApi = axios.create({
  baseURL: import.meta.env.VITE_API_AI_URL || 'http://localhost:8000',
})

// Interceptor: añade el token JWT automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export { api, aiApi }