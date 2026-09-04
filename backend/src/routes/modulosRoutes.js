const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const modulosController = require('../controllers/modulosController');

// Rutas de Módulos /api/modulos
router.get('/', authMiddleware, modulosController.obtenerModulos);
router.get('/:slug', authMiddleware, modulosController.obtenerModuloPorSlug);
router.post('/:slug/progreso', authMiddleware, modulosController.actualizarProgreso);
router.post('/:slug/favorito', authMiddleware, modulosController.toggleFavorito);

module.exports = router;
