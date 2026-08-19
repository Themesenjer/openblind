const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const AppError = require('../utils/AppError');
const buildAntigravityResponse = require('../utils/antigravity');

const login = async (req, res, next) => {
  const email = req.body.email ? req.body.email.trim() : '';
  const password = req.body.password;

  try {
    // 1. Validar campos requeridos
    if (!email || !password) {
      throw new AppError('Email y contraseña son obligatorios', 400);
    }

    // 2. Buscar el usuario en la base de datos PostgreSQL
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      throw new AppError('Credenciales inválidas, el usuario no existe', 401);
    }

    const user = result.rows[0];

    // 3. Comparar contraseña plana con el hash de Bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError('Credenciales inválidas, contraseña incorrecta', 401);
    }

    const nombreUsuario = user.name || user.nombre || 'Usuario';

    // 4. Respuesta exitosa estructurada para Antigravity (TTS por voz)
    return res.status(200).json(buildAntigravityResponse({
      speechMessage: `Inicio de sesión exitoso. Bienvenido, ${nombreUsuario}.`,
      data: {
        id: user.id,
        nombre: nombreUsuario,
        email: user.email,
        rol: user.role || 'user',
        creado_en: user.created_at
      }
    }));

  } catch (error) {
    // Enviar el error al middleware global (errorHandler.js)
    next(error);
  }
};

module.exports = {
  login,
};