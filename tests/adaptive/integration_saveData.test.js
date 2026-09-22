describe("DEBUG: Full saveData=true integration", () => {
  let ModeSelector, buildPolicy, MODES;

  beforeEach(() => {
    jest.resetModules();
    const policyMod = jest.requireActual("D:/project from D/AdaptiveWeb/src/adaptive/policyEngine.js");
    const mod = jest.requireActual("D:/project from D/AdaptiveWeb/src/adaptive/modeSelector.js");
    ModeSelector = mod.ModeSelector;
    buildPolicy = policyMod.buildPolicy;
    MODES = policyMod.MODES;
  });

  it("saveData=true → data-saver from ModeSelector.evaluate() with 4g", () => {
    const selector = new ModeSelector();
    
    // First evaluate with 4g + saveData=true
    const signals1 = {
      network: { effectiveType: "4g", rttMs: 50, downlinkMbps: 10, saveData: true },
      device: { memoryGb: 8 },
      performance: {},
    };
    
    console.log("\n=== First evaluate() ===");
    const result1 = selector.evaluate(signals1, { saveData: true });
    console.log("result.mode:", result1.mode);
    console.log("getPolicy().mode after:", selector.getPolicy().mode);
    
    expect(result1.mode).toBe("data-saver");
    expect(selector.getPolicy().mode).toBe("data-saver");
    
    // Second evaluate with same signals
    console.log("\n=== Second evaluate() ===");
    const result2 = selector.evaluate(signals1, { saveData: true });
    console.log("result.mode:", result2.mode);
    expect(result2.mode).toBe("data-saver");
  });

  it("saveData=false → balanced from ModeSelector.evaluate() with 4g", () => {
    const selector = new ModeSelector();
    
    const signals = {
      network: { effectiveType: "4g", rttMs: 50, downlinkMbps: 10, saveData: false },
      device: { memoryGb: 8 },
      performance: {},
    };
    
    console.log("\n=== evaluate() with saveData=false ===");
    const result = selector.evaluate(signals, { saveData: false });
    console.log("result.mode:", result.mode);
    console.log("getPolicy().mode:", selector.getPolicy().mode);
    
    // 4g alone → classifier → moderate → policyEngine → balanced
    expect(result.mode).toBe("balanced");
  });

  it("saveData overrides balanced → data-saver even when already balanced", () => {
    const selector = new ModeSelector();
    selector.reset("moderate"); // starts at balanced
    console.log("\n=== Starting at balanced mode ===");
    console.log("Initial:", selector.getPolicy().mode);
    
    const signals = {
      network: { effectiveType: "4g", rttMs: 50, downlinkMbps: 10, saveData: true },
      device: { memoryGb: 8 },
      performance: {},
    };
    
    const result = selector.evaluate(signals, { saveData: true });
    console.log("After saveData=true:", result.mode);
    expect(result.mode).toBe("data-saver");
  });
});
