const asyncHandler = require('express-async-handler')

const Product = require('@/models/productsModel')
const Sale = require('@/models/salesModel')

const cleanSale = (sale) => {
  return ({
    user: {
      _id: sale.user._id
    },
    products_amount: sale.products_amount,
    total_price: sale.total_price,
    products: sale.products.map(productInfo => {
      return ({
        product: {
          _id: productInfo.product._id
        },
        amount: productInfo.amount,
        sale_price: productInfo.sale_price
      })
    }),
    createdAt: sale.createdAt,
    updatedAt: sale.updatedAt,
    __v: sale.__v
  })
}

const createSale = asyncHandler(async (req, res) => {
  const products = req.body.products
  if (!products || products.length === 0) {
    res.status(400)
    throw new Error('No se puede registrar una venta sin productos')
  }
  const availableProducts = await Product.find({ isActive: true })
  if (!availableProducts) {
    res.status(400)
    throw new Error('Error al consultar los productos disponibles')
  }
  const availableProductsId = availableProducts.map(product => product.id)

  let productsAmount = 0
  let totalPrice = 0
  const productsToRegisterArray = []
  products.forEach(product => {
    if (!product.id || !availableProductsId.includes(product.id)) {
      res.status(400)
      throw new Error('Debes proporcionar IDs válidos')
    }
    if (!product.amount) {
      res.status(400)
      throw new Error('Debes ingresar cantidades para cada producto')
    }
    const amountNumber = Number(product.amount)
    if (isNaN(amountNumber) || !isFinite(amountNumber) || amountNumber <= 0 || !Number.isInteger(amountNumber)) {
      res.status(400)
      throw new Error('Las cantidades deben ser enteros positivos')
    }

    const productObject = availableProducts.filter(availableProduct => availableProduct.id === product.id)[0]

    const unitPrice = productObject.price
    const salePrice = unitPrice * amountNumber
    productsAmount = productsAmount + amountNumber
    totalPrice = totalPrice + salePrice
    productsToRegisterArray.push({
      product: productObject,
      amount: amountNumber,
      sale_price: salePrice
    })
  })
  const sale = await Sale.create({
    user: req.user,
    products_amount: productsAmount,
    total_price: totalPrice,
    products: productsToRegisterArray
  })
  if (sale) {
    res.status(201).json(cleanSale(sale))
  } else {
    res.status(400)
    throw new Error('No se ha podido crear la venta')
  }
})

const getSales = asyncHandler(async (req, res) => {
  const sales = await Sale.find({ user: req.user })
  if (sales) {
    res.status(200).json(sales.map(sale => cleanSale(sale)))
  } else {
    res.status(400)
    throw new Error('No se puede mostrar la información en este momento')
  }
})

const getAllSales = asyncHandler(async (req, res) => {
  const sales = await Sale.find()
  if (sales) {
    res.status(200).json(sales.map(sale => cleanSale(sale)))
  } else {
    res.status(400)
    throw new Error('No se puede mostrar la información en este momento')
  }
})

module.exports = {
  createSale,
  getSales,
  getAllSales
}
