"use client";

import React from "react";
import { Gauge } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-8 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-300 text-xs font-semibold">
          <div className="p-1.5 rounded-md bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <Gauge className="w-4 h-4" aria-hidden="true" />
          </div>
          <span>AdaptiveWeb — Network- and Device-Adaptive Web Application</span>
        </div>
        <p className="text-xs text-slate-400 text-center sm:text-right">
          Frontend Developer + UI/UX + Adaptive Experience Module
        </p>
      </div>
    </footer>
  );
}
