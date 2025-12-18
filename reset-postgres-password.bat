@echo off
echo ====================================
echo RESET POSTGRESQL PASSWORD - PASSO A PASSO
echo ====================================
echo.
echo Este script vai te guiar para resetar a senha do PostgreSQL
echo.
pause

echo.
echo PASSO 1: Localizando arquivo pg_hba.conf...
echo.

:: Tentar encontrar pg_hba.conf nas localizações comuns
set PGDATA_PATHS=C:\Program Files\PostgreSQL\16\data C:\Program Files\PostgreSQL\15\data C:\Program Files\PostgreSQL\14\data C:\Program Files (x86)\PostgreSQL\16\data C:\Program Files (x86)\PostgreSQL\15\data

for %%p in (%PGDATA_PATHS%) do (
    if exist "%%p\pg_hba.conf" (
        echo ENCONTRADO: %%p\pg_hba.conf
        set PGDATA=%%p
        goto :found
    )
)

echo ERRO: Nao encontrei o arquivo pg_hba.conf
echo.
echo Procure manualmente em: C:\Program Files\PostgreSQL\
echo Ou execute: dir /s /b "C:\Program Files\PostgreSQL\pg_hba.conf"
echo.
pause
exit /b 1

:found
echo.
echo Arquivo encontrado em: %PGDATA%
echo.
pause

echo.
echo PASSO 2: Fazendo backup do pg_hba.conf...
copy "%PGDATA%\pg_hba.conf" "%PGDATA%\pg_hba.conf.backup"
if %errorlevel% neq 0 (
    echo.
    echo ERRO: Precisa executar como Administrador!
    echo Clique com botao direito neste arquivo e escolha "Executar como administrador"
    pause
    exit /b 1
)
echo Backup criado: %PGDATA%\pg_hba.conf.backup
echo.
pause

echo.
echo PASSO 3: Modificando pg_hba.conf para permitir acesso sem senha...
echo.

:: Criar novo pg_hba.conf com trust authentication
(
echo # TYPE  DATABASE        USER            ADDRESS                 METHOD
echo # Temporariamente permitindo acesso sem senha para resetar
echo host    all             all             127.0.0.1/32            trust
echo host    all             all             ::1/128                 trust
echo local   all             all                                     trust
) > "%PGDATA%\pg_hba.conf.new"

move /y "%PGDATA%\pg_hba.conf.new" "%PGDATA%\pg_hba.conf"
echo Configuracao atualizada!
echo.
pause

echo.
echo PASSO 4: Reiniciando servico PostgreSQL...
echo.

:: Tentar encontrar o serviço PostgreSQL
for %%s in (postgresql-x64-16 postgresql-x64-15 postgresql-x64-14 PostgreSQL) do (
    sc query %%s >nul 2>&1
    if %errorlevel% equ 0 (
        echo Encontrado servico: %%s
        net stop %%s
        timeout /t 2 /nobreak >nul
        net start %%s
        goto :service_found
    )
)

echo AVISO: Servico PostgreSQL nao encontrado automaticamente
echo Por favor, reinicie manualmente via:
echo - Services.msc ^(procure por PostgreSQL^)
echo - Ou Task Manager ^> Services tab
echo.
pause

:service_found
echo.
echo PASSO 5: Aguardando PostgreSQL iniciar...
timeout /t 5 /nobreak
echo.

echo.
echo PASSO 6: Resetando senha do usuario postgres...
echo.
echo Executando comando SQL para mudar senha...
echo.

:: Tentar encontrar psql.exe
set PSQL_PATHS=C:\Program Files\PostgreSQL\16\bin C:\Program Files\PostgreSQL\15\bin C:\Program Files\PostgreSQL\14\bin

for %%p in (%PSQL_PATHS%) do (
    if exist "%%p\psql.exe" (
        echo Usando psql em: %%p
        "%%p\psql.exe" -U postgres -d postgres -c "ALTER USER postgres PASSWORD 'postgres';"
        if %errorlevel% equ 0 (
            echo.
            echo ============================================
            echo SUCESSO! Senha resetada para: postgres
            echo ============================================
            echo.
            goto :password_reset
        )
    )
)

echo.
echo AVISO: psql.exe nao encontrado. Execute manualmente:
echo 1. Abra pgAdmin ou Command Prompt
echo 2. Execute: psql -U postgres -d postgres
echo 3. Digite: ALTER USER postgres PASSWORD 'postgres';
echo 4. Digite: \q
echo.
pause

:password_reset
echo.
echo PASSO 7: Restaurando configuracao de seguranca...
echo.

:: Restaurar pg_hba.conf com scram-sha-256
copy "%PGDATA%\pg_hba.conf.backup" "%PGDATA%\pg_hba.conf"
echo Configuracao restaurada!
echo.

echo PASSO 8: Reiniciando PostgreSQL novamente...
echo.
for %%s in (postgresql-x64-16 postgresql-x64-15 postgresql-x64-14 PostgreSQL) do (
    sc query %%s >nul 2>&1
    if %errorlevel% equ 0 (
        net stop %%s
        timeout /t 2 /nobreak >nul
        net start %%s
        goto :done
    )
)

:done
echo.
echo ============================================
echo CONCLUIDO!
echo ============================================
echo.
echo Nova senha do PostgreSQL: postgres
echo Usuario: postgres
echo.
echo Atualize seus arquivos .env:
echo DATABASE_URL="postgresql://postgres:postgres@localhost:5432/versatiglass"
echo.
pause
