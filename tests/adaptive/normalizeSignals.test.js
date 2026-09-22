/*
 * normalizeSignals.test.js
 * Tests for signal normalization: type validation, range clamping, missing data.
 */
describe("normalizeSignals", () => {
  let normalizeSignals, createEmptySignals, mergeSignals;

  beforeEach(() => {
    jest.resetModules();
    const mod = jest.requireActual("../../src/adaptive/normalizeSignals.js");
    normalizeSignals = mod.normalizeSignals;
    createEmptySignals = mod.createEmptySignals;
    mergeSignals = mod.mergeSignals;
  });

  describe("basic validation", () => {
    it("handles null/undefined input gracefully", () => {
      expect(normalizeSignals(null)).toEqual(createEmptySignals());
      expect(normalizeSignals(undefined)).toEqual(createEmptySignals());
      expect(normalizeSignals({})).toEqual(createEmptySignals());
    });

    it("handles malformed network/device objects", () => {
      const s = normalizeSignals({ network: 123, device: "bad" });
      expect(s.network.effectiveType).toBe("unknown");
      expect(s.network.rttMs).toBeNull();
    });
  });

  describe("network normalization", () => {
    it("validates effective type", () => {
      expect(normalizeSignals({ network: { effectiveType: "4g" } }).network.effectiveType).toBe("4g");
      expect(normalizeSignals({ network: { effectiveType: "5g" } }).network.effectiveType).toBe("unknown");
    });

    it("clamps RTT to valid range", () => {
      expect(normalizeSignals({ network: { effectiveType: "4g", rttMs: 15000 } }).network.rttMs).toBeNull();
      expect(normalizeSignals({ network: { effectiveType: "4g", rttMs: -100 } }).network.rttMs).toBeNull();
      expect(normalizeSignals({ network: { effectiveType: "4g", rttMs: 250 } }).network.rttMs).toBe(250);
    });

    it("clamps downlink to valid range", () => {
      expect(normalizeSignals({ network: { effectiveType: "4g", downlinkMbps: 2000 } }).network.downlinkMbps).toBeNull();
      expect(normalizeSignals({ network: { effectiveType: "4g", downlinkMbps: 0.5 } }).network.downlinkMbps).toBeNull();
    });

    it("validates saveData boolean", () => {
      expect(normalizeSignals({ network: { saveData: true } }).network.saveData).toBe(true);
      expect(normalizeSignals({ network: { saveData: false } }).network.saveData).toBe(false);
      expect(normalizeSignals({ network: { saveData: "yes" } }).network.saveData).toBeNull();
    });
  });

  describe("device normalization", () => {
    it("clamps memory to valid range", () => {
      expect(normalizeSignals({ device: { memoryGb: 1 } }).device.memoryGb).toBeNull();
      expect(normalizeSignals({ device: { memoryGb: 64 } }).device.memoryGb).toBeNull();
      expect(normalizeSignals({ device: { memoryGb: 4 } }).device.memoryGb).toBe(4);
    });

    it("clamps hardware concurrency", () => {
      expect(normalizeSignals({ device: { hardwareConcurrency: 0 } }).device.hardwareConcurrency).toBeNull();
      expect(normalizeSignals({ device: { hardwareConcurrency: 4 } }).device.hardwareConcurrency).toBe(4);
    });

    it("clamps viewport dimensions", () => {
      expect(normalizeSignals({ device: { viewportWidth: 0 } }).device.viewportWidth).toBeNull();
      expect(normalizeSignals({ device: { viewportWidth: 375 } }).device.viewportWidth).toBe(375);
    });
  });

  describe("capabilities normalization", () => {
    it("normalizes boolean capabilities", () => {
      expect(normalizeSignals({ capabilities: { networkInformationApi: true } }).capabilities.networkInformationApi).toBe(true);
      expect(normalizeSignals({ capabilities: { networkInformationApi: false } }).capabilities.networkInformationApi).toBe(false);
    });
  });

  describe("mergeSignals()", () => {
    it("returns incoming when existing is null", () => {
      const incoming = { network: { effectiveType: "4g" } };
      expect(mergeSignals(null, incoming)).toEqual(incoming);
    });

    it("prefers newer effectiveType", () => {
      const existing = { network: { effectiveType: "3g", rttMs: 200 } };
      const incoming = { network: { effectiveType: "4g", rttMs: null } };
      const merged = mergeSignals(existing, incoming);
      expect(merged.network.effectiveType).toBe("4g");
    });

    it("prefers existing when incoming is unknown", () => {
      const existing = { network: { effectiveType: "4g" } };
      const incoming = { network: { effectiveType: "unknown" } };
      expect(mergeSignals(existing, incoming).network.effectiveType).toBe("4g");
    });
  });

  describe("createEmptySignals()", () => {
    it("returns a complete empty shape", () => {
      const empty = createEmptySignals();
      expect(empty.network.effectiveType).toBe("unknown");
      expect(empty.network.rttMs).toBeNull();
      expect(empty.device.viewportWidth).toBeNull();
      expect(empty.capabilities).toEqual({ networkInformationApi: false, performanceObserver: false });
    });
  });
});
