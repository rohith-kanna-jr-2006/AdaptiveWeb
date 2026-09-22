"use client";

import React from "react";
import { Zap, ShieldCheck, Sparkles, Activity } from "lucide-react";
import { useAdaptive } from "@/hooks/useAdaptive";
import { CANONICAL_MODES } from "@/adaptive/integration/adaptiveAdapter";

/**
 * Reusable Adaptive Mode Indicator badge.
 * In FULL mode, displays rich animated glowing effects and floating badges.
 */
export function AdaptiveModeIndicator({ className = "" }) {
  const { activeMode, isAuto } = useAdaptive();

  const isFull = activeMode === CANONICAL_MODES.FULL;
  const isDataSaver = activeMode === CANONICAL_MODES.DATA_SAVER;

  let Icon = ShieldCheck;
  let badgeStyle = "bg-blue-950/80 border-blue-500/50 text-blue-300";

  if (isDataSaver) {
    Icon = Zap;
    badgeStyle = "bg-amber-950/80 border-amber-500/50 text-amber-300";
  } else if (isFull) {
    Icon = Sparkles;
    badgeStyle = "bg-emerald-950/90 border-emerald-400/80 text-emerald-200 animate-pulse-glow animate-float-slow";
  }

  const titleText = isAuto
    ? `AUTO (${activeMode.toUpperCase()})`
    : activeMode.toUpperCase();

  return (
    <div
      aria-label={`Adaptive Mode: ${titleText}`}
      className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full border shadow-sm transition-all duration-300 ${badgeStyle} ${className}`}
    >
      {isAuto ? (
        <Activity className={`w-3.5 h-3.5 text-blue-400 shrink-0 ${isFull ? "animate-spin" : ""}`} aria-hidden="true" />
      ) : (
        <Icon className={`w-3.5 h-3.5 shrink-0 ${isFull ? "text-emerald-300" : ""}`} aria-hidden="true" />
      )}
      <span className="font-bold tracking-tight">{titleText}</span>
    </div>
  );
}
