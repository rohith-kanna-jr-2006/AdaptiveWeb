describe("DEBUG: ModeSelector reset — condition vs mode", () => {
  let ModeSelector, buildPolicy, MODES;

  beforeEach(() => {
    jest.resetModules();
    const policyMod = jest.requireActual("D:/project from D/AdaptiveWeb/src/adaptive/policyEngine.js");
    const mod = jest.requireActual("D:/project from D/AdaptiveWeb/src/adaptive/modeSelector.js");
    buildPolicy = policyMod.buildPolicy;
    MODES = policyMod.MODES;
    ModeSelector = mod.ModeSelector;
  });

  it("compares reset condition vs policy mode", () => {
    const selector = new ModeSelector();

    // reset("capable") should set condition to "capable" and policy mode to "full"
    selector.reset("capable");
    console.log("Condition:", selector.getCondition());
    console.log("Policy mode:", selector.getPolicy().mode);

    // What does buildPolicy("capable") return?
    const p = buildPolicy("capable");
    console.log("buildPolicy('capable').mode:", p.mode);

    // The test checks getCondition() === "capable" which is the LABEL
    // The policy mode is "full" which is the actual adaptive mode
    // This is the disconnect: condition label ≠ policy mode!
  });
});
