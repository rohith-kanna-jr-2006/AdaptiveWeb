/**
 * normalizeSignals.js
 *
 * Validates types, ranges, and units of collected signals.
 * Normalizes network estimates to consistent units.
 * Represents missing data explicitly as `null`.
 */

const VALID_EFFECTIVE_TYPES = new Set([
  "slow-2g",
  "2g",
  "3g",
  "4g",
]);

const VALIDATION = {
  rttMs: { min: 0, max: 10000 },
  downlinkMbps: { min: 0, max: 1000 },
  memoryGb: { min: 0.25, max: 64 },
  viewportPx: { min: 1, max: 10000 },
};

/**
 * Clamp a numeric value to a valid range, or return null if invalid.
 * @param {number|null} value
 * @param {object} range
 * @returns {number|null}
 */
function clampOrNull(value, range) {
  if (value === null || value === undefined) return null;
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  if (value < range.min || value > range.max) return null;
  return value;
}

/**
 * Validate a device memory value.
 * @param {number|null} value
 * @returns {number|null}
 */
function validateMemory(value) {
  return clampOrNull(value, VALIDATION.memoryGb);
}

/**
 * Validate viewport dimensions.
 * @param {number|null} value
 * @returns {number|null}
 */
function validateViewport(value) {
  return clampOrNull(value, VALIDATION.viewportPx);
}

/**
 * Validate an effective type string.
 * @param {string} value
 * @returns {string} Valid type or "unknown"
 */
function validateEffectiveType(value) {
  if (typeof value !== "string") return "unknown";
  return VALID_EFFECTIVE_TYPES.has(value) ? value : "unknown";
}

/**
 * Validate a boolean signal.
 * @param {*} value
 * @returns {boolean|null}
 */
function validateBoolean(value) {
  return typeof value === "boolean" ? value : null;
}

/**
 * Validate a performance metric value.
 * @param {*} value
 * @returns {number|null}
 */
function validatePerformanceMetric(value) {
  if (value === null || value === undefined) return null;
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return null;
  return value;
}

/**
 * Validate the full signal shape.
 *
 * @param {object} signals Raw signals from collectSignals()
 * @returns {object} Validated and normalized signals
 */
export function normalizeSignals(signals) {
  if (!signals || typeof signals !== "object") {
    return createEmptySignals();
  }

  const network = normalizeNetwork(signals.network);
  const device = normalizeDevice(signals.device);
  const capabilities = normalizeCapabilities(signals.capabilities);
  const performance = normalizePerformance(signals.performance);

  return {
    collectedAt: validateTimestamp(signals.collectedAt),
    network,
    device,
    capabilities,
    performance,
  };
}

/**
 * Normalize the network section of a signal shape.
 * @param {object} network
 * @returns {object}
 */
function normalizeNetwork(network) {
  if (!network || typeof network !== "object") {
    return { effectiveType: "unknown", rttMs: null, downlinkMbps: null, saveData: null };
  }

  return {
    effectiveType: validateEffectiveType(network.effectiveType),
    rttMs: clampOrNull(network.rttMs, VALIDATION.rttMs),
    downlinkMbps: clampOrNull(network.downlinkMbps, VALIDATION.downlinkMbps),
    saveData: validateBoolean(network.saveData),
  };
}

/**
 * Normalize the device section of a signal shape.
 * @param {object} device
 * @returns {object}
 */
function normalizeDevice(device) {
  if (!device || typeof device !== "object") {
    return { memoryGb: null, hardwareConcurrency: null, viewportWidth: null, viewportHeight: null };
  }

  return {
    memoryGb: validateMemory(device.memoryGb),
    hardwareConcurrency: clampOrNull(device.hardwareConcurrency, { min: 1, max: 256 }),
    viewportWidth: validateViewport(device.viewportWidth),
    viewportHeight: validateViewport(device.viewportHeight),
  };
}

/**
 * Normalize the capabilities section.
 * @param {object} capabilities
 * @returns {object}
 */
function normalizeCapabilities(capabilities) {
  if (!capabilities || typeof capabilities !== "object") {
    return { networkInformationApi: false, performanceObserver: false };
  }

  return {
    networkInformationApi: Boolean(capabilities.networkInformationApi),
    performanceObserver: Boolean(capabilities.performanceObserver),
  };
}

/**
 * Normalize the performance section.
 * @param {object} performance
 * @returns {object}
 */
function normalizePerformance(performance) {
  if (!performance || typeof performance !== "object") {
    return { lcpMs: null, inpMs: null, cls: null };
  }

  return {
    lcpMs: validatePerformanceMetric(performance.lcpMs),
    inpMs: validatePerformanceMetric(performance.inpMs),
    cls: validatePerformanceMetric(performance.cls),
  };
}

/**
 * Validate an ISO-8601 timestamp string.
 * @param {string} value
 * @returns {string} ISO timestamp or empty string
 */
function validateTimestamp(value) {
  if (typeof value !== "string" || !value) return new Date().toISOString();
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? new Date().toISOString() : value;
}

/**
 * Create an empty signal shape for when no data is available.
 * @returns {object}
 */
export function createEmptySignals() {
  return {
    collectedAt: new Date().toISOString(),
    network: { effectiveType: "unknown", rttMs: null, downlinkMbps: null, saveData: null },
    device: { memoryGb: null, hardwareConcurrency: null, viewportWidth: null, viewportHeight: null },
    capabilities: { networkInformationApi: false, performanceObserver: false },
    performance: { lcpMs: null, inpMs: null, cls: null },
  };
}

/**
 * Merge two normalized signal snapshots, preferring the newer one.
 * @param {object} existing
 * @param {object} incoming
 * @returns {object}
 */
export function mergeSignals(existing, incoming) {
  if (!existing) return incoming;
  if (!incoming) return existing;

  return {
    collectedAt: incoming.collectedAt || existing.collectedAt,
    network: {
      effectiveType: incoming.network.effectiveType !== "unknown"
        ? incoming.network.effectiveType
        : existing.network.effectiveType,
      rttMs: incoming.network.rttMs ?? existing.network.rttMs,
      downlinkMbps: incoming.network.downlinkMbps ?? existing.network.downlinkMbps,
      saveData: incoming.network.saveData ?? existing.network.saveData,
    },
    device: {
      memoryGb: incoming.device.memoryGb ?? existing.device.memoryGb,
      hardwareConcurrency: incoming.device.hardwareConcurrency ?? existing.device.hardwareConcurrency,
      viewportWidth: incoming.device.viewportWidth ?? existing.device.viewportWidth,
      viewportHeight: incoming.device.viewportHeight ?? existing.device.viewportHeight,
    },
    capabilities: {
      networkInformationApi: incoming.capabilities.networkInformationApi || existing.capabilities.networkInformationApi,
      performanceObserver: incoming.capabilities.performanceObserver || existing.capabilities.performanceObserver,
    },
    performance: {
      lcpMs: incoming.performance.lcpMs ?? existing.performance.lcpMs,
      inpMs: incoming.performance.inpMs ?? existing.performance.inpMs,
      cls: incoming.performance.cls ?? existing.performance.cls,
    },
  };
}
