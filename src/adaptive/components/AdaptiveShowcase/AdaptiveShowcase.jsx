"use client";

import React from "react";
import { Zap, ShieldCheck, Sparkles, Layers, Eye, Download, Info } from "lucide-react";
import { useAdaptive } from "@/hooks/useAdaptive";
import { AdaptiveImage } from "../AdaptiveImage/AdaptiveImage";
import { CANONICAL_MODES } from "@/adaptive/integration/adaptiveAdapter";

/**
 * Showcase component demonstrating mode-dependent UI presentation rules:
 * - DATA SAVER: Smaller image delivery, essential text first, secondary cards hidden/deferred, lightweight layout.
 * - BALANCED: Standard medium images, balanced card layout.
 * - FULL EXPERIENCE: High-res images, richer interactive cards, optional analytics panels enabled.
 */
export function AdaptiveShowcase() {
  const { mode, config, reason } = useAdaptive();

  const isDataSaver = mode === CANONICAL_MODES.DATA_SAVER;
  const isFull = mode === CANONICAL_MODES.FULL;

  return (
    <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" aria-hidden="true" />
            Adaptive Content Delivery Showcase
          </h2>
          <p className="text-xs text-slate-400">
            Live demonstration of presentation changes controlled by adaptive engine policy
          </p>
        </div>
        <div className="text-xs font-mono px-3 py-1 rounded-md bg-slate-950 border border-slate-800 text-slate-300">
          Mode: <span className="font-bold text-blue-400">{mode.toUpperCase()}</span>
        </div>
      </div>

      {/* Main Adaptive Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Adaptive Image Delivery */}
        <div className="lg:col-span-5 space-y-3">
          <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
            <AdaptiveImage
              small="/images/hero-400.jpg"
              medium="/images/hero-800.jpg"
              large="/images/hero-1600.jpg"
              alt="Adaptive Web Application Showcase"
              className={`w-full ${
                isDataSaver ? "max-h-48" : isFull ? "max-h-80" : "max-h-64"
              }`}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span>Asset Size Tier: <strong className="text-slate-200">{config.imageSize.toUpperCase()}</strong></span>
            <span>Quality: <strong className="text-slate-200">{config.qualityTier.toUpperCase()}</strong></span>
          </div>
        </div>

        {/* Right Column: Mode-Specific Content & Presentation */}
        <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-lg font-extrabold text-white tracking-tight">
              Network & Hardware Constrained Delivery
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Essential content is prioritized across all modes. Secondary features, image resolution tiers, and prefetching adapt automatically to preserve battery, bandwidth, and CPU budget.
            </p>

            {/* Mode-Specific Information Banner */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1">
              <span className="font-semibold text-slate-400 block">Active Policy Explanation:</span>
              <p className="text-slate-300">{reason}</p>
            </div>
          </div>

          {/* Secondary Features (Deferred in DATA SAVER mode per Rule 9) */}
          {config.showSecondaryContent ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800/80">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-1">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-blue-400" /> Content Tier
                </span>
                <p className="text-[11px] text-slate-400">
                  {isFull ? "Rich multimedia & interactive widgets enabled" : "Standard content presentation"}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-1">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5 text-emerald-400" /> Prefetch Strategy
                </span>
                <p className="text-[11px] text-slate-400">
                  {config.prefetchStrategy.toUpperCase()} background route preloading
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-900/40 text-amber-300 text-xs flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-400 shrink-0" />
              <span>DATA SAVER active: Secondary widgets deferred to conserve bandwidth.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
