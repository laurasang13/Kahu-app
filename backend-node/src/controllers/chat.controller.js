const prisma = require('../prisma/client')

const getHistorialChat = async (req, res, next) => {
  try {
    const historial = await prisma.chatHistorial.findMany({
      where: {
        mascota_id: req.params.mascotaId,
        mascota: { usuario_id: req.user.id }
      },
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

    if (req.user.rol !== 'ADMIN') {
      const mascota = await prisma.mascota.findFirst({ where: { id: mascota_id, usuario_id: req.user.id } })
      if (!mascota) return res.status(403).json({ error: 'No autorizado' })
    }

    const entry = await prisma.chatHistorial.create({
      data: { mascota_id, rol, mensaje }
    })
    res.status(201).json(entry)
  } catch (error) {
    next(error)
  }
}

const clearHistorial = async (req, res, next) => {
  try {
    const mascota = await prisma.mascota.findFirst({
      where: { id: req.params.mascotaId, usuario_id: req.user.id }
    })
    if (!mascota) return res.status(404).json({ error: 'Mascota no encontrada' })

    await prisma.chatHistorial.deleteMany({
      where: { mascota_id: req.params.mascotaId }
    })
    res.json({ message: 'Historial borrado' })
  } catch (error) {
    next(error)
  }
}

module.exports = { getHistorialChat, savemensaje, clearHistorial }
