const mongoose = require('mongoose')

const saleSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  products_amount: {
    type: Number,
    required: true,
    min: 0
  },
  total_price: {
    type: Number,
    required: true,
    min: 0
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
      },
      amount: {
        type: Number,
        required: true,
        min: 0
      },
      sale_price: {
        type: Number,
        required: true,
        min: 0
      }
    }
  ]
}, {
  timestamps: true
})

module.exports = mongoose.model('Sales', saleSchema)
