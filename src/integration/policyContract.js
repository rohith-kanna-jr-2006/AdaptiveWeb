/**
 * policyContract.js
 *
 * Shared types, field names, enum values, and compatibility expectations.
 * This contract must be agreed with the team before shipping.
 *
 * Version: 1
 * Last updated: Phase 0 design review
 */

const CONTRACT_VERSION = 1;

/**
 * Policy mode enum. Used in all policy documents.
 */
export const MODES = Object.freeze({
  DATA_SAVER: "data-saver",
  BALANCED: "balanced",
  FULL: "full",
});

/**
 * Image quality levels for responsive images.
 */
export const IMAGE_QUALITY = Object.freeze({
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
});

/**
 * Prefetch control levels.
 */
export const PREFETCH = Object.freeze({
  NONE: "none",
  LIMITED: "limited",
  ENABLED: "enabled",
});

/**
 * Optional feature loading strategy.
 */
export const OPTIONAL_FEATURES = Object.freeze({
  DEFERRED: "deferred",
  ON_DEMAND: "on-demand",
  ENABLED: "enabled",
});

/**
 * Reason codes attached to every policy decision.
 * These are machine-readable explanations for the mode selection.
 */
export const REASON_CODES = Object.freeze({
  CONSTRAINED_NETWORK: "constrained-network",
  MODERATE_NETWORK: "moderate-network",
  CAPABLE_NETWORK: "capable-network",
  SIGNALS_UNAVAILABLE: "signals-unavailable",
  SIGNAL_CONFLICT: "signal-conflict",
  USER_SELECTED_MODE: "user-selected-mode",
  USER_SAVE_DATA_PREFERENCE: "user-save-data-preference",
  DEFAULT_FALLBACK: "default-fallback",
});

/**
 * Schema definition for a policy document.
 * Used for validation and version compatibility checks.
 */
export const POLICY_SCHEMA = Object.freeze({
  type: "object",
  required: ["mode", "imageQuality", "prefetch", "optionalFeatures", "reason", "schemaVersion"],
  properties: {
    mode: { type: "string", enum: Object.values(MODES) },
    imageQuality: { type: "string", enum: Object.values(IMAGE_QUALITY) },
    prefetch: { type: "string", enum: Object.values(PREFETCH) },
    optionalFeatures: { type: "string", enum: Object.values(OPTIONAL_FEATURES) },
    reason: {
      type: "array",
      items: { type: "string" },
    },
    schemaVersion: { type: "number" },
    revision: { type: "number" },
  },
});

/**
 * Telemetry event schema for backend reporting.
 */
export const TELEMETRY_SCHEMA = Object.freeze({
  type: "object",
  required: ["event", "schemaVersion"],
  properties: {
    event: { type: "string" },
    schemaVersion: { type: "number" },
    mode: { type: "string" },
    reasonCodes: {
      type: "array",
      items: { type: "string" },
    },
    metrics: {
      type: "object",
      properties: {
        lcpMs: { type: ["number", "null"] },
        inpMs: { type: ["number", "null"] },
        cls: { type: ["number", "null"] },
      },
    },
  },
});

/**
 * Minimum required fields for a telemetry event.
 */
export const TELEMETRY_REQUIRED = ["event", "schemaVersion"];

/**
 * Retention policy for telemetry data (to be finalized with team).
 */
export const TELEMETRY_RETENTION = {
  rawEventsDays: 7,
  aggregatedDays: 30,
  anonymizedForever: true,
};

export { CONTRACT_VERSION };
