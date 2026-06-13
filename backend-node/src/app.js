const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const dotenv = require('dotenv')
const rateLimit = require('express-rate-limit')

const errorHandler = require('./middleware/errorHAndler')
const authRoutes = require('./routes/authRoutes')
const mascotasRoutes = require('./routes/mascotasRoutes')
const planesRoutes = require('./routes/planesRoutes')
const historialVetRoutes = require('./routes/historialVetRoutes')
const chatRoutes = require('./routes/chatRoutes')
const pesoRoutes = require('./routes/pesoRoutes')
const tratamientosRoutes = require('./routes/tratamientosRoutes')

dotenv.config()

const app = express()

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Demasiados intentos. Espera 15 minutos.' }
})

app.use(helmet())
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }))
app.use(express.json())

app.use('/api/auth', authLimiter, authRoutes)
app.use('/api/mascotas', mascotasRoutes)
app.use('/api/planes', planesRoutes)
app.use('/api/historial-vet', historialVetRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/peso', pesoRoutes)
app.use('/api/tratamientos', tratamientosRoutes)

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'kahu-node' })
})

app.use(errorHandler)

module.exports = app