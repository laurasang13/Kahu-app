const express = require('express')
const router = express.Router()
const { getHistorialChat, savemensaje, clearHistorial, } = require('../controllers/chat.controller')
const authMiddleware = require('../middleware/authMiddleware')

router.use(authMiddleware)

router.get('/:mascotaId', getHistorialChat)
router.post('/', savemensaje)

router.delete('/:mascotaId', clearHistorial)

module.exports = router