// Controlador de autenticación
const login = (req, res) => {
  const { email, password } = req.body;

  res.status(200).json({
    status: 'Success',
    message: 'Inicio de sesión exitoso',
    user: {
      id: 1,
      nombre: 'Pablo Reyes',
      email: email || 'usuario@openblind.com',
      rol: 'administrador',
      creado_en: new Date().toISOString()
    }
  });
};

module.exports = {
  login,
};