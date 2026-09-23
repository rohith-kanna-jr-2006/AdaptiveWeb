/*
 * resourceController.test.js
 * Tests for resource adaptation based on policy.
 */
describe("resourceController", () => {
  let ResourceController, resetResourceController, getResourceController;

  beforeEach(() => {
    jest.resetModules();
    const mod = jest.requireActual("../../src/adaptive/resourceController.js");
    ResourceController = mod.ResourceController;
    resetResourceController = mod.resetResourceController;
    getResourceController = mod.getResourceController;
  });

  afterEach(() => {
    resetResourceController();
  });

  describe("applyPolicy()", () => {
    it("applies a policy", () => {
      const rc = new ResourceController();
      const policy = { mode: "data-saver", imageQuality: "low", prefetch: "none", optionalFeatures: "deferred" };
      rc.applyPolicy(policy);
      expect(rc.getImageQuality()).toBe("low");
      expect(rc.getPrefetchDecision()).toBe("none");
    });

    it("ignores invalid policy", () => {
      const rc = new ResourceController();
      rc.applyPolicy(null);
      expect(rc.hasPolicy()).toBe(false);
    });
  });

  describe("default behavior", () => {
    it("returns balanced when no policy applied", () => {
      const rc = new ResourceController();
      expect(rc.getImageQuality()).toBe("medium");
    });

    it("returns default policy for UI", () => {
      const rc = new ResourceController();
      const p = rc.getPolicyForUI();
      expect(p.mode).toBe("balanced");
    });
  });

  describe("data-saver mode", () => {
    it("lowers image quality", () => {
      const rc = new ResourceController();
      rc.applyPolicy({ mode: "data-saver", imageQuality: "low", prefetch: "none", optionalFeatures: "deferred" });
      expect(rc.getImageQuality()).toBe("low");
    });
  });

  describe("full mode", () => {
    it("enables rich resources", () => {
      const rc = new ResourceController();
      rc.applyPolicy({ mode: "full", imageQuality: "high", prefetch: "enabled", optionalFeatures: "enabled" });
      expect(rc.getImageQuality()).toBe("high");
      expect(rc.getPrefetchDecision()).toBe("enabled");
    });
  });

  describe("shouldPreloadCritical()", () => {
    it("allows preload in full mode", () => {
      const rc = new ResourceController();
      rc.applyPolicy({ mode: "full" });
      expect(rc.shouldPreloadCritical()).toBe(true);
    });

    it("disallows preload in data-saver mode", () => {
      const rc = new ResourceController();
      rc.applyPolicy({ mode: "data-saver" });
      expect(rc.shouldPreloadCritical()).toBe(false);
    });
  });
});
