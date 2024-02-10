const { Router } = require('express')
const router = Router()
const { createProduct, getProduct, getAllProducts, updateProduct, deleteProduct } = require('@/controllers/productsControllers')

router.post('/', createProduct)
router.get('/:id', getProduct)
router.get('/', getAllProducts)
router.put('/:id', updateProduct)
router.delete('/:id', deleteProduct)

module.exports = router
