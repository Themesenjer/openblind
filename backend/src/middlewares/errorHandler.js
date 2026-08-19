const buildAntigravityResponse = require('../utils/antigravity');

/**
 * Middleware global de manejo de errores para Express.
 * Firma requerida por Express: (err, req, res, next).
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';

  // Registrar el log detallado en el servidor para depuración
  console.error(`[ERROR ${req.method} ${req.originalUrl}]:`, {
    statusCode,
    message: err.message,
    stack: err.stack
  });

  // Retornar la respuesta JSON con la estructura Antigravity / TTS
  return res.status(statusCode).json(buildAntigravityResponse({
    status: statusCode, // 💡 Pasa el código numérico (ej. 401, 500) para consistencia con las respuestas de éxito
    success: false,
    speechMessage: `Atención: ${message}`,
    data: null
  }));
};

module.exports = errorHandler;