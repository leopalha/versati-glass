@echo off
echo Atualizando credenciais nos arquivos .env...

:: Atualizar .env
powershell -Command "(Get-Content .env) -replace 'DATABASE_URL=.*', 'DATABASE_URL=\"postgresql://postgres:postgres@localhost:5432/versatiglass\"' | Set-Content .env"

:: Atualizar .env.test
powershell -Command "(Get-Content .env.test) -replace 'DATABASE_URL=.*', 'DATABASE_URL=\"postgresql://postgres:postgres@localhost:5432/versatiglass\"' | Set-Content .env.test"

:: Atualizar .env.local se existir
if exist .env.local (
    powershell -Command "(Get-Content .env.local) -replace 'DATABASE_URL=.*', 'DATABASE_URL=\"postgresql://postgres:postgres@localhost:5432/versatiglass\"' | Set-Content .env.local"
)

echo.
echo ============================================
echo Credenciais atualizadas com sucesso!
echo ============================================
echo.
echo Agora execute:
echo pnpm db:seed:test
echo.
pause
