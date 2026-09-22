const mongoose = require('mongoose');

const AppConfigSchema = new mongoose.Schema({
  adaptiveEnabled: {
    type: Boolean,
    default: true
  },
  measurementInterval: {
    type: Number,
    default: 5000,
    min: [1000, 'Measurement interval must be at least 1000ms'],
    max: [60000, 'Measurement interval cannot exceed 60000ms']
  },
  qualityThresholds: {
    poorLatency: { type: Number, default: 300 },
    poorDownlink: { type: Number, default: 1.5 },
    goodLatency: { type: Number, default: 100 },
    goodDownlink: { type: Number, default: 5.0 }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AppConfig', AppConfigSchema);
