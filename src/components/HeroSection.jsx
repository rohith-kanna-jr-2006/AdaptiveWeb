"use client";

import React from "react";
import { Cpu, Wifi, Activity, Sparkles } from "lucide-react";
import { AdaptiveModeIndicator } from "@/adaptive/components/AdaptiveModeIndicator/AdaptiveModeIndicator";
import { useAdaptive } from "@/hooks/useAdaptive";
import { CANONICAL_MODES } from "@/adaptive/integration/adaptiveAdapter";

export function HeroSection({ reason }) {
  const { activeMode } = useAdaptive();
  const isFull = activeMode === CANONICAL_MODES.FULL;

  return (
    <section
      id="hero"
      className={`py-10 md:py-14 border-b border-slate-800 transition-colors duration-500 ${
        isFull
          ? "bg-gradient-to-b from-emerald-950/30 via-slate-950 to-slate-900/50"
          : "bg-gradient-to-b from-slate-950 to-slate-900/50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                isFull
                  ? "bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 animate-pulse-glow"
                  : "bg-blue-950/60 border border-blue-800/60 text-blue-300"
              }`}
            >
              {isFull ? (
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" aria-hidden="true" />
              ) : (
                <Activity className="w-3.5 h-3.5" aria-hidden="true" />
              )}
              <span>
                {isFull
                  ? "Full Experience Mode Active (Richer Visuals & High-Res Assets)"
                  : "Network & Device-Adaptive E-Commerce Platform"}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              AdaptiveWeb Store
            </h1>
            <p className="text-base text-slate-300 leading-relaxed">
              Dynamically optimizes product image variants, resource loading, and optional widgets according to current network quality and device capabilities while keeping the core shopping flow available.
            </p>
          </div>

          {/* Current Engine Status Summary Box */}
          <div
            className={`w-full md:w-auto p-5 rounded-2xl bg-slate-900/90 border shadow-xl space-y-3 min-w-[280px] transition-all duration-300 ${
              isFull ? "border-emerald-500/60 shadow-emerald-950/40" : "border-slate-800"
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Current Mode
              </span>
              <AdaptiveModeIndicator />
            </div>
            {reason && (
              <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                <span className="font-semibold text-slate-400">Policy Reason:</span> {reason}
              </p>
            )}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/60">
              <span className="flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5 text-blue-400" /> Network Aware
              </span>
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-emerald-400" /> Device Aware
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
