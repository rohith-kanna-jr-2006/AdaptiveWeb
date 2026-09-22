const mongoose = require('mongoose');

const DeviceSchema = new mongoose.Schema({
  type: { type: String, enum: ['desktop', 'mobile', 'tablet', 'unknown'], default: 'unknown' },
  browser: { type: String, default: 'unknown' },
  operatingSystem: { type: String, default: 'unknown' },
  screen: { type: String, default: '' }
}, { _id: false });

const NetworkSchema = new mongoose.Schema({
  connectionType: { type: String, default: 'unknown' },
  effectiveType: { type: String, enum: ['slow-2g', '2g', '3g', '4g', 'unknown'], default: 'unknown' },
  downlink: { type: Number, default: 0 },
  latency: { type: Number, default: 0 }
}, { _id: false });

const SessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: [true, 'Session ID is required'],
    unique: true,
    index: true,
    trim: true
  },
  device: {
    type: DeviceSchema,
    default: () => ({})
  },
  network: {
    type: NetworkSchema,
    default: () => ({})
  },
  metadata: {
    type: Map,
    of: String,
    default: {}
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Session', SessionSchema);
