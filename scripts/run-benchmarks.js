import { execSync } from 'child_process';

console.log('=====================================================');
console.log('   AdaptiveWeb Performance Benchmark Suite Runner    ');
console.log('=====================================================');

try {
  console.log('[1/2] Executing Playwright E2E & Benchmark Measurement...');
  execSync('npx playwright test tests/benchmark.spec.js', { stdio: 'inherit' });

  console.log('\n[2/2] Generating Performance Comparison Summary Report...');
  execSync('node scripts/generate-report.js', { stdio: 'inherit' });

  console.log('\n✅ Benchmark execution and report generation completed successfully!');
} catch (error) {
  console.error('❌ Benchmark execution failed:', error.message);
  process.exit(1);
}
