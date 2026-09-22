/*
 * policyEngine.test.js
 * Tests for policy building, validation, mode mapping.
 */
describe("policyEngine", () => {
  let buildPolicy, validatePolicy, getSchemaVersion, MODES, IMAGE_QUALITY, PREFETCH, OPTIONAL_FEATURES;

  beforeEach(() => {
    jest.resetModules();
    const mod = jest.requireActual("../../src/adaptive/policyEngine.js");
    buildPolicy = mod.buildPolicy;
    validatePolicy = mod.validatePolicy;
    getSchemaVersion = mod.getSchemaVersion;
    MODES = mod.MODES;
    IMAGE_QUALITY = mod.IMAGE_QUALITY;
    PREFETCH = mod.PREFETCH;
    OPTIONAL_FEATURES = mod.OPTIONAL_FEATURES;
  });

  describe("buildPolicy()", () => {
    it("maps constrained condition to data-saver mode", () => {
      const p = buildPolicy("constrained");
      expect(p.mode).toBe(MODES.DATA_SAVER);
      expect(p.imageQuality).toBe(IMAGE_QUALITY.LOW);
      expect(p.prefetch).toBe(PREFETCH.NONE);
      expect(p.optionalFeatures).toBe(OPTIONAL_FEATURES.DEFERRED);
    });

    it("maps moderate condition to balanced mode", () => {
      const p = buildPolicy("moderate");
      expect(p.mode).toBe(MODES.BALANCED);
      expect(p.imageQuality).toBe(IMAGE_QUALITY.MEDIUM);
      expect(p.prefetch).toBe(PREFETCH.LIMITED);
      expect(p.optionalFeatures).toBe(OPTIONAL_FEATURES.ON_DEMAND);
    });

    it("maps capable condition to full mode", () => {
      const p = buildPolicy("capable");
      expect(p.mode).toBe(MODES.FULL);
      expect(p.imageQuality).toBe(IMAGE_QUALITY.HIGH);
      expect(p.prefetch).toBe(PREFETCH.ENABLED);
      expect(p.optionalFeatures).toBe(OPTIONAL_FEATURES.ENABLED);
    });

    it("falls back to balanced for unknown condition", () => {
      const p = buildPolicy("unknown");
      expect(p.mode).toBe(MODES.BALANCED);
    });

    it("includes reason codes from classification", () => {
      const p = buildPolicy("constrained", { classificationEvidence: ["high latency"] });
      expect(p.reason.length).toBeGreaterThan(0);
    });

    it("includes reason codes for signal-conflict", () => {
      const p = buildPolicy("moderate", { classificationConflicts: ["conflicting signals"] });
      expect(p.reason.some(r => r === "signal-conflict")).toBe(true);
    });
  });

  describe("user preference override", () => {
    it("respects user-selected mode override", () => {
      const p = buildPolicy("constrained", { userMode: MODES.FULL });
      expect(p.mode).toBe(MODES.FULL);
      expect(p.reason.some(r => r === "user-selected-mode")).toBe(true);
    });

    it("respects saveData preference", () => {
      const p = buildPolicy("moderate", { userSaveData: true });
      expect(p.mode).toBe(MODES.DATA_SAVER);
      expect(p.reason.some(r => r === "user-save-data-preference")).toBe(true);
    });

    it("saveData overrides existing mode", () => {
      const p = buildPolicy("capable", { userSaveData: true });
      expect(p.mode).toBe(MODES.DATA_SAVER);
    });
  });

  describe("policy schema", () => {
    it("has version 1", () => {
      expect(getSchemaVersion()).toBe(1);
    });

    it("includes all required fields", () => {
      const p = buildPolicy("balanced");
      expect(p).toHaveProperty("mode");
      expect(p).toHaveProperty("imageQuality");
      expect(p).toHaveProperty("prefetch");
      expect(p).toHaveProperty("optionalFeatures");
      expect(p).toHaveProperty("reason");
      expect(p).toHaveProperty("schemaVersion");
      expect(p).toHaveProperty("revision");
    });

    it("validates correctly structured policy", () => {
      const p = buildPolicy("balanced");
      expect(validatePolicy(p)).toBe(true);
    });

    it("rejects invalid mode", () => {
      expect(validatePolicy({ ...buildPolicy("balanced"), mode: "invalid" })).toBe(false);
    });

    it("rejects missing required fields", () => {
      expect(validatePolicy({ mode: "balanced" })).toBe(false);
    });

    it("rejects null policy", () => {
      expect(validatePolicy(null)).toBe(false);
    });

    it("rejects non-object policy", () => {
      expect(validatePolicy("not a policy")).toBe(false);
    });
  });
});
