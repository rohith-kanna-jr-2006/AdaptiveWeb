/**
 * ADAPTIVE UI PRESENTATION CONFIGURATION (FORGEX AI 2026)
 * -------------------------------------------------------------
<<<<<<< HEAD
 * Maps canonical mode values ('data-saver', 'balanced', 'full')
 * to presentation rules and UI flags.
 *
=======
 * Maps active adaptive modes ('data-saver', 'balanced', 'full') to presentation rules.
 * 
>>>>>>> 53a99d21d060c9d9604b7ab1bde7ac0043a17b9e
 * IMPORTANT:
 * Controls PRESENTATION ONLY.
 * Does NOT classify or decide the adaptive mode.
 */

import { CANONICAL_MODES } from "../../integration/adaptiveEngineAdapter";

export const adaptiveUIConfig = {
  [CANONICAL_MODES.DATA_SAVER]: {
    imageQualityTier: "small", // 'small' | 'medium' | 'large'
    imageDimensionScale: "compact", // 'compact' | 'standard' | 'large'
    showOptionalRecommendations: false, // Defer optional widgets
    animations: false,
    prefetchStrategy: "disabled",
    displayTitle: "DATA SAVER",
    resourcePolicyText: "Reduced (Small images, deferred optional widgets)",
  },
  [CANONICAL_MODES.BALANCED]: {
    imageQualityTier: "medium",
    imageDimensionScale: "standard",
    showOptionalRecommendations: true,
    animations: "reduced",
    prefetchStrategy: "limited",
    displayTitle: "BALANCED",
    resourcePolicyText: "Balanced (Medium images, standard resources)",
  },
  [CANONICAL_MODES.FULL]: {
    imageQualityTier: "large",
    imageDimensionScale: "large",
    showOptionalRecommendations: true,
    animations: true,
    prefetchStrategy: "full",
    displayTitle: "FULL",
    resourcePolicyText: "Rich (High-resolution images, full features enabled)",
  },
};

export function getUIConfig(activeMode) {
  return adaptiveUIConfig[activeMode] || adaptiveUIConfig[CANONICAL_MODES.BALANCED];
}
