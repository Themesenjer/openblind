const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar el Pool de conexiones a PostgreSQL
const pool = require('./config/db');

// Importar middleware de errores y clase de error personalizada
const errorHandler = require('./middlewares/errorHandler');
const AppError = require('./utils/AppError');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json()); // Permite a Express leer el Body en formato JSON

// -------------------------------------------------------------
// 1 ENDPOINT: Healthcheck (Estado de salud del servidor)
// -------------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor Backend corriendo correctamente' });
});

// -------------------------------------------------------------
// 2 ENDPOINT: POST /api/auth/login (Autenticación)
// -------------------------------------------------------------
app.post('/api/auth/login', async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Validar que se envíen los campos obligatorios
    if (!email || !password) {
      throw new AppError('Email y contraseña son obligatorios', 400);
    }

    // Consultar el usuario en PostgreSQL por email
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

    // Si el correo no existe en la base de datos
    if (result.rows.length === 0) {
      throw new AppError('Credenciales inválidas (Usuario no existe)', 401);
    }

    const usuario = result.rows[0];

    // Validar si la contraseña coincide
    if (usuario.password !== password) {
      throw new AppError('Credenciales inválidas (Contraseña incorrecta)', 401);
    }

    // Respuesta exitosa (JSON devuelto al Frontend)
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

  } catch (error) {
    next(error);
  }
});

// -------------------------------------------------------------
// 3 ENDPOINT: GET /api/users (Obtener todos los usuarios)
// -------------------------------------------------------------
app.get('/api/users', async (req, res, next) => {
  try {
    const result = await pool.query('SELECT id, nombre, email, rol, creado_en FROM usuarios ORDER BY id ASC');

    return res.status(200).json({
      status: 'Success',
      total: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
});


// -------------------------------------------------------------
// 4 ENDPOINT: POST /api/users (Crear usuario)
// -------------------------------------------------------------
app.post('/api/users', async (req, res, next) => {
  const { nombre, email, password, rol } = req.body;

  try {
    if (!nombre || !email || !password || !rol) {
      throw new AppError('Nombre, email, password y rol son obligatorios', 400);
    }

    const existente = await pool.query(
      'SELECT id FROM usuarios WHERE email = $1',
      [email]
    );

    if (existente.rows.length > 0) {
      throw new AppError('Ya existe un usuario con ese email', 409);
    }

    const result = await pool.query(
      `INSERT INTO usuarios (nombre, email, password, rol)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nombre, email, rol, creado_en`,
      [nombre, email, password, rol]
    );

    return res.status(201).json({
      status: 'Success',
      message: 'Usuario creado correctamente',
      data: result.rows[0]
    });

  } catch (error) {
    next(error);
  }
});

// -------------------------------------------------------------
// 5 ENDPOINT: DELETE /api/users/:id (Eliminar usuario)
// -------------------------------------------------------------
app.delete('/api/users/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM usuarios
       WHERE id = $1
       RETURNING id, nombre, email, rol, creado_en`,
      [id]
    );

    if (result.rows.length === 0) {
      throw new AppError('Usuario no encontrado', 404);
    }

    return res.status(200).json({
      status: 'Success',
      message: 'Usuario eliminado correctamente',
      data: result.rows[0]
    });

  } catch (error) {
    next(error);
  }
});

// -------------------------------------------------------------
// 6 ENDPOINT: GET /api/users/:id (Consultar usuario por ID)
// -------------------------------------------------------------
app.get('/api/users/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT id, nombre, email, rol, creado_en
       FROM usuarios
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      throw new AppError('Usuario no encontrado', 404);
    }

    return res.status(200).json({
      status: 'Success',
      data: result.rows[0]
    });

  } catch (error) {
    next(error);
  }
});

// Middleware global de manejo de errores (SIEMPRE al final de las rutas)
app.use(errorHandler);

// Arrancar el servidor Express
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
});