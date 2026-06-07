const express = require('express')
const router = express.Router()
const { getMascotas, getMascota, createMascota, updateMascota, deleteMascota } = require('../controllers/mascotas.controller')
const { mascotaSchema } = require('../schemas/mascotas.schema')
const authMiddleware = require('../middleware/authMiddleware')

router.use(authMiddleware)

router.get('/', getMascotas)
router.get('/:id', getMascota)
router.post('/', mascotaSchema, createMascota)
router.put('/:id', mascotaSchema, updateMascota)
router.delete('/:id', deleteMascota)

module.exports = router