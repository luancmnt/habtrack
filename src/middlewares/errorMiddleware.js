function errorHandler(error, req, res, next) {
  const statusCode = error.statusCode || 500;

  return res.status(statusCode).json({
    message: error.message || 'Erro interno do servidor.',
  });
}

module.exports = errorHandler;
