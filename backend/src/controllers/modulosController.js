const pool = require('../config/db');
const AppError = require('../utils/AppError');

/**
 * Controller: GET /api/modulos
 * Obtiene el catálogo completo de módulos incluyendo el progreso y favorito del usuario autenticado.
 */
const obtenerModulos = async (req, res, next) => {
  const usuarioId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT
        m.slug AS id,
        m.slug,
        m.categoria,
        m.titulo,
        m.badge,
        m.descripcion,
        m.icon_name,
        m.icon_bg,
        m.items,
        COALESCE(p.progreso, 0) AS progreso,
        COALESCE(p.es_favorito, false) AS es_favorito
      FROM modulos m
      LEFT JOIN progreso_modulos p
        ON m.slug = p.modulo_slug
        AND p.usuario_id = $1
      ORDER BY m.creado_en ASC;`,
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
 * Controller: GET /api/modulos/:slug
 * Obtiene la información detallada de un módulo por su slug para el usuario autenticado.
 */
const obtenerModuloPorSlug = async (req, res, next) => {
  const usuarioId = req.user.id;
  const { slug } = req.params;

  try {
    const result = await pool.query(
      `SELECT
        m.slug,
        m.categoria,
        m.titulo,
        m.badge,
        m.descripcion,
        m.icon_name,
        m.icon_bg,
        m.items,
        COALESCE(p.progreso, 0) AS progreso,
        COALESCE(p.es_favorito, false) AS es_favorito
      FROM modulos m
      LEFT JOIN progreso_modulos p
        ON m.slug = p.modulo_slug
        AND p.usuario_id = $1
      WHERE m.slug = $2;`,
      [usuarioId, slug]
    );

    if (result.rows.length === 0) {
      throw new AppError(
        'Módulo no encontrado',
        404,
        'No pudimos encontrar el módulo solicitado.'
      );
    }

    return res.status(200).json({
      status: 'Success',
      data: result.rows[0]
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Controller: POST /api/modulos/:slug/progreso
 * Actualiza o registra el progreso del usuario para un módulo específico.
 */
const actualizarProgreso = async (req, res, next) => {
  const usuarioId = req.user.id;
  const { slug } = req.params;
  const { progreso } = req.body;

  try {
    // Validar estrictamente que progreso sea un entero entre 0 y 100
    if (
      typeof progreso !== 'number' ||
      !Number.isInteger(progreso) ||
      progreso < 0 ||
      progreso > 100
    ) {
      throw new AppError(
        'El progreso debe ser un número entero entre 0 y 100',
        400,
        'El progreso debe estar entre cero y cien por ciento.'
      );
    }

    // Comprobar que el módulo exista en la base de datos
    const moduloExistente = await pool.query(
      'SELECT slug FROM modulos WHERE slug = $1',
      [slug]
    );

    if (moduloExistente.rows.length === 0) {
      throw new AppError(
        'Módulo no encontrado',
        404,
        'No pudimos encontrar el módulo solicitado.'
      );
    }

    // Insertar o actualizar el progreso usando UPSERT ON CONFLICT (usuario_id, modulo_slug)
    const result = await pool.query(
      `INSERT INTO progreso_modulos (
        usuario_id,
        modulo_slug,
        progreso,
        actualizado_en
      )
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
      ON CONFLICT (usuario_id, modulo_slug)
      DO UPDATE SET
        progreso = EXCLUDED.progreso,
        actualizado_en = CURRENT_TIMESTAMP
      RETURNING *;`,
      [usuarioId, slug, progreso]
    );

    return res.status(200).json({
      status: 'Success',
      message: 'Progreso actualizado correctamente',
      speechMessage: 'Tu progreso se guardó correctamente.',
      data: result.rows[0]
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Controller: POST /api/modulos/:slug/favorito
 * Alterna (toggle) el estado de favorito de un módulo para el usuario autenticado.
 */
const toggleFavorito = async (req, res, next) => {
  const usuarioId = req.user.id;
  const { slug } = req.params;

  try {
    // Comprobar que el módulo exista en la base de datos
    const moduloExistente = await pool.query(
      'SELECT slug FROM modulos WHERE slug = $1',
      [slug]
    );

    if (moduloExistente.rows.length === 0) {
      throw new AppError(
        'Módulo no encontrado',
        404,
        'No pudimos encontrar el módulo solicitado.'
      );
    }

    // Insertar o conmutar es_favorito usando UPSERT ON CONFLICT (usuario_id, modulo_slug)
    const result = await pool.query(
      `INSERT INTO progreso_modulos (
        usuario_id,
        modulo_slug,
        es_favorito,
        actualizado_en
      )
      VALUES ($1, $2, true, CURRENT_TIMESTAMP)
      ON CONFLICT (usuario_id, modulo_slug)
      DO UPDATE SET
        es_favorito = NOT progreso_modulos.es_favorito,
        actualizado_en = CURRENT_TIMESTAMP
      RETURNING *;`,
      [usuarioId, slug]
    );

    return res.status(200).json({
      status: 'Success',
      message: 'Favorito actualizado correctamente',
      speechMessage: 'Tu lista de favoritos se actualizó correctamente.',
      data: result.rows[0]
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  obtenerModulos,
  obtenerModuloPorSlug,
  actualizarProgreso,
  toggleFavorito,
};
