const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar rutas modulares y middlewares
const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const notFoundHandler = require('./middlewares/notFoundHandler');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors());
app.use(express.json());

// -------------------------------------------------------------
// RUTAS MODULARES
// -------------------------------------------------------------
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// -------------------------------------------------------------
// MANEJADOR DE RUTAS NO ENCONTRADAS (404)
// -------------------------------------------------------------
app.use(notFoundHandler);

// -------------------------------------------------------------
// MIDDLEWARE GLOBAL DE ERRORES (SIEMPRE al final de las rutas)
// -------------------------------------------------------------
app.use(errorHandler);

// Arrancar el servidor Express
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
});