/**
 * Controlador para la verificación de salud del servidor.
 */
const getHealth = (req, res) => {
  return res.status(200).json({ status: 'OK', message: 'Servidor Backend corriendo correctamente' });
};

module.exports = {
  getHealth
};
