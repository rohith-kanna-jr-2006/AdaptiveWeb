/**
 * explainPolicy.js
 *
 * Produces concise, human-readable reasons for a policy decision.
 * Used for UI mode indicator and developer debugging.
 */

const REASON_MESSAGES = Object.freeze({
  "constrained-network": "Network conditions are poor (slow connection or high latency)",
  "moderate-network": "Network conditions are moderate — mixed signals detected",
  "capable-network": "Network conditions are good — full resources available",
  "signals-unavailable": "Network signals not available — using default",
  "signal-conflict": "Network signals were conflicting — using conservative setting",
  "user-selected-mode": "You selected a different mode",
  "user-save-data-preference": "Data Saver mode enabled by your preference",
  "default-fallback": "Using default Balanced mode",
});

/**
 * Generate a human-readable explanation for the current policy.
 * @param {object} policy
 * @param {object} [options]
 * @param {boolean} [options.includeCodes] Include raw reason codes
 * @returns {string}
 */
export function explainPolicy(policy, options = {}) {
  if (!policy || typeof policy !== "object") {
    return "No policy available";
  }

  const { includeCodes = false } = options;
  const lines = [];

  // Header
  const modeLabel = modeToLabel(policy.mode);
  lines.push(`🌐 Adaptive mode: ${modeLabel}`);

  // Reason codes
  if (includeCodes && policy.reason) {
    lines.push(`  Reason codes: ${policy.reason.join(", ")}`);
  }

  // Concise explanation
  const explanation = getExplanationForReasonCodes(policy.reason);
  if (explanation) {
    lines.push(explanation);
  }

  // Image quality
  const imageLabel = imageToLabel(policy.imageQuality);
  lines.push(`  Images: ${imageLabel}`);

  // Prefetch
  const prefetchLabel = prefetchToLabel(policy.prefetch);
  lines.push(`  Prefetching: ${prefetchLabel}`);

  return lines.join("\n");
}

/**
 * Convert a mode string to a human-readable label.
 * @param {string} mode
 * @returns {string}
 */
function modeToLabel(mode) {
  switch (mode) {
    case "data-saver": return "Data Saver";
    case "balanced": return "Balanced";
    case "full": return "Full Experience";
    default: return "Unknown";
  }
}

/**
 * Convert an image quality string to a human-readable label.
 * @param {string} quality
 * @returns {string}
 */
function imageToLabel(quality) {
  switch (quality) {
    case "low": return "Low (compressed)";
    case "medium": return "Medium (standard)";
    case "high": return "High (uncompressed)";
    default: return "Unknown";
  }
}

/**
 * Convert a prefetch string to a human-readable label.
 * @param {string} prefetch
 * @returns {string}
 */
function prefetchToLabel(prefetch) {
  switch (prefetch) {
    case "none": return "Disabled";
    case "limited": return "Limited";
    case "enabled": return "Enabled";
    default: return "Unknown";
  }
}

/**
 * Generate an explanation string from reason codes.
 * @param {string[]} reasonCodes
 * @returns {string|null}
 */
function getExplanationForReasonCodes(reasonCodes) {
  if (!reasonCodes || !Array.isArray(reasonCodes)) return null;

  // Simple lookup
  for (const code of reasonCodes) {
    if (REASON_MESSAGES[code]) {
      return `  ${REASON_MESSAGES[code]}`;
    }
  }

  // Try to compose from multiple codes
  if (reasonCodes.includes("constrained-network") && reasonCodes.includes("signals-unavailable")) {
    return "  Some signals were unavailable, but network conditions appear constrained";
  }

  return null;
}

/**
 * Export reason messages for customization/testing.
 */
export { REASON_MESSAGES };
