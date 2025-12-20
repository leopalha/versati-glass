# Script de Configuração do Vercel - Versati Glass
# Execute este script no PowerShell após obter a DATABASE_URL do Railway

Write-Host "🚀 Configurando variáveis de ambiente no Vercel..." -ForegroundColor Cyan
Write-Host ""

# Função para adicionar variável no Vercel
function Add-VercelEnv {
    param($name, $value, $sensitive = $false)

    Write-Host "Adicionando $name..." -ForegroundColor Yellow

    if ($sensitive) {
        # Para valores sensíveis, use input interativo
        vercel env add $name production
    } else {
        # Para valores não sensíveis, pipe direto
        $value | vercel env add $name production
    }
}

Write-Host "📌 PASSO 1: Configure DATABASE_URL" -ForegroundColor Green
Write-Host "Acesse: https://railway.app" -ForegroundColor White
Write-Host "1. Selecione seu projeto PostgreSQL" -ForegroundColor White
Write-Host "2. Vá em 'Variables' → Copie DATABASE_URL" -ForegroundColor White
Write-Host "3. Execute: vercel env add DATABASE_URL production" -ForegroundColor White
Write-Host "4. Cole a URL quando solicitado" -ForegroundColor White
Write-Host ""
Write-Host "Pressione ENTER após configurar DATABASE_URL..." -ForegroundColor Cyan
Read-Host

Write-Host ""
Write-Host "📌 PASSO 2: Configurando demais variáveis..." -ForegroundColor Green
Write-Host ""

# NextAuth
"https://versati-glass.vercel.app" | vercel env add NEXTAUTH_URL production
"h5IWt1KRJQBDUFTKPdByrSBw3MviDEf1x/ebfdEFLic=" | vercel env add NEXTAUTH_SECRET production
"h5IWt1KRJQBDUFTKPdByrSBw3MviDEf1x/ebfdEFLic=" | vercel env add AUTH_SECRET production

# Twilio WhatsApp
"AC3c1339fa3ecac14202ae6b810019f0ae" | vercel env add TWILIO_ACCOUNT_SID production
"7f111a7e0eab7f58edc27ec7e326bacc" | vercel env add TWILIO_AUTH_TOKEN production
"whatsapp:+18207320393" | vercel env add TWILIO_WHATSAPP_NUMBER production
"+5521995354010" | vercel env add NEXT_PUBLIC_COMPANY_WHATSAPP production

# Google OAuth & Calendar
"326750104611-ej8pmihco1kmlr96ij165ocbcdrcj7qh.apps.googleusercontent.com" | vercel env add GOOGLE_CLIENT_ID production
"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" | vercel env add GOOGLE_CLIENT_SECRET production
"primary" | vercel env add GOOGLE_CALENDAR_ID production

# AI Services
"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" | vercel env add GROQ_API_KEY production
"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" | vercel env add OPENAI_API_KEY production

# Email (Resend)
"re_69GeoFRi_2k665YiyAtx7QvaXaG6TaQ79" | vercel env add RESEND_API_KEY production
"onboarding@resend.dev" | vercel env add EMAIL_FROM production

# Stripe
"pk_test_51SVcchB3FKITuv4SNXYFipOV4Bp2jciQ63sK1l32OsaayMIhfAYxTn40MWwGUUO5MTgMpJM9tIVrUXrgJVqn5mPY00LZQTdiCR" | vercel env add STRIPE_PUBLISHABLE_KEY production
"sk_test_51SVcchB3FKITuv4Srjs27HtsHx6Apm6mKBdQGn39WZvCgrRl9aiDB2PkXz2y7R25COVnJOAMBqfhpXHuTVquC8QE00GySQswkO" | vercel env add STRIPE_SECRET_KEY production
"pk_test_51SVcchB3FKITuv4SNXYFipOV4Bp2jciQ63sK1l32OsaayMIhfAYxTn40MWwGUUO5MTgMpJM9tIVrUXrgJVqn5mPY00LZQTdiCR" | vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production

# App URLs
"https://versati-glass.vercel.app" | vercel env add NEXT_PUBLIC_APP_URL production

Write-Host ""
Write-Host "✅ Variáveis configuradas com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "📌 PRÓXIMOS PASSOS:" -ForegroundColor Cyan
Write-Host "1. Execute a migration: railway run npx prisma migrate deploy" -ForegroundColor White
Write-Host "2. Faça redeploy: vercel --prod --force" -ForegroundColor White
Write-Host "3. Acesse: https://versati-glass.vercel.app" -ForegroundColor White
Write-Host ""
