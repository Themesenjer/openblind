const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

/**
 * Middleware de autenticación JWT.
 * Valida el token pasado en los encabezados HTTP (Authorization: Bearer <token>).
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(
      new AppError(
        'No se proporcionó un token de autenticación',
        401,
        'Tu sesión no está disponible. Por favor inicia sesión para continuar.'
      )
    );
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return next(
      new AppError(
        'No se proporcionó un token de autenticación',
        401,
        'Tu sesión no está disponible. Por favor inicia sesión para continuar.'
      )
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return next(
      new AppError(
        'Token inválido o expirado',
        401,
        'Tu sesión ha expirado o no es válida. Por favor inicia sesión nuevamente.'
      )
    );
  }
};

module.exports = authMiddleware;
