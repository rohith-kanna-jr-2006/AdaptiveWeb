import fs from 'fs';
import path from 'path';

const summaryPath = path.join(process.cwd(), 'benchmark-results', 'benchmark-summary.json');
const outputPath = path.join(process.cwd(), 'BENCHMARK_REPORT.md');

if (!fs.existsSync(summaryPath)) {
  console.error(`Summary file not found at ${summaryPath}. Please run benchmarks first.`);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
const b = data.baseline || {};
const a = data.adaptive || {};

const loadTimeDiff = b.loadTimeMs && a.loadTimeMs ? Math.round(((b.loadTimeMs - a.loadTimeMs) / b.loadTimeMs) * 100) : 'N/A';
const payloadDiff = b.estimatedTransferKB && a.estimatedTransferKB ? Math.round(((b.estimatedTransferKB - a.estimatedTransferKB) / b.estimatedTransferKB) * 100) : 'N/A';
const domDiff = b.domNodeCount && a.domNodeCount ? Math.round(((b.domNodeCount - a.domNodeCount) / b.domNodeCount) * 100) : 'N/A';

const markdown = `# AdaptiveWeb Performance Measurement & Benchmark Report

**Generated At:** ${data.timestamp || new Date().toISOString()}  
**Environment:** Next.js 14.2.15 | Node.js ${process.version} | Playwright MS Edge Engine  
**Git Branch:** \`nishaanth/testing\`

---

## Executive Summary

| Metric | Baseline (Full Experience) | Adaptive (Data Saver) | Efficiency Comparison |
| :--- | :--- | :--- | :--- |
| **Page Load Time** | ${b.loadTimeMs ? b.loadTimeMs + ' ms' : 'not measured'} | ${a.loadTimeMs ? a.loadTimeMs + ' ms' : 'not measured'} | **${loadTimeDiff}% faster** |
| **Loaded Transfer Size** | ${b.estimatedTransferKB ? b.estimatedTransferKB + ' KB' : 'not measured'} | ${a.estimatedTransferKB ? a.estimatedTransferKB + ' KB' : 'not measured'} | **${payloadDiff}% payload reduction** |
| **DOM Tree Size** | ${b.domNodeCount ? b.domNodeCount + ' nodes' : 'not measured'} | ${a.domNodeCount ? a.domNodeCount + ' nodes' : 'not measured'} | **${domDiff}% DOM node reduction** |

---

## Technical Configuration & Strategy

### 1. Baseline Mode Reference Configuration
- **Delivery Strategy:** Maximum Quality / Reference (Unconstrained)
- **Target Mode:** \`FULL EXPERIENCE\`
- **Asset Quality:** High-resolution uncompressed assets
- **Prefetching Policy:** Unrestricted background prefetching active

### 2. Adaptive Mode Policy Configuration
- **Delivery Strategy:** Resource & Hardware Throttled
- **Target Mode:** \`DATA SAVER\` / \`BALANCED\`
- **Network Detection:** Real-time \`navigator.connection\` inspection (RTT, Downlink, EffectiveType)
- **Device Detection:** Real-time \`navigator.hardwareConcurrency\` & \`navigator.deviceMemory\` inspection
- **Asset Policy:** Dynamic image quality scaling, lazy module loading, low-motion CSS overrides

---

## Reproducible Verification Steps

To execute this benchmark suite locally:

\`\`\`bash
# 1. Build Next.js application
npm run build

# 2. Run Playwright automated performance benchmark suite
npm run test:benchmark

# 3. View detailed Markdown report
cat BENCHMARK_REPORT.md
\`\`\`
`;

fs.writeFileSync(outputPath, markdown);
console.log(`[Report Generated] Saved to ${outputPath}`);
