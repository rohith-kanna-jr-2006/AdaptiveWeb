"use client";

import React, { useState } from "react";
import { Image as ImageIcon, AlertCircle } from "lucide-react";
import { useAdaptive } from "@/hooks/useAdaptive";
import { CANONICAL_MODES } from "@/adaptive/integration/adaptiveEngineAdapter";

export function AdaptiveImage({
  small,
  medium,
  large,
  fallback = "/images/placeholder.svg",
  alt = "Adaptive image content",
  className = "",
  width,
  height,
  ...props
}) {
  const { mode } = useAdaptive();
  const [hasError, setHasError] = useState(false);

  let primarySrc = medium || small || large;
  if (mode === CANONICAL_MODES.DATA_SAVER) {
    primarySrc = small || medium || large;
  } else if (mode === CANONICAL_MODES.FULL) {
    primarySrc = large || medium || small;
  }

  const srcSetEntries = [];
  if (small) srcSetEntries.push(`${small} 400w`);
  if (medium) srcSetEntries.push(`${medium} 800w`);
  if (large) srcSetEntries.push(`${large} 1600w`);
  const srcSetString = srcSetEntries.length > 0 ? srcSetEntries.join(", ") : undefined;

  const sizesString = "(max-width: 640px) 400px, (max-width: 1024px) 800px, 1600px";

  if (hasError || !primarySrc) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center p-6 bg-slate-900/80 border border-slate-800 text-slate-400 rounded-xl min-h-[160px] ${className}`}
      >
        <ImageIcon className="w-8 h-8 text-slate-500 mb-2" aria-hidden="true" />
        <span className="text-xs font-medium text-slate-400 text-center">{alt}</span>
        <span className="text-[10px] text-slate-500 mt-1 italic">
          [Adaptive placeholder ({mode.toUpperCase()})]
        </span>
      </div>
    );
  }

  return (
    <img
      src={primarySrc}
      srcSet={srcSetString}
      sizes={sizesString}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      className={`w-full h-auto object-cover rounded-xl ${className}`}
      onError={() => setHasError(true)}
      {...props}
    />
  );
}
