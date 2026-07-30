// Controlador de autenticación
const login = (req, res) => {
  const { email, password } = req.body;

  // Respuesta estática simulada por hoy
  res.status(200).json({
    status: 'success',
    message: 'Inicio de sesión simulado exitoso',
    user: {
      id: 1,
      email: email || 'usuario@ejemplo.com',
      role: 'admin'
    },
    token: 'token_falso_de_prueba_12345'
  });
};

module.exports = {
  login,
};