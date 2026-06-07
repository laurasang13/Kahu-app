const { body } = require('express-validator')

const planSchema = [
  body('mascota_id').notEmpty().withMessage('El id de la mascota es obligatorio'),
  body('fecha').isISO8601().withMessage('La fecha debe tener formato YYYY-MM-DD'),
  body('ingredientes').notEmpty().withMessage('Los ingredientes son obligatorios'),
  body('proporciones').notEmpty().withMessage('Las proporciones son obligatorias'),
  body('calorias_total').isFloat({ min: 0 }).withMessage('Las calorías deben ser un número positivo'),
  body('notas_ia').optional().isString()
]

module.exports = { planSchema }