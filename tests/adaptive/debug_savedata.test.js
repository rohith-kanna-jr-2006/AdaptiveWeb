/**
 * Temporary debug test to trace the saveData runtime path
 */

describe("DEBUG: saveData runtime path", () => {
  let buildPolicy, MODES, classify, normalizeSignals;

  beforeEach(() => {
    jest.resetModules();
    const policyMod = jest.requireActual("D:/project from D/AdaptiveWeb/src/adaptive/policyEngine.js");
    const classifyMod = jest.requireActual("D:/project from D/AdaptiveWeb/src/adaptive/classifier.js");
    const normalizeMod = jest.requireActual("D:/project from D/AdaptiveWeb/src/adaptive/normalizeSignals.js");
    buildPolicy = policyMod.buildPolicy;
    MODES = policyMod.MODES;
    classify = classifyMod.classify;
    normalizeSignals = normalizeMod.normalizeSignals;
  });

  it("TRACES the saveData=true path end-to-end", () => {
    console.log("\n=== DEBUG: saveData=true Runtime Path ===\n");

    // Simulate what a browser would report: 4g + saveData=true
    const rawSignals = {
      network: { effectiveType: "4g", rttMs: 50, downlinkMbps: 10, saveData: true },
      device: { memoryGb: 8 },
      performance: {},
    };

    console.log("1. RAW SIGNALS (what browser reports):");
    console.log(JSON.stringify(rawSignals, null, 2));

    const normalized = normalizeSignals(rawSignals);
    console.log("\n2. NORMALIZED SIGNALS:");
    console.log(JSON.stringify(normalized, null, 2));

    const classification = classify(normalized);
    console.log("\n3. CLASSIFICATION:");
    console.log("   label:", classification.label);
    console.log("   evidence:", classification.evidence);
    console.log("   conflicts:", classification.conflicts);

    const userConfig = { saveData: true };
    const userSaveData = userConfig.saveData;
    console.log("\n4. USER CONFIG:", userConfig);
    console.log("   userSaveData:", userSaveData);

    // --- buildPolicy call (same as ModeSelector.evaluate() line 75-80) ---
    const candidatePolicy = buildPolicy(classification.label, {
      userMode: undefined,
      userSaveData: userSaveData ?? undefined,
      classificationEvidence: classification.evidence,
      classificationConflicts: classification.conflicts,
    });

    console.log("\n5. CANDIDATE POLICY from buildPolicy():");
    console.log("   mode:", candidatePolicy.mode);
    console.log("   reason:", candidatePolicy.reason);

    // Now trace #shouldChangeMode logic from ModeSelector
    const currentMode = "balanced"; // assume starting from balanced
    const preferredMode = null;
    const saveData = userSaveData;

    console.log("\n6. MODE SELECTOR SHOULD-CHANGE LOGIC:");
    console.log("   candidateMode:", candidatePolicy.mode);
    console.log("   currentMode:", currentMode);
    console.log("   preferredMode:", preferredMode);
    console.log("   saveData:", saveData);

    // Simulate ModeSelector.#shouldChangeMode() (lines 116-155)
    let shouldChange = false;
    if (preferredMode) {
      shouldChange = true;
    } else if (saveData === true) {
      // Line 125-130: Save-data preference forces data-saver immediately
      if (candidatePolicy.mode === MODES.DATA_SAVER) {
        shouldChange = true;
      } else {
        shouldChange = true; // force downgrade
      }
    } else if (
      candidatePolicy.mode === currentMode &&
      classification.label === "moderate"
    ) {
      shouldChange = false;
    } else {
      shouldChange = false;
    }

    console.log("   shouldChange:", shouldChange);

    // Verify the expected invariant
    expect(candidatePolicy.mode).toBe(MODES.DATA_SAVER);
    expect(shouldChange).toBe(true);

    console.log("\n=== CONCLUSION ===");
    console.log("buildPolicy for 4g+saveData=true:", candidatePolicy.mode);
    console.log("shouldChange:", shouldChange);
    console.log("Expected: data-saver, should be true");
  });

  it("TRACES constrained label without saveData", () => {
    console.log("\n=== DEBUG: constrained label (no saveData) ===\n");

    const rawSignals = {
      network: { effectiveType: "4g", rttMs: 500, downlinkMbps: 0.5, saveData: false },
      device: { memoryGb: 4 },
      performance: {},
    };

    const normalized = normalizeSignals(rawSignals);
    const classification = classify(normalized);
    console.log("label:", classification.label);
    console.log("evidence:", classification.evidence);

    const policy = buildPolicy(classification.label, { userSaveData: undefined });
    console.log("policy mode:", policy.mode);
    expect(policy.mode).toBe(MODES.DATA_SAVER);
  });
});
