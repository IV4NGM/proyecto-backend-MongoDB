const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Por favor, ingresa el nombre del producto']
  },
  price: {
    type: Number,
    required: [true, 'Por favor, ingresa el precio del producto'],
    min: [0, 'El precio  no puede ser negativo']
  },
  description: {
    type: String,
    default: ''
  },
  sku: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Product', productSchema)
