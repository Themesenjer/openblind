const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rutas de Autenticación /api/auth
router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/forgot-password', authController.forgotPassword);

module.exports = router;