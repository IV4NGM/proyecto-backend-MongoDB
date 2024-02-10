const asyncHandler = require('express-async-handler')

const createUser = asyncHandler(async (req, res) => {
  res.status(201).json({ message: 'Crear usuario' })
})

const loginUser = asyncHandler(async (req, res) => {
  res.status(200).json({ message: 'Login usuario' })
})

const getUser = asyncHandler(async (req, res) => {
  res.status(200).json({ message: 'Datos usuario' })
})

const updateUser = asyncHandler(async (req, res) => {
  res.status(200).json({ message: 'Actualizar usuario' })
})

const deleteUser = asyncHandler(async (req, res) => {
  res.status(200).json({ message: 'Eliminar usuario' })
})

module.exports = {
  createUser,
  loginUser,
  getUser,
  updateUser,
  deleteUser
}
