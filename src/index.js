const express = require('express');
const app = express();

// 1.  Rutas
const authRoutes = require('./routes/authRoutes');
const mallaRoutes = require('./routes/mallaRoutes'); // Corregido: sin la 's' extra

// 2. Middlewares
app.use(express.json());

// 3. la API
app.use('/api/auth', authRoutes);
app.use('/api/mallas', mallaRoutes);

// Base de datos temporal
let users = [
  { id: 1, nombre: "Pablo Reyes", email: "pablo@openblind.com" }
];

// 1.  todos los usuarios (GET)
app.get('/api/users', (req, res) => {
  res.status(200).json({ status: "Success", users });
});

// 2.  un nuevo usuario (POST)
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