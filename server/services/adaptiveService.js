const AdaptivePolicy = require('../models/AdaptivePolicy');
const Session = require('../models/Session');
const configService = require('./configService');

/**
 * Default fallback adaptive policy rules.
 */
const DEFAULT_POLICIES = [
  {
    name: 'poor-network-policy',
    enabled: true,
    priority: 1,
    rules: [
      {
        name: 'Low Quality Aggressive Optimization',
        condition: {
          effectiveTypes: ['slow-2g', '2g'],
          maxLatency: 300,
          minDownlink: 0,
          maxLoadTime: 3000
        },
        action: {
          contentQuality: 'low',
          optimization: 'aggressive',
          prefetchEnabled: false,
          maxImageResolution: '480p',
          compressionLevel: 'high'
        }
      }
    ]
  },
  {
    name: 'moderate-network-policy',
    enabled: true,
    priority: 2,
    rules: [
      {
        name: 'Medium Quality Standard Optimization',
        condition: {
          effectiveTypes: ['3g'],
          maxLatency: 299,
          minDownlink: 1.5,
          maxLoadTime: 2999
        },
        action: {
          contentQuality: 'medium',
          optimization: 'standard',
          prefetchEnabled: false,
          maxImageResolution: '720p',
          compressionLevel: 'standard'
        }
      }
    ]
  },
  {
    name: 'good-network-policy',
    enabled: true,
    priority: 3,
    rules: [
      {
        name: 'High Quality Minimal Optimization',
        condition: {
          effectiveTypes: ['4g'],
          maxLatency: 100,
          minDownlink: 5.0,
          maxLoadTime: 1500
        },
        action: {
          contentQuality: 'high',
          optimization: 'minimal',
          prefetchEnabled: true,
          maxImageResolution: '1080p',
          compressionLevel: 'none'
        }
      }
    ]
  }
];

/**
 * Gets active adaptive policy details from DB or fallback default.
 */
const getActivePolicy = async () => {
  const customPolicies = await AdaptivePolicy.find({ enabled: true }).sort({ priority: 1 });
  if (customPolicies && customPolicies.length > 0) {
    return {
      enabled: true,
      policies: customPolicies
    };
  }

  return {
    enabled: true,
    policies: DEFAULT_POLICIES
  };
};

/**
 * Evaluates network/device context against adaptive rules.
 * @param {Object} evalPayload 
 */
const evaluateContext = async (evalPayload) => {
  const { sessionId, network = {}, device = {}, performance = {} } = evalPayload;
  const config = await configService.getConfig();

  // Upsert session if sessionId is provided
  if (sessionId) {
    await Session.findOneAndUpdate(
      { sessionId },
      {
        $set: {
          device: {
            type: device.type || 'unknown',
            browser: device.browser || 'unknown',
            operatingSystem: device.operatingSystem || 'unknown'
          },
          network: {
            effectiveType: network.effectiveType || 'unknown',
            downlink: network.downlink || 0,
            latency: network.latency || 0
          }
        }
      },
      { upsert: true, new: true }
    ).catch(() => {
      // Ignore session write error in read/eval path if db fails transiently
    });
  }

  const effectiveType = (network.effectiveType || 'unknown').toLowerCase();
  const downlink = Number(network.downlink) || 0;
  const latency = Number(network.latency) || 0;
  const loadTime = Number(performance.loadTime) || 0;

  const thresholds = config.qualityThresholds || {
    poorLatency: 300,
    poorDownlink: 1.5,
    goodLatency: 100,
    goodDownlink: 5.0
  };

  let networkProfile = 'moderate';

  // Rule 1: Poor network evaluation
  if (
    effectiveType === 'slow-2g' ||
    effectiveType === '2g' ||
    (latency > 0 && latency >= thresholds.poorLatency) ||
    (downlink > 0 && downlink <= thresholds.poorDownlink) ||
    (loadTime > 0 && loadTime >= 3000)
  ) {
    networkProfile = 'poor';
  }
  // Rule 2: Good network evaluation
  else if (
    (effectiveType === '4g' || effectiveType === 'unknown') &&
    (latency === 0 || latency <= thresholds.goodLatency) &&
    (downlink === 0 || downlink >= thresholds.goodDownlink) &&
    (loadTime === 0 || loadTime <= 1500)
  ) {
    networkProfile = 'good';
  }
  // Rule 3: Moderate network (fallback)
  else {
    networkProfile = 'moderate';
  }

  let decision;
  if (networkProfile === 'poor') {
    decision = {
      contentQuality: 'low',
      optimization: 'aggressive',
      prefetchEnabled: false,
      maxImageResolution: '480p',
      compressionLevel: 'high',
      resourceStrategy: 'minimal'
    };
  } else if (networkProfile === 'good') {
    decision = {
      contentQuality: 'high',
      optimization: 'minimal',
      prefetchEnabled: true,
      maxImageResolution: '1080p',
      compressionLevel: 'none',
      resourceStrategy: 'full'
    };
  } else {
    decision = {
      contentQuality: 'medium',
      optimization: 'standard',
      prefetchEnabled: false,
      maxImageResolution: '720p',
      compressionLevel: 'standard',
      resourceStrategy: 'balanced'
    };
  }

  return {
    sessionId: sessionId || null,
    evaluatedProfile: networkProfile,
    decision,
    evaluatedAt: new Date().toISOString()
  };
};

module.exports = {
  getActivePolicy,
  evaluateContext,
  DEFAULT_POLICIES
};
