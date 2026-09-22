"use client";

import React from "react";
import { Zap, ShieldCheck, Sparkles } from "lucide-react";
import { ADAPTIVE_MODES } from "@/adapters/adaptiveEngineAdapter";

/**
 * Reusable Mode Badge Component.
 * Displays mode icon + clear text label (never relying strictly on color alone).
 */
export function ModeBadge({ mode }) {
  let badgeStyle = "bg-blue-950/80 border-blue-500/50 text-blue-300";
  let Icon = ShieldCheck;
  let modeText = mode || "UNKNOWN";

  if (mode === ADAPTIVE_MODES.DATA_SAVER) {
    badgeStyle = "bg-amber-950/80 border-amber-500/50 text-amber-300";
    Icon = Zap;
  } else if (mode === ADAPTIVE_MODES.BALANCED) {
    badgeStyle = "bg-blue-950/80 border-blue-500/50 text-blue-300";
    Icon = ShieldCheck;
  } else if (mode === ADAPTIVE_MODES.FULL_EXPERIENCE) {
    badgeStyle = "bg-emerald-950/80 border-emerald-500/50 text-emerald-300";
    Icon = Sparkles;
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border ${badgeStyle}`}
    >
      <Icon className="w-3.5 h-3.5" aria-hidden="true" />
      <span>{modeText}</span>
    </div>
  );
}
