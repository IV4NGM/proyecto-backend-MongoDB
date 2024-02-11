const asyncHandler = require('express-async-handler')

const Product = require('@/models/productsModel')

const createProduct = asyncHandler(async (req, res) => {
  res.status(201).json({ message: 'Crear producto' })
})

const getProduct = asyncHandler(async (req, res) => {
  res.status(200).json({ message: 'Datos producto' })
})

const getAllProducts = asyncHandler(async (req, res) => {
  res.status(200).json({ message: 'Datos de todos los productos' })
})

const updateProduct = asyncHandler(async (req, res) => {
  res.status(200).json({ message: 'Actualizar producto' })
})

const deleteProduct = asyncHandler(async (req, res) => {
  res.status(200).json({ message: 'Eliminar producto' })
})

module.exports = {
  createProduct,
  getProduct,
  getAllProducts,
  updateProduct,
  deleteProduct
}
