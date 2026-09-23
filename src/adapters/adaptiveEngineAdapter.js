/**
 * ADAPTIVE ENGINE ADAPTER LAYER (TEMPORARY MOCK / INTERFACE)
 * -------------------------------------------------------------
 * Note: Rohith owns the adaptive engine/policy logic.
 * Frontend components must NOT perform adaptive classification logic.
 *
 * This adapter layer standardizes the policy state consumed by the UI.
 * When Rohith's engine module/API is integrated, replace this mock provider
 * with the real engine subscription or API call without altering UI component code.
 */

import { CANONICAL_MODES } from "@/adaptive/integration/adaptiveEngineAdapter";

export const ADAPTIVE_MODES = {
  DATA_SAVER: "DATA SAVER",
  BALANCED: "BALANCED",
  FULL_EXPERIENCE: "FULL EXPERIENCE",
};

export const MODE_DESCRIPTIONS = {
  [ADAPTIVE_MODES.DATA_SAVER]: {
    title: "DATA SAVER",
    subtitle: "Lower data usage",
    features: [
      "Smaller / low-resolution images",
      "Reduced non-essential scripts & features",
      "Limited or disabled prefetching",
      "Reduced visual animations and effects",
    ],
    themeColor: "amber",
  },
  [ADAPTIVE_MODES.BALANCED]: {
    title: "BALANCED",
    subtitle: "Balanced quality & performance",
    features: [
      "Medium image quality delivery",
      "Controlled resource loading",
      "Limited background prefetching",
      "Smooth, lightweight visual effects",
    ],
    themeColor: "blue",
  },
  [ADAPTIVE_MODES.FULL_EXPERIENCE]: {
    title: "FULL EXPERIENCE",
    subtitle: "Highest quality content",
    features: [
      "Maximum high-resolution asset delivery",
      "All visual effects & interactive features enabled",
      "Full background prefetching active",
      "Unrestricted resource loading",
    ],
    themeColor: "emerald",
  },
};

let currentPolicy = {
  mode: ADAPTIVE_MODES.BALANCED,
  reason: "Moderate connection detected (4G / 8.5 Mbps)",
  imageQuality: "Medium quality",
  prefetch: "Limited",
  animations: "Reduced",
  dataUsage: "Optimized",
  manualOverride: false,
  requestedMode: null,
};

const listeners = new Set();

export const adaptiveEngineAdapter = {
  /**
   * Subscribe to adaptive policy updates.
   * @param {Function} callback - Callback triggered when policy changes.
   * @returns {Function} Unsubscribe function.
   */
  subscribe(callback) {
    listeners.add(callback);
    callback(currentPolicy);
    return () => listeners.delete(callback);
  },

  /**
   * Get the current policy snapshot.
   */
  getSnapshot() {
    return currentPolicy;
  },

  /**
   * Submit a user mode preference request.
   * If engine manual override contract exists, pass it to engine.
   * Otherwise record as requested preference.
   */
  setModePreference(mode) {
    if (mode === "AUTOMATIC") {
      currentPolicy = {
        ...currentPolicy,
        manualOverride: false,
        requestedMode: null,
        mode: ADAPTIVE_MODES.BALANCED,
        reason: "Automatic detection active (Engine policy restored)",
      };
    } else if (Object.values(ADAPTIVE_MODES).includes(mode)) {
      currentPolicy = {
        ...currentPolicy,
        manualOverride: true,
        requestedMode: mode,
        mode: mode,
        reason: `Manual preference selected: ${mode} (Engine override request)`,
      };
    }
    listeners.forEach((listener) => listener(currentPolicy));
  },
};
