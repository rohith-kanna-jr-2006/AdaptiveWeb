/**
 * signalCollector.js
 *
 * Reads supported browser signals and returns a normalized observation shape.
 * Every API is feature-detected before use. Unavailable or invalid values are
 * represented explicitly as `null` — never fabricated defaults.
 *
 * This module is framework-agnostic: it works in any browser context and
 * degrades to an all-`null` shape when no signals are available.
 */

const UNKNOWN = "unknown";

/**
 * Returns a number if it is finite and non-negative, otherwise null.
 * @param {*} value
 * @returns {number|null}
 */
function numberOrNull(value) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? value
    : null;
}

/**
 * Returns a string if it is a non-empty string, otherwise null.
 * @param {*} value
 * @returns {string|null}
 */
function stringOrNull(value) {
  return typeof value === "string" && value.length > 0 ? value : null;
}

/**
 * Returns a boolean if it is a boolean, otherwise null.
 * @param {*} value
 * @returns {boolean|null}
 */
function booleanOrNull(value) {
  return typeof value === "boolean" ? value : null;
}

/**
 * Resolve the Navigator "connection" object across vendor prefixes.
 * @returns {object|null}
 */
function getConnection() {
  if (typeof navigator === "undefined") return null;
  return (
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection ||
    null
  );
}

/**
 * Detect whether PerformanceObserver is supported.
 * @returns {boolean}
 */
function hasPerformanceObserver() {
  return (
    typeof PerformanceObserver !== "undefined" &&
    typeof PerformanceObserver.observe === "function"
  );
}

/**
 * Collect a single snapshot of browser signals.
 *
 * @returns {object} Normalized signal shape
 */
export function collectSignals() {
  const connection = getConnection();

  const viewportWidth =
    typeof window !== "undefined" ? numberOrNull(window.innerWidth) : null;
  const viewportHeight =
    typeof window !== "undefined" ? numberOrNull(window.innerHeight) : null;

  return {
    collectedAt: new Date().toISOString(),
    network: {
      effectiveType: stringOrNull(connection?.effectiveType) ?? UNKNOWN,
      rttMs: numberOrNull(connection?.rtt),
      downlinkMbps: numberOrNull(connection?.downlink),
      saveData: booleanOrNull(connection?.saveData),
    },
    device: {
      memoryGb: numberOrNull(navigator?.deviceMemory),
      hardwareConcurrency: numberOrNull(navigator?.hardwareConcurrency),
      viewportWidth,
      viewportHeight,
    },
    capabilities: {
      networkInformationApi: Boolean(connection),
      performanceObserver: hasPerformanceObserver(),
    },
    performance: {
      lcpMs: null,
      inpMs: null,
      cls: null,
    },
  };
}

/**
 * Collect signals and attach an optional performance snapshot.
 * Performance entries are observed separately because they require an
 * observer lifecycle rather than a one-shot read.
 *
 * @param {object} [perfSnapshot] Optional { lcpMs, inpMs, cls } from PerformanceObserver
 * @returns {object} Normalized signal shape with performance populated
 */
export function collectSignalsWithPerformance(perfSnapshot = null) {
  const signals = collectSignals();
  if (perfSnapshot && typeof perfSnapshot === "object") {
    signals.performance = {
      lcpMs: numberOrNull(perfSnapshot.lcpMs),
      inpMs: numberOrNull(perfSnapshot.inpMs),
      cls: numberOrNull(perfSnapshot.cls),
    };
  }
  return signals;
}

/**
 * Create a PerformanceObserver that records the requested entry types.
 * Returns a no-op handle when PerformanceObserver is unavailable.
 *
 * @param {string[]} entryTypes
 * @param {(entries: PerformanceEntryList) => void} callback
 * @returns {{observe: Function, disconnect: Function, supported: boolean}}
 */
export function createPerformanceObserver(entryTypes, callback) {
  const noop = () => {};

  if (!hasPerformanceObserver()) {
    return { observe: noop, disconnect: noop, supported: false };
  }

  const safeCallback = (entries) => {
    try {
      callback(entries);
    } catch (err) {
      // Observer must never break the page; swallow and continue.
      if (typeof console !== "undefined" && console.warn) {
        console.warn("PerformanceObserver callback failed:", err);
      }
    }
  };

  const observer = new PerformanceObserver(safeCallback);

  return {
    observe: () => {
      try {
        observer.observe({ entryTypes });
      } catch (err) {
        // Some browsers reject unknown entry types silently.
        if (typeof console !== "undefined" && console.warn) {
          console.warn("PerformanceObserver.observe failed:", err);
        }
      }
    },
    disconnect: () => observer.disconnect(),
    supported: true,
  };
}

/**
 * Recollect signals after a meaningful context change (connection, viewport).
 * @param {Function} [onUpdate] Optional callback receiving new signals
 * @returns {{collect: Function, teardown: Function}}
 */
export function startSignalCollection(onUpdate) {
  const collect = () => {
    const signals = collectSignals();
    if (typeof onUpdate === "function") {
      try {
        onUpdate(signals);
      } catch (err) {
        // Callback failures must not break collection.
      }
    }
    return signals;
  };

  const onConnectionChange = () => collect();
  const onResize = () => collect();

  const connection = getConnection();
  if (connection) {
    connection.addEventListener?.("change", onConnectionChange);
  }
  if (typeof window !== "undefined") {
    window.addEventListener?.("resize", onResize);
  }

  return {
    collect,
    teardown: () => {
      if (connection) {
        connection.removeEventListener?.("change", onConnectionChange);
      }
      if (typeof window !== "undefined") {
        window.removeEventListener?.("resize", onResize);
      }
    },
  };
}
