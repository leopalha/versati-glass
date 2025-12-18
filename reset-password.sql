-- Script para resetar senha do PostgreSQL
-- Execute: psql -U postgres -d postgres -f reset-password.sql

ALTER USER postgres PASSWORD 'postgres';

-- Confirmar alteração
\echo 'Senha do usuario postgres alterada para: postgres'
