const { validationResult } = require('express-validator')
const prisma = require('../prisma/client')

const getMascotas = async (req, res, next) => {
  try {
    const mascotas = await prisma.mascota.findMany({
      where: { usuario_id: req.user.id }
    })
    res.json(mascotas)
  } catch (error) {
    next(error)
  }
}

const getMascota = async (req, res, next) => {
  try {
    const mascota = await prisma.mascota.findFirst({
      where: { id: req.params.id, usuario_id: req.user.id }
    })
    if (!mascota) return res.status(404).json({ error: 'Mascota no encontrada' })
    res.json(mascota)
  } catch (error) {
    next(error)
  }
}

const createMascota = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { nombre, raza, peso_kg, edad_meses, sexo, alergias, tipo_dieta, num_tomas } = req.body

    const mascota = await prisma.mascota.create({
      data: {
        usuario_id: req.user.id,
        nombre,
        raza,
        peso_kg,
        edad_meses,
        sexo,
        alergias,
        tipo_dieta,
        num_tomas
      }
    })
    res.status(201).json(mascota)
  } catch (error) {
    next(error)
  }
}

const updateMascota = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const mascota = await prisma.mascota.findFirst({
      where: { id: req.params.id, usuario_id: req.user.id }
    })
    if (!mascota) return res.status(404).json({ error: 'Mascota no encontrada' })

    const { nombre, raza, peso_kg, edad_meses, sexo, alergias, tipo_dieta, num_tomas } = req.body
    const updated = await prisma.mascota.update({
      where: { id: req.params.id },
      data: { nombre, raza, peso_kg, edad_meses, sexo, alergias, tipo_dieta, num_tomas }
    })
    res.json(updated)
  } catch (error) {
    next(error)
  }
}

const deleteMascota = async (req, res, next) => {
  try {
    const mascota = await prisma.mascota.findFirst({
      where: { id: req.params.id, usuario_id: req.user.id }
    })
    if (!mascota) return res.status(404).json({ error: 'Mascota no encontrada' })

    await prisma.mascota.delete({ where: { id: req.params.id } })
    res.json({ message: 'Mascota eliminada correctamente' })
  } catch (error) {
    next(error)
  }
}

module.exports = { getMascotas, getMascota, createMascota, updateMascota, deleteMascota }