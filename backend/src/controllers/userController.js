const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const AppError = require('../utils/AppError');
const buildAntigravityResponse = require('../utils/antigravity');

// GET /api/users
const getUsers = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT id, name, email, role, created_at FROM users ORDER BY id ASC');
    return res.status(200).json(buildAntigravityResponse({
      speechMessage: `Se encontraron ${result.rows.length} usuarios registrados en el sistema.`,
      data: result.rows
    }));
  } catch (error) {
    next(error);
  }
};

// GET /api/users/:id
const getUserById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT id, name, email, role, created_at FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) throw new AppError('Usuario no encontrado', 404);

    return res.status(200).json(buildAntigravityResponse({
      speechMessage: `Mostrando la información de ${result.rows[0].name}.`,
      data: result.rows[0]
    }));
  } catch (error) {
    next(error);
  }
};

// POST /api/users
const createUser = async (req, res, next) => {
  const { nombre, email, password, rol } = req.body;
  try {
    if (!nombre || !email || !password) throw new AppError('Nombre, email y password son obligatorios', 400);

    const existente = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existente.rows.length > 0) throw new AppError('Ya existe un usuario con ese correo electrónico', 409);

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at`,
      [nombre, email, hashedPassword, rol || 'user']
    );

    return res.status(201).json(buildAntigravityResponse({
      speechMessage: `El usuario ${result.rows[0].name} ha sido creado correctamente.`,
      data: result.rows[0]
    }));
  } catch (error) {
    next(error);
  }
};

// PUT /api/users/:id
const updateUser = async (req, res, next) => {
  const { id } = req.params;
  const { nombre, email, rol } = req.body;
  try {
    if (!nombre || !email) throw new AppError('Nombre y email son obligatorios', 400);

    const result = await pool.query(
      `UPDATE users SET name = $1, email = $2, role = $3 WHERE id = $4 RETURNING id, name, email, role, created_at`,
      [nombre, email, rol || 'user', id]
    );

    if (result.rows.length === 0) throw new AppError('Usuario no encontrado para actualizar', 404);

    return res.status(200).json(buildAntigravityResponse({
      speechMessage: `Los datos del usuario ${result.rows[0].name} han sido actualizados con éxito.`,
      data: result.rows[0]
    }));
  } catch (error) {
    next(error);
  }
};

// DELETE /api/users/:id
const deleteUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id, name, email, role, created_at', [id]);
    if (result.rows.length === 0) throw new AppError('Usuario no encontrado para eliminar', 404);

    return res.status(200).json(buildAntigravityResponse({
      speechMessage: `El usuario ${result.rows[0].name} fue eliminado con éxito.`,
      data: result.rows[0]
    }));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};