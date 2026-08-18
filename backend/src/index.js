const express = require('express');
const cors = require('cors');
require('dotenv').config();

const buildAntigravityResponse = require('./utils/antigravity');
const errorHandler = require('./middlewares/errorHandler');

// Rutas modularizadas
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares globales
app.use(cors());
app.use(express.json());

// Healthcheck
app.get('/api/health', (req, res) => {
  return res.json(buildAntigravityResponse({
    speechMessage: 'El servidor backend de OpenBlind está corriendo correctamente.',
    data: { health: 'OK' }
  }));
});

// Enlazar enrutadores
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Middleware global de errores
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
});