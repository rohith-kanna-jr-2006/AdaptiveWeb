const AppConfig = require('../models/AppConfig');

const DEFAULT_CONFIG = {
  adaptiveEnabled: true,
  measurementInterval: 5000,
  qualityThresholds: {
    poorLatency: 300,
    poorDownlink: 1.5,
    goodLatency: 100,
    goodDownlink: 5.0
  }
};

/**
 * Retrieves global application configuration.
 * Creates default record if none exists.
 */
const getConfig = async () => {
  let config = await AppConfig.findOne();
  if (!config) {
    config = await AppConfig.create(DEFAULT_CONFIG);
  }
  return {
    adaptiveEnabled: config.adaptiveEnabled,
    measurementInterval: config.measurementInterval,
    qualityThresholds: config.qualityThresholds
  };
};

/**
 * Updates application configuration safely.
 * @param {Object} updateData 
 */
const updateConfig = async (updateData) => {
  let config = await AppConfig.findOne();
  if (!config) {
    config = new AppConfig(DEFAULT_CONFIG);
  }

  if (updateData.adaptiveEnabled !== undefined) {
    config.adaptiveEnabled = updateData.adaptiveEnabled;
  }
  if (updateData.measurementInterval !== undefined) {
    config.measurementInterval = updateData.measurementInterval;
  }
  if (updateData.qualityThresholds !== undefined) {
    config.qualityThresholds = {
      ...config.qualityThresholds,
      ...updateData.qualityThresholds
    };
  }

  await config.save();

  return {
    adaptiveEnabled: config.adaptiveEnabled,
    measurementInterval: config.measurementInterval,
    qualityThresholds: config.qualityThresholds
  };
};

module.exports = {
  getConfig,
  updateConfig,
  DEFAULT_CONFIG
};
