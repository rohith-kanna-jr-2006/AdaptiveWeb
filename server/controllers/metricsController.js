const metricsService = require('../services/metricsService');

/**
 * POST /api/metrics
 * Stores performance measurement metric.
 */
const postMetric = async (req, res, next) => {
  try {
    const metric = await metricsService.recordMetric(req.body);
    res.status(201).json({
      success: true,
      data: metric
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/metrics/:sessionId
 * Retrieves all stored metrics for a session.
 */
const getMetricsBySession = async (req, res, next) => {
  try {
    const result = await metricsService.getMetricsBySessionId(req.params.sessionId);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  postMetric,
  getMetricsBySession
};
