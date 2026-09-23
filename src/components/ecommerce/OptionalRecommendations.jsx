"use client";

import React from "react";
import { Sparkles, Info } from "lucide-react";
import { useAdaptive } from "@/hooks/useAdaptive";
import { AdaptiveImage } from "@/adaptive/components/AdaptiveImage/AdaptiveImage";

export function OptionalRecommendations({ products = [], onSelectProduct }) {
  const { config, activeMode } = useAdaptive();

  if (!config.showOptionalRecommendations) {
    return (
      <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-900/40 text-amber-300 text-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>DATA SAVER Mode Active:</strong> Optional product recommendations & media carousels are deferred to conserve bandwidth.
          </span>
        </div>
        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-950 border border-amber-800 text-amber-300">
          Deferred
        </span>
      </div>
    );
  }

  const recommendations = products.slice(0, 3);

  return (
    <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Recommended for You</h3>
            <p className="text-[11px] text-slate-400">
              Optional widget enabled in <strong className="text-slate-200">{activeMode.toUpperCase()}</strong> mode
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {recommendations.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectProduct?.(item)}
            className="group cursor-pointer p-3 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-all flex items-center gap-3"
          >
            <div className="w-14 h-14 shrink-0 overflow-hidden rounded-lg border border-slate-800 bg-slate-900">
              <AdaptiveImage
                small={item.images.small}
                medium={item.images.medium}
                large={item.images.large}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="flex-1 min-w-0 space-y-0.5">
              <h4 className="text-xs font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                {item.name}
              </h4>
              <p className="text-xs font-extrabold text-blue-400">
                ₹{item.price.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
