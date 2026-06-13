const prisma = require('../prisma/client')

const getRegistrosPeso = async (req, res, next) => {
  try {
    const registros = await prisma.registroPeso.findMany({
      where: {
        mascota_id: req.params.mascotaId,
        mascota: { usuario_id: req.user.id }
      },
      orderBy: { fecha: 'asc' }
    })
    res.json(registros)
  } catch (error) {
    next(error)
  }
}

const createRegistroPeso = async (req, res, next) => {
  try {
    const { mascota_id, peso_kg, fecha } = req.body

    if (req.user.rol !== 'ADMIN') {
      const mascota = await prisma.mascota.findFirst({ where: { id: mascota_id, usuario_id: req.user.id } })
      if (!mascota) return res.status(403).json({ error: 'No autorizado' })
    }

    const registro = await prisma.registroPeso.create({
      data: {
        mascota_id,
        peso_kg: parseFloat(peso_kg),
        fecha: fecha ? new Date(fecha) : new Date()
      }
    })
    res.status(201).json(registro)
  } catch (error) {
    next(error)
  }
}

const deleteRegistroPeso = async (req, res, next) => {
  try {
    const registro = await prisma.registroPeso.findFirst({
      where: { id: req.params.id, mascota: { usuario_id: req.user.id } }
    })
    if (!registro) return res.status(404).json({ error: 'Registro no encontrado' })

    await prisma.registroPeso.delete({ where: { id: req.params.id } })
    res.json({ message: 'Registro eliminado' })
  } catch (error) {
    next(error)
  }
}

module.exports = { getRegistrosPeso, createRegistroPeso, deleteRegistroPeso }
