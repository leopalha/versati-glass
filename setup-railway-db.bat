@echo off
echo ============================================
echo   SETUP RAILWAY DATABASE
echo ============================================
echo.
echo Este script vai te ajudar a configurar o banco Railway
echo.
echo PASSO 1: Obtenha a DATABASE_URL do Railway
echo   1. Acesse https://railway.app
echo   2. Entre no projeto Versati Glass
echo   3. Clique no servico PostgreSQL
echo   4. Na aba Variables, copie DATABASE_URL
echo.
echo PASSO 2: Cole a URL abaixo (Ctrl+V + Enter)
echo.
set /p RAILWAY_URL="Cole a DATABASE_URL do Railway: "

if "%RAILWAY_URL%"=="" (
    echo.
    echo ERRO: Nenhuma URL fornecida!
    pause
    exit /b 1
)

echo.
echo Atualizando .env...
echo.

REM Backup do .env atual
copy .env .env.backup >nul 2>&1

REM Criar novo .env com a URL do Railway
(
    echo # Database
    echo DATABASE_URL="%RAILWAY_URL%"
    echo.
    echo # Outras variaveis...
    findstr /v "DATABASE_URL" .env
) > .env.tmp

move /y .env.tmp .env >nul

echo ✓ .env atualizado (backup salvo em .env.backup^)
echo.
echo PASSO 3: Sincronizar o schema com o Railway
echo.
choice /c SN /m "Executar 'npx prisma db push' agora?"

if errorlevel 2 (
    echo.
    echo Pule esta etapa por enquanto.
    echo Execute manualmente: npx prisma db push
) else (
    echo.
    echo Executando prisma db push...
    call npx prisma db push
)

echo.
echo ============================================
echo   CONFIGURACAO CONCLUIDA!
echo ============================================
echo.
echo Proximo passo:
echo   1. Reinicie o servidor: npm run dev
echo   2. Teste o chat e verifique se o historico persiste
echo   3. Abra Prisma Studio: npx prisma studio
echo.
pause
