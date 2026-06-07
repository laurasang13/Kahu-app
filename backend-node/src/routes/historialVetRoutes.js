const express = require('express')
const router = express.Router()
const { getHistorial, createRegistro, deleteRegistro } = require('../controllers/historialVet.controller')
const { historialVetSchema } = require('../schemas/historialVet.schema')
const authMiddleware = require('../middleware/authMiddleware')

router.use(authMiddleware)

router.get('/:mascotaId', getHistorial)
router.post('/', historialVetSchema, createRegistro)
router.delete('/:id', deleteRegistro)

module.exports = router