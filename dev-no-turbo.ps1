# Script para iniciar Next.js dev server SEM Turbopack
# Resolve problema de privilégios de symlink no Windows

Write-Host "Iniciando Next.js dev server (sem Turbopack)..." -ForegroundColor Green
Write-Host ""

# Define variável de ambiente para desabilitar Turbopack
$env:TURBOPACK = "0"

# Inicia o servidor
pnpm run dev
