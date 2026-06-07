const prisma = require('../prisma/client')

const getHistorialChat = async (req, res, next) => {
  try {
    const historial = await prisma.chatHistorial.findMany({
      where: { mascota_id: req.params.mascotaId },
      orderBy: { created_at: 'asc' }
    })
    res.json(historial)
  } catch (error) {
    next(error)
  }
}

const savemensaje = async (req, res, next) => {
  try {
    const { mascota_id, rol, mensaje } = req.body

    const entry = await prisma.chatHistorial.create({
      data: { mascota_id, rol, mensaje }
    })
    res.status(201).json(entry)
  } catch (error) {
    next(error)
  }
}

module.exports = { getHistorialChat, savemensaje }