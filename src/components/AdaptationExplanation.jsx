"use client";

import React from "react";
import { BookOpen, Cpu, Wifi, Zap, Layers, Image, HardDrive } from "lucide-react";

export function AdaptationExplanation() {
  const points = [
    {
      title: "Network Condition Sensing",
      desc: "Monitors effective bandwidth, round-trip time (RTT), network connection type (4G/3G/WiFi), and Save-Data browser preferences.",
      icon: Wifi,
    },
    {
      title: "Device Capability Inspection",
      desc: "Evaluates available CPU hardware concurrency, approximate RAM memory budget, viewport pixel density (DPR), and screen resolution.",
      icon: Cpu,
    },
    {
      title: "Dynamic Image & Asset Delivery",
      desc: "Adjusts image compression, responsive source set selection, SVG vector vs raster formats, and quality tiers according to active policy.",
      icon: Image,
    },
    {
      title: "Resource Prefetching & Script Execution",
      desc: "Dynamically pauses or enables background link prefetching, route preloading, and non-critical JavaScript execution to preserve battery and data.",
      icon: HardDrive,
    },
  ];

  return (
    <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
        <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
          <BookOpen className="w-5 h-5" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">
            How AdaptiveWeb Works
          </h2>
          <p className="text-xs text-slate-400">
            System architectural overview & adaptive resource delivery mechanics
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {points.map((pt, idx) => {
          const Icon = pt.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2 flex items-start gap-3"
            >
              <div className="p-2 rounded-lg bg-slate-900 text-blue-400 shrink-0 mt-0.5">
                <Icon className="w-4 h-4" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-white">{pt.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{pt.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
