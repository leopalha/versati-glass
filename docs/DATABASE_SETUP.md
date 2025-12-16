# 🗄️ Configuração do Banco de Dados - Versati Glass

**Status:** ⚠️ Requer ação do usuário
**Data:** 16 Dezembro 2024

---

## ✅ O que já foi feito

1. ✅ Expandido `prisma/seed.test.ts` com **13 produtos** completos do catálogo
2. ✅ Criado arquivo `.env` com DATABASE_URL padrão
3. ✅ Atualizado `.env.local` com DATABASE_URL padrão
4. ✅ Atualizado `.env.test` com placeholder e instruções

---

## 🔴 Próximos Passos (VOCÊ PRECISA FAZER)

### Opção 1: PostgreSQL Local (Recomendado para desenvolvimento)

#### 1.1 Instalar PostgreSQL

Se você ainda não tem PostgreSQL instalado:

**Windows:**
```bash
# Baixar e instalar:
https://www.postgresql.org/download/windows/

# Ou via Chocolatey:
choco install postgresql

# Ou via Scoop:
scoop install postgresql
```

**Mac:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux:**
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

#### 1.2 Criar Banco de Dados

```bash
# Conectar ao PostgreSQL como superuser
psql -U postgres

# Criar banco de dados
CREATE DATABASE versatiglass;

# Criar usuário (se necessário)
CREATE USER postgres WITH PASSWORD 'postgres';

# Dar permissões
GRANT ALL PRIVILEGES ON DATABASE versatiglass TO postgres;

# Sair
\q
```

#### 1.3 Configurar Credenciais

Edite o arquivo `.env` na raiz do projeto com suas credenciais:

```bash
# .env
DATABASE_URL="postgresql://SEU_USUARIO:SUA_SENHA@localhost:5432/versatiglass"
```

Exemplo se suas credenciais são diferentes:
```bash
DATABASE_URL="postgresql://admin:minhasenha123@localhost:5432/versatiglass"
```

#### 1.4 Aplicar Schema

```bash
pnpm db:push
```

#### 1.5 Popular com Dados de Teste

```bash
pnpm db:seed:test
```

---

### Opção 2: Railway / Supabase / Neon (Cloud)

Se preferir usar um banco na nuvem:

#### Railway (Recomendado)

1. Acesse https://railway.app/
2. Crie novo projeto → Add PostgreSQL
3. Copie a `DATABASE_URL` nas variáveis
4. Cole no arquivo `.env`:

```bash
DATABASE_URL="postgresql://postgres:ABC123...@containers-us-west-12.railway.app:6543/railway"
```

5. Execute:

```bash
pnpm db:push
pnpm db:seed:test
```

#### Supabase

1. Acesse https://supabase.com/
2. Crie novo projeto
3. Vá em Settings → Database → Connection String (URI)
4. Cole no `.env`
5. Execute os comandos acima

#### Neon

1. Acesse https://neon.tech/
2. Crie novo projeto
3. Copie connection string
4. Configure `.env`
5. Execute os comandos

---

## 📊 Dados de Teste Criados

Após rodar `pnpm db:seed:test`, você terá:

### 👥 Usuários (2)

```
Admin:    admin@versatiglass.com / admin123
Customer: customer@versatiglass.com / customer123
```

### 📦 Produtos (13)

**Box para Banheiro (3):**
- Box Frontal Incolor 8mm - R$ 420/m²
- Box de Canto (L) Fumê 8mm - R$ 480/m²
- Box de Abrir Incolor 10mm Premium - R$ 550/m²

**Espelhos (2):**
- Espelho Bisotado 4mm - R$ 320/m²
- Espelho Bronze 4mm - R$ 350/m²

**Guarda-Corpo (2):**
- Guarda-Corpo Incolor 10mm - R$ 680/m²
- Guarda-Corpo Verde 12mm - R$ 850/m²

**Portas (2):**
- Porta Pivotante 10mm - R$ 2.800 (fixo)
- Porta de Abrir 8mm - R$ 2.200 (fixo)

**Fechamentos (2):**
- Cortina de Vidro para Sacada - R$ 520/m²
- Fachada Estrutural Spider Glass - Sob consulta

**Tampos e Prateleiras (2):**
- Tampo de Vidro Temperado 10mm - R$ 380/m²
- Prateleira de Vidro 8mm - R$ 280/m²

### 📄 Orçamentos (1)

- ORC-TEST-001 - Status: DRAFT - R$ 1.500

---

## 🧪 Testar Após Configuração

### 1. Verificar Conexão

```bash
pnpm prisma db push
```

Se funcionar, verá: ✅ "The database is already in sync with the Prisma schema"

### 2. Popular Dados

```bash
pnpm db:seed:test
```

Deve ver:
```
🌱 Seeding test database for E2E tests...
✅ Database cleaned
✅ Users created
✅ 13 products created (6 categories)
✅ Test quote created
🎉 Test seed completed successfully!
```

### 3. Abrir Prisma Studio (Opcional)

```bash
pnpm db:studio
```

Abre interface visual em http://localhost:5555 para ver os dados.

### 4. Rodar Testes E2E

```bash
pnpm test:e2e
```

---

## ❌ Troubleshooting

### Erro: "Authentication failed"

**Causa:** Credenciais incorretas no DATABASE_URL

**Solução:**
1. Verifique usuário e senha do PostgreSQL
2. Tente conectar manualmente: `psql -U seu_usuario -d versatiglass`
3. Se falhar, recrie usuário ou use postgres default

### Erro: "database versatiglass does not exist"

**Causa:** Banco não foi criado

**Solução:**
```bash
psql -U postgres -c "CREATE DATABASE versatiglass;"
```

### Erro: "Connection refused"

**Causa:** PostgreSQL não está rodando

**Solução:**

**Windows:**
```bash
# Services.msc → PostgreSQL → Start
net start postgresql-x64-14
```

**Mac:**
```bash
brew services start postgresql
```

**Linux:**
```bash
sudo systemctl start postgresql
```

### Erro: "P1001: Can't reach database server"

**Causa:** Host/porta incorretos

**Solução:**
- Verifique se PostgreSQL está na porta 5432: `netstat -an | findstr 5432`
- Ou tente porta alternativa: 5433

---

## 📝 Arquivos Configurados

✅ `.env` - Criado com DATABASE_URL padrão
✅ `.env.local` - Atualizado com DATABASE_URL
✅ `.env.test` - Atualizado com instruções
✅ `prisma/seed.test.ts` - Expandido com 13 produtos do catálogo

---

## 🆘 Precisa de Ajuda?

Se você está tendo problemas, as opções mais simples são:

1. **Railway** (https://railway.app/) - Gratuito, setup em 2 min
2. **Supabase** (https://supabase.com/) - Gratuito, fácil
3. **Docker** - Se você tem Docker instalado:

```bash
docker run --name versatiglass-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=versatiglass \
  -p 5432:5432 \
  -d postgres:16
```

Depois use: `DATABASE_URL="postgresql://postgres:postgres@localhost:5432/versatiglass"`

---

**Documento gerado por:** Claude Code
**Última atualização:** 16 Dezembro 2024
