/**
 * TEMPORARY ADAPTIVE ENGINE MOCK
 * -------------------------------------------------------------
 * Isolated development mock for Rohith's Adaptive Policy Engine.
 * Provides canonical mode states ('data-saver', 'balanced', 'full')
 * along with mock environmental metadata.
 * 
 * Production components consume the adapter/hook, NOT this mock directly.
 */

export const MOCK_ENGINE_STATES = {
  "data-saver": {
    mode: "data-saver",
    rawMode: "DATA SAVER",
    network: "3g",
    deviceTier: "low",
    saveData: true,
    reason: "Slow connection / Save-Data enabled (3G detected)",
    isManual: false,
  },
  balanced: {
    mode: "balanced",
    rawMode: "BALANCED",
    network: "4g",
    deviceTier: "mid",
    saveData: false,
    reason: "Moderate connection detected (4G / 8.5 Mbps)",
    isManual: false,
  },
  full: {
    mode: "full",
    rawMode: "FULL EXPERIENCE",
    network: "5g",
    deviceTier: "high",
    saveData: false,
    reason: "Fast unmetered connection detected (5G / WiFi)",
    isManual: false,
  },
};

let currentMockState = { ...MOCK_ENGINE_STATES.balanced };

export const adaptiveMock = {
  getSnapshot() {
    return currentMockState;
  },
  setMockMode(modeKey) {
    if (MOCK_ENGINE_STATES[modeKey]) {
      currentMockState = {
        ...MOCK_ENGINE_STATES[modeKey],
        isManual: true,
        reason: `Manual development override selected: ${modeKey.toUpperCase()}`,
      };
    } else if (modeKey === "AUTOMATIC" || modeKey === "auto") {
      currentMockState = {
        ...MOCK_ENGINE_STATES.balanced,
        isManual: false,
        reason: "Automatic detection active (Engine policy active)",
      };
    }
  },
};
