/**
 * Validates PUT /api/config payload.
 */
const validateConfigUpdate = (req) => {
  const body = req.body;

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return 'Request body must be a valid JSON object';
  }

  const allowedKeys = ['adaptiveEnabled', 'measurementInterval', 'qualityThresholds'];
  const keys = Object.keys(body);

  if (keys.length === 0) {
    return 'Configuration payload cannot be empty';
  }

  for (const key of keys) {
    if (!allowedKeys.includes(key)) {
      return `Invalid field: '${key}' is not allowed in configuration updates`;
    }
  }

  if (body.adaptiveEnabled !== undefined && typeof body.adaptiveEnabled !== 'boolean') {
    return 'Field adaptiveEnabled must be a boolean';
  }

  if (body.measurementInterval !== undefined) {
    if (typeof body.measurementInterval !== 'number' || isNaN(body.measurementInterval)) {
      return 'Field measurementInterval must be a valid number';
    }
    if (body.measurementInterval < 1000 || body.measurementInterval > 60000) {
      return 'Field measurementInterval must be between 1000 and 60000 milliseconds';
    }
  }

  if (body.qualityThresholds !== undefined) {
    if (typeof body.qualityThresholds !== 'object' || body.qualityThresholds === null || Array.isArray(body.qualityThresholds)) {
      return 'Field qualityThresholds must be an object';
    }

    const { poorLatency, poorDownlink, goodLatency, goodDownlink } = body.qualityThresholds;
    if (poorLatency !== undefined && (typeof poorLatency !== 'number' || poorLatency < 0)) {
      return 'qualityThresholds.poorLatency must be a non-negative number';
    }
    if (poorDownlink !== undefined && (typeof poorDownlink !== 'number' || poorDownlink < 0)) {
      return 'qualityThresholds.poorDownlink must be a non-negative number';
    }
    if (goodLatency !== undefined && (typeof goodLatency !== 'number' || goodLatency < 0)) {
      return 'qualityThresholds.goodLatency must be a non-negative number';
    }
    if (goodDownlink !== undefined && (typeof goodDownlink !== 'number' || goodDownlink < 0)) {
      return 'qualityThresholds.goodDownlink must be a non-negative number';
    }
  }

  return null; // Valid
};

module.exports = {
  validateConfigUpdate
};
