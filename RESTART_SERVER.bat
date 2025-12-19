@echo off
echo ========================================
echo Reiniciando Servidor de Desenvolvimento
echo ========================================
echo.
echo 1. Encerrando todos os processos Node...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo 2. Aguardando portas liberarem...
timeout /t 3 /nobreak >nul

echo 3. Iniciando servidor na porta 3000...
echo.
start cmd /k "title Versati Glass Server && pnpm dev"

echo.
echo ========================================
echo Servidor sera iniciado em nova janela!
echo Aguarde aparecer: "Ready in XXs"
echo Depois acesse: http://localhost:3000
echo ========================================
echo.
pause
