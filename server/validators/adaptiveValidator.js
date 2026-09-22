/**
 * Validates POST /api/adaptive/evaluate request payload.
 */
const validateAdaptiveEvaluate = (req) => {
  const body = req.body;

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return 'Request body must be a valid JSON object';
  }

  if (body.sessionId !== undefined && (typeof body.sessionId !== 'string' || body.sessionId.trim() === '')) {
    return 'Field sessionId must be a non-empty string if provided';
  }

  if (body.network !== undefined) {
    if (typeof body.network !== 'object' || body.network === null || Array.isArray(body.network)) {
      return 'Field network must be an object';
    }
    const { effectiveType, downlink, latency } = body.network;

    if (effectiveType !== undefined) {
      const allowedEffectiveTypes = ['slow-2g', '2g', '3g', '4g', 'unknown'];
      if (typeof effectiveType !== 'string' || !allowedEffectiveTypes.includes(effectiveType)) {
        return `network.effectiveType must be one of: ${allowedEffectiveTypes.join(', ')}`;
      }
    }

    if (downlink !== undefined && (typeof downlink !== 'number' || isNaN(downlink) || downlink < 0)) {
      return 'network.downlink must be a non-negative number';
    }

    if (latency !== undefined && (typeof latency !== 'number' || isNaN(latency) || latency < 0)) {
      return 'network.latency must be a non-negative number';
    }
  }

  if (body.device !== undefined) {
    if (typeof body.device !== 'object' || body.device === null || Array.isArray(body.device)) {
      return 'Field device must be an object';
    }
    if (body.device.type !== undefined) {
      const allowedTypes = ['desktop', 'mobile', 'tablet', 'unknown'];
      if (typeof body.device.type !== 'string' || !allowedTypes.includes(body.device.type)) {
        return `device.type must be one of: ${allowedTypes.join(', ')}`;
      }
    }
  }

  if (body.performance !== undefined) {
    if (typeof body.performance !== 'object' || body.performance === null || Array.isArray(body.performance)) {
      return 'Field performance must be an object';
    }
    if (body.performance.loadTime !== undefined && (typeof body.performance.loadTime !== 'number' || isNaN(body.performance.loadTime) || body.performance.loadTime < 0)) {
      return 'performance.loadTime must be a non-negative number';
    }
  }

  return null; // Valid
};

module.exports = {
  validateAdaptiveEvaluate
};
