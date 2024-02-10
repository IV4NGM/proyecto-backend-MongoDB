const asyncHandler = require('express-async-handler')

const createSale = asyncHandler(async (req, res) => {
  res.status(201).json({ message: 'Crear venta' })
})

const getSales = asyncHandler(async (req, res) => {
  res.status(200).json({ message: 'Compras del usuario' })
})

const getAllSales = asyncHandler(async (req, res) => {
  res.status(200).json({ message: 'Datos de todas las ventas. SOLO ADMIN' })
})

module.exports = {
  createSale,
  getSales,
  getAllSales
}
