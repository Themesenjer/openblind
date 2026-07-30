const express = require('express');
const app = express();

// Middleware para procesar JSON en las peticiones
app.use(express.json());

// Importar rutas de autenticación (si las utilizas)
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Base de datos temporal en memoria
let users = [
  { id: 1, nombre: "Pablo Reyes", email: "pablo@openblind.com" }
];

// 1. OBTENER todos los usuarios (GET)
app.get('/api/users', (req, res) => {
  res.status(200).json({ status: "Success", users });
});

// 2. CREAR un nuevo usuario (POST)
app.post('/api/users', (req, res) => {
  const { nombre, email } = req.body;
  
  if (!nombre || !email) {
    return res.status(400).json({ message: "Nombre y email son requeridos" });
  }

  const newUser = {
    id: users.length + 1,
    nombre,
    email
  };
  
  users.push(newUser);
  res.status(201).json({ status: "Usuario creado", user: newUser });
});

// 3. EDITAR un usuario por ID (PUT)
app.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, email } = req.body;

  const userIndex = users.findIndex(u => u.id === parseInt(id));
  if (userIndex === -1) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  users[userIndex] = { ...users[userIndex], nombre, email };
  res.status(200).json({ status: "Usuario actualizado", user: users[userIndex] });
});

// 4. ELIMINAR un usuario por ID (DELETE)
app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const userIndex = users.findIndex(u => u.id === parseInt(id));

  if (userIndex === -1) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  const deletedUser = users.splice(userIndex, 1);
  res.status(200).json({ status: "Usuario eliminado", user: deletedUser[0] });
});

// Inicialización del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});