require('dotenv').config();
require('./config/db');

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Ruta de prueba (Endpoint de salud)
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor Backend de OpenBlind corriendo correctamente' });
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});