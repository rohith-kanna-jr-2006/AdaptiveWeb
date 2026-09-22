const express = require('express');
const router = express.Router();
const configController = require('../controllers/configController');
const validate = require('../middleware/validate');
const { validateConfigUpdate } = require('../validators/configValidator');

router.get('/config', configController.getConfig);
router.put('/config', validate(validateConfigUpdate), configController.updateConfig);

module.exports = router;
