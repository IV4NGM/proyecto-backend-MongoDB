const { Router } = require('express')
const router = Router()
const { createSale, getSales, getAllSales } = require('@/controllers/salesControllers')

router.post('/', createSale)
router.get('/', getSales)
router.get('/all', getAllSales)

module.exports = router
