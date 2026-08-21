const AppError = require('../utils/AppError');

/**
 * Middleware de validación de campos obligatorios para el inicio de sesión.
 */
const validateLoginInput = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Email y contraseña son obligatorios', 400));
  }
  next();
};

/**
 * Middleware de validación de campos obligatorios para creación de usuario.
 */
const validateCreateUserInput = (req, res, next) => {
  const { nombre, email, password, rol } = req.body;
  if (!nombre || !email || !password || !rol) {
    return next(new AppError('Nombre, email, password y rol son obligatorios', 400));
  }
  next();
};

/**
 * Middleware de validación de campos obligatorios para actualización de usuario (PUT).
 */
const validateUpdateUserInput = (req, res, next) => {
  const { nombre, email, password, rol } = req.body;
  if (!nombre || !email || !password || !rol) {
    return next(new AppError('Nombre, email, password y rol son obligatorios', 400));
  }
  next();
};

/**
 * Middleware de validación para actualización parcial de usuario (PATCH).
 */
const validatePatchUserInput = (req, res, next) => {
  const allowedFields = ['nombre', 'email', 'password', 'rol'];

  const providedFields = allowedFields.filter((field) =>
    Object.prototype.hasOwnProperty.call(req.body, field)
  );

  // No se envió ningún campo permitido
  if (providedFields.length === 0) {
    return next(
      new AppError(
        'Debe proporcionar al menos un campo para actualizar (nombre, email, password, rol)',
        400
      )
    );
  }

  // Algún campo enviado es null, no es texto o está vacío
  const hasInvalidField = providedFields.some((field) => {
    const value = req.body[field];

    return (
      value === null ||
      typeof value !== 'string' ||
      value.trim() === ''
    );
  });

  if (hasInvalidField) {
    return next(
      new AppError('Los campos enviados no pueden estar vacíos', 400)
    );
  }

  return next();
};

module.exports = {
  validateLoginInput,
  validateCreateUserInput,
  validateUpdateUserInput,
  validatePatchUserInput
};

