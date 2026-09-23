describe("DEBUG: Classifier classification logic", () => {
  let classify, LABELS;

  beforeEach(() => {
    jest.resetModules();
    const mod = jest.requireActual("D:/project from D/AdaptiveWeb/src/adaptive/classifier.js");
    classify = mod.classify;
    LABELS = mod.LABELS;
  });

  it("checks 3g with memory=4GB", () => {
    const signals = { network: { effectiveType: "3g" }, device: { memoryGb: 4 } };
    const result = classify(signals);
    console.log("3g + memory 4GB label:", result.label);
    console.log("3g + memory 4GB evidence:", result.evidence);
  });

  it("checks 3g with memory=8GB", () => {
    const signals = { network: { effectiveType: "3g" }, device: { memoryGb: 8 } };
    const result = classify(signals);
    console.log("3g + memory 8GB label:", result.label);
    console.log("3g + memory 8GB evidence:", result.evidence);
  });
});
