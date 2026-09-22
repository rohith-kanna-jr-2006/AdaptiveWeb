"use client";

import { useState, useEffect } from "react";
import { adaptiveAdapter } from "@/adaptive/integration/adaptiveAdapter";
import { getUIConfig } from "@/adaptive/config/adaptiveUIConfig";

/**
 * Custom React Hook for UI components to consume adaptive engine state.
 * Returns canonical mode ('data-saver' | 'balanced' | 'full'), UI presentation config,
 * environmental metadata, and controls.
 */
export function useAdaptive() {
  const [state, setState] = useState(adaptiveAdapter.getSnapshot());

  useEffect(() => {
    const unsubscribe = adaptiveAdapter.subscribe((data) => {
      setState(data);
    });
    return () => unsubscribe();
  }, []);

  const config = getUIConfig(state.mode);

  const setModePreference = (newMode) => {
    adaptiveAdapter.setModePreference(newMode);
  };

  return {
    mode: state.mode, // Canonical mode: 'data-saver' | 'balanced' | 'full'
    rawMode: state.rawMode,
    config, // Presentation rules from adaptiveUIConfig.js
    network: state.network,
    deviceTier: state.deviceTier,
    saveData: state.saveData,
    reason: state.reason,
    isManual: state.isManual,
    isLoading: state.isLoading,
    error: state.error,
    setModePreference,
  };
}
