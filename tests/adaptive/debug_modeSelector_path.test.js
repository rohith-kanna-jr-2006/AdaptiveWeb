/**
 * DEBUG: Full ModeSelector.evaluate() path for saveData=true
 */

describe("DEBUG: ModeSelector.evaluate() full path", () => {
  let ModeSelector, HYSTERESIS;

  beforeEach(() => {
    jest.resetModules();
    const mod = jest.requireActual("D:/project from D/AdaptiveWeb/src/adaptive/modeSelector.js");
    ModeSelector = mod.ModeSelector;
    HYSTERESIS = mod.HYSTERESIS;
  });

  it("TRACES ModeSelector.evaluate() for 4g + saveData=true (first call)", () => {
    console.log("\n=== DEBUG: ModeSelector.evaluate() — 4g + saveData=true (first call) ===\n");

    const selector = new ModeSelector();
    console.log("Initial policy:", selector.getPolicy().mode);
    console.log("Initial condition:", selector.getCondition());

    const signals = {
      network: { effectiveType: "4g", rttMs: 50, downlinkMbps: 10, saveData: true },
      device: { memoryGb: 8 },
      performance: {},
    };
    const userConfig = { saveData: true };

    console.log("\nInput signals:");
    console.log("  effectiveType:", signals.network.effectiveType);
    console.log("  rttMs:", signals.network.rttMs);
    console.log("  downlinkMbps:", signals.network.downlinkMbps);
    console.log("  saveData:", signals.network.saveData);
    console.log("  userConfig.saveData:", userConfig.saveData);

    const result = selector.evaluate(signals, userConfig);

    console.log("\nResult policy:");
    console.log("  mode:", result.mode);
    console.log("  reason:", result.reason);
    console.log("  imageQuality:", result.imageQuality);

    console.log("\nFinal state:");
    console.log("  condition:", selector.getCondition());
    console.log("  currentPolicy.mode:", selector.getPolicy().mode);

    expect(result.mode).toBe("data-saver");
  });

  it("TRACES ModeSelector.evaluate() for 4g + saveData=true (second call, same signals)", () => {
    console.log("\n=== DEBUG: ModeSelector.evaluate() — 4g + saveData=true (second call) ===\n");

    const selector = new ModeSelector();

    // First call establishes the state
    const signals1 = {
      network: { effectiveType: "4g", rttMs: 50, downlinkMbps: 10, saveData: true },
      device: { memoryGb: 8 },
      performance: {},
    };
    selector.evaluate(signals1, { saveData: true });
    console.log("After first call:", selector.getPolicy().mode);

    // Second call with same signals
    const signals2 = {
      network: { effectiveType: "4g", rttMs: 50, downlinkMbps: 10, saveData: true },
      device: { memoryGb: 8 },
      performance: {},
    };
    const result = selector.evaluate(signals2, { saveData: true });

    console.log("After second call:", result.mode);
    expect(result.mode).toBe("data-saver");
  });

  it("TRACES hysteresis: 4g WITHOUT saveData (moderate classification)", () => {
    console.log("\n=== DEBUG: Hysteresis test — 4g WITHOUT saveData (should stay balanced) ===\n");

    const selector = new ModeSelector();

    // Start at balanced
    selector.reset("moderate");
    console.log("Initial:", selector.getPolicy().mode, "/", selector.getCondition());

    // Send 4g signals without saveData — classifier gives moderate, policyEngine gives balanced
    const signals = {
      network: { effectiveType: "4g", rttMs: 50, downlinkMbps: 10, saveData: false },
      device: { memoryGb: 8 },
      performance: {},
    };

    const result = selector.evaluate(signals, { saveData: false });
    console.log("After 4g (no saveData):", result.mode, "/", selector.getCondition());

    // Hysteresis requires cooldown for full upgrade. Balanced upgrade from moderate:
    // policyEngine: moderate -> balanced. Candidate mode = balanced, current = moderate.
    // balanced !== moderate, so the equal-mode check (line 134) fails.
    // Then: is it a strongDowngrade? No (current=moderate, not constrained).
    // Then: is it an upgrade to full? No (candidate=balanced).
    // Then: moderate vs balanced -> balanced is always safe? Actually line 151 says:
    // "Moderate vs balanced → balanced is always safe, but full upgrade needs hysteresis"
    // But balanced !== moderate, so this check does NOT apply — falls through to return false!
    // Wait, let me check: candidateMode = balanced, currentPolicy.mode = moderate
    // Line 133: candidateMode !== currentPolicy.mode (balanced !== moderate) → true
    // Line 134: conditionLabel === currentCondition? moderate === moderate → true
    // So line 133-138: candidateMode !== currentMode BUT conditionLabel === currentCondition
    // → returns false! 
    // This means the mode change is blocked when condition label is unchanged!

    // But the classifier returns "moderate" for 4g alone, and the policyEngine
    // maps moderate → balanced. So candidateMode=balanced, currentMode=moderate.
    // Hysteresis blocks this because label hasn't changed!

    console.log("Expected: balanced (hysteresis blocks same-label change from moderate to balanced)");
    // Actually we need to trace this more carefully...
  });

  it("TRACES the SAVE-DATA OVERRIDE path in shouldChangeMode", () => {
    console.log("\n=== DEBUG: shouldChangeMode saveData override (lines 125-130) ===\n");

    // The code says:
    // if (saveData === true) {
    //   if (candidateMode === MODES.DATA_SAVER) return true;
    //   return true;  // force downgrade
    // }
    // This ALWAYS returns true when saveData===true, regardless of candidate mode.
    // So hysteresis CANNOT block saveData.
    // Let me verify by checking the code...
    
    const selector = new ModeSelector();
    selector.reset("full"); // start at full
    console.log("Starting at:", selector.getPolicy().mode);

    const signals = {
      network: { effectiveType: "4g", rttMs: 50, downlinkMbps: 10, saveData: true },
      device: { memoryGb: 8 },
      performance: {},
    };

    const result = selector.evaluate(signals, { saveData: true });
    console.log("After saveData=true eval:", result.mode);

    // Even starting from full, saveData=true should force data-saver
    expect(result.mode).toBe("data-saver");
  });
});
