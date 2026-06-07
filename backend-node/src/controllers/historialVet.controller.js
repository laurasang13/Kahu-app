const { validationResult } = require('express-validator')
const prisma = require('../prisma/client')

const getHistorial = async (req, res, next) => {
  try {
    const historial = await prisma.historialVeterinario.findMany({
      where: { mascota_id: req.params.mascotaId },
      orderBy: { fecha_visita: 'desc' }
    })
    res.json(historial)
  } catch (error) {
    next(error)
  }
}

const createRegistro = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { mascota_id, fecha_visita, motivo, descripcion, tratamiento, proxima_cita } = req.body

    const registro = await prisma.historialVeterinario.create({
      data: {
        mascota_id,
        fecha_visita: new Date(fecha_visita),
        motivo,
        descripcion,
        tratamiento,
        proxima_cita: proxima_cita ? new Date(proxima_cita) : null
      }
    })
    res.status(201).json(registro)
  } catch (error) {
    next(error)
  }
}

const deleteRegistro = async (req, res, next) => {
  try {
    await prisma.historialVeterinario.delete({ where: { id: req.params.id } })
    res.json({ message: 'Registro eliminado correctamente' })
  } catch (error) {
    next(error)
  }
}

module.exports = { getHistorial, createRegistro, deleteRegistro }