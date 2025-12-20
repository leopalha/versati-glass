#!/bin/bash

# Script para configurar variáveis de ambiente no Vercel
# Execute: bash setup-env.sh

echo "🚀 Configurando variáveis de ambiente no Vercel..."

# NextAuth
echo "https://versati-glass.vercel.app" | vercel env add NEXTAUTH_URL production --force
echo "h5IWt1KRJQBDUFTKPdByrSBw3MviDEf1x/ebfdEFLic=" | vercel env add NEXTAUTH_SECRET production --force
echo "h5IWt1KRJQBDUFTKPdByrSBw3MviDEf1x/ebfdEFLic=" | vercel env add AUTH_SECRET production --force

# Database - VOCÊ PRECISA SUBSTITUIR COM SUA URL DO RAILWAY
echo "IMPORTANTE: Configure DATABASE_URL manualmente com a URL do Railway!"
# echo "sua_url_railway_aqui" | vercel env add DATABASE_URL production --force

# Twilio WhatsApp
echo "AC3c1339fa3ecac14202ae6b810019f0ae" | vercel env add TWILIO_ACCOUNT_SID production --force
echo "7f111a7e0eab7f58edc27ec7e326bacc" | vercel env add TWILIO_AUTH_TOKEN production --force
echo "whatsapp:+18207320393" | vercel env add TWILIO_WHATSAPP_NUMBER production --force
echo "+5521995354010" | vercel env add NEXT_PUBLIC_COMPANY_WHATSAPP production --force

# Google OAuth & Calendar
echo "326750104611-ej8pmihco1kmlr96ij165ocbcdrcj7qh.apps.googleusercontent.com" | vercel env add GOOGLE_CLIENT_ID production --force
echo "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" | vercel env add GOOGLE_CLIENT_SECRET production --force
echo "primary" | vercel env add GOOGLE_CALENDAR_ID production --force

# AI Services
echo "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" | vercel env add GROQ_API_KEY production --force
echo "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" | vercel env add OPENAI_API_KEY production --force

# Email (Resend)
echo "re_69GeoFRi_2k665YiyAtx7QvaXaG6TaQ79" | vercel env add RESEND_API_KEY production --force
echo "onboarding@resend.dev" | vercel env add EMAIL_FROM production --force

# Stripe
echo "pk_test_51SVcchB3FKITuv4SNXYFipOV4Bp2jciQ63sK1l32OsaayMIhfAYxTn40MWwGUUO5MTgMpJM9tIVrUXrgJVqn5mPY00LZQTdiCR" | vercel env add STRIPE_PUBLISHABLE_KEY production --force
echo "sk_test_51SVcchB3FKITuv4Srjs27HtsHx6Apm6mKBdQGn39WZvCgrRl9aiDB2PkXz2y7R25COVnJOAMBqfhpXHuTVquC8QE00GySQswkO" | vercel env add STRIPE_SECRET_KEY production --force
echo "pk_test_51SVcchB3FKITuv4SNXYFipOV4Bp2jciQ63sK1l32OsaayMIhfAYxTn40MWwGUUO5MTgMpJM9tIVrUXrgJVqn5mPY00LZQTdiCR" | vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production --force

# App URLs
echo "https://versati-glass.vercel.app" | vercel env add NEXT_PUBLIC_APP_URL production --force

echo "✅ Variáveis de ambiente configuradas!"
echo "⚠️  ATENÇÃO: Configure DATABASE_URL manualmente no dashboard do Vercel"
echo "🔗 https://vercel.com/leopalhas-projects/versati-glass/settings/environment-variables"
