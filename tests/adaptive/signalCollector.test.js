/*
 * signalCollector.test.js
 * Tests for signal collection, feature detection, defensive coding.
 */
describe("signalCollector", () => {
  let collectSignals, collectSignalsWithPerformance, createPerformanceObserver;

  beforeEach(() => {
    jest.resetModules();
    const windowSpy = { innerWidth: 1920, innerHeight: 1080, addEventListener: jest.fn(), removeEventListener: jest.fn() };
    const navigatorSpy = { connection: null, deviceMemory: null, hardwareConcurrency: null, saveData: undefined, mozConnection: null, webkitConnection: null };
    Object.defineProperty(global, "window", { value: windowSpy, writable: true });
    Object.defineProperty(global, "navigator", { value: navigatorSpy, writable: true });
    Object.defineProperty(global, "PerformanceObserver", { value: undefined, writable: true });

    const mod = jest.requireActual("../../src/adaptive/signalCollector.js");
    collectSignals = mod.collectSignals;
    collectSignalsWithPerformance = mod.collectSignalsWithPerformance;
    createPerformanceObserver = mod.createPerformanceObserver;
  });

  describe("collectSignals()", () => {
    it("returns a normalized shape with all sections", () => {
      const s = collectSignals();
      expect(s).toHaveProperty("collectedAt");
      expect(s).toHaveProperty("network");
      expect(s).toHaveProperty("device");
      expect(s).toHaveProperty("capabilities");
      expect(s).toHaveProperty("performance");
    });

    it("returns valid timestamp", () => {
      expect(typeof collectSignals().collectedAt).toBe("string");
    });
  });

  describe("network signals", () => {
    it("detects effective type", () => {
      global.navigator.connection = { effectiveType: "4g", rtt: 50, downlink: 10 };
      const s = collectSignals();
      expect(s.network.effectiveType).toBe("4g");
      expect(s.network.rttMs).toBe(50);
      expect(s.network.downlinkMbps).toBe(10);
    });

    it("returns unknown for effective type when no connection", () => {
      global.navigator.connection = null;
      expect(collectSignals().network.effectiveType).toBe("unknown");
    });

    it("returns null for negative/invalid numeric values", () => {
      global.navigator.connection = { rtt: -1, downlink: -5 };
      const s = collectSignals();
      expect(s.network.rttMs).toBeNull();
      expect(s.network.downlinkMbps).toBeNull();
    });

    it("returns null for non-number values", () => {
      global.navigator.connection = { rtt: "fast", downlink: "10" };
      const s = collectSignals();
      expect(s.network.rttMs).toBeNull();
      expect(s.network.downlinkMbps).toBeNull();
    });

    it("detects saveData boolean", () => {
      global.navigator.connection = { saveData: true };
      expect(collectSignals().network.saveData).toBe(true);
      global.navigator.connection = { saveData: false };
      expect(collectSignals().network.saveData).toBe(false);
    });

    it("returns null for non-boolean saveData", () => {
      global.navigator.connection = { saveData: "yes" };
      expect(collectSignals().network.saveData).toBeNull();
    });
  });

  describe("device signals", () => {
    it("reads device memory", () => {
      global.navigator.deviceMemory = 8;
      expect(collectSignals().device.memoryGb).toBe(8);
    });

    it("returns null for invalid memory", () => {
      global.navigator.deviceMemory = -1;
      expect(collectSignals().device.memoryGb).toBeNull();
      global.navigator.deviceMemory = 1e10;
      expect(collectSignals().device.memoryGb).toBeNull();
      global.navigator.deviceMemory = "8";
      expect(collectSignals().device.memoryGb).toBeNull();
    });

    it("reads hardware concurrency", () => {
      global.navigator.hardwareConcurrency = 8;
      expect(collectSignals().device.hardwareConcurrency).toBe(8);
    });

    it("returns null for zero concurrency", () => {
      global.navigator.hardwareConcurrency = 0;
      expect(collectSignals().device.hardwareConcurrency).toBeNull();
    });
  });

  describe("viewport signals", () => {
    it("reads viewport dimensions", () => {
      global.window.innerWidth = 1920;
      global.window.innerHeight = 1080;
      const s = collectSignals();
      expect(s.device.viewportWidth).toBe(1920);
      expect(s.device.viewportHeight).toBe(1080);
    });

    it("returns null for invalid dimensions", () => {
      global.window.innerWidth = 0;
      global.window.innerHeight = 0;
      const s = collectSignals();
      expect(s.device.viewportWidth).toBeNull();
      expect(s.device.viewportHeight).toBeNull();
    });
  });

  describe("capabilities", () => {
    it("detects network information API support", () => {
      global.navigator.connection = { effectiveType: "4g" };
      expect(collectSignals().capabilities.networkInformationApi).toBe(true);
      global.navigator.connection = null;
      expect(collectSignals().capabilities.networkInformationApi).toBe(false);
    });

    it("detects performance observer support", () => {
      Object.defineProperty(global, "PerformanceObserver", {
        value: class MockPO { observe() {} disconnect() {} },
        writable: true,
      });
      expect(collectSignals().capabilities.performanceObserver).toBe(true);
    });

    it("reports false when performance observer unavailable", () => {
      Object.defineProperty(global, "PerformanceObserver", { value: undefined, writable: true });
      expect(collectSignals().capabilities.performanceObserver).toBe(false);
    });
  });

  describe("collectSignalsWithPerformance()", () => {
    it("merges performance snapshot", () => {
      global.navigator.connection = { effectiveType: "4g" };
      const s = collectSignalsWithPerformance({ lcpMs: 2500, inpMs: 45, cls: 0.1 });
      expect(s.performance.lcpMs).toBe(2500);
      expect(s.performance.inpMs).toBe(45);
      expect(s.performance.cls).toBe(0.1);
    });

    it("preserves null performance when no snapshot", () => {
      global.navigator.connection = { effectiveType: "4g" };
      const s = collectSignalsWithPerformance();
      expect(s.performance.lcpMs).toBeNull();
      expect(s.performance.inpMs).toBeNull();
      expect(s.performance.cls).toBeNull();
    });
  });

  describe("createPerformanceObserver()", () => {
    it("returns no-op handle when PerformanceObserver unavailable", () => {
      const h = createPerformanceObserver(["web-vitals"], () => {});
      expect(h.supported).toBe(false);
      expect(typeof h.observe).toBe("function");
      expect(typeof h.disconnect).toBe("function");
      h.observe(); // no throw
      h.disconnect(); // no throw
    });

    it("returns real handle when available", () => {
      const cb = jest.fn();
      Object.defineProperty(global, "PerformanceObserver", {
        value: class MockPO { observe() {} disconnect() {} },
        writable: true,
      });
      const h = createPerformanceObserver(["web-vitals"], cb);
      expect(h.supported).toBe(true);
    });
  });

  describe("non-browser environment", () => {
    it("handles undefined window gracefully", () => {
      Object.defineProperty(global, "window", { value: undefined, writable: true });
      const s = collectSignals();
      expect(s).toBeDefined();
      expect(s.device.viewportWidth).toBeNull();
    });

    it("handles undefined navigator gracefully", () => {
      Object.defineProperty(global, "navigator", { value: undefined, writable: true });
      const s = collectSignals();
      expect(s).toBeDefined();
      expect(s.network.effectiveType).toBe("unknown");
    });
  });
});
