"use client";

import React from "react";
import { CheckCircle2, Zap, ShieldCheck, Sparkles } from "lucide-react";
import { ADAPTIVE_MODES, MODE_DESCRIPTIONS } from "@/adapters/adaptiveEngineAdapter";

export function ModeCard({ modeKey, isCurrentMode }) {
  const config = MODE_DESCRIPTIONS[modeKey];
  if (!config) return null;

  let Icon = ShieldCheck;
  let activeBorder = "border-slate-800 bg-slate-900/60";
  let badgeColor = "bg-slate-800 text-slate-300";

  if (modeKey === ADAPTIVE_MODES.DATA_SAVER) {
    Icon = Zap;
    if (isCurrentMode) {
      activeBorder = "border-amber-500/80 bg-amber-950/20 shadow-amber-950/40";
      badgeColor = "bg-amber-500/20 text-amber-300 border border-amber-500/30";
    }
  } else if (modeKey === ADAPTIVE_MODES.BALANCED) {
    Icon = ShieldCheck;
    if (isCurrentMode) {
      activeBorder = "border-blue-500/80 bg-blue-950/20 shadow-blue-950/40";
      badgeColor = "bg-blue-500/20 text-blue-300 border border-blue-500/30";
    }
  } else if (modeKey === ADAPTIVE_MODES.FULL_EXPERIENCE) {
    Icon = Sparkles;
    if (isCurrentMode) {
      activeBorder = "border-emerald-500/80 bg-emerald-950/20 shadow-emerald-950/40";
      badgeColor = "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30";
    }
  }

  return (
    <div
      className={`relative p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${activeBorder}`}
    >
      {isCurrentMode && (
        <div className="absolute -top-3 right-4 px-3 py-0.5 text-[10px] font-bold rounded-full bg-blue-600 text-white uppercase tracking-wider shadow">
          Active Engine Policy
        </div>
      )}

      <div className="space-y-4">
        {/* Card Title & Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${badgeColor}`}>
              <Icon className="w-3.5 h-3.5" aria-hidden="true" />
              {config.title}
            </span>
            <p className="text-xs text-slate-400 font-medium">{config.subtitle}</p>
          </div>
        </div>

        {/* Feature List */}
        <ul className="space-y-2 pt-2 border-t border-slate-800/80" aria-label={`${config.title} feature list`}>
          {config.features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-500 mt-0.5 shrink-0" aria-hidden="true" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/50 text-[11px] text-slate-500 italic">
        * Mode behavior defined by policy classification rules.
      </div>
    </div>
  );
}
