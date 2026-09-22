/**
 * METRICS ADAPTER LAYER (TEMPORARY MOCK / INTERFACE)
 * -------------------------------------------------------------
 * Note: Nishaanth owns performance metrics and baseline measurement integration.
 * Praveen owns backend API contracts.
 * 
 * Rules:
 * - Do NOT fabricate performance metrics (LCP, INP, CLS, TTFB, Transfer size, Resource count).
 * - Before real measurements arrive, return null so UI displays "Not measured yet".
 * - If baseline vs adaptive comparison data is absent, return null so UI displays "Comparison data not available yet."
 */

export const metricsAdapter = {
  /**
   * Get initial real measurement values or null.
   */
  getInitialMetrics() {
    return {
      lcp: null, // e.g. { value: 1420, formatted: "1.42 s" }
      inp: null, // e.g. { value: 82, formatted: "82 ms" }
      cls: null, // e.g. { value: 0.02, formatted: "0.02" }
      ttfb: null, // e.g. { value: 310, formatted: "310 ms" }
      transferSize: null, // e.g. { bytes: 1887436, formatted: "1.8 MB" }
      resourceCount: null, // e.g. 42
    };
  },

  /**
   * Retrieve Baseline vs Adaptive comparison data provided by team integration.
   * Returns null if comparison data has not been provided by backend/test system.
   */
  getComparisonData() {
    // Return null when real backend/test system measurements are unavailable
    return null;
  },
};
