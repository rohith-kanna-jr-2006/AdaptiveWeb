/**
 * adaptiveEngineAdapter.js
 *
 * Adapter boundary between Rohith's Adaptive Policy Engine
 * and Ravi's Frontend UI Components.
 *
 * Responsibilities:
 * 1. Translate engine policy output to Ravi's canonical mode format:
 *    - "data-saver" | "balanced" | "full"
 * 2. Provide updateFromEngine() interface for the adapter layer
 * 3. Expose subscription interface to decouple UI from engine internals
 *
 * IMPORTANT: This adapter does NOT decide the mode. It translates the engine's
 * decision into the format the frontend expects.
 */

import { adaptiveMock } from "./adaptiveMock.js";

export const CANONICAL_MODES = Object.freeze({
  DATA_SAVER: "data-saver",
  BALANCED: "balanced",
  FULL: "full",
});

/**
 * Safely normalize any incoming mode string to canonical mode values.
 * @param {string} rawMode
 * @returns {string}
 */
export function normalizeMode(rawMode) {
  if (!rawMode) return CANONICAL_MODES.BALANCED;
  const str = String(rawMode).toLowerCase().trim().replace(/_/g, "-");

  if (str.includes("saver") || str.includes("data-saver") || str === "low") {
    return CANONICAL_MODES.DATA_SAVER;
  }
  if (str.includes("full") || str.includes("experience") || str === "high") {
    return CANONICAL_MODES.FULL;
  }
  return CANONICAL_MODES.BALANCED;
}

const listeners = new Set();

let adapterState = {
  mode: CANONICAL_MODES.BALANCED,
  rawMode: "BALANCED",
  network: "4g",
  deviceTier: "mid",
  saveData: false,
  reason: "Moderate connection detected",
  isManual: false,
  isLoading: false,
  error: null,
};

function notifyListeners() {
  listeners.forEach((listener) => listener({ ...adapterState }));
}

/**
 * Initialize adapter state from mock snapshot or engine contract.
 */
const initialMock = adaptiveMock.getSnapshot();
adapterState = {
  ...adapterState,
  ...initialMock,
  mode: normalizeMode(initialMock.mode || initialMock.rawMode),
};

export const adaptiveEngineAdapter = {
  /**
   * Subscribe to adaptive policy engine updates.
   * @param {Function} callback
   * @returns {Function} Unsubscribe cleanup function
   */
  subscribe(callback) {
    listeners.add(callback);
    callback({ ...adapterState });
    return () => listeners.delete(callback);
  },

  /**
   * Get current policy snapshot.
   * @returns {object}
   */
  getSnapshot() {
    return { ...adapterState };
  },

  /**
   * Submit mode preference request to engine or mock layer.
   * @param {string} modeInput
   */
  setModePreference(modeInput) {
    const canonical = normalizeMode(modeInput);
    adaptiveMock.setMockMode(modeInput === "AUTOMATIC" ? "AUTOMATIC" : canonical);
    const updatedMock = adaptiveMock.getSnapshot();

    adapterState = {
      ...adapterState,
      ...updatedMock,
      mode: normalizeMode(updatedMock.mode || updatedMock.rawMode),
      isLoading: false,
      error: null,
    };
    notifyListeners();
  },

  /**
   * Update adapter state directly when Rohith's engine emits new output.
   * This is the integration point: the engine calls this with policy objects.
   * @param {object} engineOutput - Policy object from policyEngine.js
   */
  updateFromEngine(engineOutput) {
    if (!engineOutput || typeof engineOutput !== "object") return;

    const mode = normalizeMode(engineOutput.mode || engineOutput.rawMode);
    const reason = engineOutput.reason || "Engine policy update received";

    adapterState = {
      mode,
      rawMode: engineOutput.rawMode || engineOutput.mode || "BALANCED",
      network: engineOutput.network || "unknown",
      deviceTier: engineOutput.deviceTier || "unknown",
      saveData: Boolean(engineOutput.saveData),
      reason,
      isManual: Boolean(engineOutput.isManual),
      isLoading: false,
      error: null,
    };
    notifyListeners();
  },

  /**
   * Reset adapter to default state.
   */
  reset() {
    adapterState = {
      mode: CANONICAL_MODES.BALANCED,
      rawMode: "BALANCED",
      network: "4g",
      deviceTier: "mid",
      saveData: false,
      reason: "Moderate connection detected",
      isManual: false,
      isLoading: false,
      error: null,
    };
    notifyListeners();
  },
};
