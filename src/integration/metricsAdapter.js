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
      lcp: null,
      inp: null,
      cls: null,
      ttfb: null,
      transferSize: null,
      resourceCount: null,
    };
  },

  /**
   * Retrieve Baseline vs Adaptive comparison data provided by team integration.
   * Returns null if comparison data has not been provided by backend/test system.
   */
  getComparisonData() {
    return null;
  },
};
