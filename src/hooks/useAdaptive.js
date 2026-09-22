"use client";

import { useState, useEffect } from "react";
import { adaptiveEngineAdapter } from "@/adapters/adaptiveEngineAdapter";
import { getUIConfig } from "@/adaptive/config/adaptiveUIConfig";

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
