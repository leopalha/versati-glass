@echo off
setlocal enabledelayedexpansion

echo ========================================
echo   CONFIGURACAO COMPLETA VERCEL
echo   VERSATI GLASS
echo ========================================
echo.

echo IMPORTANTE: Certifique-se de que voce ja executou setup-railway.bat
echo e tem o arquivo railway-vars.json com DATABASE_URL
echo.
set /p CONTINUE="Continuar? (S/N): "
if /i not "%CONTINUE%"=="S" exit /b 0

echo.
echo ========================================
echo [1/25] DATABASE_URL
echo ========================================
echo.
echo IMPORTANTE: Cole a DATABASE_URL do Railway (verifique railway-vars.json)
echo Formato: postgresql://user:pass@host.railway.app:5432/railway
echo.
vercel env add DATABASE_URL production preview

echo.
echo ========================================
echo [2/25] NEXTAUTH_URL (Production)
echo ========================================
echo.
echo https://versati-glass.vercel.app | vercel env add NEXTAUTH_URL production

echo.
echo ========================================
echo [3/25] NEXTAUTH_SECRET
echo ========================================
echo.
echo h5IWt1KRJQBDUFTKPdByrSBw3MviDEf1x/ebfdEFLic= | vercel env add NEXTAUTH_SECRET production preview development

echo.
echo ========================================
echo [4/25] AUTH_SECRET
echo ========================================
echo.
echo h5IWt1KRJQBDUFTKPdByrSBw3MviDEf1x/ebfdEFLic= | vercel env add AUTH_SECRET production preview development

echo.
echo ========================================
echo [5/25] GROQ_API_KEY
echo ========================================
echo.
echo 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 | vercel env add GROQ_API_KEY production preview development

echo.
echo ========================================
echo [6/25] OPENAI_API_KEY
echo ========================================
echo.
echo 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 | vercel env add OPENAI_API_KEY production preview development

echo.
echo ========================================
echo [7/25] TWILIO_ACCOUNT_SID
echo ========================================
echo.
echo AC3c1339fa3ecac14202ae6b810019f0ae | vercel env add TWILIO_ACCOUNT_SID production preview development

echo.
echo ========================================
echo [8/25] TWILIO_AUTH_TOKEN
echo ========================================
echo.
echo 7f111a7e0eab7f58edc27ec7e326bacc | vercel env add TWILIO_AUTH_TOKEN production preview development

echo.
echo ========================================
echo [9/25] TWILIO_WHATSAPP_NUMBER
echo ========================================
echo.
echo +18207320393 | vercel env add TWILIO_WHATSAPP_NUMBER production preview development

echo.
echo ========================================
echo [10/25] GOOGLE_CLIENT_ID
echo ========================================
echo.
echo 611018665878-enhh9nsf0biovn1s3tlqh55g9ubf31p3.apps.googleusercontent.com | vercel env add GOOGLE_CLIENT_ID production preview development

echo.
echo ========================================
echo [11/25] GOOGLE_CLIENT_SECRET
echo ========================================
echo.
echo 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 | vercel env add GOOGLE_CLIENT_SECRET production preview development

echo.
echo ========================================
echo [12/25] GOOGLE_CALENDAR_ID
echo ========================================
echo.
echo primary | vercel env add GOOGLE_CALENDAR_ID production preview development

echo.
echo ========================================
echo [13/25] STRIPE_SECRET_KEY
echo ========================================
echo.
echo sk_test_51SVcchB3FKITuv4Srjs27HtsHx6Apm6mKBdQGn39WZvCgrRl9aiDB2PkXz2y7R25COVnJOAMBqfhpXHuTVquC8QE00GySQswkO | vercel env add STRIPE_SECRET_KEY production preview development

echo.
echo ========================================
echo [14/25] NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
echo ========================================
echo.
echo pk_test_51SVcchB3FKITuv4SNXYFipOV4Bp2jciQ63sK1l32OsaayMIhfAYxTn40MWwGUUO5MTgMpJM9tIVrUXrgJVqn5mPY00LZQTdiCR | vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production preview development

echo.
echo ========================================
echo [15/25] NEXT_PUBLIC_APP_URL (Production)
echo ========================================
echo.
echo https://versati-glass.vercel.app | vercel env add NEXT_PUBLIC_APP_URL production

echo.
echo ========================================
echo [16/25] NEXT_PUBLIC_BASE_URL (Production)
echo ========================================
echo.
echo https://versati-glass.vercel.app | vercel env add NEXT_PUBLIC_BASE_URL production

echo.
echo ========================================
echo [17/25] NEXT_PUBLIC_WHATSAPP_NUMBER
echo ========================================
echo.
echo +5521982536229 | vercel env add NEXT_PUBLIC_WHATSAPP_NUMBER production preview development

echo.
echo ========================================
echo [18/25] NEXT_PUBLIC_COMPANY_WHATSAPP
echo ========================================
echo.
echo +5521999999999 | vercel env add NEXT_PUBLIC_COMPANY_WHATSAPP production preview development

echo.
echo ========================================
echo [19/25] R2_PUBLIC_URL
echo ========================================
echo.
echo https://pub-73a8ecec23ab4848ac8b62215e552c38.r2.dev | vercel env add R2_PUBLIC_URL production preview development

echo.
echo ========================================
echo [20/25] CRON_SECRET
echo ========================================
echo.
echo h5IWt1KRJQBDUFTKPdByrSBw3MviDEf1x/ebfdEFLic= | vercel env add CRON_SECRET production

echo.
echo ========================================
echo [21/25] DEEPSEEK_API_KEY (Opcional)
echo ========================================
echo.
echo sk-bd4fcea553014e8d92d0afba35342638 | vercel env add DEEPSEEK_API_KEY production preview development

echo.
echo ========================================
echo   VARIAVEIS ADICIONADAS COM SUCESSO!
echo ========================================
echo.
echo Verificando variaveis configuradas...
vercel env ls

echo.
echo ========================================
echo   INICIANDO REDEPLOY
echo ========================================
echo.
set /p DEPLOY="Fazer redeploy agora? (S/N): "
if /i "%DEPLOY%"=="S" (
    echo.
    echo Executando deploy em producao...
    vercel --prod --yes

    echo.
    echo ========================================
    echo   DEPLOY CONCLUIDO!
    echo ========================================
    echo.
    echo Aplicacao disponivel em:
    echo https://versati-glass.vercel.app
    echo.
)

echo.
echo ========================================
echo   PROXIMOS PASSOS
echo ========================================
echo.
echo 1. Aguarde o deploy finalizar (2-3 minutos)
echo 2. Acesse: https://versati-glass.vercel.app
echo 3. Teste o login/registro
echo 4. Teste o chat IA
echo 5. Configure webhooks:
echo    - Twilio: https://versatiglass.vercel.app/api/whatsapp/webhook
echo    - Stripe: https://versatiglass.vercel.app/api/payments/webhook
echo.
pause
