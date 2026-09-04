const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const lectorController = require('../controllers/lectorController');

// Rutas del Lector Inteligente /api/lector
router.get('/textos', authMiddleware, lectorController.obtenerTextos);
router.post('/textos', authMiddleware, lectorController.guardarTexto);
router.delete('/textos/:id', authMiddleware, lectorController.eliminarTexto);

module.exports = router;
