const { body } = require('express-validator')

const mascotaSchema = [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  body('raza').notEmpty().withMessage('La raza es obligatoria'),
  body('peso_kg').isFloat({ min: 0.1 }).withMessage('El peso debe ser un número positivo'),
  body('edad_meses').isInt({ min: 0 }).withMessage('La edad en meses debe ser un número entero positivo'),
  body('sexo').isIn(['macho', 'hembra']).withMessage('El sexo debe ser macho o hembra'),
  body('alergias').optional().isString()
]

module.exports = { mascotaSchema }