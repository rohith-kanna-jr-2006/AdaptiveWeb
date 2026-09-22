const PerformanceMetric = require('../models/PerformanceMetric');
const Session = require('../models/Session');

/**
 * Stores performance measurement metric.
 * @param {Object} metricData 
 */
const recordMetric = async (metricData) => {
  const {
    sessionId,
    metricName,
    value,
    unit,
    source,
    network,
    device,
    metadata
  } = metricData;

  // Auto-upsert Session record if non-existent
  await Session.findOneAndUpdate(
    { sessionId },
    {
      $setOnInsert: { sessionId },
      $set: {
        ...(network ? { network } : {}),
        ...(device ? { device } : {})
      }
    },
    { upsert: true, new: true }
  ).catch(() => {
    // Non-blocking fallback for session update
  });

  const metric = await PerformanceMetric.create({
    sessionId,
    metricName,
    value,
    unit,
    source,
    network,
    device,
    metadata,
    timestamp: new Date()
  });

  return {
    id: metric._id,
    sessionId: metric.sessionId,
    metricName: metric.metricName,
    value: metric.value,
    unit: metric.unit,
    source: metric.source,
    timestamp: metric.timestamp
  };
};

/**
 * Retrieves stored performance metrics by sessionId.
 * @param {string} sessionId 
 */
const getMetricsBySessionId = async (sessionId) => {
  const metrics = await PerformanceMetric.find({ sessionId })
    .sort({ timestamp: -1 })
    .select('-__v');

  return {
    sessionId,
    count: metrics.length,
    metrics
  };
};

module.exports = {
  recordMetric,
  getMetricsBySessionId
};
