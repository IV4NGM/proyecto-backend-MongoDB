const express = require('express')
require('colors')
require('dotenv').config()

const path = require('path')
require('module-alias/register')
const aliasPath = path.join(__dirname, './')
require('module-alias').addAlias('@', aliasPath)

// const connectDB = require('./config/db')
const { errorHandler } = require('@/middleware/errorMiddleware')
const cors = require('cors')

const usersRoutes = require('@/routes/usersRoutes')
const productsRoutes = require('@/routes/productsRoutes')
const salesRoutes = require('@/routes/salesRoutes')

const port = process.env.PORT || 5000

const app = express()

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/users', usersRoutes)
app.use('/api/products', productsRoutes)
app.use('/api/sales', salesRoutes)

app.use(errorHandler)
app.listen(port, () => { console.log(`Servidor iniciado en el puerto ${port}`) })
