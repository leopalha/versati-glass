@echo off
echo ============================================
echo QUICK FIX - Reset PostgreSQL Password
echo ============================================
echo.

set PSQL="C:\Program Files\PostgreSQL\17\bin\psql.exe"

echo Tentando resetar senha do PostgreSQL...
echo.

echo Tentativa 1: Senha Mercedes2025*
set PGPASSWORD=Mercedes2025*
%PSQL% -U postgres -d postgres -c "ALTER USER postgres PASSWORD 'postgres';" 2>nul
if %errorlevel% equ 0 goto success

echo Tentativa 2: Senha Mercedes2025**
set PGPASSWORD=Mercedes2025**
%PSQL% -U postgres -d postgres -c "ALTER USER postgres PASSWORD 'postgres';" 2>nul
if %errorlevel% equ 0 goto success

echo Tentativa 3: Senha vazia
set PGPASSWORD=
%PSQL% -U postgres -d postgres -c "ALTER USER postgres PASSWORD 'postgres';" 2>nul
if %errorlevel% equ 0 goto success

echo Tentativa 4: Senha admin
set PGPASSWORD=admin
%PSQL% -U postgres -d postgres -c "ALTER USER postgres PASSWORD 'postgres';" 2>nul
if %errorlevel% equ 0 goto success

echo.
echo ============================================
echo TODAS AS TENTATIVAS FALHARAM
echo ============================================
echo.
echo Voce precisa:
echo 1. Abrir pgAdmin
echo 2. Conectar ao servidor PostgreSQL
echo 3. Anotar a senha que funciona
echo 4. OU resetar via pg_hba.conf (executar reset-postgres-password.bat como Admin)
echo.
pause
exit /b 1

:success
echo.
echo ============================================
echo SUCESSO! Senha resetada para: postgres
echo ============================================
echo.
echo Atualizando arquivos .env...

:: Atualizar .env
powershell -Command "(Get-Content .env -Raw) -replace 'DATABASE_URL=\"postgresql://[^\"]+\"', 'DATABASE_URL=\"postgresql://postgres:postgres@localhost:5432/versatiglass\"' | Set-Content .env"

:: Atualizar .env.test
powershell -Command "(Get-Content .env.test -Raw) -replace 'DATABASE_URL=\"postgresql://[^\"]+\"', 'DATABASE_URL=\"postgresql://postgres:postgres@localhost:5432/versatiglass\"' | Set-Content .env.test"

echo.
echo Arquivos .env atualizados!
echo.
echo Testando conexao...
pnpm db:seed:test
echo.
pause
