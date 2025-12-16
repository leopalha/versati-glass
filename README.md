# 🔷 VERSATI GLASS

Plataforma digital completa para vidraçaria premium.

**Transparência que transforma espaços**

## Stack Tecnológica

- **Frontend:** Next.js 14 (App Router) + React 18 + TypeScript
- **Styling:** Tailwind CSS + Framer Motion
- **Backend:** Node.js + Prisma ORM + PostgreSQL
- **Auth:** NextAuth.js (v5)
- **Payments:** Stripe
- **WhatsApp:** Twilio + Anthropic Claude
- **Email:** Resend
- **Deploy:** Vercel + Railway

## Início Rápido

```bash
# Instalar dependências
pnpm install

# Configurar env
cp .env.example .env.local
# Editar .env.local com suas credenciais

# Rodar migrações
pnpm db:push

# Seed (opcional)
pnpm db:seed

# Iniciar desenvolvimento
pnpm dev
```

Acessar: http://localhost:3000

## Comandos Disponíveis

```bash
pnpm dev          # Desenvolvimento
pnpm build        # Build produção
pnpm start        # Produção
pnpm lint         # ESLint
pnpm type-check   # TypeScript

# Banco de dados
pnpm db:push      # Sincronizar schema
pnpm db:migrate   # Migrar
pnpm db:generate  # Gerar Prisma Client
pnpm db:studio    # Prisma Studio
pnpm db:seed      # Popular banco
```

## Estrutura do Projeto

```
versati-glass/
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── (public)/      # Páginas públicas
│   │   ├── portal/        # Portal do cliente
│   │   ├── admin/         # Admin
│   │   └── api/           # API Routes
│   ├── components/        # Componentes React
│   │   ├── ui/           # Primitivos
│   │   ├── layout/       # Layout
│   │   └── features/     # Features
│   ├── lib/              # Utilitários
│   ├── services/         # Business logic
│   └── types/            # TypeScript types
├── prisma/               # Schema & migrations
├── docs/                 # Documentação
└── public/               # Assets
```

## Documentação

- [Activation Prompt](docs/00_ACTIVATION_PROMPT.md)
- [Conceito da Marca](docs/01_CONCEITO_VERSATI.md)
- [Design System](docs/02_DESIGN_SYSTEM.md)
- [PRD](docs/03_PRD.md)
- [Dev Brief](docs/07_DEV_BRIEF.md)
- [Tasks/Roadmap](docs/tasks.md)

## Licença

Proprietary - © 2024 Versati Glass
