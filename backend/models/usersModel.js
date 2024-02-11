const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Por favor, ingresa tu nombre']
  },
  email: {
    type: String,
    required: [true, 'Por favor, ingresa tu email'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Por favor, ingresa tu contraseña']
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tokenVersion: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('User', userSchema)
