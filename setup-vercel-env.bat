@echo off
REM Script para configurar variáveis de ambiente no Vercel
REM Execute este script depois de revisar as variáveis

echo ========================================
echo Configurando Variáveis de Ambiente - Vercel
echo ========================================
echo.

echo ATENCAO: Este script vai adicionar variáveis de ambiente ao projeto Vercel
echo Pressione Ctrl+C para cancelar ou qualquer tecla para continuar...
pause > nul

echo.
echo [1/20] Configurando NEXTAUTH_SECRET...
vercel env add NEXTAUTH_SECRET production < nul
echo h5IWt1KRJQBDUFTKPdByrSBw3MviDEf1x/ebfdEFLic=

echo.
echo [2/20] Configurando AUTH_SECRET...
vercel env add AUTH_SECRET production

echo.
echo [3/20] Configurando NEXTAUTH_URL (Production)...
vercel env add NEXTAUTH_URL production

echo.
echo [4/20] Configurando GROQ_API_KEY...
vercel env add GROQ_API_KEY production

echo.
echo [5/20] Configurando OPENAI_API_KEY...
vercel env add OPENAI_API_KEY production

echo.
echo [6/20] Configurando TWILIO_ACCOUNT_SID...
vercel env add TWILIO_ACCOUNT_SID production

echo.
echo [7/20] Configurando TWILIO_AUTH_TOKEN...
vercel env add TWILIO_AUTH_TOKEN production

echo.
echo [8/20] Configurando TWILIO_WHATSAPP_NUMBER...
vercel env add TWILIO_WHATSAPP_NUMBER production

echo.
echo [9/20] Configurando GOOGLE_CLIENT_ID...
vercel env add GOOGLE_CLIENT_ID production

echo.
echo [10/20] Configurando GOOGLE_CLIENT_SECRET...
vercel env add GOOGLE_CLIENT_SECRET production

echo.
echo [11/20] Configurando STRIPE_SECRET_KEY...
vercel env add STRIPE_SECRET_KEY production

echo.
echo [12/20] Configurando NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY...
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production

echo.
echo [13/20] Configurando NEXT_PUBLIC_APP_URL...
vercel env add NEXT_PUBLIC_APP_URL production

echo.
echo [14/20] Configurando NEXT_PUBLIC_BASE_URL...
vercel env add NEXT_PUBLIC_BASE_URL production

echo.
echo [15/20] Configurando NEXT_PUBLIC_WHATSAPP_NUMBER...
vercel env add NEXT_PUBLIC_WHATSAPP_NUMBER production

echo.
echo [16/20] Configurando R2_PUBLIC_URL...
vercel env add R2_PUBLIC_URL production

echo.
echo [17/20] Configurando GOOGLE_CALENDAR_ID...
vercel env add GOOGLE_CALENDAR_ID production

echo.
echo [18/20] Configurando CRON_SECRET...
vercel env add CRON_SECRET production

echo.
echo ========================================
echo IMPORTANTE: Configure DATABASE_URL manualmente!
echo ========================================
echo.
echo A DATABASE_URL atual aponta para localhost e NAO funcionara em producao.
echo.
echo Voce precisa:
echo 1. Criar um banco PostgreSQL no Railway/Supabase/Neon
echo 2. Adicionar a DATABASE_URL manualmente via dashboard ou CLI:
echo    vercel env add DATABASE_URL production
echo.
echo ========================================
echo Configuracao concluida!
echo ========================================
echo.
echo Proximos passos:
echo 1. Adicione DATABASE_URL manualmente
echo 2. Execute: vercel --prod
echo.
pause
