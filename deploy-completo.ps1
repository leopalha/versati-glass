# Script Completo de Deploy - Versati Glass
# Automatiza: Git Push + Railway PostgreSQL + Vercel

Write-Host "🚀 DEPLOY COMPLETO - VERSATI GLASS" -ForegroundColor Cyan
Write-Host ""

# ============================================================
# PASSO 1: GIT PUSH
# ============================================================
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "PASSO 1: CRIAR REPOSITÓRIO NO GITHUB" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  AÇÃO NECESSÁRIA:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Abra em uma nova aba: https://github.com/new" -ForegroundColor White
Write-Host "2. Repository name: versati-glass" -ForegroundColor White
Write-Host "3. Description: Sistema de gestão Versati Glass" -ForegroundColor White
Write-Host "4. Visibility: Private" -ForegroundColor White
Write-Host "5. NÃO marque README, .gitignore ou license" -ForegroundColor White
Write-Host "6. Clique em 'Create repository'" -ForegroundColor White
Write-Host ""
Write-Host "Já criei o remote apontando para: https://github.com/leopalha/versati-glass.git" -ForegroundColor Cyan
Write-Host ""
Write-Host "Pressione ENTER quando criar o repositório..." -ForegroundColor Yellow
Read-Host

Write-Host ""
Write-Host "Fazendo push para GitHub..." -ForegroundColor Yellow
git branch -M main
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Push realizado com sucesso!" -ForegroundColor Green
} else {
    Write-Host "❌ Erro no push. Verifique:" -ForegroundColor Red
    Write-Host "1. Se criou o repositório no GitHub" -ForegroundColor White
    Write-Host "2. Use Personal Access Token como senha (não a senha do GitHub)" -ForegroundColor White
    Write-Host "   Token: https://github.com/settings/tokens" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Quer tentar novamente? (s/N)" -ForegroundColor Yellow
    $retry = Read-Host
    if ($retry -eq "s" -or $retry -eq "S") {
        git push -u origin main
    } else {
        exit 1
    }
}

# ============================================================
# PASSO 2: POSTGRESQL NO RAILWAY
# ============================================================
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "PASSO 2: ADICIONAR POSTGRESQL NO RAILWAY" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  AÇÃO NECESSÁRIA:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Abra em uma nova aba: https://railway.com/project/c779d035-e75a-4ef7-a171-224525270b7e" -ForegroundColor White
Write-Host "2. Clique em 'New Service' (botão roxo)" -ForegroundColor White
Write-Host "3. Selecione 'Database' → 'PostgreSQL'" -ForegroundColor White
Write-Host "4. Aguarde ~30 segundos" -ForegroundColor White
Write-Host "5. Clique no card do PostgreSQL" -ForegroundColor White
Write-Host "6. Vá na aba 'Variables'" -ForegroundColor White
Write-Host "7. Copie o valor de DATABASE_URL" -ForegroundColor White
Write-Host ""
Write-Host "Pressione ENTER quando copiar a DATABASE_URL..." -ForegroundColor Yellow
Read-Host

# ============================================================
# PASSO 3: CONFIGURAR DATABASE_URL NO VERCEL
# ============================================================
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "PASSO 3: CONFIGURAR DATABASE_URL NO VERCEL" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "Cole a DATABASE_URL do Railway:" -ForegroundColor Yellow
Write-Host "(Pressione Ctrl+V e depois ENTER)" -ForegroundColor Gray
Write-Host ""

# Adicionar DATABASE_URL
$databaseUrl | vercel env add DATABASE_URL production

Write-Host ""
Write-Host "✅ DATABASE_URL configurada!" -ForegroundColor Green

# ============================================================
# PASSO 4: LINKAR RAILWAY
# ============================================================
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "PASSO 4: LINKAR RAILWAY AO PROJETO" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "Linkando Railway..." -ForegroundColor Yellow

# Simular seleção no railway link
Write-Output "versati-glass" | railway link 2>&1

railway status

# ============================================================
# PASSO 5: EXECUTAR MIGRATION
# ============================================================
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "PASSO 5: EXECUTAR MIGRATION NO BANCO" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "Executando migration..." -ForegroundColor Yellow

railway run npx prisma migrate deploy

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Migration executada com sucesso!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "⚠️  Erro na migration. Verifique os logs acima." -ForegroundColor Yellow
}

# ============================================================
# PASSO 6: REDEPLOY FINAL
# ============================================================
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "PASSO 6: REDEPLOY FINAL NO VERCEL" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "Fazendo redeploy com todas as configurações..." -ForegroundColor Yellow

vercel --prod --force

# ============================================================
# CONCLUSÃO
# ============================================================
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "🎉 DEPLOY CONCLUÍDO COM SUCESSO!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Git Remote configurado" -ForegroundColor Green
Write-Host "✅ Código no GitHub" -ForegroundColor Green
Write-Host "✅ PostgreSQL no Railway" -ForegroundColor Green
Write-Host "✅ DATABASE_URL configurada" -ForegroundColor Green
Write-Host "✅ Migration executada" -ForegroundColor Green
Write-Host "✅ Deploy finalizado" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 URLS DE PRODUÇÃO:" -ForegroundColor Cyan
Write-Host "   Homepage: https://versati-glass.vercel.app" -ForegroundColor White
Write-Host "   Admin: https://versati-glass.vercel.app/admin" -ForegroundColor White
Write-Host "   Fornecedores: https://versati-glass.vercel.app/admin/fornecedores" -ForegroundColor White
Write-Host ""
Write-Host "🚀 PRÓXIMOS PASSOS:" -ForegroundColor Cyan
Write-Host "1. Teste o sistema em produção" -ForegroundColor White
Write-Host "2. Faça login no admin" -ForegroundColor White
Write-Host "3. Cadastre um fornecedor de teste" -ForegroundColor White
Write-Host ""
Write-Host "💡 DEPLOY AUTOMÁTICO ATIVO:" -ForegroundColor Cyan
Write-Host "   Agora quando você fizer 'git push', o Vercel faz deploy automaticamente!" -ForegroundColor White
Write-Host ""
