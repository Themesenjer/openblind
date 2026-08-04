const express = require('express');
const router = express.Router();
const { getMallas, createMalla } = require('../controllers/mallaController');

router.get('/', getMallas);
router.post('/', createMalla);

module.exports = router;