const express = require('express');
const router = express.Router();

// Si en authController solo tienes login, solo importa login
const { login } = require('../controllers/authController');

router.post('/login', login);

module.exports = router;