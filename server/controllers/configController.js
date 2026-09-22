const configService = require('../services/configService');

/**
 * GET /api/config
 * Retrieves adaptive configuration settings.
 */
const getConfig = async (req, res, next) => {
  try {
    const config = await configService.getConfig();
    res.status(200).json({
      success: true,
      data: config
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/config
 * Updates adaptive configuration settings.
 */
const updateConfig = async (req, res, next) => {
  try {
    const updated = await configService.updateConfig(req.body);
    res.status(200).json({
      success: true,
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getConfig,
  updateConfig
};
