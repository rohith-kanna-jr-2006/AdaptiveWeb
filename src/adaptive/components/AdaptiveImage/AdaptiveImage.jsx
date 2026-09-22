"use client";

import React, { useState } from "react";
import { Image as ImageIcon } from "lucide-react";
import { useAdaptive } from "@/hooks/useAdaptive";
import { CANONICAL_MODES } from "@/adaptive/integration/adaptiveAdapter";

/**
 * Reusable Adaptive Image Component (FORGEX AI 2026)
 * -------------------------------------------------------------
 * Dynamically delivers optimal asset tier depending on active adaptive policy:
 * - DATA SAVER  -> Small low-data image tier
 * - BALANCED    -> Medium quality image tier
 * - FULL        -> Large high-resolution image tier
 * 
 * Includes HTML srcset/sizes attributes, native lazy loading, and robust fallback error handling.
 */
export function AdaptiveImage({
  small,
  medium,
  large,
  src,
  fallback = "/images/placeholder.svg",
  alt = "Product image",
  className = "",
  eager = false,
  width,
  height,
  ...props
}) {
  const { activeMode } = useAdaptive();
  const [hasError, setHasError] = useState(false);

  // Determine primary source URL based on active policy mode
  let primarySrc = src || medium || small || large;
  if (activeMode === CANONICAL_MODES.DATA_SAVER) {
    primarySrc = small || medium || large || src;
  } else if (activeMode === CANONICAL_MODES.FULL) {
    primarySrc = large || medium || small || src;
  } else {
    primarySrc = medium || small || large || src;
  }

  // Build responsive srcset attribute if variants exist
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
          [Image Placeholder ({activeMode?.toUpperCase()})]
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
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onError={() => setHasError(true)}
      className={`transition-all duration-300 object-cover ${className}`}
      width={width}
      height={height}
      {...props}
    />
  );
}
