describe("DEBUG: ModeSelector reset behavior", () => {
  let ModeSelector;

  beforeEach(() => {
    jest.resetModules();
    const mod = jest.requireActual("D:/project from D/AdaptiveWeb/src/adaptive/modeSelector.js");
    ModeSelector = mod.ModeSelector;
  });

  it("checks what reset('moderate') produces", () => {
    const selector = new ModeSelector();
    console.log("Initial:", selector.getPolicy().mode, "/", selector.getCondition());

    selector.reset("moderate");
    const policy = selector.getPolicy();
    const condition = selector.getCondition();
    console.log("After reset('moderate'):", policy.mode, "/", condition);

    // The reset calls buildPolicy('moderate') which returns mode: 'balanced'
    // So the mode is balanced, not moderate!
  });
});
