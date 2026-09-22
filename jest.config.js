/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js"],
  transform: {
    "^.+\.js$": ["babel-jest", { configFile: false }],
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(babel-jest)/)",
  ],
  collectCoverageFrom: [
    "src/adaptive/**/*.js",
    "src/integration/**/*.js",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],
};
