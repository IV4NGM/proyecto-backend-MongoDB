const { Router } = require('express')
const router = Router()
const { createUser, loginUser, getUser, updateUser, deleteUser } = require('@/controllers/usersControllers')
const { protect } = require('@/middleware/authMiddleware')

router.post('/', createUser)
router.post('/login', loginUser)
router.get('/', protect, getUser)
router.put('/', protect, updateUser)
router.delete('/', protect, deleteUser)

module.exports = router
