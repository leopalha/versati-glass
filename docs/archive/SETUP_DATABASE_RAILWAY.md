# Configuração do Banco de Dados Railway

## Problema Atual

O projeto está configurado com PostgreSQL local (`localhost:5432`), mas você está usando Railway para produção. Isso causa:

- Histórico de conversa sumindo ao fazer refresh (localStorage salva no navegador, mas banco de dados é diferente)
- Dados não sincronizados entre desenvolvimento e produção

## Solução: Usar Railway em Desenvolvimento

### 1. Obter as credenciais do Railway

1. Acesse [railway.app](https://railway.app)
2. Entre no seu projeto Versati Glass
3. Clique no serviço PostgreSQL
4. Na aba **Variables**, copie as seguintes variáveis:
   - `DATABASE_URL` (connection string completa)
   - `PGHOST`
   - `PGPORT`
   - `PGUSER`
   - `PGPASSWORD`
   - `PGDATABASE`

### 2. Atualizar o arquivo `.env`

Substitua a linha atual:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/versatiglass"
```

Pela DATABASE_URL do Railway (exemplo):

```env
DATABASE_URL="postgresql://postgres:senha@containers-us-west-123.railway.app:5432/railway"
```

**IMPORTANTE:** A URL completa já inclui todas as informações necessárias:

- Usuário
- Senha
- Host
- Porta
- Nome do banco

### 3. Executar a migração (se necessário)

Se é a primeira vez usando o banco Railway:

```bash
npx prisma db push
```

Isso criará todas as tabelas no banco Railway.

### 4. Popular o banco (opcional)

Se quiser adicionar dados de teste:

```bash
npx prisma db seed
```

### 5. Reiniciar o servidor

```bash
# Parar o servidor atual (Ctrl+C)
# Iniciar novamente
npm run dev
```

## Verificação

Para verificar se está conectando corretamente:

```bash
# Teste a conexão
npx prisma studio
```

Isso abrirá uma interface visual em `http://localhost:5555` mostrando os dados do banco Railway.

## Alternativa: Usar .env.local para Railway

Se quiser manter o PostgreSQL local para alguns testes, crie um arquivo `.env.local`:

```env
# .env.local (prioridade sobre .env)
DATABASE_URL="postgresql://usuario:senha@railway.app:porta/banco"
```

Next.js lê `.env.local` antes de `.env`, então você pode alternar facilmente.

## Notas Importantes

1. **Nunca commitar** o `.env` ou `.env.local` com credenciais reais
2. O `.gitignore` já está configurado para ignorar esses arquivos
3. Em produção (Vercel/Railway), configure as variáveis de ambiente na plataforma
4. O histórico do chat ficará persistente porque estará no mesmo banco

## Próximos Passos

Após configurar:

1. Teste criar uma conversa no chat
2. Faça refresh da página
3. Verifique se o histórico permanece
4. Abra o Prisma Studio para ver os dados salvos

## Troubleshooting

**Erro de conexão:**

- Verifique se a URL está correta (copie/cole do Railway)
- Verifique se o serviço PostgreSQL está ativo no Railway
- Tente `npx prisma db push` para testar a conexão

**Tabelas não existem:**

- Execute `npx prisma db push` para criar as tabelas
- Execute `npx prisma db seed` para popular com dados de teste
