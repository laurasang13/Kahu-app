const express = require('express')
const router = express.Router()
const { getRegistrosPeso, createRegistroPeso, deleteRegistroPeso } = require('../controllers/peso.controller')
const authMiddleware = require('../middleware/authMiddleware')

router.use(authMiddleware)

router.get('/:mascotaId', getRegistrosPeso)
router.post('/', createRegistroPeso)
router.delete('/:id', deleteRegistroPeso)

module.exports = router