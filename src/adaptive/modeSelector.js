/**
 * modeSelector.js
 *
 * Expose the current policy and manage updates.
 * Prevents mode thrashing with hysteresis (cooldown) and requires
 * repeated observations before automatic mode changes.
 */

import { buildPolicy, MODES, validatePolicy } from "./policyEngine.js";
import { classify } from "./classifier.js";
import { normalizeSignals } from "./normalizeSignals.js";

const HYSTERESIS = {
  COOLDOWN_MS: 10000, // 10s cooldown before automatic mode upgrade
  MINIMUM_OBSERVATIONS: 2, // at least N consistent observations before upgrade
  UPGRADE_DELAY_MS: 5000, // minimum stable period before upgrade
};

const USER_MODE_COOLDOWN_MS = 15000; // user override lockout

/**
 * ModeSelector manages the current policy, hysteresis, and stability rules.
 */
export class ModeSelector {
  #currentPolicy = null;
  #currentCondition = null;
  #previousObservations = [];
  #lastPolicyChangeTime = 0;
  #userModeLockUntil = 0;
  #hysteresisTimer = null;
  #listeners = new Set();

  /**
   * Create a ModeSelector.
   * @param {object} [initialPolicy] Initial policy if known
   */
  constructor(initialPolicy = null) {
    this.#currentPolicy = initialPolicy || buildPolicy("moderate");
    this.#currentCondition = "moderate";
  }

  /**
   * Evaluate a new signal observation and update the policy.
   * Applies hysteresis rules before changing mode.
   *
   * @param {object} rawSignals Raw signals from collectSignals()
   * @param {object} [userConfig] User configuration
   * @param {string} [userConfig.preferredMode] User's preferred mode
   * @param {boolean} [userConfig.saveData] Explicit save-data preference
   * @returns {object} The resulting policy (may be unchanged)
   */
  evaluate(rawSignals, userConfig = {}) {
    const normalized = normalizeSignals(rawSignals);
    const { label, evidence, conflicts } = classify(normalized);

    const userMode = this.#shouldApplyUserMode(userConfig.preferredMode);
    const userSaveData = userConfig.saveData;

    // Record observation for hysteresis
    this.#previousObservations.push({
      timestamp: Date.now(),
      condition: label,
      evidence,
      conflicts,
      userMode: userMode || "none",
      userSaveData: userSaveData ?? null,
    });

    // Clean up old observations (>2 minutes old)
    const cutoff = Date.now() - 120000;
    this.#previousObservations = this.#previousObservations.filter(
      (o) => o.timestamp > cutoff
    );

    const candidatePolicy = buildPolicy(label, {
      userMode: userMode || undefined,
      userSaveData: userSaveData ?? undefined,
      classificationEvidence: evidence,
      classificationConflicts: conflicts,
    });

    const shouldChange = this.#shouldChangeMode(
      candidatePolicy.mode,
      label,
      userConfig.preferredMode,
      userSaveData
    );

    if (shouldChange) {
      this.#applyPolicy(candidatePolicy, label, userConfig);
    }

    return { ...this.#currentPolicy };
  }

  /**
   * Check if user mode should be applied (respecting cooldown).
   * @param {string} preferredMode
   * @returns {string|null}
   */
  #shouldApplyUserMode(preferredMode) {
    if (!preferredMode || this.#userModeLockUntil > Date.now()) {
      return null;
    }
    return preferredMode;
  }

  /**
   * Determine whether the candidate mode should be applied now.
   * Rules:
   *   - User mode always applies immediately (handled externally)
   *   - Downgrades apply immediately on strong evidence
   *   - Upgrades require cooldown + consistent observations
   *   - Save-data override forces immediate data-saver mode
   */
  #shouldChangeMode(candidateMode, conditionLabel, preferredMode, saveData) {
    if (preferredMode) return true; // user override always applies

    // Strong evidence → immediate downgrade
    const strongDowngrade =
      conditionLabel === "constrained" &&
      this.#currentCondition !== "constrained";

    // Save-data preference forces data-saver immediately (overrides hysteresis)
    if (saveData === true) {
      // If candidate is already data-saver, always apply it
      if (candidateMode === MODES.DATA_SAVER) return true;
      // If candidate is not data-saver, force downgrade to data-saver
      return true;
    }

    // No strong reason to change
    if (
      candidateMode === this.#currentPolicy.mode &&
      conditionLabel === this.#currentCondition
    ) {
      return false;
    }

    // Strong downgrade → immediate
    if (strongDowngrade) {
      return this.#currentPolicy.mode !== MODES.DATA_SAVER;
    }

    // Upgrade requires cooldown
    if (candidateMode === MODES.FULL && this.#currentPolicy.mode !== MODES.FULL) {
      return this.#passesHysteresis(conditionLabel);
    }

    // Moderate vs balanced → balanced is always safe, but full upgrade needs hysteresis
    if (candidateMode === MODES.BALANCED && this.#currentPolicy.mode !== MODES.BALANCED) {
      return this.#passesHysteresis(conditionLabel);
    }

    return false;
  }

  /**
   * Check if observations meet hysteresis requirements for an upgrade.
   * @param {string} label
   * @returns {boolean}
   */
  #passesHysteresis(label) {
    const recent = this.#previousObservations.filter((o) => o.condition === label);
    if (recent.length < HYSTERESIS.MINIMUM_OBSERVATIONS) return false;

    const minTime = recent[recent.length - 1].timestamp;
    return Date.now() - minTime >= HYSTERESIS.UPGRADE_DELAY_MS;
  }

  /**
   * Apply a new policy and notify listeners.
   * @param {object} policy
   * @param {string} condition
   * @param {object} userConfig
   */
  #applyPolicy(policy, condition, userConfig) {
    if (userConfig.preferredMode) {
      this.#userModeLockUntil = Date.now() + USER_MODE_COOLDOWN_MS;
    }

    this.#currentPolicy = policy;
    this.#currentCondition = condition;
    this.#previousObservations = [];
    this.#lastPolicyChangeTime = Date.now();

    this.#notifyListeners(policy);
  }

  /**
   * Register a listener to receive policy update notifications.
   * @param {Function} listener
   * @returns {Function} Unsubscribe
   */
  onPolicyUpdate(listener) {
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  }

  /**
   * Notify all listeners of a policy update.
   * @param {object} policy
   */
  #notifyListeners(policy) {
    for (const listener of this.#listeners) {
      try {
        listener(policy);
      } catch (err) {
        // Listener failures must not break the engine
        if (typeof console !== "undefined" && console.warn) {
          console.warn("Policy listener error:", err);
        }
      }
    }
  }

  /**
   * Get the current policy without evaluating new signals.
   * @returns {object}
   */
  getPolicy() {
    return { ...this.#currentPolicy };
  }

  /**
   * Get the current condition label.
   * @returns {string}
   */
  getCondition() {
    return this.#currentCondition;
  }

  /**
   * Get hysteresis configuration (useful for tests).
   * @returns {object}
   */
  getHysteresisConfig() {
    return { ...HYSTERESIS };
  }

  /**
   * Reset to a known state (useful for tests).
   * @param {string} [initialCondition]
   */
  reset(initialCondition = "moderate") {
    this.#currentPolicy = buildPolicy(initialCondition);
    this.#currentCondition = initialCondition;
    this.#previousObservations = [];
    this.#userModeLockUntil = 0;
    this.#lastPolicyChangeTime = Date.now();
  }
}

export { HYSTERESIS };
