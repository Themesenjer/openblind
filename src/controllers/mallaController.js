const db = require('../config/db'); // Ajusta la ruta a tu archivo de conexión si cambia

// Obtener todas las mallas
const getMallas = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM mallas ORDER BY id ASC');
    res.status(200).json({
      status: 'Success',
      mallas: result.rows
    });
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      message: 'Error al consultar las mallas',
      error: error.message
    });
  }
};

// Crear una nueva malla
const createMalla = async (req, res) => {
  const { codigo, carrera, anio } = req.body;

  if (!codigo || !carrera || !anio) {
    return res.status(400).json({
      status: 'Error',
      message: 'Los campos codigo, carrera y anio son obligatorios'
    });
  }

  try {
    const result = await db.query(
      'INSERT INTO mallas (codigo, carrera, anio) VALUES ($1, $2, $3) RETURNING *',
      [codigo, carrera, anio]
    );

    res.status(201).json({
      status: 'Success',
      message: 'Malla creada exitosamente',
      malla: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      message: 'Error al crear la malla',
      error: error.message
    });
  }
};

module.exports = {
  getMallas,
  createMalla
};