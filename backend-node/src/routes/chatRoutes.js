const express = require('express')
const router = express.Router()
const { getHistorialChat, savemensaje } = require('../controllers/chat.controller')
const authMiddleware = require('../middleware/authMiddleware')

router.use(authMiddleware)

router.get('/:mascotaId', getHistorialChat)
router.post('/', savemensaje)

module.exports = router