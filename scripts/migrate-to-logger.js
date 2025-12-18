#!/usr/bin/env node
/**
 * Migration Script: Replace console.log/error/warn with logger
 *
 * This script automatically replaces all console statements with proper logger calls
 * across the entire codebase, except for:
 * - The logger.ts file itself
 * - node_modules
 * - .next build directory
 *
 * Usage: node scripts/migrate-to-logger.js
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Statistics
const stats = {
  filesScanned: 0,
  filesModified: 0,
  consoleLogReplaced: 0,
  consoleErrorReplaced: 0,
  consoleWarnReplaced: 0,
  consoleInfoReplaced: 0,
  consoleDebugReplaced: 0,
};

// Files to exclude
const EXCLUDE_PATTERNS = [
  '**/node_modules/**',
  '**/.next/**',
  '**/dist/**',
  '**/build/**',
  '**/logger.ts', // Don't modify the logger itself
  '**/scripts/**', // Don't modify scripts
  '**/*.test.ts',
  '**/*.test.tsx',
  '**/*.spec.ts',
  '**/*.spec.tsx',
];

// Find all TypeScript/TSX files
const files = glob.sync('**/*.{ts,tsx}', {
  ignore: EXCLUDE_PATTERNS,
  cwd: path.join(__dirname, '..'),
  absolute: true,
});

console.log(`\n🔍 Found ${files.length} files to scan...`);

files.forEach((filePath) => {
  stats.filesScanned++;

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  let needsImport = false;

  // Track replacements
  const replacements = {
    log: 0,
    error: 0,
    warn: 0,
    info: 0,
    debug: 0,
  };

  // Replace console.log with logger.debug
  const newContent = content.replace(/console\.log\(/g, (match) => {
    replacements.log++;
    needsImport = true;
    modified = true;
    return 'logger.debug(';
  });

  content = newContent.replace(/console\.error\(/g, (match) => {
    replacements.error++;
    needsImport = true;
    modified = true;
    return 'logger.error(';
  });

  content = content.replace(/console\.warn\(/g, (match) => {
    replacements.warn++;
    needsImport = true;
    modified = true;
    return 'logger.warn(';
  });

  content = content.replace(/console\.info\(/g, (match) => {
    replacements.info++;
    needsImport = true;
    modified = true;
    return 'logger.info(';
  });

  content = content.replace(/console\.debug\(/g, (match) => {
    replacements.debug++;
    needsImport = true;
    modified = true;
    return 'logger.debug(';
  });

  // Add import if needed and not already present
  if (needsImport && !content.includes("from '@/lib/logger'")) {
    // Detect if file is a server component or API route
    const isServerFile = content.includes("'use server'") ||
                         filePath.includes('/api/') ||
                         filePath.includes('/app/api/');

    // Find the right place to add import
    let importAdded = false;

    // Try to add after 'use client' or 'use server' directive if present
    if (content.match(/^['"]use (client|server)['"]\s*\n/m)) {
      content = content.replace(
        /^(['"]use (client|server)['"]\s*\n)/m,
        "$1\nimport { logger } from '@/lib/logger'\n"
      );
      importAdded = true;
    }
    // Try to add after last import statement
    else if (content.match(/^import .+ from .+$/m)) {
      const lastImportMatch = content.match(/^import .+ from .+$/gm);
      if (lastImportMatch && lastImportMatch.length > 0) {
        const lastImport = lastImportMatch[lastImportMatch.length - 1];
        content = content.replace(
          lastImport,
          `${lastImport}\nimport { logger } from '@/lib/logger'`
        );
        importAdded = true;
      }
    }
    // Add at the beginning if no imports found
    else {
      content = `import { logger } from '@/lib/logger'\n\n${content}`;
      importAdded = true;
    }

    if (!importAdded) {
      console.warn(`⚠️  Could not add import to ${path.relative(process.cwd(), filePath)}`);
    }
  }

  // Write file if modified
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    stats.filesModified++;
    stats.consoleLogReplaced += replacements.log;
    stats.consoleErrorReplaced += replacements.error;
    stats.consoleWarnReplaced += replacements.warn;
    stats.consoleInfoReplaced += replacements.info;
    stats.consoleDebugReplaced += replacements.debug;

    const totalInFile = Object.values(replacements).reduce((a, b) => a + b, 0);
    console.log(
      `✅ ${path.relative(process.cwd(), filePath)} - ${totalInFile} replacements`
    );
  }
});

// Print summary
console.log(`\n${'='.repeat(60)}`);
console.log('📊 MIGRATION SUMMARY');
console.log('='.repeat(60));
console.log(`Files scanned:           ${stats.filesScanned}`);
console.log(`Files modified:          ${stats.filesModified}`);
console.log(`console.log → logger.debug:    ${stats.consoleLogReplaced}`);
console.log(`console.error → logger.error:  ${stats.consoleErrorReplaced}`);
console.log(`console.warn → logger.warn:    ${stats.consoleWarnReplaced}`);
console.log(`console.info → logger.info:    ${stats.consoleInfoReplaced}`);
console.log(`console.debug → logger.debug:  ${stats.consoleDebugReplaced}`);
console.log(`${'='.repeat(60)}`);
console.log(
  `\n✨ Total replacements: ${
    stats.consoleLogReplaced +
    stats.consoleErrorReplaced +
    stats.consoleWarnReplaced +
    stats.consoleInfoReplaced +
    stats.consoleDebugReplaced
  }\n`
);

if (stats.filesModified > 0) {
  console.log('⚠️  IMPORTANT: Review the changes and run tests before committing!');
  console.log('Run: pnpm type-check && pnpm build\n');
} else {
  console.log('✅ No files needed modification!\n');
}
