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

  getComparisonData() {
    return null;
  },
};
