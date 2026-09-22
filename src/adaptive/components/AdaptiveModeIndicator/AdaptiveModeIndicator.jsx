"use client";

import React from "react";
import { Zap, ShieldCheck, Sparkles, Activity } from "lucide-react";
import { useAdaptive } from "@/hooks/useAdaptive";
import { CANONICAL_MODES } from "@/adaptive/integration/adaptiveAdapter";

/**
 * Reusable small, clear, accessible Adaptive Mode Indicator badge.
 * Displays mode title (AUTO, DATA SAVER, BALANCED, FULL) with icons and text labels.
 */
export function AdaptiveModeIndicator({ className = "" }) {
  const { mode, activeMode, isAuto } = useAdaptive();

  let Icon = ShieldCheck;
  let badgeStyle = "bg-blue-950/80 border-blue-500/50 text-blue-300";

  if (activeMode === CANONICAL_MODES.DATA_SAVER) {
    Icon = Zap;
    badgeStyle = "bg-amber-950/80 border-amber-500/50 text-amber-300";
  } else if (activeMode === CANONICAL_MODES.FULL) {
    Icon = Sparkles;
    badgeStyle = "bg-emerald-950/80 border-emerald-500/50 text-emerald-300";
  }

  const titleText = isAuto
    ? `AUTO (${activeMode.toUpperCase()})`
    : activeMode.toUpperCase();

  return (
    <div
      aria-label={`Adaptive Mode: ${titleText}`}
      className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full border shadow-sm ${badgeStyle} ${className}`}
    >
      {isAuto ? (
        <Activity className="w-3.5 h-3.5 text-blue-400 shrink-0" aria-hidden="true" />
      ) : (
        <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      )}
      <span className="font-bold tracking-tight">{titleText}</span>
    </div>
  );
}
