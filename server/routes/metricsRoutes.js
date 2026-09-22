const express = require('express');
const router = express.Router();
const metricsController = require('../controllers/metricsController');
const validate = require('../middleware/validate');
const { validatePostMetric, validateGetMetricsBySession } = require('../validators/metricsValidator');

router.post('/metrics', validate(validatePostMetric), metricsController.postMetric);
router.get('/metrics/:sessionId', validate(validateGetMetricsBySession), metricsController.getMetricsBySession);

module.exports = router;
