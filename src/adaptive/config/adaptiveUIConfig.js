/**
 * ADAPTIVE UI PRESENTATION CONFIGURATION
 * -------------------------------------------------------------
 * Maps canonical mode values ('data-saver', 'balanced', 'full')
 * to presentation rules and UI flags.
 * 
 * IMPORTANT:
 * This configuration strictly controls PRESENTATION.
 * It does NOT decide the user's adaptive mode.
 * The mode MUST originate from Rohith's engine/adapter.
 */

import { CANONICAL_MODES } from "../integration/adaptiveAdapter";

export const adaptiveUIConfig = {
  [CANONICAL_MODES.DATA_SAVER]: {
    imageSize: "small",
    qualityTier: "low",
    showSecondaryContent: false,
    animations: false,
    deferOptionalSections: true,
    prefetchStrategy: "disabled",
    displayTitle: "DATA SAVER",
    badgeColor: "amber",
  },
  [CANONICAL_MODES.BALANCED]: {
    imageSize: "medium",
    qualityTier: "medium",
    showSecondaryContent: true,
    animations: "reduced",
    deferOptionalSections: false,
    prefetchStrategy: "limited",
    displayTitle: "BALANCED",
    badgeColor: "blue",
  },
  [CANONICAL_MODES.FULL]: {
    imageSize: "large",
    qualityTier: "high",
    showSecondaryContent: true,
    animations: true,
    deferOptionalSections: false,
    prefetchStrategy: "full",
    displayTitle: "FULL EXPERIENCE",
    badgeColor: "emerald",
  },
};

export function getUIConfig(mode) {
  return adaptiveUIConfig[mode] || adaptiveUIConfig[CANONICAL_MODES.BALANCED];
}
