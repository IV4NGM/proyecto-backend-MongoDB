const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode || 500
  // Para detectar errores de JSON parser
  if (err instanceof SyntaxError && 'body' in err) {
    statusCode = 400
  }
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  })
}

module.exports = {
  errorHandler
}
