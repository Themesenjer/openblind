const AppError = require('../utils/AppError');

/**
 * Middleware para capturar rutas inexistentes.
 * Genera un AppError y lo delega mediante next() a errorHandler.
 */
const notFoundHandler = (req, res, next) => {
  next(new AppError(`Ruta ${req.originalUrl} no encontrada en el servidor`, 404));
};

module.exports = notFoundHandler;
