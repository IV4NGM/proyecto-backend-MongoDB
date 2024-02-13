const asyncHandler = require('express-async-handler')

const User = require('@/models/usersModel')
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
  if (!sales) {
    res.status(400)
    throw new Error('No se puede mostrar la información en este momento')
  }
  const salesArray = sales.map(sale => cleanSale(sale))
  let salesAmount = 0
  let totalProductsAmount = 0
  let totalSalesPrice = 0
  salesArray.forEach(sale => {
    salesAmount = salesAmount + 1
    totalProductsAmount = totalProductsAmount + sale.products_amount
    totalSalesPrice = totalSalesPrice + sale.total_price
  })
  res.status(200).json({
    user: {
      _id: req.user._id
    },
    sales_amount: salesAmount,
    total_products_amount: totalProductsAmount,
    total_sales_price: totalSalesPrice,
    sales: salesArray
  })
})

const getAllSales = asyncHandler(async (req, res) => {
  const { user_id: userId, min_amount: minAmount, max_amount: maxAmount, min_price: minPrice, max_price: maxPrice } = req.query

  const sales = await Sale.find()
  if (!sales) {
    res.status(400)
    throw new Error('No se puede mostrar la información en este momento')
  }

  // Filtrar la información por medio de los query params
  let salesToDisplay = sales.map(sale => cleanSale(sale))

  if (userId) {
    salesToDisplay = salesToDisplay.filter(sale => sale.user._id.toString() === userId)
  }
  if (minAmount) {
    salesToDisplay = salesToDisplay.filter(sale => sale.products_amount >= parseInt(minAmount))
  }
  if (maxAmount) {
    salesToDisplay = salesToDisplay.filter(sale => sale.products_amount <= parseInt(maxAmount))
  }
  if (minPrice) {
    salesToDisplay = salesToDisplay.filter(sale => sale.total_price >= parseFloat(minPrice))
  }
  if (maxPrice) {
    salesToDisplay = salesToDisplay.filter(sale => sale.total_price <= parseFloat(maxPrice))
  }

  res.status(200).json(salesToDisplay)
})

const getSummary = asyncHandler(async (req, res) => {
  // Obtener todos los usuarios
  const users = await User.find({ isActive: true }).select('-password -isActive -tokenVersion')
  if (!users) {
    res.status(400)
    throw new Error('No se puede mostrar la información en este momento')
  }
  // Crear un objeto para guardar la información de ventas por usuario
  let allSalesAmount = 0
  let allTotalProductsAmount = 0
  let allTotalSalesPrice = 0
  const summary = {
    all_sales_amount: allSalesAmount,
    all_products_amount: allTotalProductsAmount,
    all_sales_price: allTotalSalesPrice,
    by_user: []
  }

  // Obtener todas las ventas
  const sales = await Sale.find()
  if (!sales) {
    res.status(400)
    throw new Error('No se puede mostrar la información en este momento')
  }

  // Dar formato a las ventas
  const salesCleaned = sales.map(sale => cleanSale(sale))

  // Obtener la información de ventas por usuario
  users.map(async (user) => {
    const salesArray = salesCleaned.filter(sale => sale.user._id.toString() === user._id.toString())
    let salesAmount = 0
    let totalProductsAmount = 0
    let totalSalesPrice = 0
    salesArray.forEach(sale => {
      salesAmount = salesAmount + 1
      totalProductsAmount = totalProductsAmount + sale.products_amount
      totalSalesPrice = totalSalesPrice + sale.total_price
    })
    allSalesAmount = allSalesAmount + salesAmount
    allTotalProductsAmount = allTotalProductsAmount + totalProductsAmount
    allTotalSalesPrice = allTotalSalesPrice + totalSalesPrice
    summary.by_user.push({
      user: {
        _id: req.user._id
      },
      sales_amount: salesAmount,
      total_products_amount: totalProductsAmount,
      total_sales_price: totalSalesPrice
    })
  })

  summary.all_sales_amount = allSalesAmount
  summary.all_products_amount = allTotalProductsAmount
  summary.all_sales_price = allTotalSalesPrice

  res.status(200).json(summary)
})

module.exports = {
  createSale,
  getSales,
  getAllSales,
  getSummary
}
