"use client";

import { useState, useEffect } from "react";
import { adaptiveEngineAdapter } from "@/adapters/adaptiveEngineAdapter";
import { getUIConfig } from "@/adaptive/config/adaptiveUIConfig";

<<<<<<< HEAD
=======
/**
 * Canonical useAdaptive Hook (FORGEX AI 2026)
 * -------------------------------------------------------------
 * Usage in UI components:
 * const { mode, activeMode, isAuto, config, network, reason, setModePreference } = useAdaptive();
 * 
 * Flow: Adaptive Runtime -> adaptiveAdapter -> useAdaptive() -> UI
 */
>>>>>>> 53a99d21d060c9d9604b7ab1bde7ac0043a17b9e
export function useAdaptive() {
  const [state, setState] = useState(adaptiveEngineAdapter.getSnapshot());

  useEffect(() => {
    const unsubscribe = adaptiveEngineAdapter.subscribe((data) => {
      setState(data);
    });
    return () => unsubscribe();
  }, []);

  const config = getUIConfig(state.mode);

  const setModePreference = (newMode) => {
    adaptiveEngineAdapter.setModePreference(newMode);
  };

  return {
    mode: state.mode,
    rawMode: state.rawMode,
    config,
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
