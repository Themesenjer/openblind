/**
 * Middleware global de manejo de errores para Express.
 * Firma requerida por Express: (err, req, res, next).
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';

  // Registrar el log detallado en el servidor
  console.error(`[ERROR ${req.method} ${req.originalUrl}]:`, {
    statusCode,
    message: err.message,
    stack: err.stack
  });

  // Retornar la respuesta JSON centralizada respetando la interfaz actual
  return res.status(statusCode).json({
    status: 'Error',
    message: message
  });
};

module.exports = errorHandler;
