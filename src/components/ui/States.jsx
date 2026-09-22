"use client";

import React from "react";
import { Loader2, AlertTriangle, Inbox } from "lucide-react";

/**
 * Standard Loading State Component
 */
export function LoadingState({ message = "Detecting environment..." }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center p-8 bg-slate-900/40 rounded-xl border border-slate-800 text-slate-300 min-h-[160px]"
    >
      <Loader2 className="w-7 h-7 animate-spin text-blue-400 mb-3" aria-hidden="true" />
      <p className="text-sm font-medium text-slate-300">{message}</p>
    </div>
  );
}

/**
 * Standard Empty State Component
 */
export function EmptyState({ message = "Adaptive policy information is not available yet." }) {
  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center p-8 bg-slate-900/40 rounded-xl border border-slate-800 text-slate-400 min-h-[160px]"
    >
      <Inbox className="w-8 h-8 text-slate-500 mb-3" aria-hidden="true" />
      <p className="text-sm text-slate-400 text-center max-w-md">{message}</p>
    </div>
  );
}

/**
 * Standard Error State Component with optional Retry action
 */
export function ErrorState({
  message = "Unable to retrieve adaptive policy.",
  onRetry,
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center p-8 bg-rose-950/20 rounded-xl border border-rose-900/40 text-rose-300 min-h-[160px]"
    >
      <AlertTriangle className="w-8 h-8 text-rose-400 mb-3" aria-hidden="true" />
      <p className="text-sm font-medium text-rose-200 text-center mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          type="button"
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-rose-900/60 hover:bg-rose-800 text-rose-100 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500"
        >
          Retry
        </button>
      )}
    </div>
  );
}
