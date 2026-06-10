const prisma = require('../prisma/client')

const getRegistrosPeso = async (req, res, next) => {
  try {
    const registros = await prisma.registroPeso.findMany({
      where: { mascota_id: req.params.mascotaId },
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
    await prisma.registroPeso.delete({ where: { id: req.params.id } })
    res.json({ message: 'Registro eliminado' })
  } catch (error) {
    next(error)
  }
}

module.exports = { getRegistrosPeso, createRegistroPeso, deleteRegistroPeso }