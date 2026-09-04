const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Importar el Pool de conexiones a PostgreSQL
const pool = require('./config/db');

// Importar middleware de errores, autenticación y clase de error personalizada
const errorHandler = require('./middlewares/errorHandler');
const authMiddleware = require('./middlewares/authMiddleware');
const AppError = require('./utils/AppError');

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const modulosRoutes = require('./routes/modulosRoutes');
const lectorRoutes = require('./routes/lectorRoutes');
const metricsRoutes = require('./routes/metricsRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true,
}));
app.use(express.json()); // Permite a Express leer el Body en formato JSON

// -------------------------------------------------------------
// 1 ENDPOINT: Healthcheck (Estado de salud del servidor)
// -------------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor Backend corriendo correctamente' });
});

// -------------------------------------------------------------
// 2 RUTAS DE AUTENTICACIÓN, MÓDULOS, LECTOR INTELIGENTE Y MÉTRICAS
// -------------------------------------------------------------
app.use('/api/auth', authRoutes);
app.use('/api/modulos', modulosRoutes);
app.use('/api/lector', lectorRoutes);
app.use('/api/metrics', metricsRoutes);

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

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO usuarios (nombre, email, password, rol)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nombre, email, rol, creado_en`,
      [nombre, email, hashedPassword, rol]
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
// ENDPOINT: GET /api/users/profile (Perfil de usuario autenticado)
// -------------------------------------------------------------
app.get('/api/users/profile', authMiddleware, async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT id, nombre, email, rol, creado_en
       FROM usuarios
       WHERE id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      throw new AppError(
        'Usuario no encontrado',
        404,
        'No pudimos encontrar la información de tu perfil.'
      );
    }

    return res.status(200).json({
      status: 'Success',
      data: result.rows[0]
    });

  } catch (error) {
    next(error);
  }
});

// -------------------------------------------------------------
// ENDPOINT: PUT /api/users/profile (Actualizar perfil de usuario autenticado)
// -------------------------------------------------------------
app.put('/api/users/profile', authMiddleware, async (req, res, next) => {
  const { nombre, email } = req.body;

  try {
    if (!nombre || !email) {
      throw new AppError(
        'Nombre y email son obligatorios',
        400,
        'Por favor completa tu nombre y correo electrónico.'
      );
    }

    // Verificar que el nuevo email no pertenezca a otro usuario
    const existente = await pool.query(
      'SELECT id FROM usuarios WHERE email = $1 AND id <> $2',
      [email, req.user.id]
    );

    if (existente.rows.length > 0) {
      throw new AppError(
        'Ya existe un usuario con ese email',
        409,
        'Ese correo electrónico ya está registrado en otra cuenta.'
      );
    }

    const result = await pool.query(
      `UPDATE usuarios
       SET nombre = $1, email = $2
       WHERE id = $3
       RETURNING id, nombre, email, rol, creado_en`,
      [nombre, email, req.user.id]
    );

    if (result.rows.length === 0) {
      throw new AppError(
        'Usuario no encontrado',
        404,
        'No pudimos encontrar la información de tu perfil.'
      );
    }

    return res.status(200).json({
      status: 'Success',
      message: 'Perfil actualizado correctamente',
      speechMessage: 'Tu perfil se actualizó correctamente.',
      data: result.rows[0]
    });

  } catch (error) {
    next(error);
  }
});

// -------------------------------------------------------------
// ENDPOINT: PUT /api/users/password (Cambiar contraseña del usuario autenticado)
// -------------------------------------------------------------
app.put('/api/users/password', authMiddleware, async (req, res, next) => {
  const { actual, nueva } = req.body;

  try {
    if (!actual || !nueva) {
      throw new AppError(
        'Debes proporcionar la contraseña actual y la nueva',
        400,
        'Por favor ingresa tu contraseña actual y la nueva contraseña.'
      );
    }

    const result = await pool.query(
      'SELECT password FROM usuarios WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      throw new AppError(
        'Usuario no encontrado',
        404,
        'No pudimos encontrar la información de tu perfil.'
      );
    }

    const usuario = result.rows[0];

    const isMatch = await bcrypt.compare(actual, usuario.password);
    if (!isMatch) {
      throw new AppError(
        'La contraseña actual es incorrecta',
        401,
        'La contraseña actual que ingresaste no es correcta.'
      );
    }

    const hashedPassword = await bcrypt.hash(nueva, 10);

    await pool.query(
      'UPDATE usuarios SET password = $1 WHERE id = $2',
      [hashedPassword, req.user.id]
    );

    return res.status(200).json({
      status: 'Success',
      message: 'Contraseña actualizada exitosamente',
      speechMessage: 'Tu contraseña se actualizó correctamente.'
    });

  } catch (error) {
    next(error);
  }
});

// -------------------------------------------------------------
// ENDPOINT: GET /api/accessibility (Obtener preferencias de accesibilidad)
// -------------------------------------------------------------
app.get('/api/accessibility', authMiddleware, async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT * FROM preferencias_accesibilidad WHERE usuario_id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(200).json({
        status: 'Success',
        data: {
          lector_pantalla: true,
          alto_contraste: false,
          modo_oscuro: false,
          texto_grande: false,
          comandos_voz: true,
          navegacion_teclado: true,
          velocidad_lectura: 1.2,
          volumen: 80,
          idioma: 'es',
          color_acento: 'azul'
        }
      });
    }

    const pref = result.rows[0];
    if (typeof pref.velocidad_lectura === 'string') {
      pref.velocidad_lectura = parseFloat(pref.velocidad_lectura);
    }
    if (typeof pref.volumen === 'string') {
      pref.volumen = parseInt(pref.volumen, 10);
    }

    return res.status(200).json({
      status: 'Success',
      data: pref
    });

  } catch (error) {
    next(error);
  }
});

// -------------------------------------------------------------
// ENDPOINT: PUT /api/accessibility (Guardar/Sincronizar preferencias de accesibilidad)
// -------------------------------------------------------------
app.put('/api/accessibility', authMiddleware, async (req, res, next) => {
  const {
    lector_pantalla,
    alto_contraste,
    modo_oscuro,
    texto_grande,
    comandos_voz,
    navegacion_teclado,
    velocidad_lectura,
    volumen,
    idioma,
    color_acento
  } = req.body;

  try {
    const lectorPantallaVal = lector_pantalla !== undefined ? lector_pantalla : true;
    const altoContrasteVal = alto_contraste !== undefined ? alto_contraste : false;
    const modoOscuroVal = modo_oscuro !== undefined ? modo_oscuro : false;
    const textoGrandeVal = texto_grande !== undefined ? texto_grande : false;
    const comandosVozVal = comandos_voz !== undefined ? comandos_voz : true;
    const navegacionTecladoVal = navegacion_teclado !== undefined ? navegacion_teclado : true;
    const velocidadLecturaVal = velocidad_lectura !== undefined ? velocidad_lectura : 1.2;
    const volumenVal = volumen !== undefined ? volumen : 80;
    const idiomaVal = idioma || 'es';
    const colorAcentoVal = color_acento || 'azul';

    const result = await pool.query(
      `INSERT INTO preferencias_accesibilidad (
        usuario_id,
        lector_pantalla,
        alto_contraste,
        modo_oscuro,
        texto_grande,
        comandos_voz,
        navegacion_teclado,
        velocidad_lectura,
        volumen,
        idioma,
        color_acento,
        actualizado_en
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, CURRENT_TIMESTAMP)
      ON CONFLICT (usuario_id) DO UPDATE SET
        lector_pantalla = EXCLUDED.lector_pantalla,
        alto_contraste = EXCLUDED.alto_contraste,
        modo_oscuro = EXCLUDED.modo_oscuro,
        texto_grande = EXCLUDED.texto_grande,
        comandos_voz = EXCLUDED.comandos_voz,
        navegacion_teclado = EXCLUDED.navegacion_teclado,
        velocidad_lectura = EXCLUDED.velocidad_lectura,
        volumen = EXCLUDED.volumen,
        idioma = EXCLUDED.idioma,
        color_acento = EXCLUDED.color_acento,
        actualizado_en = CURRENT_TIMESTAMP
      RETURNING *`,
      [
        req.user.id,
        lectorPantallaVal,
        altoContrasteVal,
        modoOscuroVal,
        textoGrandeVal,
        comandosVozVal,
        navegacionTecladoVal,
        velocidadLecturaVal,
        volumenVal,
        idiomaVal,
        colorAcentoVal
      ]
    );

    const pref = result.rows[0];
    if (typeof pref.velocidad_lectura === 'string') {
      pref.velocidad_lectura = parseFloat(pref.velocidad_lectura);
    }
    if (typeof pref.volumen === 'string') {
      pref.volumen = parseInt(pref.volumen, 10);
    }

    return res.status(200).json({
      status: 'Success',
      message: 'Accesibilidad sincronizada',
      speechMessage: 'Tus preferencias de accesibilidad se guardaron correctamente.',
      data: pref
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
