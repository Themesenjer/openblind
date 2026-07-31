const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar el Pool de conexiones a PostgreSQL
const pool = require('./config/db');

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
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validar que se envíen los campos obligatorios
    if (!email || !password) {
      return res.status(400).json({
        status: 'Error',
        message: 'Email y contraseña son obligatorios'
      });
    }

    // Consultar el usuario en PostgreSQL por email
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

    // Si el correo no existe en la base de datos
    if (result.rows.length === 0) {
      return res.status(401).json({
        status: 'Error',
        message: 'Credenciales inválidas (Usuario no existe)'
      });
    }

    const usuario = result.rows[0];

    // Validar si la contraseña coincide
    if (usuario.password !== password) {
      return res.status(401).json({
        status: 'Error',
        message: 'Credenciales inválidas (Contraseña incorrecta)'
      });
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
    console.error('Error en /api/auth/login:', error.message);
    return res.status(500).json({
      status: 'Error',
      message: 'Error interno del servidor al autenticar'
    });
  }
});

// -------------------------------------------------------------
// 3 ENDPOINT: GET /api/users (Obtener todos los usuarios)
// -------------------------------------------------------------
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nombre, email, rol, creado_en FROM usuarios ORDER BY id ASC');

    return res.status(200).json({
      status: 'Success',
      total: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Error en /api/users:', error.message);
    return res.status(500).json({
      status: 'Error',
      message: 'Error interno al consultar usuarios'
    });
  }
});


// -------------------------------------------------------------
// 4 ENDPOINT: POST /api/users (Crear usuario)
// -------------------------------------------------------------
app.post('/api/users', async (req, res) => {
  const { nombre, email, password, rol } = req.body;

  try {
    if (!nombre || !email || !password || !rol) {
      return res.status(400).json({
        status: 'Error',
        message: 'Nombre, email, password y rol son obligatorios'
      });
    }

    const existente = await pool.query(
      'SELECT id FROM usuarios WHERE email = $1',
      [email]
    );

    if (existente.rows.length > 0) {
      return res.status(409).json({
        status: 'Error',
        message: 'Ya existe un usuario con ese email'
      });
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
    console.error('Error en POST /api/users:', error.message);

    return res.status(500).json({
      status: 'Error',
      message: 'Error interno al crear el usuario'
    });
  }
});

// -------------------------------------------------------------
// 5 ENDPOINT: DELETE /api/users/:id (Eliminar usuario)
// -------------------------------------------------------------
app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM usuarios
       WHERE id = $1
       RETURNING id, nombre, email, rol, creado_en`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'Error',
        message: 'Usuario no encontrado'
      });
    }

    return res.status(200).json({
      status: 'Success',
      message: 'Usuario eliminado correctamente',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error en DELETE /api/users/:id:', error.message);

    return res.status(500).json({
      status: 'Error',
      message: 'Error interno al eliminar el usuario'
    });
  }
});

// -------------------------------------------------------------
// 6 ENDPOINT: GET /api/users/:id (Consultar usuario por ID)
// -------------------------------------------------------------
app.get('/api/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT id, nombre, email, rol, creado_en
       FROM usuarios
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'Error',
        message: 'Usuario no encontrado'
      });
    }

    return res.status(200).json({
      status: 'Success',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error en GET /api/users/:id:', error.message);

    return res.status(500).json({
      status: 'Error',
      message: 'Error interno al consultar el usuario'
    });
  }
});

// Arrancar el servidor Express
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
});