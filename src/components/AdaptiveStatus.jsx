"use client";

import React from "react";
import { SlidersHorizontal, Image, RefreshCw, Sparkles, HardDrive } from "lucide-react";
import { ModeBadge } from "./ModeBadge";

export function AdaptiveStatus({ policy }) {
  if (!policy) return null;

  const {
    mode,
    reason,
    imageQuality,
    prefetch,
    animations,
    dataUsage,
  } = policy;

  const adaptations = [
    { label: "Image Delivery", value: imageQuality || "Not specified", icon: Image },
    { label: "Resource Prefetch", value: prefetch || "Not specified", icon: RefreshCw },
    { label: "Visual Animations", value: animations || "Not specified", icon: Sparkles },
    { label: "Data Usage Profile", value: dataUsage || "Not specified", icon: HardDrive },
  ];

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400">
            <SlidersHorizontal className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Adaptive Policy Status
            </h2>
            <p className="text-xs text-slate-400">
              Active parameters provided by adaptive policy engine
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Current Mode:
          </span>
          <ModeBadge mode={mode} />
        </div>
      </div>

      {/* Engine Reason */}
      <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-1">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
          Policy Adaptation Reason
        </span>
        <p className="text-sm font-medium text-slate-200">
          {reason || "Engine output received with no explicit reason provided."}
        </p>
      </div>

      {/* Adaptation Parameters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {adaptations.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">{item.label}</span>
                <Icon className="w-4 h-4 text-blue-400" aria-hidden="true" />
              </div>
              <div className="text-sm font-bold text-white">{item.value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
