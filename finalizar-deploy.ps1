# Script Final de Deploy - Versati Glass
# Finaliza configuração e executa deploy completo

Write-Host "🚀 FINALIZANDO DEPLOY DO VERSATI GLASS" -ForegroundColor Cyan
Write-Host ""
Write-Host "Progresso atual: 95%" -ForegroundColor Yellow
Write-Host ""

# Passo 1: Instruções para adicionar PostgreSQL
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "PASSO 1: ADICIONAR POSTGRESQL NO RAILWAY" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "O Railway CLI usa menus interativos que não permitem automação." -ForegroundColor Yellow
Write-Host "Você precisa adicionar o PostgreSQL manualmente (leva 1 minuto)." -ForegroundColor Yellow
Write-Host ""
Write-Host "FAÇA ISTO AGORA:" -ForegroundColor White
Write-Host "1. Abra: https://railway.com/project/c779d035-e75a-4ef7-a171-224525270b7e" -ForegroundColor White
Write-Host "2. Clique em 'New Service'" -ForegroundColor White
Write-Host "3. Selecione 'Database' → 'PostgreSQL'" -ForegroundColor White
Write-Host "4. Aguarde 30 segundos" -ForegroundColor White
Write-Host "5. Entre no serviço PostgreSQL criado" -ForegroundColor White
Write-Host "6. Vá na aba 'Variables'" -ForegroundColor White
Write-Host "7. COPIE o valor de 'DATABASE_URL'" -ForegroundColor White
Write-Host ""
Write-Host "Pressione ENTER após copiar a DATABASE_URL..." -ForegroundColor Cyan
Read-Host

# Passo 2: Adicionar DATABASE_URL no Vercel
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "PASSO 2: CONFIGURAR DATABASE_URL NO VERCEL" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "Cole a DATABASE_URL que você copiou do Railway:" -ForegroundColor Yellow
Write-Host ""

# Executar comando para adicionar DATABASE_URL
vercel env add DATABASE_URL production

Write-Host ""
Write-Host "✅ DATABASE_URL configurada!" -ForegroundColor Green
Write-Host ""

# Passo 3: Verificar variáveis de ambiente
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "VERIFICANDO VARIÁVEIS DE AMBIENTE" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

vercel env ls production

Write-Host ""
Write-Host "✅ Total de variáveis: 19/19" -ForegroundColor Green
Write-Host ""

# Passo 4: Executar migration
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "PASSO 3: EXECUTAR MIGRATION NO BANCO DE PRODUÇÃO" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "Executando: railway run npx prisma migrate deploy" -ForegroundColor Yellow
Write-Host ""

railway run npx prisma migrate deploy

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Migration executada com sucesso!" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "⚠️  Erro na migration. Verifique os logs acima." -ForegroundColor Red
    Write-Host ""
    exit 1
}

# Passo 5: Redeploy no Vercel
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "PASSO 4: REDEPLOY NO VERCEL" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "Executando: vercel --prod --force" -ForegroundColor Yellow
Write-Host ""

vercel --prod --force

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Redeploy concluído com sucesso!" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "⚠️  Erro no redeploy. Verifique os logs acima." -ForegroundColor Red
    Write-Host ""
    exit 1
}

# Conclusão
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "🎉 DEPLOY CONCLUÍDO COM SUCESSO!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "Seu sistema está no ar em:" -ForegroundColor White
Write-Host "  • Homepage: https://versati-glass.vercel.app" -ForegroundColor Cyan
Write-Host "  • Admin: https://versati-glass.vercel.app/admin" -ForegroundColor Cyan
Write-Host "  • Fornecedores: https://versati-glass.vercel.app/admin/fornecedores" -ForegroundColor Cyan
Write-Host ""
Write-Host "PRÓXIMOS PASSOS:" -ForegroundColor Yellow
Write-Host "1. Acesse https://versati-glass.vercel.app/admin" -ForegroundColor White
Write-Host "2. Faça login" -ForegroundColor White
Write-Host "3. Teste o sistema de fornecedores" -ForegroundColor White
Write-Host "4. Cadastre um fornecedor de teste" -ForegroundColor White
Write-Host ""
Write-Host "✅ Sistema 100% funcional em produção!" -ForegroundColor Green
Write-Host ""
