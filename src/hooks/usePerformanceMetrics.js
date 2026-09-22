"use client";

import { useState, useEffect } from "react";
import { metricsAdapter } from "@/adapters/metricsAdapter";

/**
 * Hook to retrieve REAL measured performance metrics from the browser PerformanceObserver / Performance Navigation APIs.
 * Displays "Not measured yet" before real values exist. Never fabricates numbers.
 */
export function usePerformanceMetrics() {
  const [metrics, setMetrics] = useState(metricsAdapter.getInitialMetrics());
  const [comparison, setComparison] = useState(metricsAdapter.getComparisonData());

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Gather real PerformanceNavigationTiming metrics if available
    const measureNavigationMetrics = () => {
      try {
        const perfEntries = performance.getEntriesByType("navigation");
        if (perfEntries && perfEntries.length > 0) {
          const navTiming = perfEntries[0];

          // TTFB (Time to First Byte = responseStart - requestStart or responseStart)
          const ttfbVal = Math.round(navTiming.responseStart - (navTiming.requestStart || 0));
          const formattedTtfb = ttfbVal > 0 ? `${ttfbVal} ms` : null;

          // Transfer size & resource count
          const transferBytes = navTiming.transferSize || 0;
          const formattedTransfer =
            transferBytes > 0
              ? transferBytes > 1024 * 1024
                ? `${(transferBytes / (1024 * 1024)).toFixed(2)} MB`
                : `${(transferBytes / 1024).toFixed(1)} KB`
              : null;

          const resourceEntries = performance.getEntriesByType("resource");
          const totalResources = resourceEntries ? resourceEntries.length + 1 : 1;

          setMetrics((prev) => ({
            ...prev,
            ttfb: formattedTtfb ? { value: ttfbVal, formatted: formattedTtfb } : prev.ttfb,
            transferSize: formattedTransfer ? { bytes: transferBytes, formatted: formattedTransfer } : prev.transferSize,
            resourceCount: totalResources || prev.resourceCount,
          }));
        }
      } catch (err) {
        console.warn("Performance timing reading warning:", err);
      }
    };

    // Attempt initial measurement after load event
    if (document.readyState === "complete") {
      measureNavigationMetrics();
    } else {
      window.addEventListener("load", measureNavigationMetrics);
    }

    // Observe LCP using PerformanceObserver if available
    let lcpObserver = null;
    if ("PerformanceObserver" in window) {
      try {
        lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          if (lastEntry) {
            const lcpSec = (lastEntry.startTime / 1000).toFixed(2);
            setMetrics((prev) => ({
              ...prev,
              lcp: { value: lastEntry.startTime, formatted: `${lcpSec} s` },
            }));
          }
        });
        lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });
      } catch (e) {
        // LCP observer not supported or restricted
      }
    }

    return () => {
      window.removeEventListener("load", measureNavigationMetrics);
      if (lcpObserver) lcpObserver.disconnect();
    };
  }, []);

  return { metrics, comparison };
}
