const express = require('express');
const router = express.Router();
const usageMetricsController = require('../controllers/usageMetricsController');

// POST /api/metrics/usage - Registrar telemetría de movilidad / voz
router.post('/usage', usageMetricsController.trackAccessibilityEvent);

// GET /api/metrics/summary - Obtener resumen de adopción de usuarios no videntes
router.get('/summary', usageMetricsController.getAccessibilityMetricsSummary);

module.exports = router;
