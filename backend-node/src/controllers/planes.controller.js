const { validationResult } = require('express-validator')
const prisma = require('../prisma/client')
const axios = require('axios')

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL

const getPlanes = async (req, res, next) => {
  try {
    const planes = await prisma.planNutricional.findMany({
      where: {
        mascota_id: req.params.mascotaId,
        mascota: { usuario_id: req.user.id }
      },
      orderBy: { fecha: 'desc' }
    })
    res.json(planes)
  } catch (error) {
    next(error)
  }
}

const createPlan = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { mascota_id, fecha, ingredientes, proporciones, calorias_total, notas_ia } = req.body

    if (req.user.rol !== 'ADMIN') {
      const mascota = await prisma.mascota.findFirst({ where: { id: mascota_id, usuario_id: req.user.id } })
      if (!mascota) return res.status(403).json({ error: 'No autorizado' })
    }

    const plan = await prisma.planNutricional.create({
      data: {
        mascota_id,
        fecha: new Date(fecha),
        ingredientes,
        proporciones,
        calorias_total,
        notas_ia
      }
    })

    res.status(201).json(plan)
  } catch (error) {
    next(error)
  }
}

const deletePlan = async (req, res, next) => {
  try {
    const plan = await prisma.planNutricional.findFirst({
      where: { id: req.params.id, mascota: { usuario_id: req.user.id } }
    })
    if (!plan) return res.status(404).json({ error: 'Plan no encontrado' })

    await prisma.planNutricional.delete({ where: { id: req.params.id } })
    res.json({ message: 'Plan eliminado correctamente' })
  } catch (error) {
    next(error)
  }
}

const enviarEmailPlan = async (req, res, next) => {
  try {
    const plan = await prisma.planNutricional.findFirst({
      where: { id: req.params.id, mascota: { usuario_id: req.user.id } },
      include: { mascota: true }
    })

    if (!plan) return res.status(404).json({ error: 'Plan no encontrado' })

    if (N8N_WEBHOOK_URL) {
      await axios.post(N8N_WEBHOOK_URL, {
        usuario_email: req.user.email,
        nombre_perro: plan.mascota?.nombre || 'tu perro',
        ingredientes: plan.ingredientes,
        proporciones: plan.proporciones,
        calorias_total: plan.calorias_total,
        notas_ia: plan.notas_ia,
        plan_id: plan.id,
        fecha: plan.fecha
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      })
    }

    res.json({ ok: true, message: 'Email enviado correctamente' })
  } catch (error) {
    next(error)
  }
}

module.exports = { getPlanes, createPlan, deletePlan, enviarEmailPlan }
