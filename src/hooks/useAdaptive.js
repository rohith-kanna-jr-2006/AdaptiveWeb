"use client";

import { useState, useEffect } from "react";
import { adaptiveAdapter } from "@/adaptive/integration/adaptiveAdapter";
import { getUIConfig } from "@/adaptive/config/adaptiveUIConfig";

/**
 * Canonical useAdaptive Hook (FORGEX AI 2026)
 * -------------------------------------------------------------
 * Usage in UI components:
 * const { mode, activeMode, isAuto, config, network, reason, setModePreference } = useAdaptive();
 * 
 * Flow: Adaptive Runtime -> adaptiveAdapter -> useAdaptive() -> UI
 */
export function useAdaptive() {
  const [state, setState] = useState(adaptiveAdapter.getSnapshot());

  useEffect(() => {
    const unsubscribe = adaptiveAdapter.subscribe((data) => {
      setState(data);
    });
    return () => unsubscribe();
  }, []);

  const config = getUIConfig(state.activeMode);

  return {
    mode: state.mode, // User preference: 'auto' | 'data-saver' | 'balanced' | 'full'
    activeMode: state.activeMode, // Resolved active mode: 'data-saver' | 'balanced' | 'full'
    isAuto: state.isAuto,
    config, // Presentation rules from adaptiveUIConfig
    network: state.network,
    saveData: state.saveData,
    downlink: state.downlink,
    reason: state.reason,
    isLoading: state.isLoading,
    error: state.error,
    setModePreference: adaptiveAdapter.setModePreference,
  };
}
