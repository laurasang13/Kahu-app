const express = require('express')
const router = express.Router()
const { getTratamientos, createTratamiento, administrarTratamiento, deleteTratamiento } = require('../controllers/tratamientos.controller')
const authMiddleware = require('../middleware/authMiddleware')

router.use(authMiddleware)

router.get('/:mascotaId', getTratamientos)
router.post('/', createTratamiento)
router.patch('/:id/administrar', administrarTratamiento)
router.delete('/:id', deleteTratamiento)

module.exports = router
