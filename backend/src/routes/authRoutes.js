const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateLoginInput } = require('../middlewares/validationMiddleware');

// Ruta POST /api/auth/login
router.post('/login', validateLoginInput, authController.login);

module.exports = router;