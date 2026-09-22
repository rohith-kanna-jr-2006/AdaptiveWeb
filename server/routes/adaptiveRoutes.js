const express = require('express');
const router = express.Router();
const adaptiveController = require('../controllers/adaptiveController');
const validate = require('../middleware/validate');
const { validateAdaptiveEvaluate } = require('../validators/adaptiveValidator');

router.get('/adaptive/policy', adaptiveController.getPolicy);
router.post('/adaptive/evaluate', validate(validateAdaptiveEvaluate), adaptiveController.evaluateAdaptive);

module.exports = router;
