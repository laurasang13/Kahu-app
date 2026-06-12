const express = require('express')
const router = express.Router()
const { getPlanes, createPlan, deletePlan, enviarEmailPlan } = require('../controllers/planes.controller')
const { planSchema } = require('../schemas/planes.schema')
const authMiddleware = require('../middleware/authMiddleware')

router.use(authMiddleware)

router.get('/:mascotaId', getPlanes)
router.post('/', planSchema, createPlan)
router.delete('/:id', deletePlan)
router.post('/:id/email', enviarEmailPlan)

module.exports = router