"use client";

import React, { useState } from "react";
import { Settings, Info, Check, ShieldAlert } from "lucide-react";
import { ADAPTIVE_MODES } from "@/adapters/adaptiveEngineAdapter";

export function SettingsPanel({ currentPolicy, onSelectMode }) {
  const [selectedPreference, setSelectedPreference] = useState(
    currentPolicy?.manualOverride ? currentPolicy?.mode : "AUTOMATIC"
  );

  const modeOptions = [
    {
      id: "AUTOMATIC",
      title: "Automatic (Recommended)",
      desc: "Engine dynamically selects optimal mode according to real-time network and device classification.",
    },
    {
      id: ADAPTIVE_MODES.DATA_SAVER,
      title: "Data Saver",
      desc: "Request minimum data usage, low-resolution assets, and disabled prefetching.",
    },
    {
      id: ADAPTIVE_MODES.BALANCED,
      title: "Balanced",
      desc: "Request balanced image quality, controlled loading, and moderate resource prefetching.",
    },
    {
      id: ADAPTIVE_MODES.FULL_EXPERIENCE,
      title: "Full Experience",
      desc: "Request maximum quality, uncompressed assets, full prefetching, and all visual effects.",
    },
  ];

  const handleOptionChange = (optionId) => {
    setSelectedPreference(optionId);
    onSelectMode?.(optionId);
  };

  return (
    <div id="settings" className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <Settings className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Adaptive User Settings & Preferences
            </h2>
            <p className="text-xs text-slate-400">
              Configure adaptive engine mode request preferences
            </p>
          </div>
        </div>
      </div>

      {/* Integration Notice */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-950/40 border border-blue-800/40 text-blue-200">
        <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" aria-hidden="true" />
        <div className="text-xs space-y-1">
          <p className="font-semibold text-blue-300">Engine Integration Status:</p>
          <p className="text-blue-300/80">
            Selecting a mode here submits a preference request to Rohith's Adaptive Policy Engine adapter. If engine policy policies enforce strict network boundaries, the engine may override manual selections.
          </p>
        </div>
      </div>

      {/* Radio Group Selection */}
      <fieldset className="space-y-3">
        <legend className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          Select Mode Preference
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {modeOptions.map((opt) => {
            const isChecked = selectedPreference === opt.id;
            return (
              <label
                key={opt.id}
                className={`relative flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                  isChecked
                    ? "bg-blue-950/40 border-blue-500/80 text-white shadow-lg"
                    : "bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700"
                }`}
              >
                <input
                  type="radio"
                  name="adaptiveModePreference"
                  value={opt.id}
                  checked={isChecked}
                  onChange={() => handleOptionChange(opt.id)}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded-full border mt-0.5 shrink-0 flex items-center justify-center ${
                    isChecked
                      ? "border-blue-400 bg-blue-600"
                      : "border-slate-600 bg-slate-900"
                  }`}
                  aria-hidden="true"
                >
                  {isChecked && <Check className="w-3 h-3 text-white" />}
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold block">{opt.title}</span>
                  <p className="text-[11px] text-slate-400 leading-snug">{opt.desc}</p>
                </div>
              </label>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
