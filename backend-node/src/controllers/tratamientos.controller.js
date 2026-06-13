const prisma = require('../prisma/client')

const getTratamientos = async (req, res, next) => {
  try {
    const tratamientos = await prisma.tratamiento.findMany({
      where: {
        mascota_id: req.params.mascotaId,
        mascota: { usuario_id: req.user.id }
      },
      orderBy: { proxima_dosis: 'asc' }
    })
    res.json(tratamientos)
  } catch (error) {
    next(error)
  }
}

const createTratamiento = async (req, res, next) => {
  try {
    const { mascota_id, nombre, frecuencia_dias, ultima_dosis, notas } = req.body

    if (!nombre || !frecuencia_dias || !mascota_id) {
      return res.status(400).json({ error: 'nombre, frecuencia_dias y mascota_id son obligatorios' })
    }

    const mascota = await prisma.mascota.findFirst({ where: { id: mascota_id, usuario_id: req.user.id } })
    if (!mascota) return res.status(403).json({ error: 'No autorizado' })

    const ultimaDosisDate = ultima_dosis ? new Date(ultima_dosis) : null
    const proximaDosis = ultimaDosisDate
      ? new Date(ultimaDosisDate.getTime() + frecuencia_dias * 24 * 60 * 60 * 1000)
      : null

    const tratamiento = await prisma.tratamiento.create({
      data: {
        mascota_id,
        nombre,
        frecuencia_dias: parseInt(frecuencia_dias),
        ultima_dosis: ultimaDosisDate,
        proxima_dosis: proximaDosis,
        notas: notas || null
      }
    })
    res.status(201).json(tratamiento)
  } catch (error) {
    next(error)
  }
}

const administrarTratamiento = async (req, res, next) => {
  try {
    const tratamiento = await prisma.tratamiento.findFirst({
      where: { id: req.params.id, mascota: { usuario_id: req.user.id } }
    })
    if (!tratamiento) return res.status(404).json({ error: 'Tratamiento no encontrado' })

    const hoy = new Date()
    const proximaDosis = new Date(hoy.getTime() + tratamiento.frecuencia_dias * 24 * 60 * 60 * 1000)

    const updated = await prisma.tratamiento.update({
      where: { id: req.params.id },
      data: { ultima_dosis: hoy, proxima_dosis: proximaDosis }
    })
    res.json(updated)
  } catch (error) {
    next(error)
  }
}

const deleteTratamiento = async (req, res, next) => {
  try {
    const tratamiento = await prisma.tratamiento.findFirst({
      where: { id: req.params.id, mascota: { usuario_id: req.user.id } }
    })
    if (!tratamiento) return res.status(404).json({ error: 'Tratamiento no encontrado' })

    await prisma.tratamiento.delete({ where: { id: req.params.id } })
    res.json({ message: 'Tratamiento eliminado' })
  } catch (error) {
    next(error)
  }
}

module.exports = { getTratamientos, createTratamiento, administrarTratamiento, deleteTratamiento }
