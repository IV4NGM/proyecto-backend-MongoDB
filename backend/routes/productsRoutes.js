const { Router } = require('express')
const router = Router()
const { createProduct, getProduct, getAllProducts, updateProduct, deleteProduct } = require('@/controllers/productsControllers')
const { protect, adminProtect } = require('@/middleware/authMiddleware')

router.post('/', protect, adminProtect, createProduct)
router.get('/:id', getProduct)
router.get('/', getAllProducts)
router.put('/:id', protect, adminProtect, updateProduct)
router.delete('/:id', protect, adminProtect, deleteProduct)

module.exports = router
