const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('@/models/usersModel')

const protect = asyncHandler(async (req, res, next) => {
  let token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Obtenemos el token
      token = req.headers.authorization.split(' ')[1]

      // Verificamos el token a través de su firma
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Obtenemos los datos del token a través del payload, y traemos todos los datos de la DB excepto el password y tokenVersion
      const user = await User.findById(decoded.user_id).select('-password')
      if (!user || !user.isActive) {
        res.status(401)
        throw new Error('El usuario no se encuentra en la base de datos')
      }
      if (user.tokenVersion !== decoded.token_version) {
        res.status(401)
        throw new Error('Acceso no autorizado')
      }
      req.user = user
      next()
    } catch (error) {
      // console.log(error)
      res.status(401)
      throw new Error(error.message || 'Acceso no autorizado')
    }
  }

  if (!token) {
    res.status(401)
    throw new Error('No se proporcionó un token')
  }
})

const adminProtect = asyncHandler(async (req, res, next) => {
  if (req.user.isAdmin) {
    next()
  } else {
    res.status(401)
    throw new Error('Debes ser Admin para acceder a esta ruta')
  }
})

module.exports = { protect, adminProtect }
