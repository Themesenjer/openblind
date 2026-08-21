const pool = require('../config/db');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

/**
 * Controlador para la autenticación de usuarios.
 */
const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  // Consultar usuario en PostgreSQL por email
  const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

  if (result.rows.length === 0) {
    throw new AppError('Credenciales inválidas (Usuario no existe)', 401);
  }

  const usuario = result.rows[0];

  // Validar contraseña
  if (usuario.password !== password) {
    throw new AppError('Credenciales inválidas (Contraseña incorrecta)', 401);
  }

  // Respuesta exitosa
  return res.status(200).json({
    status: 'Success',
    message: 'Inicio de sesión exitoso',
    user: {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      creado_en: usuario.creado_en
    }
  });
});

module.exports = {
  login
};