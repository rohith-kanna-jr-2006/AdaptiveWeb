const mongoose = require('mongoose');

const MetricNames = [
  'latency',
  'loadTime',
  'responseTime',
  'bandwidth',
  'throughput',
  'resourceSize',
  'renderTime'
];

const MetricUnits = [
  'ms',
  'kbps',
  'mbps',
  'bytes',
  'percent',
  'count'
];

const MetricSources = [
  'client',
  'server',
  'browser_measurement',
  'calculated_value'
];

const PerformanceMetricSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: [true, 'Session ID is required'],
    index: true,
    trim: true
  },
  metricName: {
    type: String,
    required: [true, 'Metric name is required'],
    enum: {
      values: MetricNames,
      message: '{VALUE} is not a supported metric name'
    }
  },
  value: {
    type: Number,
    required: [true, 'Metric value is required'],
    min: [0, 'Metric value cannot be negative']
  },
  unit: {
    type: String,
    required: [true, 'Unit is required'],
    enum: {
      values: MetricUnits,
      message: '{VALUE} is not a valid unit'
    }
  },
  source: {
    type: String,
    required: [true, 'Metric source is required'],
    enum: {
      values: MetricSources,
      message: '{VALUE} is not a recognized metric source'
    }
  },
  network: {
    effectiveType: String,
    downlink: Number,
    latency: Number
  },
  device: {
    type: String,
    browser: String,
    operatingSystem: String
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

PerformanceMetricSchema.index({ sessionId: 1, timestamp: -1 });

module.exports = mongoose.model('PerformanceMetric', PerformanceMetricSchema);
