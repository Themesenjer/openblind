const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

/**
 * Controller: POST /api/auth/login
 * Autentica usuario en PostgreSQL y retorna respuesta JSON con speechMessage.
 */
const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      throw new AppError(
        'Email y contraseña son obligatorios',
        400,
        'Por favor ingresa tu correo electrónico y contraseña para continuar.'
      );
    }

    // Consultar el usuario en PostgreSQL por email
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      throw new AppError(
        'Credenciales inválidas (Usuario no existe)',
        401,
        'Credenciales incorrectas. El usuario ingresado no existe.'
      );
    }

    const usuario = result.rows[0];

    // Validar contraseña cifrada con bcrypt
    const isPasswordValid = await bcrypt.compare(password, usuario.password);

    if (!isPasswordValid) {
      throw new AppError(
        'Credenciales inválidas (Contraseña incorrecta)',
        401,
        'Credenciales incorrectas. La contraseña ingresada no es válida.'
      );
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    console.log('POST /api/auth/login - 200 OK');
    return res.status(200).json({
      status: 'Success',
      message: 'Inicio de sesión exitoso',
      speechMessage: `Bienvenido ${usuario.nombre}. Inicio de sesión exitoso. Redirigiendo a tu panel de control.`,
      token,
      user: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        creado_en: usuario.creado_en
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Controller: POST /api/auth/register
 * Crea un nuevo usuario en PostgreSQL y retorna respuesta con speechMessage.
 */
const register = async (req, res, next) => {
  const { email, password, rol } = req.body;
  const nombre = req.body.fullName || req.body.nombre;

  try {
    if (!nombre || !email || !password) {
      throw new AppError(
        'Nombre, email y contraseña son obligatorios',
        400,
        'Por favor completa todos los campos requeridos para el registro.'
      );
    }

    // Verificar si ya existe el correo en la BD
    const existente = await pool.query(
      'SELECT id FROM usuarios WHERE email = $1',
      [email]
    );

    if (existente.rows.length > 0) {
      throw new AppError(
        'Ya existe un usuario con este email',
        409,
        'Ya existe una cuenta registrada con este correo electrónico.'
      );
    }

    const userRole = rol || 'usuario';

    // Cifrar la contraseña con bcryptjs (10 salt rounds)
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO usuarios (nombre, email, password, rol)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nombre, email, rol, creado_en`,
      [nombre, email, hashedPassword, userRole]
    );

    const nuevoUsuario = result.rows[0];

    console.log('POST /api/auth/register - 201 Created');
    return res.status(201).json({
      status: 'Success',
      message: 'Usuario registrado exitosamente',
      speechMessage: `Cuenta creada exitosamente para ${nuevoUsuario.nombre}. Ya puedes iniciar sesión.`,
      user: nuevoUsuario
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Controller: POST /api/auth/forgot-password
 * Valida el correo en PostgreSQL y genera respuesta accesible con speechMessage.
 */
const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    if (!email) {
      throw new AppError(
        'El correo electrónico es obligatorio',
        400,
        'Por favor ingresa tu correo electrónico para restablecer la contraseña.'
      );
    }

    const result = await pool.query(
      'SELECT id, nombre, email FROM usuarios WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      throw new AppError(
        'Usuario no encontrado',
        404,
        'No encontramos ninguna cuenta registrada con el correo proporcionado.'
      );
    }

    const usuario = result.rows[0];

    console.log('POST /api/auth/forgot-password - 200 OK');
    return res.status(200).json({
      status: 'Success',
      message: 'Instrucciones de recuperación enviadas',
      speechMessage: `Se han enviado las instrucciones de recuperación al correo ${usuario.email}.`,
      data: {
        email: usuario.email
      }
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  register,
  forgotPassword,
};