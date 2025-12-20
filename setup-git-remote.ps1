# Script para configurar Git Remote e conectar ao GitHub
# Versati Glass - Deploy Automation

Write-Host "🔗 CONFIGURANDO REPOSITÓRIO REMOTO GIT" -ForegroundColor Cyan
Write-Host ""

# Verificar se já existe remote
$hasRemote = git remote -v 2>&1 | Select-String "origin"

if ($hasRemote) {
    Write-Host "⚠️  Remote 'origin' já existe:" -ForegroundColor Yellow
    git remote -v
    Write-Host ""
    $response = Read-Host "Deseja remover e reconfigurar? (s/N)"
    if ($response -eq "s" -or $response -eq "S") {
        git remote remove origin
        Write-Host "✅ Remote removido" -ForegroundColor Green
    } else {
        Write-Host "❌ Operação cancelada" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "PASSO 1: CRIAR REPOSITÓRIO NO GITHUB" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Abra: https://github.com/new" -ForegroundColor White
Write-Host "2. Repository name: versati-glass" -ForegroundColor White
Write-Host "3. Visibility: Private" -ForegroundColor White
Write-Host "4. NÃO marque nenhuma opção (README, .gitignore, license)" -ForegroundColor White
Write-Host "5. Clique em 'Create repository'" -ForegroundColor White
Write-Host ""
Write-Host "Pressione ENTER após criar o repositório..." -ForegroundColor Cyan
Read-Host

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "PASSO 2: CONFIGURAR REMOTE" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "Qual é seu usuário do GitHub?" -ForegroundColor Yellow
Write-Host "(Exemplo: leopalhas)" -ForegroundColor Gray
$githubUser = Read-Host "Usuário"

if ([string]::IsNullOrWhiteSpace($githubUser)) {
    Write-Host "❌ Usuário não pode ser vazio" -ForegroundColor Red
    exit 1
}

$repoUrl = "https://github.com/$githubUser/versati-glass.git"

Write-Host ""
Write-Host "URL do repositório: $repoUrl" -ForegroundColor Cyan
Write-Host ""

# Adicionar remote
Write-Host "Adicionando remote..." -ForegroundColor Yellow
git remote add origin $repoUrl

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Remote adicionado com sucesso!" -ForegroundColor Green
} else {
    Write-Host "❌ Erro ao adicionar remote" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "PASSO 3: FAZER PUSH PARA GITHUB" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "Configurando branch principal..." -ForegroundColor Yellow
git branch -M main

Write-Host ""
Write-Host "Fazendo push..." -ForegroundColor Yellow
Write-Host ""
Write-Host "⚠️  ATENÇÃO:" -ForegroundColor Yellow
Write-Host "Se solicitar senha, use um Personal Access Token do GitHub" -ForegroundColor Yellow
Write-Host "Não use sua senha normal!" -ForegroundColor Yellow
Write-Host ""
Write-Host "Como obter token:" -ForegroundColor Cyan
Write-Host "1. Acesse: https://github.com/settings/tokens" -ForegroundColor White
Write-Host "2. 'Generate new token' → 'Classic'" -ForegroundColor White
Write-Host "3. Marque 'repo' (full control)" -ForegroundColor White
Write-Host "4. Generate e copie o token" -ForegroundColor White
Write-Host ""
Write-Host "Pressione ENTER para continuar com o push..." -ForegroundColor Cyan
Read-Host

git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Push realizado com sucesso!" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Erro ao fazer push" -ForegroundColor Red
    Write-Host ""
    Write-Host "Possíveis soluções:" -ForegroundColor Yellow
    Write-Host "1. Verifique se criou o repositório no GitHub" -ForegroundColor White
    Write-Host "2. Verifique se está usando Personal Access Token" -ForegroundColor White
    Write-Host "3. Tente: git push -u origin main --force" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "PASSO 4: CONECTAR VERCEL AO GITHUB" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "Agora configure o Vercel para fazer deploy automático:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Acesse: https://vercel.com/leopalhas-projects/versati-glass/settings/git" -ForegroundColor White
Write-Host "2. Clique em 'Connect Git Repository'" -ForegroundColor White
Write-Host "3. Selecione GitHub" -ForegroundColor White
Write-Host "4. Autorize o Vercel" -ForegroundColor White
Write-Host "5. Selecione 'versati-glass'" -ForegroundColor White
Write-Host "6. Production Branch: main" -ForegroundColor White
Write-Host ""
Write-Host "Pressione ENTER após conectar..." -ForegroundColor Cyan
Read-Host

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✅ CONFIGURAÇÃO CONCLUÍDA!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "Repositório configurado:" -ForegroundColor White
git remote -v
Write-Host ""
Write-Host "📊 STATUS:" -ForegroundColor Cyan
Write-Host "✅ Git remote configurado" -ForegroundColor Green
Write-Host "✅ Código no GitHub" -ForegroundColor Green
Write-Host "⏳ Vercel → GitHub (configure manualmente)" -ForegroundColor Yellow
Write-Host ""
Write-Host "🎉 PRÓXIMOS PASSOS:" -ForegroundColor Cyan
Write-Host "1. Configure DATABASE_URL no Vercel" -ForegroundColor White
Write-Host "2. Adicione PostgreSQL no Railway" -ForegroundColor White
Write-Host "3. Faça um push e veja o deploy automático!" -ForegroundColor White
Write-Host ""
Write-Host "Comando para testar deploy automático:" -ForegroundColor Yellow
Write-Host 'echo "teste" > TEST.md && git add TEST.md && git commit -m "test: Deploy automático" && git push' -ForegroundColor Gray
Write-Host ""
