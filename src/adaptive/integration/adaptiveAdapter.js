/**
 * ADAPTIVE POLICY ENGINE ADAPTER BOUNDARY
 * -------------------------------------------------------------
 * Acts as the strict boundary between Rohith's Adaptive Policy Engine
 * and Ravi's Frontend UI Components.
 * 
 * Responsibilities:
 * 1. Normalize raw mode strings from engine contract to canonical modes:
 *    - "data-saver"
 *    - "balanced"
 *    - "full"
 * 2. Expose subscription interface to decouple UI components from engine internals.
 */

import { adaptiveMock } from "./adaptiveMock";

export const CANONICAL_MODES = {
  DATA_SAVER: "data-saver",
  BALANCED: "balanced",
  FULL: "full",
};

/**
 * Safely normalizes any incoming mode string to one of the canonical mode values:
 * "data-saver" | "balanced" | "full"
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

// Initialize adapter state from mock snapshot or engine contract
const initialMock = adaptiveMock.getSnapshot();
adapterState = {
  ...adapterState,
  ...initialMock,
  mode: normalizeMode(initialMock.mode || initialMock.rawMode),
};

export const adaptiveAdapter = {
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
   */
  getSnapshot() {
    return { ...adapterState };
  },

  /**
   * Submit mode preference request to engine or mock layer.
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
   */
  updateFromEngine(engineOutput) {
    if (!engineOutput) return;
    adapterState = {
      mode: normalizeMode(engineOutput.mode || engineOutput.rawMode),
      rawMode: engineOutput.rawMode || engineOutput.mode || "BALANCED",
      network: engineOutput.network || "unknown",
      deviceTier: engineOutput.deviceTier || "unknown",
      saveData: Boolean(engineOutput.saveData),
      reason: engineOutput.reason || "Engine policy update received",
      isManual: Boolean(engineOutput.isManual),
      isLoading: false,
      error: null,
    };
    notifyListeners();
  },
};
