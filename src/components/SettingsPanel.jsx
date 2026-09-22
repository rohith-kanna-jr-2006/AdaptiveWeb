"use client";

import React, { useState, useEffect } from "react";
import { Settings, Info, Check } from "lucide-react";
import { useAdaptive } from "@/hooks/useAdaptive";
import { CANONICAL_MODES } from "@/adaptive/integration/adaptiveAdapter";

export function SettingsPanel() {
  const { mode, isManual, setModePreference } = useAdaptive();
  const [selectedPreference, setSelectedPreference] = useState(
    isManual ? mode : "AUTOMATIC"
  );

  useEffect(() => {
    setSelectedPreference(isManual ? mode : "AUTOMATIC");
  }, [mode, isManual]);

  const modeOptions = [
    {
      id: "AUTOMATIC",
      title: "Automatic (Recommended)",
      desc: "Engine dynamically selects optimal mode according to real-time network and device classification.",
    },
    {
      id: CANONICAL_MODES.DATA_SAVER,
      title: "Data Saver",
      desc: "Request minimum data usage, low-resolution assets, and disabled prefetching.",
    },
    {
      id: CANONICAL_MODES.BALANCED,
      title: "Balanced",
      desc: "Request balanced image quality, controlled loading, and moderate resource prefetching.",
    },
    {
      id: CANONICAL_MODES.FULL,
      title: "Full Experience",
      desc: "Request maximum quality, uncompressed assets, full prefetching, and all visual effects.",
    },
  ];

  const handleOptionChange = (optionId) => {
    setSelectedPreference(optionId);
    setModePreference(optionId);
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
              Adaptive User Settings & Development Mode Switcher
            </h2>
            <p className="text-xs text-slate-400">
              Configure adaptive engine mode request preferences and test UI reactions
            </p>
          </div>
        </div>
      </div>

      {/* Integration Notice */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-950/40 border border-blue-800/40 text-blue-200">
        <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" aria-hidden="true" />
        <div className="text-xs space-y-1">
          <p className="font-semibold text-blue-300">Adapter Interface & Dev Testing Control:</p>
          <p className="text-blue-300/80">
            Selecting a mode here sends a request through <code className="font-mono text-blue-200">useAdaptive()</code> to <code className="font-mono text-blue-200">adaptiveAdapter.js</code>. The UI responds immediately to <code className="font-mono text-blue-200">data-saver</code>, <code className="font-mono text-blue-200">balanced</code>, and <code className="font-mono text-blue-200">full</code> mode states.
          </p>
        </div>
      </div>

      {/* Radio Group Selection */}
      <fieldset className="space-y-3">
        <legend className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          Select Mode Preference / Development Mode Test
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
