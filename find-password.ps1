# Script PowerShell para encontrar senha PostgreSQL
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Testando Senhas PostgreSQL Automaticamente" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$psql = "C:\Program Files\PostgreSQL\17\bin\psql.exe"
$passwords = @(
    "Mercedes2025*",
    "Mercedes2025**",
    "",
    "admin",
    "postgres",
    "root",
    "password"
)

$found = $false

foreach ($pwd in $passwords) {
    if ($pwd -eq "") {
        Write-Host "Tentando: [senha vazia]" -ForegroundColor Yellow
    } else {
        Write-Host "Tentando: $pwd" -ForegroundColor Yellow
    }

    $env:PGPASSWORD = $pwd

    # Tentar conectar e executar comando
    $result = & $psql -U postgres -d postgres -c "SELECT 1;" 2>&1

    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "============================================" -ForegroundColor Green
        Write-Host "SENHA ENCONTRADA!" -ForegroundColor Green
        Write-Host "============================================" -ForegroundColor Green
        Write-Host ""
        if ($pwd -eq "") {
            Write-Host "Senha: [VAZIA - sem senha]" -ForegroundColor Green
            $pwd = ""
        } else {
            Write-Host "Senha: $pwd" -ForegroundColor Green
        }

        Write-Host ""
        Write-Host "Resetando para senha padrao 'postgres'..." -ForegroundColor Cyan

        & $psql -U postgres -d postgres -c "ALTER USER postgres PASSWORD 'postgres';" 2>&1 | Out-Null

        if ($LASTEXITCODE -eq 0) {
            Write-Host "Senha alterada com sucesso!" -ForegroundColor Green

            # Atualizar .env
            Write-Host ""
            Write-Host "Atualizando arquivos .env..." -ForegroundColor Cyan

            $envContent = Get-Content .env -Raw
            $envContent = $envContent -replace 'DATABASE_URL="postgresql://[^"]+"', 'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/versatiglass"'
            Set-Content .env $envContent

            $envTestContent = Get-Content .env.test -Raw
            $envTestContent = $envTestContent -replace 'DATABASE_URL="postgresql://[^"]+"', 'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/versatiglass"'
            Set-Content .env.test $envTestContent

            Write-Host "Arquivos atualizados!" -ForegroundColor Green
            Write-Host ""
            Write-Host "Testando conexao final..." -ForegroundColor Cyan

            $env:PGPASSWORD = "postgres"
            $testResult = & $psql -U postgres -d postgres -c "SELECT version();" 2>&1

            if ($LASTEXITCODE -eq 0) {
                Write-Host ""
                Write-Host "============================================" -ForegroundColor Green
                Write-Host "TUDO PRONTO!" -ForegroundColor Green
                Write-Host "============================================" -ForegroundColor Green
                Write-Host ""
                Write-Host "Nova senha PostgreSQL: postgres" -ForegroundColor Green
                Write-Host "Usuario: postgres" -ForegroundColor Green
                Write-Host ""
                Write-Host "Proximo passo: pnpm db:seed:test" -ForegroundColor Cyan
            }
        }

        $found = $true
        break
    }
}

if (-not $found) {
    Write-Host ""
    Write-Host "============================================" -ForegroundColor Red
    Write-Host "NENHUMA SENHA FUNCIONOU" -ForegroundColor Red
    Write-Host "============================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Opcoes:" -ForegroundColor Yellow
    Write-Host "1. Abrir pgAdmin e verificar senha que funciona la" -ForegroundColor White
    Write-Host "2. Resetar via pg_hba.conf (executar reset-postgres-password.bat como Admin)" -ForegroundColor White
    Write-Host "3. Verificar se PostgreSQL esta rodando (Services.msc)" -ForegroundColor White
}

Write-Host ""
Read-Host "Pressione Enter para fechar"
