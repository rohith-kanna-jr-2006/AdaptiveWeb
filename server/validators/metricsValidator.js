const allowedMetricNames = [
  'latency',
  'loadTime',
  'responseTime',
  'bandwidth',
  'throughput',
  'resourceSize',
  'renderTime'
];

const allowedUnits = [
  'ms',
  'kbps',
  'mbps',
  'bytes',
  'percent',
  'count'
];

const allowedSources = [
  'client',
  'server',
  'browser_measurement',
  'calculated_value'
];

/**
 * Validates POST /api/metrics payload.
 */
const validatePostMetric = (req) => {
  const body = req.body;

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return 'Request body must be a valid JSON object';
  }

  const { sessionId, metricName, value, unit, source } = body;

  if (!sessionId || typeof sessionId !== 'string' || sessionId.trim() === '') {
    return 'Field sessionId is required and must be a non-empty string';
  }

  if (!metricName || typeof metricName !== 'string' || !allowedMetricNames.includes(metricName)) {
    return `Field metricName is required and must be one of: ${allowedMetricNames.join(', ')}`;
  }

  if (value === undefined || typeof value !== 'number' || isNaN(value) || value < 0) {
    return 'Field value is required and must be a non-negative number';
  }

  if (!unit || typeof unit !== 'string' || !allowedUnits.includes(unit)) {
    return `Field unit is required and must be one of: ${allowedUnits.join(', ')}`;
  }

  if (!source || typeof source !== 'string' || !allowedSources.includes(source)) {
    return `Field source is required and must be one of: ${allowedSources.join(', ')}`;
  }

  return null; // Valid
};

/**
 * Validates GET /api/metrics/:sessionId params.
 */
const validateGetMetricsBySession = (req) => {
  const { sessionId } = req.params;
  if (!sessionId || typeof sessionId !== 'string' || sessionId.trim() === '') {
    return 'sessionId parameter is required';
  }
  return null;
};

module.exports = {
  validatePostMetric,
  validateGetMetricsBySession
};
