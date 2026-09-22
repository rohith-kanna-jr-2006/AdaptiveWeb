"use client";

import React from "react";
import { SlidersHorizontal, Image, RefreshCw, HardDrive, Wifi, Cpu } from "lucide-react";
import { useAdaptive } from "@/hooks/useAdaptive";
import { AdaptiveModeIndicator } from "@/adaptive/components/AdaptiveModeIndicator/AdaptiveModeIndicator";

export function AdaptiveStatus() {
  const { mode, activeMode, isAuto, network, saveData, reason, config } = useAdaptive();

  const diagnosticFields = [
    {
      label: "Selection Mode",
      value: isAuto ? "AUTO" : "MANUAL OVERRIDE",
      icon: SlidersHorizontal,
    },
    {
      label: "Effective Active Mode",
      value: activeMode.toUpperCase(),
      icon: Cpu,
    },
    {
      label: "Decision Source",
      value: isAuto ? "Engine (Auto Detection)" : "Manual Override",
      icon: Wifi,
    },
    {
      label: "Network Signal",
      value: network ? `${network.toUpperCase()} ${saveData ? "(Save-Data On)" : ""}` : "Unknown (Fallback)",
      icon: Wifi,
    },
    {
      label: "Resource Policy",
      value: config.resourcePolicyText,
      icon: HardDrive,
    },
    {
      label: "Image Quality Variant",
      value: `${config.imageQualityTier.toUpperCase()} (${config.imageDimensionScale})`,
      icon: Image,
    },
  ];

  return (
    <div
      data-testid="adaptive-status-panel"
      className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400">
            <SlidersHorizontal className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Adaptive Policy Diagnostic Area
            </h2>
            <p className="text-xs text-slate-400">
              Live engine output consumed via canonical <code className="font-mono text-blue-300">useAdaptive()</code> hook
            </p>
          </div>
        </div>
        <AdaptiveModeIndicator />
      </div>

      {/* Engine Reason Banner */}
      <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-1">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
          Current Engine Policy Reason & Source
        </span>
        <p className="text-sm font-medium text-slate-200">{reason}</p>
      </div>

      {/* Diagnostic Fields Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {diagnosticFields.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5"
            >
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-medium">{item.label}</span>
                <Icon className="w-4 h-4 text-blue-400" aria-hidden="true" />
              </div>
              <div className="text-sm font-extrabold text-white">{item.value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
