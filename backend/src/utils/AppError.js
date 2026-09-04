/**
 * Clase personalizada para errores operacionales HTTP.
 * Permite definir el código de estado (statusCode) y mensaje descriptivo.
 */
class AppError extends Error {
  constructor(message, statusCode = 500, speechMessage = null) {
    super(message);
    this.statusCode = statusCode;
    this.status = 'Error';
    this.speechMessage = speechMessage || message;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
