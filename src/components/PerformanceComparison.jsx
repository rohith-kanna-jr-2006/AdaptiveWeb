"use client";

import React from "react";
import { BarChart2, Info } from "lucide-react";

export function PerformanceComparison({ comparisonData }) {
  if (!comparisonData || !Array.isArray(comparisonData) || comparisonData.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <BarChart2 className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Baseline vs Adaptive Performance Comparison
            </h2>
            <p className="text-xs text-slate-400">
              Comparative benchmark results from backend test system
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center p-8 bg-slate-950/60 rounded-xl border border-slate-800/80 text-center space-y-2">
          <Info className="w-6 h-6 text-slate-500" aria-hidden="true" />
          <p className="text-sm font-semibold text-slate-400">
            Comparison data not available yet.
          </p>
          <p className="text-xs text-slate-400 max-w-md">
            Baseline measurements will appear here once benchmarking data is supplied by Nishaanth / Praveen's test harness.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
        <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
          <BarChart2 className="w-5 h-5" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">
            Baseline vs Adaptive Performance Comparison
          </h2>
          <p className="text-xs text-slate-400">
            Comparative measurements provided by backend/test system
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
              <th className="py-2.5 px-3">Metric</th>
              <th className="py-2.5 px-3">Baseline</th>
              <th className="py-2.5 px-3">Adaptive</th>
              <th className="py-2.5 px-3">Difference</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {comparisonData.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-950/40">
                <td className="py-3 px-3 font-semibold text-slate-200">{row.metric}</td>
                <td className="py-3 px-3 text-slate-400">{row.baseline}</td>
                <td className="py-3 px-3 font-bold text-emerald-400">{row.adaptive}</td>
                <td className="py-3 px-3 text-slate-300 font-mono">{row.improvement}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
