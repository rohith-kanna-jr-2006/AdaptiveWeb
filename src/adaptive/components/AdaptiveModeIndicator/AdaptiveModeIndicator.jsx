"use client";

import React from "react";
import { Zap, ShieldCheck, Sparkles } from "lucide-react";
import { useAdaptive } from "@/hooks/useAdaptive";
import { CANONICAL_MODES } from "@/adaptive/integration/adaptiveAdapter";

/**
 * Reusable small, clear, product-like Adaptive Mode Indicator badge.
 * Fully accessible (uses explicit text labels + icons, never color-only).
 */
export function AdaptiveModeIndicator({ showStatus = true, className = "" }) {
  const { mode, config, isManual } = useAdaptive();

  let Icon = ShieldCheck;
  let badgeStyle = "bg-blue-950/80 border-blue-500/50 text-blue-300";

  if (mode === CANONICAL_MODES.DATA_SAVER) {
    Icon = Zap;
    badgeStyle = "bg-amber-950/80 border-amber-500/50 text-amber-300";
  } else if (mode === CANONICAL_MODES.FULL) {
    Icon = Sparkles;
    badgeStyle = "bg-emerald-950/80 border-emerald-500/50 text-emerald-300";
  }

  const titleText = config.displayTitle;
  const statusTag = isManual ? "Manual" : "Auto";

  return (
    <div
      aria-label={`Adaptive Mode: ${titleText} (${statusTag})`}
      className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full border shadow-sm ${badgeStyle} ${className}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      <span className="font-bold tracking-tight">{titleText}</span>
      {showStatus && (
        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-900/60 border border-slate-700/60 text-slate-300">
          {statusTag}
        </span>
      )}
    </div>
  );
}
