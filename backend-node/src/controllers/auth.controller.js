const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const prisma = require('../prisma/client')

const register = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { nombre, email, password, ciudad } = req.body

    const existingUser = await prisma.usuario.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(409).json({ error: 'El email ya está registrado' })
    }

    const password_hash = await bcrypt.hash(password, 10)

    const usuario = await prisma.usuario.create({
      data: { nombre, email, password_hash, ciudad }
    })

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({
      token,
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email }
    })
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body

    const usuario = await prisma.usuario.findUnique({ where: { email } })
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' })
    }

    const validPassword = await bcrypt.compare(password, usuario.password_hash)
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' })
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      token,
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email }
    })
  } catch (error) {
    next(error)
  }
}

const getMe = async (req, res, next) => {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: req.user.id },
      select: { id: true, nombre: true, email: true, ciudad: true, created_at: true }
    })
    res.json(usuario)
  } catch (error) {
    next(error)
  }
}

module.exports = { register, login, getMe }