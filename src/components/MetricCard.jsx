"use client";

import React from "react";
import { Activity } from "lucide-react";

export function MetricCard({ title, value, description, icon: Icon = Activity }) {
  const isNotMeasured =
    value === null ||
    value === undefined ||
    value === "Not measured yet" ||
    value === "Performance measurement available after test";

  return (
    <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        <Icon className="w-4 h-4 text-slate-500" aria-hidden="true" />
      </div>

      <div>
        <div
          className={`text-xl font-extrabold tracking-tight ${
            isNotMeasured ? "text-slate-500 text-xs font-normal italic" : "text-white"
          }`}
        >
          {isNotMeasured
            ? "Performance measurement available after test"
            : typeof value === "object"
            ? value.formatted || JSON.stringify(value)
            : value}
        </div>
        {description && <p className="text-[11px] text-slate-400 mt-1">{description}</p>}
      </div>
    </div>
  );
}
