const asyncHandler = require('express-async-handler')

const Product = require('@/models/productsModel')

const createProduct = asyncHandler(async (req, res) => {
  const { name, price, description, sku } = req.body
  if (!name || !price) {
    res.status(400)
    throw new Error('Debes ingresar el nombre y precio')
  }
  const priceToSet = Number(price)
  if (isNaN(priceToSet) || !isFinite(priceToSet) || priceToSet <= 0) {
    res.status(400)
    throw new Error('El precio debe ser un número positivo')
  }
  const product = await Product.create({ name, price: priceToSet, description, sku })
  if (product) {
    res.status(201).json({
      _id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      sku: product.sku
    })
  } else {
    res.status(400)
    throw new Error('No se ha podido crear el producto')
  }
})

const getProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (product && product.isActive) {
      res.status(200).json({
        _id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        sku: product.sku
      })
    } else {
      res.status(404)
      throw new Error('Este producto no existe')
    }
  } catch (error) {
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      res.status(404)
      throw new Error('Este producto no existe')
    } else {
      res.status(res.statusCode || 404)
      throw new Error(error.message || 'Este producto no existe')
    }
  }
})

const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isActive: true }).select('-isActive')
  if (products) {
    res.status(200).json(products)
  } else {
    res.status(400)
    throw new Error('No se puede mostrar la información en este momento')
  }
})

const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, sku } = req.body
  if (!name && !price && !description && !sku) {
    res.status(400)
    throw new Error('Debes enviar al menos un campo a actualizar')
  }
  try {
    const product = await Product.findById(req.params.id)
    if (!product || !product.isActive) {
      res.status(404)
      throw new Error('Este producto no existe')
    }
    let priceToSet = product.price
    if (price) {
      priceToSet = Number(price)
      if (isNaN(priceToSet) || !isFinite(priceToSet) || priceToSet <= 0) {
        res.status(400)
        throw new Error('El precio debe ser un número positivo')
      }
    }

    const productUpdated = await Product.findOneAndUpdate(product, {
      name,
      price: priceToSet,
      description,
      sku
    }, { new: true })
    if (productUpdated) {
      res.status(200).json({
        _id: productUpdated.id,
        name: productUpdated.name,
        price: productUpdated.price,
        description: productUpdated.description,
        sku: productUpdated.sku
      })
    } else {
      res.status(400)
      throw new Error('No se ha podido actualizar el producto')
    }
  } catch (error) {
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      res.status(404)
      throw new Error('Este producto no existe')
    } else {
      res.status(res.statusCode || 400)
      throw new Error(error.message || 'No se ha podido actualizar el producto')
    }
  }
})

const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product || !product.isActive) {
      res.status(404)
      throw new Error('Este producto no existe')
    }
    const productDeleted = await Product.findOneAndUpdate(product, { isActive: false }, { new: true })
    if (productDeleted) {
      res.status(200).json({ message: 'Producto eliminado exitosamente' })
    } else {
      res.status(400)
      throw new Error('No se pudo eliminar el producto')
    }
  } catch (error) {
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      res.status(404)
      throw new Error('Este producto no existe')
    } else {
      res.status(res.statusCode || 400)
      throw new Error(error.message || 'No se pudo eliminar el producto')
    }
  }
})

module.exports = {
  createProduct,
  getProduct,
  getAllProducts,
  updateProduct,
  deleteProduct
}
