/**
 * CANONICAL ADAPTIVE POLICY ENGINE ADAPTER (FORGEX AI 2026)
 * -------------------------------------------------------------
 * Acts as the strict boundary between the Adaptive Policy Engine and the React UI.
 * 
 * Rules:
 * 1. UI components MUST NOT contain classification logic.
 * 2. Supported user preferences: 'auto' | 'data-saver' | 'balanced' | 'full'
 * 3. Safe Fallback Rule: Unknown or unsupported signals fallback to 'balanced'.
 * 4. AUTO mode evaluates context signals via event listeners (no tight polling).
 */

export const CANONICAL_MODES = {
  AUTO: "auto",
  DATA_SAVER: "data-saver",
  BALANCED: "balanced",
  FULL: "full",
};

/**
 * Safely normalizes incoming mode string to one of the canonical values.
 */
export function normalizeMode(modeInput) {
  if (!modeInput) return CANONICAL_MODES.BALANCED;
  const str = String(modeInput).toLowerCase().trim().replace(/_/g, "-");

  if (str === "auto" || str === "automatic") return CANONICAL_MODES.AUTO;
  if (str.includes("saver") || str === "low") return CANONICAL_MODES.DATA_SAVER;
  if (str.includes("full") || str === "high") return CANONICAL_MODES.FULL;
  return CANONICAL_MODES.BALANCED;
}

let userPreference = CANONICAL_MODES.AUTO;
let activeMode = CANONICAL_MODES.BALANCED;
let listeners = new Set();

let networkInfo = {
  effectiveType: "4g",
  downlink: 8.5,
  saveData: false,
  rtt: 50,
};

function determineAutoActiveMode() {
  if (typeof window === "undefined") return CANONICAL_MODES.BALANCED;

  const conn =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection;

  if (!conn) {
    // Safe Fallback Rule: Unknown/unsupported -> BALANCED
    return CANONICAL_MODES.BALANCED;
  }

  const effType = conn.effectiveType ? String(conn.effectiveType).toLowerCase() : "4g";
  const saveData = Boolean(conn.saveData);
  const downlink = conn.downlink !== undefined ? conn.downlink : 8.5;

  networkInfo = {
    effectiveType: effType,
    downlink: downlink,
    saveData: saveData,
    rtt: conn.rtt || 50,
  };

  if (saveData || effType === "3g" || effType === "2g" || effType === "slow-2g" || downlink < 1.5) {
    return CANONICAL_MODES.DATA_SAVER;
  }
  if (downlink >= 10 || effType === "5g") {
    return CANONICAL_MODES.FULL;
  }
  return CANONICAL_MODES.BALANCED;
}

function updateState() {
  if (userPreference === CANONICAL_MODES.AUTO) {
    activeMode = determineAutoActiveMode();
  } else {
    activeMode = userPreference;
  }

  const payload = {
    mode: userPreference,
    activeMode: activeMode,
    isAuto: userPreference === CANONICAL_MODES.AUTO,
    network: networkInfo.effectiveType,
    saveData: networkInfo.saveData,
    downlink: networkInfo.downlink,
    reason:
      userPreference === CANONICAL_MODES.AUTO
        ? `Auto detection active (${activeMode.toUpperCase()} mode selected based on network signals)`
        : `Manual mode selected: ${activeMode.toUpperCase()}`,
    isLoading: false,
    error: null,
  };

  listeners.forEach((cb) => cb(payload));
}

// Event-driven network signal change handler (no tight polling)
if (typeof window !== "undefined") {
  const conn =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection;

  if (conn && conn.addEventListener) {
    conn.addEventListener("change", () => {
      if (userPreference === CANONICAL_MODES.AUTO) {
        updateState();
      }
    });
  }
}

export const adaptiveAdapter = {
  subscribe(callback) {
    listeners.add(callback);
    updateState();
    return () => listeners.delete(callback);
  },

  getSnapshot() {
    return {
      mode: userPreference,
      activeMode: activeMode,
      isAuto: userPreference === CANONICAL_MODES.AUTO,
      network: networkInfo.effectiveType,
      saveData: networkInfo.saveData,
      downlink: networkInfo.downlink,
      reason:
        userPreference === CANONICAL_MODES.AUTO
          ? `Auto detection active (${activeMode.toUpperCase()} mode selected based on network signals)`
          : `Manual mode selected: ${activeMode.toUpperCase()}`,
      isLoading: false,
      error: null,
    };
  },

  setModePreference(prefInput) {
    const norm = normalizeMode(prefInput);
    userPreference = norm;
    updateState();
  },

  updateFromEngine(engineData) {
    if (!engineData) return;
    if (engineData.mode) {
      userPreference = normalizeMode(engineData.mode);
    }
    updateState();
  },
};
