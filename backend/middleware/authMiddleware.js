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
        throw new Error('El usuario no existe')
      }
      if (user.tokenVersion !== decoded.token_version) {
        throw new Error('Acceso no autorizado')
      }
      req.user = user
      next()
    } catch (error) {
      // console.log(error)
      res.status(401)
      throw new Error('Acceso no autorizado')
    }
  }

  if (!token) {
    res.status(401)
    throw new Error('No se proporcionó un token')
  }
})

module.exports = { protect }
