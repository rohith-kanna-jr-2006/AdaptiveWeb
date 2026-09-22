"use client";

import React from "react";
import { Cpu, HardDrive, Monitor, Layers, Smartphone } from "lucide-react";

export function DeviceStatus({ deviceInfo }) {
  const { cpuCores, memory, screenSize, devicePixelRatio, profile } = deviceInfo || {};

  const fields = [
    { label: "CPU Cores", value: cpuCores !== undefined && cpuCores !== null ? cpuCores : "Not available", icon: Cpu },
    { label: "Memory (RAM)", value: memory || "Not available", icon: HardDrive },
    { label: "Screen Resolution", value: screenSize || "Not available", icon: Monitor },
    { label: "Pixel Ratio (DPR)", value: devicePixelRatio || "Not available", icon: Layers },
    { label: "Device Profile", value: profile || "Not available", icon: Smartphone },
  ];

  return (
    <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
            <Cpu className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Device Status</h3>
            <p className="text-[11px] text-slate-400">Hardware & Viewport Capabilities</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3">
        {fields.map((field, idx) => {
          const Icon = field.icon;
          const isNotAvailable = field.value === "Not available";
          return (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1"
            >
              <div className="flex items-center gap-1.5 text-slate-400">
                <Icon className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                <span className="text-[11px] font-medium">{field.label}</span>
              </div>
              <p
                className={`text-xs font-semibold ${
                  isNotAvailable ? "text-slate-500 italic" : "text-slate-200"
                }`}
              >
                {String(field.value)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
