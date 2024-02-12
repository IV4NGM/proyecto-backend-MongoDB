const { Router } = require('express')
const router = Router()
const { createSale, getSales, getAllSales } = require('@/controllers/salesControllers')
const { protect, adminProtect } = require('@/middleware/authMiddleware')

router.post('/', protect, createSale)
router.get('/', protect, getSales)
router.get('/all', protect, adminProtect, getAllSales)

module.exports = router
