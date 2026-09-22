"use client";

import { useState, useEffect } from "react";
import { adaptiveEngineAdapter } from "@/adapters/adaptiveEngineAdapter";

/**
 * Hook to consume the current adaptive engine policy state.
 * Status states: 'loading' | 'success' | 'empty' | 'error'
 */
export function useAdaptivePolicy() {
  const [policy, setPolicy] = useState(null);
  const [status, setStatus] = useState("loading"); // 'loading' | 'success' | 'empty' | 'error'
  const [error, setError] = useState(null);

  useEffect(() => {
    setStatus("loading");
    try {
      const unsubscribe = adaptiveEngineAdapter.subscribe((data) => {
        if (!data || Object.keys(data).length === 0) {
          setPolicy(null);
          setStatus("empty");
        } else {
          setPolicy(data);
          setStatus("success");
        }
      });
      return () => unsubscribe();
    } catch (err) {
      setError(err.message || "Failed to load adaptive policy");
      setStatus("error");
    }
  }, []);

  const setModePreference = (mode) => {
    adaptiveEngineAdapter.setModePreference(mode);
  };

  const refetch = () => {
    setStatus("loading");
    try {
      const current = adaptiveEngineAdapter.getSnapshot();
      if (!current) {
        setStatus("empty");
      } else {
        setPolicy({ ...current });
        setStatus("success");
      }
    } catch (err) {
      setError(err.message || "Failed to reload policy");
      setStatus("error");
    }
  };

  return { policy, status, error, setModePreference, refetch };
}
