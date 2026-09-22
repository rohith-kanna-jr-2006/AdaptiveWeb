/**
 * resourceController.js
 *
 * Maps policy decisions to concrete resource and feature behavior.
 * Provides an adapter interface that UI components consume without
 * needing to understand policy internals.
 *
 * The controller never decides policy — it applies decisions passed to it.
 */

import {
  MODES,
  IMAGE_QUALITY,
  PREFETCH,
  OPTIONAL_FEATURES,
} from "./policyEngine.js";

/**
 * ResourceController adapts policy to concrete resource decisions.
 */
export class ResourceController {
  #policy = null;

  /**
   * Set the active policy. Called by ModeSelector.
   * @param {object} policy
   */
  applyPolicy(policy) {
    if (!policy || typeof policy !== "object") {
      console.warn("ResourceController: invalid policy passed, ignoring");
      return;
    }
    this.#policy = policy;
  }

  /**
   * Decide image quality based on current policy.
   * @returns {string} "low" | "medium" | "high"
   */
  getImageQuality() {
    return this.#policy?.imageQuality || IMAGE_QUALITY.MEDIUM;
  }

  /**
   * Decide whether prefetching is allowed.
   * @returns {string} "none" | "limited" | "enabled"
   */
  getPrefetchDecision() {
    return this.#policy?.prefetch || PREFETCH.NONE;
  }

  /**
   * Decide how optional features should be loaded.
   * @returns {string} "deferred" | "on-demand" | "enabled"
   */
  getOptionalFeaturesDecision() {
    return this.#policy?.optionalFeatures || OPTIONAL_FEATURES.ON_DEMAND;
  }

  /**
   * Decide if critical resources should be preloaded.
   * @returns {boolean}
   */
  shouldPreloadCritical() {
    const mode = this.#policy?.mode;
    // Always preload in Full; defer in Data Saver
    if (mode === MODES.FULL) return true;
    if (mode === MODES.DATA_SAVER) return false;
    // Balanced: preload only if prefetch is "enabled"
    return this.getPrefetchDecision() === PREFETCH.ENABLED;
  }

  /**
   * Get the full policy as served to UI components.
   * @returns {object}
   */
  getPolicyForUI() {
    return this.#policy || getDefaultPolicy();
  }

  /**
   * Check if the resource controller has a valid policy.
   * @returns {boolean}
   */
  hasPolicy() {
    return this.#policy !== null;
  }

  /**
   * Reset to default (Balanced) policy.
   */
  reset() {
    this.#policy = getDefaultPolicy();
  }
}

function getDefaultPolicy() {
  return {
    mode: MODES.BALANCED,
    imageQuality: IMAGE_QUALITY.MEDIUM,
    prefetch: PREFETCH.NONE,
    optionalFeatures: OPTIONAL_FEATURES.ON_DEMAND,
    reason: ["default-fallback"],
    schemaVersion: 1,
    revision: 1,
  };
}

// Singleton instance (can be replaced with dependency injection in frameworks)
let globalController = null;

export function getResourceController() {
  if (!globalController) {
    globalController = new ResourceController();
  }
  return globalController;
}

export function resetResourceController() {
  if (globalController) {
    globalController.reset();
  }
  globalController = null;
}

export { IMAGE_QUALITY, PREFETCH, OPTIONAL_FEATURES, MODES };
