@echo off
echo ========================================
echo   SETUP RAILWAY - VERSATI GLASS
echo ========================================
echo.

echo [PASSO 1] Login no Railway
echo Vai abrir o browser para autenticacao...
echo.
railway login
if %errorlevel% neq 0 (
    echo Erro no login! Verifique sua conta Railway.
    pause
    exit /b 1
)

echo.
echo ========================================
echo [PASSO 2] Criar projeto versatiglass
echo ========================================
echo.
railway init --name versatiglass
if %errorlevel% neq 0 (
    echo Erro ao criar projeto!
    pause
    exit /b 1
)

echo.
echo ========================================
echo [PASSO 3] Adicionar PostgreSQL
echo ========================================
echo.
railway add --database postgres
if %errorlevel% neq 0 (
    echo Erro ao adicionar PostgreSQL!
    pause
    exit /b 1
)

echo.
echo ========================================
echo [PASSO 4] Aguardando PostgreSQL ficar pronto...
echo ========================================
echo Aguarde 30 segundos para o banco inicializar...
timeout /t 30 /nobreak

echo.
echo ========================================
echo [PASSO 5] Obter DATABASE_URL
echo ========================================
echo.
railway variables --json > railway-vars.json
if %errorlevel% neq 0 (
    echo Erro ao obter variáveis!
    pause
    exit /b 1
)

echo.
echo Variáveis salvas em: railway-vars.json
echo.

echo ========================================
echo [PASSO 6] Configurar variáveis locais
echo ========================================
echo.
echo Exportando variáveis do Railway...
railway variables > .env.railway

echo.
echo ========================================
echo [PASSO 7] Executar migrations
echo ========================================
echo.
railway run pnpm prisma migrate deploy
if %errorlevel% neq 0 (
    echo Aviso: Erro ao executar migrations.
    echo Pode ser necessário rodar manualmente.
)

echo.
echo ========================================
echo [PASSO 8] Executar seed (opcional)
echo ========================================
echo.
set /p SEED="Deseja executar o seed do banco? (S/N): "
if /i "%SEED%"=="S" (
    railway run pnpm db:seed
    if %errorlevel% neq 0 (
        echo Aviso: Erro ao executar seed.
    )
)

echo.
echo ========================================
echo   SETUP RAILWAY CONCLUÍDO!
echo ========================================
echo.
echo Proximos passos:
echo 1. Verifique railway-vars.json para DATABASE_URL
echo 2. Adicione DATABASE_URL na Vercel
echo 3. Execute: setup-vercel-complete.bat
echo.
pause
