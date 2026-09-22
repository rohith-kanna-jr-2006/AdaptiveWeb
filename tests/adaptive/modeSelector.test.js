/*
 * modeSelector.test.js
 * Tests for mode selection, hysteresis, stability rules.
 */
describe("modeSelector", () => {
  let ModeSelector, HYSTERESIS;

  beforeEach(() => {
    jest.resetModules();
    const mod = jest.requireActual("../../src/adaptive/modeSelector.js");
    ModeSelector = mod.ModeSelector;
    HYSTERESIS = mod.HYSTERESIS;
  });

  describe("construction", () => {
    it("creates a ModeSelector instance", () => {
      const selector = new ModeSelector();
      expect(selector).toBeDefined();
    });

    it("accepts initial policy", () => {
      const initial = { mode: "balanced", imageQuality: "medium", prefetch: "limited" };
      const selector = new ModeSelector(initial);
      expect(selector.getPolicy()).toEqual(expect.objectContaining({ mode: "balanced" }));
    });
  });

  describe("evaluate()", () => {
    it("evaluates signals and returns a policy", () => {
      const selector = new ModeSelector();
      const signals = {
        network: { effectiveType: "4g", rttMs: 50, downlinkMbps: 10, saveData: false },
        device: { memoryGb: 4 },
        performance: {},
      };
      const policy = selector.evaluate(signals);
      expect(policy).toHaveProperty("mode");
      expect(policy).toHaveProperty("imageQuality");
    });

    it("returns data-saver for constrained network", () => {
      const selector = new ModeSelector();
      const signals = {
        network: { effectiveType: "2g", rttMs: 500, downlinkMbps: 0.5 },
      };
      const policy = selector.evaluate(signals);
      expect(policy.mode).toBe("data-saver");
    });

    it("returns full for capable network", () => {
      const selector = new ModeSelector();
      const signals = {
        network: { effectiveType: "4g", rttMs: 50, downlinkMbps: 10, saveData: false },
        device: { memoryGb: 8 },
      };
      const policy = selector.evaluate(signals);
      expect(policy.mode).toBe("full");
    });

    it("returns balanced for moderate network", () => {
      const selector = new ModeSelector();
      const signals = {
        network: { effectiveType: "3g", rttMs: 200, downlinkMbps: 2 },
      };
      const policy = selector.evaluate(signals);
      expect(policy.mode).toBe("balanced");
    });
  });

  describe("user override", () => {
    it("respects userMode preference", () => {
      const selector = new ModeSelector();
      const signals = {
        network: { effectiveType: "2g", rttMs: 500, downlinkMbps: 0.5 },
      };
      const policy = selector.evaluate(signals, { preferredMode: "full" });
      expect(policy.mode).toBe("full");
    });

    it("respects saveData user preference", () => {
      const selector = new ModeSelector();
      const signals = {
        network: { effectiveType: "4g", rttMs: 50, downlinkMbps: 10 },
      };
      const policy = selector.evaluate(signals, { saveData: true });
      expect(policy.mode).toBe("data-saver");
    });
  });

  describe("policy listener", () => {
    it("notifies listeners on policy change", () => {
      const selector = new ModeSelector();
      const listener = jest.fn();
      selector.onPolicyUpdate(listener);

      const signals = {
        network: { effectiveType: "2g", rttMs: 500 },
      };
      selector.evaluate(signals);

      expect(listener).toHaveBeenCalled();
    });
  });

  describe("hysteresis config", () => {
    it("exposes hysteresis configuration", () => {
      const selector = new ModeSelector();
      const config = selector.getHysteresisConfig();
      expect(config).toHaveProperty("COOLDOWN_MS");
      expect(config).toHaveProperty("MINIMUM_OBSERVATIONS");
      expect(config).toHaveProperty("UPGRADE_DELAY_MS");
    });
  });

  describe("reset()", () => {
    it("resets to a known state", () => {
      const selector = new ModeSelector();
      selector.reset("capable");
      expect(selector.getCondition()).toBe("capable");
    });
  });

  describe("getPolicy()", () => {
    it("returns current policy without evaluating", () => {
      const selector = new ModeSelector();
      const policy = selector.getPolicy();
      expect(policy).toHaveProperty("mode");
      expect(policy).toHaveProperty("reason");
      expect(policy).toHaveProperty("schemaVersion");
    });
  });
});
