"use client";

import React from "react";
import { Gauge, Clock, Zap, ArrowDown, FileCode, Layers } from "lucide-react";
import { MetricCard } from "./MetricCard";

export function PerformanceDashboard({ metrics }) {
  const { lcp, inp, cls, ttfb, transferSize, resourceCount } = metrics || {};

  const dashboardItems = [
    {
      title: "LCP (Largest Contentful Paint)",
      value: lcp,
      description: "Render time of largest visual element",
      icon: Gauge,
    },
    {
      title: "INP (Interaction to Next Paint)",
      value: inp,
      description: "Latency of user interactions",
      icon: Zap,
    },
    {
      title: "CLS (Cumulative Layout Shift)",
      value: cls,
      description: "Visual stability score during load",
      icon: Layers,
    },
    {
      title: "TTFB (Time to First Byte)",
      value: ttfb,
      description: "Server response latency",
      icon: Clock,
    },
    {
      title: "Transfer Size",
      value: transferSize,
      description: "Total bytes downloaded across wire",
      icon: ArrowDown,
    },
    {
      title: "Resource Count",
      value: resourceCount,
      description: "Total network requests fetched",
      icon: FileCode,
    },
  ];

  return (
    <div id="dashboard" className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <Gauge className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Performance Dashboard
            </h2>
            <p className="text-xs text-slate-400">
              Real-time browser performance & Web Vitals measurements
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {dashboardItems.map((item, idx) => (
          <MetricCard
            key={idx}
            title={item.title}
            value={item.value}
            description={item.description}
            icon={item.icon}
          />
        ))}
      </div>
    </div>
  );
}
