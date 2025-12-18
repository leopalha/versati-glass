#!/usr/bin/env node
/**
 * Script para migrar console.log/error/warn para logger
 *
 * Uso: node migrate-to-logger.js
 */

const fs = require('fs');
const path = require('path');

// Padrões de substituição
const replacements = [
  // console.error -> logger.error
  {
    pattern: /console\.error\(/g,
    replacement: 'logger.error('
  },
  // console.warn -> logger.warn
  {
    pattern: /console\.warn\(/g,
    replacement: 'logger.warn('
  },
  // console.log -> logger.debug
  {
    pattern: /console\.log\(/g,
    replacement: 'logger.debug('
  },
  // console.info -> logger.info
  {
    pattern: /console\.info\(/g,
    replacement: 'logger.info('
  }
];

// Adicionar import se necessário
function addLoggerImport(content, filePath) {
  // Verifica se já tem import do logger
  if (content.includes("from '@/lib/logger'") || content.includes('from "@/lib/logger"')) {
    return content;
  }

  // Verifica se tem algum logger. sendo usado
  if (!content.includes('logger.')) {
    return content;
  }

  // Encontra a última linha de import
  const lines = content.split('\n');
  let lastImportIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('import ') || lines[i].includes("from '") || lines[i].includes('from "')) {
      lastImportIndex = i;
    }
  }

  // Adiciona import após última linha de import
  if (lastImportIndex >= 0) {
    lines.splice(lastImportIndex + 1, 0, "import { logger } from '@/lib/logger'");
    return lines.join('\n');
  }

  // Se não encontrou imports, adiciona no topo
  return "import { logger } from '@/lib/logger'\n\n" + content;
}

// Processar arquivo
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Aplica substituições
    for (const { pattern, replacement } of replacements) {
      if (pattern.test(content)) {
        content = content.replace(pattern, replacement);
        modified = true;
      }
    }

    // Adiciona import se modificado
    if (modified) {
      content = addLoggerImport(content, filePath);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Migrado: ${filePath}`);
      return 1;
    }

    return 0;
  } catch (error) {
    console.error(`❌ Erro em ${filePath}:`, error.message);
    return 0;
  }
}

// Processar diretório recursivamente
function processDirectory(dir, stats = { total: 0, migrated: 0 }) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Pular node_modules, .next, etc
      if (['node_modules', '.next', 'dist', 'build'].includes(file)) {
        continue;
      }
      processDirectory(filePath, stats);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      stats.total++;
      stats.migrated += processFile(filePath);
    }
  }

  return stats;
}

// Executar
console.log('🚀 Iniciando migração console -> logger...\n');

const srcDir = path.join(__dirname, 'src');
const stats = processDirectory(srcDir);

console.log(`\n📊 Resultado:`);
console.log(`   Total de arquivos: ${stats.total}`);
console.log(`   Arquivos migrados: ${stats.migrated}`);
console.log(`   Taxa de sucesso: ${((stats.migrated / stats.total) * 100).toFixed(1)}%`);
console.log('\n✅ Migração concluída!');
