const { body } = require('express-validator')

const historialVetSchema = [
  body('mascota_id').notEmpty().withMessage('El id de la mascota es obligatorio'),
  body('fecha_visita').isISO8601().withMessage('La fecha debe tener formato YYYY-MM-DD'),
  body('motivo').notEmpty().withMessage('El motivo es obligatorio'),
  body('descripcion').notEmpty().withMessage('La descripción es obligatoria'),
  body('tratamiento').notEmpty().withMessage('El tratamiento es obligatorio'),
  body('proxima_cita').optional().isISO8601().withMessage('La próxima cita debe tener formato YYYY-MM-DD')
]

module.exports = { historialVetSchema }