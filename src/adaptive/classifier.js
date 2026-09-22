/**
 * classifier.js
 *
 * Converts normalized signal observations into condition labels
 * (constrained, moderate, capable, unknown) with evidence trail.
 *
 * Classification rules:
 *   - saveData === true  → constrained (unless user override)
 *   - effectiveType slow-2g/2g → constrained
 *   - effectiveType 3g → moderate/constrained; refine with RTT/downlink
 *   - RTT > 300ms or downlink < 1.5 Mbps → constrained
 *   - Repeated poor performance → supports constrained
 *   - Strong signals unavailable → unknown (fallback to Balanced)
 *   - Conflicting signals → temporarily prefer less resource-intensive
 *
 * All thresholds are explicit so they can be tuned and tested.
 */

// --- Thresholds (tune with team) ---
const THRESHOLDS = Object.freeze({
  RTT_CONSTRAINED_MS: 300,
  RTT_MODERATE_MS: 150,
  DOWNLINK_CONSTRAINED_MBPS: 1.5,
  DOWNLINK_MODERATE_MBPS: 4,
  DOWNLOAD_CONSTRAINED_MBPS: 1.5,
  EFFECTIVE_TYPE_CONSTRAINED: new Set(["slow-2g", "2g"]),
  EFFECTIVE_TYPE_MODERATE: new Set(["3g"]),
  MEMORY_CONSTRAINED_GB: 2,
  PERF_SAMPLES_REQUIRED: 3,
});

const LABELS = Object.freeze({
  CONSTRAINED: "constrained",
  MODERATE: "moderate",
  CAPABLE: "capable",
  UNKNOWN: "unknown",
});

/**
 * Evaluate a single signal snapshot and return a condition label with evidence.
 *
 * @param {object} signals Normalized signals
 * @returns {{label: string, evidence: string[], conflicts: string[]}}
 */
export function classify(signals) {
  if (!signals || !signals.network) {
    return { label: LABELS.UNKNOWN, evidence: ["no signals provided"], conflicts: [] };
  }

  const evidence = [];
  const conflicts = [];

  const network = signals.network;
  const device = signals.device || {};
  const performance = signals.performance || {};

  // --- Save-Data preference (strongest single signal) ---
  if (network.saveData === true) {
    evidence.push("user save-data preference is enabled");
  }

  // --- Effective connection type ---
  const effectiveType = network.effectiveType;
  if (THRESHOLDS.EFFECTIVE_TYPE_CONSTRAINED.has(effectiveType)) {
    evidence.push(`effective type is ${effectiveType} (constrained)`);
  } else if (THRESHOLDS.EFFECTIVE_TYPE_MODERATE.has(effectiveType)) {
    evidence.push(`effective type is ${effectiveType} (moderate)`);
  } else if (effectiveType === "4g") {
    evidence.push("effective type is 4g (positive)");
  } else {
    evidence.push("effective type unknown");
  }

  // --- RTT ---
  const rtt = network.rttMs;
  if (rtt !== null) {
    if (rtt > THRESHOLDS.RTT_CONSTRAINED_MS) {
      evidence.push(`RTT ${rtt}ms exceeds ${THRESHOLDS.RTT_CONSTRAINED_MS}ms threshold`);
    } else if (rtt > THRESHOLDS.RTT_MODERATE_MS) {
      evidence.push(`RTT ${rtt}ms is elevated`);
    } else {
      evidence.push(`RTT ${rtt}ms is low`);
    }
  }

  // --- Downlink ---
  const downlink = network.downlinkMbps;
  if (downlink !== null) {
    if (downlink < THRESHOLDS.DOWNLINK_CONSTRAINED_MBPS) {
      evidence.push(`downlink ${downlink}Mbps below ${THRESHOLDS.DOWNLINK_CONSTRAINED_MBPS}Mbps`);
    } else if (downlink < THRESHOLDS.DOWNLINK_MODERATE_MBPS) {
      evidence.push(`downlink ${downlink}Mbps is moderate`);
    } else {
      evidence.push(`downlink ${downlink}Mbps is strong`);
    }
  }

  // --- Device memory ---
  if (device.memoryGb !== null && device.memoryGb < THRESHOLDS.MEMORY_CONSTRAINED_GB) {
    evidence.push(`device memory ${device.memoryGb}GB is low`);
  }

  // --- Performance observations ---
  if (performance.lcpMs !== null && performance.lcpMs > 4000) {
    evidence.push(`LCP ${performance.lcpMs}ms indicates poor performance`);
  }

  // --- Detect conflicts ---
  const strongPositive =
    effectiveType === "4g" &&
    downlink !== null &&
    downlink >= THRESHOLDS.DOWNLINK_MODERATE_MBPS &&
    rtt !== null &&
    rtt <= THRESHOLDS.RTT_MODERATE_MS;

  const strongNegative =
    THRESHOLDS.EFFECTIVE_TYPE_CONSTRAINED.has(effectiveType) ||
    (rtt !== null && rtt > THRESHOLDS.RTT_CONSTRAINED_MS) ||
    (downlink !== null && downlink < THRESHOLDS.DOWNLOAD_CONSTRAINED_MBPS) ||
    network.saveData === true ||
    (device.memoryGb !== null && device.memoryGb < THRESHOLDS.MEMORY_CONSTRAINED_GB);

  if (strongPositive && (network.saveData === true || THRESHOLDS.EFFECTIVE_TYPE_CONSTRAINED.has(effectiveType))) {
    conflicts.push("positive network signals conflict with data-saver or very slow type");
  }
  if (strongPositive && strongNegative) {
    conflicts.push("conflicting positive and negative network evidence");
  }

  // --- Resolve label ---
  const label = resolveLabel(evidence, conflicts, network.saveData);

  return { label, evidence, conflicts };
}

/**
 * Resolve a condition label from evidence and conflicts.
 * @param {string[]} evidence
 * @param {string[]} conflicts
 * @param {boolean|null} saveData
 * @returns {string}
 */
function resolveLabel(evidence, conflicts, saveData) {
  // Explicit save-data preference forces constrained unless overridden externally.
  if (saveData === true) {
    return LABELS.CONSTRAINED;
  }

  // Strong negative evidence → constrained
  const hasStrongNegative =
    evidence.some((e) => e.includes("constrained")) ||
    evidence.some((e) => e.includes("slow-2g") || e.includes("2g")) ||
    evidence.some((e) => e.includes("exceeds") && e.includes("RTT")) ||
    evidence.some((e) => e.includes("below") && e.includes("downlink")) ||
    evidence.some((e) => e.includes("poor performance"));

  if (hasStrongNegative) {
    return LABELS.CONSTRAINED;
  }

  // Conflicting signals → temporarily moderate (less resource-intensive default)
  if (conflicts.length > 0) {
    return LABELS.MODERATE;
  }

  // Strong positive evidence → capable
  const hasStrongPositive =
    evidence.some((e) => e.includes("4g") && e.includes("positive")) ||
    evidence.some((e) => e.includes("strong"));

  if (hasStrongPositive) {
    return LABELS.CAPABLE;
  }

  // Moderate evidence → moderate
  const hasModerate =
    evidence.some((e) => e.includes("moderate")) ||
    evidence.some((e) => e.includes("elevated")) ||
    evidence.some((e) => e.includes("low") && e.includes("memory"));

  if (hasModerate) {
    return LABELS.MODERATE;
  }

  // Weak / mixed / unknown → unknown (fallback to Balanced)
  if (evidence.some((e) => e.includes("unknown"))) {
    return LABELS.UNKNOWN;
  }

  return LABELS.MODERATE;
}

/**
 * Get classifier configuration (useful for tests and debugging).
 * @returns {object}
 */
export function getClassifierThresholds() {
  return { ...THRESHOLDS };
}

export { LABELS, THRESHOLDS };
