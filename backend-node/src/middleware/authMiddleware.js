const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' })
  }

  const token = authHeader.split(' ')[1]

  // Token interno para comunicación entre backends
  if (token === process.env.INTERNAL_SERVICE_TOKEN) {
    req.user = { id: 'system', rol: 'ADMIN' }
    return next()
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' })
  }
}

module.exports = authMiddleware