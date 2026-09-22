/**
 * policyEngine.js
 *
 * Maps condition labels + user preferences to a concrete adaptive policy.
 * Returns a stable, versioned policy object with reason codes.
 */

const MODES = Object.freeze({
  DATA_SAVER: "data-saver",
  BALANCED: "balanced",
  FULL: "full",
});

const IMAGE_QUALITY = Object.freeze({
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
});

const PREFETCH = Object.freeze({
  NONE: "none",
  LIMITED: "limited",
  ENABLED: "enabled",
});

const OPTIONAL_FEATURES = Object.freeze({
  DEFERRED: "deferred",
  ON_DEMAND: "on-demand",
  ENABLED: "enabled",
});

// --- Policy mapping table ---
const POLICY_MAP = Object.freeze({
  constrained: {
    mode: MODES.DATA_SAVER,
    imageQuality: IMAGE_QUALITY.LOW,
    prefetch: PREFETCH.NONE,
    optionalFeatures: OPTIONAL_FEATURES.DEFERRED,
  },
  moderate: {
    mode: MODES.BALANCED,
    imageQuality: IMAGE_QUALITY.MEDIUM,
    prefetch: PREFETCH.LIMITED,
    optionalFeatures: OPTIONAL_FEATURES.ON_DEMAND,
  },
  capable: {
    mode: MODES.FULL,
    imageQuality: IMAGE_QUALITY.HIGH,
    prefetch: PREFETCH.ENABLED,
    optionalFeatures: OPTIONAL_FEATURES.ENABLED,
  },
  unknown: {
    mode: MODES.BALANCED,
    imageQuality: IMAGE_QUALITY.MEDIUM,
    prefetch: PREFETCH.LIMITED,
    optionalFeatures: OPTIONAL_FEATURES.ON_DEMAND,
  },
});

const SCHEMA_VERSION = 1;

/**
 * Build a policy from a condition label and optional user override.
 *
 * @param {string} conditionLabel - One of "constrained", "moderate", "capable", "unknown"
 * @param {object} [options]
 * @param {string} [options.userMode] - User-selected mode override
 * @param {boolean} [options.userSaveData] - Explicit user save-data preference
 * @param {object} [options.classificationEvidence] - Evidence from classifier
 * @param {object} [options.classificationConflicts] - Conflicts from classifier
 * @returns {object} Policy object
 */
export function buildPolicy(conditionLabel, options = {}) {
  const {
    userMode = null,
    userSaveData = null,
    classificationEvidence = [],
    classificationConflicts = [],
  } = options;

  const base = POLICY_MAP[conditionLabel] || POLICY_MAP.unknown;
  const evidence = [...classificationEvidence];
  const conflicts = [...classificationConflicts];
  const reasonCodes = [];

  // User mode override takes precedence
  let finalMode = base.mode;
  if (userMode && Object.values(MODES).includes(userMode)) {
    finalMode = userMode;
    reasonCodes.push("user-selected-mode");
  } else {
    // Apply label-based reasons
    if (conditionLabel === "constrained") reasonCodes.push("constrained-network");
    else if (conditionLabel === "moderate") reasonCodes.push("moderate-network");
    else if (conditionLabel === "capable") reasonCodes.push("capable-network");
    else reasonCodes.push("signals-unavailable");
  }

  // User save-data preference can force data-saver mode
  if (userSaveData === true && finalMode !== MODES.DATA_SAVER) {
    finalMode = MODES.DATA_SAVER;
    reasonCodes.push("user-save-data-preference");
  }

  // Conflicts add diagnostic context
  if (conflicts.length > 0) {
    reasonCodes.push("signal-conflict");
  }

  // Determine image quality/prefetch/features based on final mode
  const policySettings = getSettingsForMode(finalMode);

  return {
    mode: finalMode,
    reason: evidence.length > 0 ? evidence : reasonCodes,
    imageQuality: policySettings.imageQuality,
    prefetch: policySettings.prefetch,
    optionalFeatures: policySettings.optionalFeatures,
    schemaVersion: SCHEMA_VERSION,
    revision: 1,
  };
}

/**
 * Get policy settings for a given mode.
 * @param {string} mode
 * @returns {object}
 */
function getSettingsForMode(mode) {
  switch (mode) {
    case MODES.DATA_SAVER:
      return {
        imageQuality: IMAGE_QUALITY.LOW,
        prefetch: PREFETCH.NONE,
        optionalFeatures: OPTIONAL_FEATURES.DEFERRED,
      };
    case MODES.FULL:
      return {
        imageQuality: IMAGE_QUALITY.HIGH,
        prefetch: PREFETCH.ENABLED,
        optionalFeatures: OPTIONAL_FEATURES.ENABLED,
      };
    case MODES.BALANCED:
    default:
      return {
        imageQuality: IMAGE_QUALITY.MEDIUM,
        prefetch: PREFETCH.LIMITED,
        optionalFeatures: OPTIONAL_FEATURES.ON_DEMAND,
      };
  }
}

/**
 * Get the schema version for the current policy contract.
 * @returns {number}
 */
export function getSchemaVersion() {
  return SCHEMA_VERSION;
}

/**
 * Validate a policy object conforms to the expected shape.
 * @param {object} policy
 * @returns {boolean}
 */
export function validatePolicy(policy) {
  if (!policy || typeof policy !== "object") return false;
  if (!Object.values(MODES).includes(policy.mode)) return false;
  if (!Object.values(IMAGE_QUALITY).includes(policy.imageQuality)) return false;
  if (!Object.values(PREFETCH).includes(policy.prefetch)) return false;
  if (!Object.values(OPTIONAL_FEATURES).includes(policy.optionalFeatures)) return false;
  if (typeof policy.schemaVersion !== "number") return false;
  if (!Array.isArray(policy.reason)) return false;
  return true;
}

export { MODES, IMAGE_QUALITY, PREFETCH, OPTIONAL_FEATURES, POLICY_MAP };
