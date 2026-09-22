"use client";

import React from "react";
import { Wifi, Signal, ArrowDownCircle, Save } from "lucide-react";
import { ModeBadge } from "./ModeBadge";

export function NetworkStatus({ networkInfo, currentMode }) {
  const { connectionType, effectiveType, downlink, saveData } = networkInfo || {};

  const fields = [
    { label: "Connection Type", value: connectionType || "Not available", icon: Wifi },
    { label: "Effective Type", value: effectiveType || "Not available", icon: Signal },
    { label: "Downlink Speed", value: downlink || "Not available", icon: ArrowDownCircle },
    { label: "Save Data Mode", value: saveData || "Not available", icon: Save },
  ];

  return (
    <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <Wifi className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Network Status</h3>
            <p className="text-[11px] text-slate-400">Browser Network Information API</p>
          </div>
        </div>
        {currentMode && <ModeBadge mode={currentMode} />}
      </div>

      <div className="grid grid-cols-2 gap-3">
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
                {field.value}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
