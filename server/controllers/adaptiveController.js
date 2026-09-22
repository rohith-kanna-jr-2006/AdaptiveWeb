const adaptiveService = require('../services/adaptiveService');

/**
 * GET /api/adaptive/policy
 * Returns active adaptive policy configuration.
 */
const getPolicy = async (req, res, next) => {
  try {
    const policyData = await adaptiveService.getActivePolicy();
    res.status(200).json({
      success: true,
      data: policyData
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/adaptive/evaluate
 * Evaluates current client network and device context.
 */
const evaluateAdaptive = async (req, res, next) => {
  try {
    const evaluation = await adaptiveService.evaluateContext(req.body);
    res.status(200).json({
      success: true,
      data: evaluation
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPolicy,
  evaluateAdaptive
};
