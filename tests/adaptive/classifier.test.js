/*
 * classifier.test.js
 * Tests for condition classification: labels, evidence, conflicts.
 */
describe("classifier", () => {
  let classify, getClassifierThresholds, LABELS;

  beforeEach(() => {
    jest.resetModules();
    const mod = jest.requireActual("../../src/adaptive/classifier.js");
    classify = mod.classify;
    getClassifierThresholds = mod.getClassifierThresholds;
    LABELS = mod.LABELS;
  });

  describe("basic classification", () => {
    it("returns unknown for null/undefined signals", () => {
      const r1 = classify(null);
      expect(r1.label).toBe(LABELS.UNKNOWN);
      expect(r1.evidence.length).toBeGreaterThan(0);

      const r2 = classify(undefined);
      expect(r2.label).toBe(LABELS.UNKNOWN);
    });

    it("returns unknown for empty signals", () => {
      const r = classify({});
      expect(r.label).toBe(LABELS.UNKNOWN);
    });

    it("handles missing network object", () => {
      const r = classify({ device: {} });
      expect(r.label).toBe(LABELS.UNKNOWN);
    });
  });

  describe("saveData classification", () => {
    it("forces constrained when saveData is true", () => {
      const r = classify({ network: { saveData: true, effectiveType: "4g" } });
      expect(r.label).toBe(LABELS.CONSTRAINED);
      expect(r.evidence.some(e => e.includes("save-data"))).toBe(true);
    });

    it("does not force constrained when saveData is false", () => {
      const r = classify({ network: { saveData: false, effectiveType: "4g" } });
      expect(r.label).not.toBe(LABELS.CONSTRAINED);
    });
  });

  describe("effectiveType classification", () => {
    it("classifies slow-2g and 2g as constrained", () => {
      expect(classify({ network: { effectiveType: "slow-2g" } }).label).toBe(LABELS.CONSTRAINED);
      expect(classify({ network: { effectiveType: "2g" } }).label).toBe(LABELS.CONSTRAINED);
    });

    it("classifies 4g with no other signals as moderate (not capable)", () => {
      expect(classify({ network: { effectiveType: "4g" } }).label).toBe(LABELS.MODERATE);
    });

    it("classifies 3g as moderate", () => {
      expect(classify({ network: { effectiveType: "3g" } }).label).toBe(LABELS.MODERATE);
    });

    it("classifies unknown effectiveType as moderate fallback", () => {
      expect(classify({ network: { effectiveType: "unknown" } }).label).toBe(LABELS.UNKNOWN);
    });
  });

  describe("RTT and downlink thresholds", () => {
    it("classifies high RTT as constrained", () => {
      const thresholds = getClassifierThresholds();
      const r = classify({ network: { effectiveType: "4g", rttMs: thresholds.RTT_CONSTRAINED_MS + 100 } });
      expect(r.label).toBe(LABELS.CONSTRAINED);
      expect(r.evidence.some(e => e.includes("RTT"))).toBe(true);
    });

    it("classifies moderate RTT appropriately", () => {
      const thresholds = getClassifierThresholds();
      const r = classify({ network: { effectiveType: "4g", rttMs: thresholds.RTT_MODERATE_MS + 50 } });
      expect(r.label).toBe(LABELS.MODERATE);
    });

    it("classifies low downlink as constrained", () => {
      const thresholds = getClassifierThresholds();
      const r = classify({ network: { effectiveType: "4g", downlinkMbps: thresholds.DOWNLINK_CONSTRAINED_MBPS - 0.5 } });
      expect(r.label).toBe(LABELS.CONSTRAINED);
    });
  });

  describe("conflict detection", () => {
    it("classifies conflicting signals as moderate", () => {
      // Positive signals (4g, good downlink) but explicit save-data = true
      const r = classify({ network: { effectiveType: "4g", downlinkMbps: 10, saveData: true } });
      expect(r.label).toBe(LABELS.CONSTRAINED); // saveData wins
      expect(r.conflicts.length).toBeGreaterThan(0);
    });

    it("reports conflicts in evidence", () => {
      const r = classify({ network: { effectiveType: "4g", downlinkMbps: 10 }, device: { memoryGb: 0.5 } });
      expect(r.conflicts.length).toBeGreaterThan(0);
    });
  });

  describe("device signals", () => {
    it("classifies low memory as constrained", () => {
      const thresholds = getClassifierThresholds();
      const r = classify({ network: { effectiveType: "4g" }, device: { memoryGb: thresholds.MEMORY_CONSTRAINED_GB - 1 } });
      expect(r.label).toBe(LABELS.CONSTRAINED);
    });

    it("classifies adequate memory as moderate or capable", () => {
      expect(classify({ network: { effectiveType: "4g" }, device: { memoryGb: 8 } }).label).toBe(LABELS.CAPABLE);
      expect(classify({ network: { effectiveType: "3g" }, device: { memoryGb: 4 } }).label).toBe(LABELS.MODERATE);
    });
  });

  describe("performance signals", () => {
    it("classifies poor LCP as constrained", () => {
      const r = classify({ network: { effectiveType: "4g" }, performance: { lcpMs: 5000 } });
      expect(r.label).toBe(LABELS.CONSTRAINED);
      expect(r.evidence.some(e => e.includes("LCP"))).toBe(true);
    });

    it("does not downgrade on good LCP", () => {
      expect(classify({ network: { effectiveType: "4g" }, performance: { lcpMs: 1000 } }).label).toBe(LABELS.CAPABLE);
    });
  });

  describe("combined evidence", () => {
    it("applies strong negative evidence from multiple signals", () => {
      const r = classify({
        network: { effectiveType: "3g", rttMs: 400, downlinkMbps: 1, saveData: false },
        device: { memoryGb: 1 },
      });
      expect(r.label).toBe(LABELS.CONSTRAINED);
    });

    it("applies strong positive evidence from multiple signals", () => {
      const r = classify({
        network: { effectiveType: "4g", rttMs: 50, downlinkMbps: 20 },
        device: { memoryGb: 8 },
      });
      expect(r.label).toBe(LABELS.CAPABLE);
    });
  });
});
