const { body } = require('express-validator')

const registerSchema = [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  body('email').isEmail().withMessage('Email no válido'),
  body('password').isLength({ min: 8 }).withMessage('La contraseña debe tener mínimo 8 caracteres'),
  body('ciudad').optional().isString()
]

const loginSchema = [
  body('email').isEmail().withMessage('Email no válido'),
  body('password').notEmpty().withMessage('La contraseña es obligatoria')
]

module.exports = { registerSchema, loginSchema }