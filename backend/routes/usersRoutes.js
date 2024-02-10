const { Router } = require('express')
const router = Router()
const { createUser, loginUser, getUser, updateUser, deleteUser } = require('@/controllers/usersControllers')

router.post('/', createUser)
router.post('/login', loginUser)
router.get('/', getUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)

module.exports = router
