const express = require('express')
const router = express.Router()
const { register, login, getMe } = require('../controllers/auth.controller')
const { registerSchema, loginSchema } = require('../schemas/auth.schema')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/register', registerSchema, register)
router.post('/login', loginSchema, login)
router.get('/me', authMiddleware, getMe)

module.exports = router