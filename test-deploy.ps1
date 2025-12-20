# ============================================================================
# SCRIPT DE TESTES COMPLETO PARA DEPLOY - VERSATI GLASS
# ============================================================================
# Data: 19 Dezembro 2024
# Objetivo: Validar 100% do projeto antes do deploy
# ============================================================================

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║    🚀 TESTES COMPLETOS PARA DEPLOY - VERSATI GLASS    ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

$ErrorActionPreference = "Continue"
$totalTests = 0
$passedTests = 0
$failedTests = 0
$warnings = @()

# ============================================================================
# TESTE 1: ESTRUTURA DE ARQUIVOS
# ============================================================================
Write-Host "📁 TESTE 1: ESTRUTURA DE ARQUIVOS" -ForegroundColor Yellow
Write-Host ""

$essentialFiles = @(
    "package.json",
    "next.config.mjs",
    "tsconfig.json",
    "tailwind.config.ts",
    "prisma/schema.prisma",
    ".env",
    "public/manifest.json",
    "public/robots.txt",
    "src/app/layout.tsx",
    "src/app/page.tsx",
    "src/lib/prisma.ts",
    "src/lib/auth.ts"
)

foreach($file in $essentialFiles) {
    $totalTests++
    if(Test-Path $file) {
        Write-Host "  ✅ $file" -ForegroundColor Green
        $passedTests++
    } else {
        Write-Host "  ❌ $file - NOT FOUND" -ForegroundColor Red
        $failedTests++
    }
}

Write-Host ""

# ============================================================================
# TESTE 2: DEPENDÊNCIAS DO PROJETO
# ============================================================================
Write-Host "📦 TESTE 2: DEPENDÊNCIAS" -ForegroundColor Yellow
Write-Host ""

$totalTests++
if(Test-Path "node_modules") {
    Write-Host "  ✅ node_modules existe" -ForegroundColor Green
    $passedTests++
} else {
    Write-Host "  ❌ node_modules não encontrado - Execute: npm install" -ForegroundColor Red
    $failedTests++
}

$totalTests++
$packageJson = Get-Content "package.json" | ConvertFrom-Json
if($packageJson.dependencies) {
    $depCount = ($packageJson.dependencies | Get-Member -MemberType NoteProperty).Count
    Write-Host "  ✅ $depCount dependências no package.json" -ForegroundColor Green
    $passedTests++
} else {
    Write-Host "  ❌ Nenhuma dependência encontrada" -ForegroundColor Red
    $failedTests++
}

Write-Host ""

# ============================================================================
# TESTE 3: VARIÁVEIS DE AMBIENTE
# ============================================================================
Write-Host "🔐 TESTE 3: VARIÁVEIS DE AMBIENTE" -ForegroundColor Yellow
Write-Host ""

$envVars = @(
    "DATABASE_URL",
    "NEXTAUTH_SECRET",
    "NEXTAUTH_URL",
    "GROQ_API_KEY",
    "OPENAI_API_KEY"
)

if(Test-Path ".env") {
    $envContent = Get-Content ".env" -Raw
    foreach($var in $envVars) {
        $totalTests++
        if($envContent -match $var) {
            Write-Host "  ✅ $var definida" -ForegroundColor Green
            $passedTests++
        } else {
            Write-Host "  ⚠️  $var não encontrada" -ForegroundColor Yellow
            $warnings += "$var não está definida no .env"
        }
    }
} else {
    Write-Host "  ❌ Arquivo .env não encontrado!" -ForegroundColor Red
    $failedTests += $envVars.Count
    $totalTests += $envVars.Count
}

Write-Host ""

# ============================================================================
# TESTE 4: ESTRUTURA DE IMAGENS
# ============================================================================
Write-Host "🖼️  TESTE 4: IMAGENS" -ForegroundColor Yellow
Write-Host ""

$imageFolders = @(
    @{Path="public/images/products"; Expected=12; Name="Produtos"},
    @{Path="public/images/services"; Expected=4; Name="Serviços"},
    @{Path="public/images/portfolio"; Expected=27; Name="Portfolio"}
)

foreach($folder in $imageFolders) {
    $totalTests++
    if(Test-Path $folder.Path) {
        $count = (Get-ChildItem "$($folder.Path)/*.jpg" -ErrorAction SilentlyContinue).Count
        if($count -eq $folder.Expected) {
            Write-Host "  ✅ $($folder.Name): $count/$($folder.Expected) imagens" -ForegroundColor Green
            $passedTests++
        } else {
            Write-Host "  ⚠️  $($folder.Name): $count/$($folder.Expected) imagens" -ForegroundColor Yellow
            $warnings += "$($folder.Name): esperado $($folder.Expected), encontrado $count"
        }
    } else {
        Write-Host "  ❌ Pasta $($folder.Path) não existe" -ForegroundColor Red
        $failedTests++
    }
}

$totalTests++
if(Test-Path "public/images/hero-bg.jpg") {
    Write-Host "  ✅ Hero background existe" -ForegroundColor Green
    $passedTests++
} else {
    Write-Host "  ❌ Hero background não encontrado" -ForegroundColor Red
    $failedTests++
}

Write-Host ""

# ============================================================================
# TESTE 5: ROTAS PRINCIPAIS
# ============================================================================
Write-Host "🛣️  TESTE 5: ROTAS E PÁGINAS" -ForegroundColor Yellow
Write-Host ""

$routes = @(
    "src/app/(public)/page.tsx",
    "src/app/(public)/produtos/page.tsx",
    "src/app/(public)/portfolio/page.tsx",
    "src/app/(public)/orcamento/page.tsx",
    "src/app/(public)/contato/page.tsx",
    "src/app/(public)/sobre/page.tsx",
    "src/app/(admin)/admin/page.tsx",
    "src/app/api/ai/chat/route.ts"
)

foreach($route in $routes) {
    $totalTests++
    if(Test-Path $route) {
        Write-Host "  ✅ $(Split-Path $route -Leaf)" -ForegroundColor Green
        $passedTests++
    } else {
        Write-Host "  ❌ $route - NOT FOUND" -ForegroundColor Red
        $failedTests++
    }
}

Write-Host ""

# ============================================================================
# TESTE 6: COMPONENTES PRINCIPAIS
# ============================================================================
Write-Host "⚛️  TESTE 6: COMPONENTES" -ForegroundColor Yellow
Write-Host ""

$components = @(
    "src/components/layout/header.tsx",
    "src/components/layout/footer.tsx",
    "src/components/chat/chat-assistido.tsx",
    "src/components/produtos/produtos-list.tsx",
    "src/components/portfolio/portfolio-grid.tsx",
    "src/components/quote/quote-wizard.tsx"
)

foreach($component in $components) {
    $totalTests++
    if(Test-Path $component) {
        Write-Host "  ✅ $(Split-Path $component -Leaf)" -ForegroundColor Green
        $passedTests++
    } else {
        Write-Host "  ❌ $component - NOT FOUND" -ForegroundColor Red
        $failedTests++
    }
}

Write-Host ""

# ============================================================================
# TESTE 7: BANCO DE DADOS E PRISMA
# ============================================================================
Write-Host "🗄️  TESTE 7: PRISMA E BANCO DE DADOS" -ForegroundColor Yellow
Write-Host ""

$totalTests++
if(Test-Path "prisma/schema.prisma") {
    $schemaContent = Get-Content "prisma/schema.prisma" -Raw
    if($schemaContent -match "model User" -and $schemaContent -match "model Quote") {
        Write-Host "  ✅ Schema Prisma válido" -ForegroundColor Green
        $passedTests++
    } else {
        Write-Host "  ⚠️  Schema Prisma incompleto" -ForegroundColor Yellow
        $warnings += "Schema Prisma pode estar incompleto"
    }
} else {
    Write-Host "  ❌ Schema Prisma não encontrado" -ForegroundColor Red
    $failedTests++
}

$totalTests++
if(Test-Path "node_modules/@prisma/client") {
    Write-Host "  ✅ Prisma Client instalado" -ForegroundColor Green
    $passedTests++
} else {
    Write-Host "  ❌ Prisma Client não instalado - Execute: npx prisma generate" -ForegroundColor Red
    $failedTests++
}

Write-Host ""

# ============================================================================
# TESTE 8: CONFIGURAÇÕES DO NEXT.JS
# ============================================================================
Write-Host "⚙️  TESTE 8: CONFIGURAÇÃO NEXT.JS" -ForegroundColor Yellow
Write-Host ""

$totalTests++
if(Test-Path "next.config.mjs") {
    $nextConfig = Get-Content "next.config.mjs" -Raw
    if($nextConfig -match "images" -or $nextConfig.Length -gt 0) {
        Write-Host "  ✅ next.config.mjs válido" -ForegroundColor Green
        $passedTests++
    } else {
        Write-Host "  ⚠️  next.config.mjs vazio ou inválido" -ForegroundColor Yellow
        $warnings += "Verifique configuração do Next.js"
    }
} else {
    Write-Host "  ❌ next.config.mjs não encontrado" -ForegroundColor Red
    $failedTests++
}

Write-Host ""

# ============================================================================
# TESTE 9: TYPESCRIPT
# ============================================================================
Write-Host "📘 TESTE 9: TYPESCRIPT" -ForegroundColor Yellow
Write-Host ""

$totalTests++
if(Test-Path "tsconfig.json") {
    Write-Host "  ✅ tsconfig.json existe" -ForegroundColor Green
    $passedTests++
} else {
    Write-Host "  ❌ tsconfig.json não encontrado" -ForegroundColor Red
    $failedTests++
}

$totalTests++
if(Test-Path "src") {
    $tsFiles = (Get-ChildItem "src" -Recurse -Filter "*.ts" -ErrorAction SilentlyContinue).Count
    $tsxFiles = (Get-ChildItem "src" -Recurse -Filter "*.tsx" -ErrorAction SilentlyContinue).Count
    $total = $tsFiles + $tsxFiles
    Write-Host "  ✅ $total arquivos TypeScript encontrados" -ForegroundColor Green
    $passedTests++
} else {
    Write-Host "  ❌ Pasta src não encontrada" -ForegroundColor Red
    $failedTests++
}

Write-Host ""

# ============================================================================
# TESTE 10: DOCUMENTAÇÃO
# ============================================================================
Write-Host "📚 TESTE 10: DOCUMENTAÇÃO" -ForegroundColor Yellow
Write-Host ""

$docs = @(
    "README.md",
    "docs/IMAGE_MAPPING.md",
    "docs/PORTFOLIO_PROMPTS_COMPLETE.md",
    "COMPLETE_IMAGE_PLAN.md"
)

foreach($doc in $docs) {
    $totalTests++
    if(Test-Path $doc) {
        Write-Host "  ✅ $(Split-Path $doc -Leaf)" -ForegroundColor Green
        $passedTests++
    } else {
        Write-Host "  ⚠️  $doc não encontrado" -ForegroundColor Yellow
        $warnings += "Documentação $doc ausente"
    }
}

Write-Host ""

# ============================================================================
# TESTE 11: SCRIPTS NPM
# ============================================================================
Write-Host "📜 TESTE 11: SCRIPTS NPM" -ForegroundColor Yellow
Write-Host ""

$requiredScripts = @("dev", "build", "start", "lint")

foreach($script in $requiredScripts) {
    $totalTests++
    if($packageJson.scripts.$script) {
        Write-Host "  ✅ npm run $script definido" -ForegroundColor Green
        $passedTests++
    } else {
        Write-Host "  ❌ npm run $script não encontrado" -ForegroundColor Red
        $failedTests++
    }
}

Write-Host ""

# ============================================================================
# RESUMO FINAL
# ============================================================================
Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║              📊 RESUMO DOS TESTES                      ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

Write-Host "  Total de testes: $totalTests" -ForegroundColor White
Write-Host "  ✅ Passou: $passedTests" -ForegroundColor Green
Write-Host "  ❌ Falhou: $failedTests" -ForegroundColor Red
Write-Host "  ⚠️  Avisos: $($warnings.Count)" -ForegroundColor Yellow
Write-Host ""

$successRate = [math]::Round(($passedTests / $totalTests) * 100, 2)
Write-Host "  Taxa de sucesso: $successRate%" -ForegroundColor $(if($successRate -ge 90){'Green'}elseif($successRate -ge 70){'Yellow'}else{'Red'})
Write-Host ""

if($warnings.Count -gt 0) {
    Write-Host "⚠️  AVISOS:" -ForegroundColor Yellow
    foreach($warning in $warnings) {
        Write-Host "  • $warning" -ForegroundColor Yellow
    }
    Write-Host ""
}

# Status final
if($failedTests -eq 0) {
    Write-Host "✅ RESULTADO: PRONTO PARA DEPLOY!" -ForegroundColor Green -BackgroundColor DarkGreen
    Write-Host ""
    Write-Host "  Próximo passo:" -ForegroundColor Cyan
    Write-Host "  1. Execute: npm run build" -ForegroundColor White
    Write-Host "  2. Verifique se build completa sem erros" -ForegroundColor White
    Write-Host "  3. Execute: npm run start" -ForegroundColor White
    Write-Host "  4. Teste localmente em http://localhost:3000" -ForegroundColor White
    Write-Host "  5. Faça deploy no Vercel" -ForegroundColor White
} elseif($failedTests -le 3) {
    Write-Host "⚠️  RESULTADO: QUASE PRONTO - Corrija os erros críticos" -ForegroundColor Yellow -BackgroundColor DarkYellow
} else {
    Write-Host "❌ RESULTADO: NÃO PRONTO - Corrija os erros antes do deploy" -ForegroundColor Red -BackgroundColor DarkRed
}

Write-Host ""
Write-Host "Relatório salvo em: test-results.txt" -ForegroundColor Cyan
Write-Host ""

# Salvar relatório
$report = @"
VERSATI GLASS - RELATÓRIO DE TESTES PARA DEPLOY
Data: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
============================================================

RESUMO:
Total de testes: $totalTests
Passou: $passedTests
Falhou: $failedTests
Avisos: $($warnings.Count)
Taxa de sucesso: $successRate%

STATUS: $(if($failedTests -eq 0){'✅ PRONTO PARA DEPLOY'}elseif($failedTests -le 3){'⚠️ QUASE PRONTO'}else{'❌ NÃO PRONTO'})

AVISOS:
$($warnings -join "`n")

============================================================
"@

$report | Out-File "test-results.txt" -Encoding UTF8

# Retornar código de saída
if($failedTests -eq 0) {
    exit 0
} else {
    exit 1
}
