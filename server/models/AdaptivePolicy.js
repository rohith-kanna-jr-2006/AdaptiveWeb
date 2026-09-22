const mongoose = require('mongoose');

const RuleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  condition: {
    effectiveTypes: [{ type: String, enum: ['slow-2g', '2g', '3g', '4g'] }],
    maxLatency: { type: Number },
    minDownlink: { type: Number },
    maxLoadTime: { type: Number }
  },
  action: {
    contentQuality: { type: String, enum: ['low', 'medium', 'high'], required: true },
    optimization: { type: String, enum: ['aggressive', 'standard', 'minimal'], required: true },
    prefetchEnabled: { type: Boolean, default: false },
    maxImageResolution: { type: String, default: '720p' },
    compressionLevel: { type: String, enum: ['none', 'standard', 'high'], default: 'standard' }
  }
}, { _id: false });

const AdaptivePolicySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Policy name is required'],
    trim: true
  },
  enabled: {
    type: Boolean,
    default: true
  },
  priority: {
    type: Number,
    default: 1
  },
  rules: [RuleSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('AdaptivePolicy', AdaptivePolicySchema);
