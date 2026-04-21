#!/usr/bin/env tsx

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

console.log('🔍 Analyzing bundle size...\n');

// Check if @next/bundle-analyzer is installed
const packageJson = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf-8'));
const hasBundleAnalyzer = packageJson.devDependencies?.['@next/bundle-analyzer'];

if (!hasBundleAnalyzer) {
  console.log('❌ @next/bundle-analyzer not installed');
  console.log('📦 Installing...');
  try {
    execSync('npm install -D @next/bundle-analyzer', { stdio: 'inherit' });
    console.log('✅ Installed successfully\n');
  } catch (error) {
    console.error('❌ Failed to install:', error);
    process.exit(1);
  }
}

// Check if next.config.mjs needs bundle analyzer
const configPath = join(process.cwd(), 'next.config.mjs');
const config = readFileSync(configPath, 'utf-8');

if (!config.includes('withBundleAnalyzer')) {
  console.log('⚙️  Adding bundle analyzer to next.config.mjs...\n');

  const importStatement = "import { withBundleAnalyzer } from '@next/bundle-analyzer'";
  const exportStatement = "export default withBundleAnalyzer(nextConfig);";

  const newConfig = config
    .replace(
      '/** @type {import(\'next\').NextConfig} */',
      `/** @type {import('next').NextConfig} */\n${importStatement}`
    )
    .replace(
      'export default nextConfig;',
      exportStatement
    );

  writeFileSync(configPath, newConfig);
  console.log('✅ Bundle analyzer added to config\n');
}

console.log('📊 Running bundle analyzer...\n');

try {
  execSync('ANALYZE=true npm run build', { stdio: 'inherit' });
  console.log('\n✅ Bundle analysis complete!');
  console.log('📈 Check the .next/analyze folder for detailed reports');
} catch (error) {
  console.error('\n❌ Analysis failed:', error);
  process.exit(1);
}
