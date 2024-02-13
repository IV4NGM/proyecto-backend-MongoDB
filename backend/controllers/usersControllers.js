const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')

const User = require('@/models/usersModel')

const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, isAdmin } = req.body

  // Verificar si se pasan todos los datos
  if (!name || !email || !password) {
    res.status(400)
    throw new Error('Debes ingresar todos los campos')
  }
  // Establecer la propiedad isAdmin
  const admin = !(!isAdmin || isAdmin !== 'true')
  // Hacer el Hash al password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  // Verificar que el email no esté registrado
  const userExists = await User.findOne({ email })
  if (userExists) {
    if (userExists.isActive) {
      res.status(400)
      throw new Error('El email ya está registrado en la base de datos')
    } else {
      const userUpdated = await User.findByIdAndUpdate(userExists.id, {
        name,
        email,
        password: hashedPassword,
        isAdmin: admin,
        isActive: true,
        tokenVersion: userExists.tokenVersion + 1
      }, { new: true })

      if (userUpdated) {
        res.status(201).json({
          _id: userUpdated.id,
          name: userUpdated.name,
          email: userUpdated.email,
          isAdmin: userUpdated.isAdmin
        })
      } else {
        res.status(400)
        throw new Error('No se pudieron guardar los datos')
      }
    }
  } else {
    // Crear el usuario
    const userCreated = await User.create({
      name,
      email,
      password: hashedPassword,
      isAdmin: admin
    })

    if (userCreated) {
      res.status(201).json({
        _id: userCreated.id,
        name: userCreated.name,
        email: userCreated.email,
        isAdmin: userCreated.isAdmin
      })
    } else {
      res.status(400)
      throw new Error('No se pudieron guardar los datos')
    }
  }
})

const generateToken = (userId, tokenVersion) => {
  return jwt.sign({ user_id: userId, token_version: tokenVersion }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  })
}

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    res.status(400)
    throw new Error('Debes ingresar todos los campos')
  }

  // Verificamos si el usuario existe y también su password
  const user = await User.findOne({ email })
  if (user && user.isActive && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user.id, user.tokenVersion)
    })
  } else {
    res.status(400)
    throw new Error('Credenciales incorrectas')
  }
})

const getUser = asyncHandler(async (req, res) => {
  const user = req.user.toObject()
  delete user.isActive
  delete user.tokenVersion
  res.status(200).json(user)
})

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ isActive: true }).select('-password -isActive -tokenVersion')
  if (users) {
    res.status(200).json(users)
  } else {
    res.status(400)
    throw new Error('No se puede mostrar la información en este momento')
  }
})

const updateUser = asyncHandler(async (req, res) => {
  const { name, password, isAdmin, logout } = req.body
  if (!name && !password && !isAdmin) {
    res.status(400)
    throw new Error('Debes enviar al menos un campo a actualizar')
  }
  if (name === '') {
    res.status(400)
    throw new Error('El nombre no debe ser vacío')
  }
  let newIsAdmin = req.user.isAdmin
  if (isAdmin) {
    if (isAdmin === 'true') {
      newIsAdmin = true
    } else if (isAdmin === 'false') {
      newIsAdmin = false
    } else {
      res.status(400)
      throw new Error('El campo isAdmin no es válido')
    }
  }
  let newPassword
  if (password) {
    // Hacer el Hash al password
    const salt = await bcrypt.genSalt(10)
    newPassword = await bcrypt.hash(password, salt)
  }
  const newTokenVersion = logout === 'false' ? req.user.tokenVersion : req.user.tokenVersion + 1
  if (newPassword) {
    const userUpdated = await User.findByIdAndUpdate(req.user.id, {
      name,
      password: newPassword,
      isAdmin: newIsAdmin,
      tokenVersion: newTokenVersion
    }, { new: true })
    if (userUpdated) {
      res.status(200).json({
        _id: userUpdated.id,
        name: userUpdated.name,
        email: userUpdated.email,
        isAdmin: userUpdated.isAdmin
      })
    } else {
      res.status(400)
      throw new Error('No se pudieron guardar los datos')
    }
  } else {
    const userUpdated = await User.findByIdAndUpdate(req.user.id, {
      name,
      isAdmin: newIsAdmin
    }, { new: true })
    if (userUpdated) {
      res.status(200).json({
        _id: userUpdated.id,
        name: userUpdated.name,
        email: userUpdated.email,
        isAdmin: userUpdated.isAdmin
      })
    } else {
      res.status(400)
      throw new Error('No se pudieron guardar los datos')
    }
  }
})

const deleteUser = asyncHandler(async (req, res) => {
  const userDeleted = await User.findByIdAndUpdate(req.user.id, {
    isActive: false,
    tokenVersion: req.user.tokenVersion + 1
  },
  { new: true })
  if (userDeleted) {
    res.status(200).json({ message: 'Usuario eliminado exitosamente' })
  } else {
    res.status(400)
    throw new Error('No se ha podido eliminar el usuario')
  }
})

module.exports = {
  createUser,
  loginUser,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser
}
