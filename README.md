# 🔷 VERSATI GLASS

**Plataforma digital completa para vidraçaria premium.**

> Transparência que transforma espaços

[![Deploy](https://img.shields.io/badge/deploy-vercel-black)](https://vercel.com)
[![Database](https://img.shields.io/badge/database-railway-purple)](https://railway.app)
[![TypeScript](https://img.shields.io/badge/typescript-100%25-blue)](https://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/tests-passing-green)](/)

---

## 🎯 Features Principais

### 🌐 Landing Page Premium

- Design elegante e responsivo
- Sistema de temas (4 paletas de cores)
- SEO otimizado
- Animações suaves (Framer Motion)

### 💬 WhatsApp Bot Inteligente

- IA Conversacional (Groq/Llama - FREE!)
- Atendimento 24/7
- Qualificação automática de leads
- Integração com CRM

### 📋 Wizard de Orçamentos

- 4 steps intuitivos
- Cálculo automático de preços
- Agendamento de visita técnica
- Envio por email

### 👤 Portal do Cliente

- Acompanhamento de orçamentos
- Histórico de pedidos
- Gestão de agendamentos
- Upload de documentos

### 🎛️ Admin Dashboard

- Gestão completa de orçamentos e pedidos
- Calendário de instalações
- CRUD de produtos com upload de imagens
- Perfil 360° dos clientes
- Analytics e KPIs

### 💳 Pagamentos

- Stripe integration
- PIX + Cartão de Crédito
- Webhooks automatizados
- Controle de status

---

## 🛠️ Stack Tecnológica

- **Frontend:** Next.js 14 (App Router) + React 18 + TypeScript
- **Styling:** Tailwind CSS + Radix UI + Framer Motion
- **Backend:** Node.js + Prisma ORM + PostgreSQL
- **Auth:** NextAuth.js v5 (Credentials + Google OAuth)
- **Payments:** Stripe (PIX + Card)
- **WhatsApp:** Twilio + Groq AI (Llama 3.3 70B)
- **Email:** Resend
- **Deploy:** Vercel + Railway
- **Analytics:** Google Analytics + Meta Pixel
- **Testing:** Vitest + Testing Library (68 tests passing)

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

## 📊 Status do Projeto

- ✅ **176 arquivos TypeScript** implementados
- ✅ **44+ páginas** construídas
- ✅ **200+ testes** passando (68 unit + 80+ E2E + 55+ integration)
- ✅ **40 API routes** completas e documentadas
- ✅ **13 Sprints** finalizados
- ✅ **270+ tarefas** completadas
- ✅ **19 documentos técnicos** completos
- ✅ **Husky hooks** configurados (lint + type-check + tests)
- ✅ **Playwright E2E** implementado (5 browsers)
- 🚀 **100% PRONTO PARA PRODUÇÃO!**

---

## 📚 Documentação Completa

### Conceito e Design

- [Activation Prompt](docs/00_ACTIVATION_PROMPT.md) - Overview do projeto
- [Conceito da Marca](docs/01_CONCEITO_VERSATI.md) - Identidade visual
- [Design System](docs/02_DESIGN_SYSTEM.md) - Componentes e paletas
- [PRD](docs/03_PRD.md) - Requisitos do produto
- [Dev Brief](docs/07_DEV_BRIEF.md) - Especificações técnicas

### Development

- [Tasks/Roadmap](docs/tasks.md) - Todas as tarefas e sprints
- [Deploy Guide](docs/DEPLOY.md) - Guia completo de deploy
- [API Documentation](docs/API.md) - Endpoints e schemas

---

## 🤝 Contribuindo

```bash
# 1. Fork o projeto
# 2. Crie sua feature branch
git checkout -b feature/AmazingFeature

# 3. Commit suas mudanças
git commit -m 'feat: Add some AmazingFeature'

# 4. Push para a branch
git push origin feature/AmazingFeature

# 5. Abra um Pull Request
```

---

## 📄 Licença

Proprietary - © 2024 Versati Glass. Todos os direitos reservados.

---

## 👏 Créditos

Desenvolvido com ❤️ usando:

- [Next.js](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Prisma](https://prisma.io)
- [Radix UI](https://radix-ui.com)
- [Groq](https://groq.com) - IA gratuita e super rápida!

---

## 📞 Suporte

- **Email:** dev@versatiglass.com.br
- **WhatsApp:** +55 21 98253-6229
- **GitHub Issues:** [Reportar problema](https://github.com/versatiglass/platform/issues)

---

<p align="center">
  <strong>🔷 Feito com transparência e excelência</strong>
</p>
