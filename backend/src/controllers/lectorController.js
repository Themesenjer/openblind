const pool = require('../config/db');
const AppError = require('../utils/AppError');

/**
 * Controller: GET /api/lector/textos
 * Obtiene la lista de textos guardados para el Lector Inteligente del usuario autenticado.
 */
const obtenerTextos = async (req, res, next) => {
  const usuarioId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT id, titulo, contenido, idioma, creado_en
       FROM textos_lector
       WHERE usuario_id = $1
       ORDER BY creado_en DESC;`,
      [usuarioId]
    );

    return res.status(200).json({
      status: 'Success',
      data: result.rows
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Controller: POST /api/lector/textos
 * Guarda un nuevo texto en la biblioteca del Lector Inteligente para el usuario autenticado.
 */
const guardarTexto = async (req, res, next) => {
  const usuarioId = req.user.id;
  const { titulo, contenido, idioma } = req.body;

  try {
    if (!titulo || !contenido) {
      throw new AppError(
        'Título y contenido son obligatorios',
        400,
        'Por favor agrega un título y el contenido que deseas guardar.'
      );
    }

    const result = await pool.query(
      `INSERT INTO textos_lector (
        usuario_id,
        titulo,
        contenido,
        idioma
      )
      VALUES ($1, $2, $3, $4)
      RETURNING id, titulo, contenido, idioma, creado_en;`,
      [usuarioId, titulo, contenido, idioma || 'es-ES']
    );

    return res.status(201).json({
      status: 'Success',
      message: 'Texto guardado correctamente',
      speechMessage: 'Tu texto se guardó correctamente en el lector.',
      data: result.rows[0]
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Controller: DELETE /api/lector/textos/:id
 * Elimina un texto guardado del Lector Inteligente del usuario autenticado.
 */
const eliminarTexto = async (req, res, next) => {
  const usuarioId = req.user.id;
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM textos_lector
       WHERE id = $1 AND usuario_id = $2
       RETURNING id;`,
      [id, usuarioId]
    );

    if (result.rows.length === 0) {
      throw new AppError(
        'Documento no encontrado o no autorizado',
        404,
        'No pudimos encontrar ese documento o no tienes permiso para eliminarlo.'
      );
    }

    return res.status(200).json({
      status: 'Success',
      message: 'Documento eliminado',
      speechMessage: 'El documento se eliminó correctamente.'
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  obtenerTextos,
  guardarTexto,
  eliminarTexto,
};
