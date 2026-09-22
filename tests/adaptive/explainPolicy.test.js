/*
 * explainPolicy.test.js
 * Tests for human-readable policy explanations.
 */
describe("explainPolicy", () => {
  let explainPolicy;

  beforeEach(() => {
    jest.resetModules();
    const mod = jest.requireActual("../../src/adaptive/explainPolicy.js");
    explainPolicy = mod.explainPolicy;
  });

  it("explains balanced policy", () => {
    const text = explainPolicy({ mode: "balanced", reason: ["moderate-network"], imageQuality: "medium", prefetch: "limited" });
    expect(text).toContain("Adaptive mode: Balanced");
    expect(text).toContain("Images: Medium");
    expect(text).toContain("Prefetching: Limited");
  });

  it("explains data-saver policy", () => {
    const text = explainPolicy({ mode: "data-saver", reason: ["constrained-network"], imageQuality: "low", prefetch: "none" });
    expect(text).toContain("Data Saver");
    expect(text).toContain("Images: Low");
    expect(text).toContain("Prefetching: Disabled");
  });

  it("includes reason codes when requested", () => {
    const text = explainPolicy({ mode: "full", reason: ["capable-network"], imageQuality: "high", prefetch: "enabled" }, { includeCodes: true });
    expect(text).toContain("Reason codes: capable-network");
  });

  it("handles missing policy gracefully", () => {
    expect(explainPolicy(null)).toBe("No policy available");
  });
});
