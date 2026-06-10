const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const dotenv = require('dotenv')

const errorHandler = require('./middleware/errorHAndler')
const authRoutes = require('./routes/authRoutes')
const mascotasRoutes = require('./routes/mascotasRoutes')
const planesRoutes = require('./routes/planesRoutes')
const historialVetRoutes = require('./routes/historialVetRoutes')
const chatRoutes = require('./routes/chatRoutes')
const pesoRoutes = require('./routes/pesoRoutes')

dotenv.config()

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/mascotas', mascotasRoutes)
app.use('/api/planes', planesRoutes)
app.use('/api/historial-vet', historialVetRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/peso', pesoRoutes)

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'kahu-node' })
})

app.use(errorHandler)

module.exports = app