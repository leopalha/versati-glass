# 🚀 VERSATI GLASS - DEV BRIEF

**Versão:** 1.0.0  
**Data:** Dezembro 2024  
**Objetivo:** Guia rápido para desenvolvedores iniciarem no projeto

---

## INÍCIO RÁPIDO

### 1. Pré-requisitos

```bash
# Versões necessárias
node >= 20.0.0
pnpm >= 8.0.0
```

### 2. Setup do Projeto

```bash
# Clonar repositório
git clone https://github.com/versatiglass/versati-glass.git
cd versati-glass

# Instalar dependências
pnpm install

# Configurar variáveis de ambiente
cp .env.example .env.local
# Editar .env.local com suas credenciais

# Rodar migrações do banco
pnpm db:push

# Seed do banco (opcional)
pnpm db:seed

# Iniciar desenvolvimento
pnpm dev
```

### 3. URLs de Desenvolvimento

| Serviço | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Prisma Studio | http://localhost:5555 |
| API Health | http://localhost:3000/api/health |

---

## ESTRUTURA DO PROJETO

```
versati-glass/
├── app/                    # Next.js App Router
│   ├── (public)/          # Páginas públicas
│   ├── (auth)/            # Autenticação
│   ├── portal/            # Área do cliente
│   ├── admin/             # Área administrativa
│   └── api/               # API Routes
├── components/            # Componentes React
│   ├── ui/               # Primitivos (Button, Input...)
│   ├── layout/           # Header, Footer, Sidebar
│   ├── features/         # Componentes de feature
│   └── shared/           # Componentes compartilhados
├── lib/                   # Utilitários e configs
├── services/              # Business logic
├── stores/                # Zustand stores
├── hooks/                 # Custom hooks
├── types/                 # TypeScript types
├── prisma/                # Schema e migrations
└── public/                # Assets estáticos
```

---

## COMANDOS ESSENCIAIS

### Desenvolvimento

```bash
pnpm dev          # Iniciar servidor de desenvolvimento
pnpm build        # Build de produção
pnpm start        # Iniciar em produção
pnpm lint         # Verificar linting
pnpm type-check   # Verificar tipos TypeScript
```

### Banco de Dados

```bash
pnpm db:push      # Sincronizar schema (dev)
pnpm db:migrate   # Rodar migrações
pnpm db:generate  # Gerar cliente Prisma
pnpm db:studio    # Abrir Prisma Studio
pnpm db:seed      # Popular banco com dados
pnpm db:reset     # Resetar banco (cuidado!)
```

### Testes

```bash
pnpm test         # Rodar testes
pnpm test:watch   # Rodar em watch mode
pnpm test:cov     # Cobertura de testes
```

---

## CONVENÇÕES DE CÓDIGO

### Nomenclatura

| Tipo | Convenção | Exemplo |
|------|-----------|---------|
| Componentes | PascalCase | `ProductCard.tsx` |
| Hooks | camelCase + use | `useProducts.ts` |
| Utilitários | camelCase | `formatCurrency.ts` |
| Types/Interfaces | PascalCase | `Product`, `QuoteItem` |
| Constantes | UPPER_SNAKE | `MAX_FILE_SIZE` |
| Variáveis | camelCase | `isLoading`, `currentUser` |
| CSS Classes | kebab-case | `.card-header` |
| Rotas API | kebab-case | `/api/quote-items` |
| DB Tables | snake_case | `quote_items` |

### Commits (Conventional Commits)

```
feat: adicionar página de produtos
fix: corrigir cálculo de orçamento
docs: atualizar README
style: formatar código
refactor: reorganizar services
test: adicionar testes de login
chore: atualizar dependências
```

### Estrutura de Componentes

```tsx
// components/features/product-card.tsx

// 1. Imports externos
import { useState } from "react";
import Image from "next/image";

// 2. Imports internos
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

// 3. Types
interface ProductCardProps {
  product: Product;
  onSelect?: (product: Product) => void;
}

// 4. Componente
export function ProductCard({ product, onSelect }: ProductCardProps) {
  // 4.1 Hooks
  const [isLoading, setIsLoading] = useState(false);

  // 4.2 Handlers
  const handleClick = () => {
    setIsLoading(true);
    onSelect?.(product);
  };

  // 4.3 Render
  return (
    <div className="...">
      {/* JSX */}
    </div>
  );
}
```

---

## PADRÕES DE API

### Estrutura de Response

```typescript
// Sucesso
{
  success: true,
  data: { ... }
}

// Erro
{
  success: false,
  error: {
    code: "VALIDATION_ERROR",
    message: "Email inválido"
  }
}

// Lista paginada
{
  success: true,
  data: [...],
  pagination: {
    page: 1,
    limit: 10,
    total: 100,
    pages: 10
  }
}
```

### Exemplo de API Route

```typescript
// app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const querySchema = z.object({
  category: z.enum(["box", "espelhos", "vidros"]).optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = querySchema.parse(Object.fromEntries(searchParams));

    const products = await prisma.product.findMany({
      where: query.category ? { category: query.category } : undefined,
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });

    const total = await prisma.product.count({
      where: query.category ? { category: query.category } : undefined,
    });

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        pages: Math.ceil(total / query.limit),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: error.message } },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Erro interno" } },
      { status: 500 }
    );
  }
}
```

---

## AUTENTICAÇÃO

### Proteger Rotas

```typescript
// middleware.ts
import { auth } from "@/lib/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isPortal = req.nextUrl.pathname.startsWith("/portal");
  const isAdmin = req.nextUrl.pathname.startsWith("/admin");

  if ((isPortal || isAdmin) && !isLoggedIn) {
    return Response.redirect(new URL("/auth/login", req.url));
  }
});

export const config = {
  matcher: ["/portal/:path*", "/admin/:path*"],
};
```

### Uso no Cliente

```tsx
"use client";

import { useAuth } from "@/hooks/use-auth";

export function ProfilePage() {
  const { user, isLoading, logout } = useAuth();

  if (isLoading) return <Loading />;
  if (!user) return <Redirect to="/login" />;

  return (
    <div>
      <p>Olá, {user.name}</p>
      <button onClick={logout}>Sair</button>
    </div>
  );
}
```

### Uso na API

```typescript
// app/api/orders/route.ts
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
  });

  return NextResponse.json({ data: orders });
}
```

---

## ESTILIZAÇÃO

### Tailwind + Design Tokens

```tsx
// ✅ Correto - usando tokens
<div className="bg-neutral-150 border-neutral-300 text-gold-500">

// ❌ Errado - cores hardcoded
<div className="bg-[#141414] border-[#262626] text-[#C9A962]">
```

### Classes Utilitárias

```tsx
// Importar utilitário cn
import { cn } from "@/lib/utils";

// Uso condicional
<button
  className={cn(
    "px-4 py-2 rounded-lg",
    isActive && "bg-gold-500 text-black",
    isDisabled && "opacity-50 cursor-not-allowed"
  )}
>
```

### Animações com Framer Motion

```tsx
import { motion } from "framer-motion";

// Fade in up
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  Conteúdo
</motion.div>

// Stagger children
<motion.ul
  initial="hidden"
  animate="visible"
  variants={{
    visible: { transition: { staggerChildren: 0.1 } },
  }}
>
  {items.map((item) => (
    <motion.li
      key={item.id}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      {item.name}
    </motion.li>
  ))}
</motion.ul>
```

---

## FORMULÁRIOS

### React Hook Form + Zod

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().regex(/^\(\d{2}\) \d{5}-\d{4}$/, "Telefone inválido"),
});

type FormData = z.infer<typeof schema>;

export function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    // ...
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Nome"
        {...register("name")}
        error={errors.name?.message}
      />
      <Input
        label="Email"
        type="email"
        {...register("email")}
        error={errors.email?.message}
      />
      <Button type="submit" loading={isSubmitting}>
        Enviar
      </Button>
    </form>
  );
}
```

---

## FETCHING DE DADOS

### React Query

```tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Query
const { data, isLoading, error } = useQuery({
  queryKey: ["products", category],
  queryFn: () => fetchProducts(category),
});

// Mutation
const queryClient = useQueryClient();

const mutation = useMutation({
  mutationFn: createQuote,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["quotes"] });
    toast.success("Orçamento criado!");
  },
  onError: (error) => {
    toast.error(error.message);
  },
});
```

---

## VARIÁVEIS DE AMBIENTE

### Obrigatórias

```env
# Database
DATABASE_URL="postgresql://..."

# Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="sua-secret-key"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Twilio
TWILIO_ACCOUNT_SID="..."
TWILIO_AUTH_TOKEN="..."
TWILIO_WHATSAPP_NUMBER="+14155238886"

# Anthropic
ANTHROPIC_API_KEY="sk-ant-..."
```

### Acessando

```typescript
// Server-side (seguro)
const apiKey = process.env.STRIPE_SECRET_KEY;

// Client-side (apenas NEXT_PUBLIC_*)
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
```

---

## TROUBLESHOOTING

### Erro: "Cannot find module '@prisma/client'"

```bash
pnpm db:generate
```

### Erro: "ECONNREFUSED" no banco

```bash
# Verificar se o PostgreSQL está rodando
# Verificar DATABASE_URL no .env
```

### Erro: "Hydration mismatch"

```tsx
// Componente deve ser client-side
"use client";

// Ou usar useEffect para dados que mudam
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);
if (!mounted) return null;
```

### Erro: "Too many re-renders"

```tsx
// ❌ Errado
onClick={handleClick()}

// ✅ Correto
onClick={handleClick}
onClick={() => handleClick(param)}
```

### Cache do Next.js

```bash
# Limpar cache
rm -rf .next
pnpm dev
```

---

## DEPLOY

### Vercel (Frontend)

1. Conectar repositório GitHub
2. Configurar variáveis de ambiente
3. Deploy automático em cada push

### Railway (Database)

1. Criar projeto PostgreSQL
2. Copiar DATABASE_URL
3. Configurar no Vercel

### Checklist de Deploy

- [ ] Variáveis de ambiente configuradas
- [ ] Migrações aplicadas (`pnpm db:migrate`)
- [ ] Build sem erros (`pnpm build`)
- [ ] Testes passando (`pnpm test`)
- [ ] Webhooks configurados (Stripe, Twilio)
- [ ] DNS configurado

---

## DOCUMENTAÇÃO RELACIONADA

| Documento | Descrição |
|-----------|-----------|
| `00_ACTIVATION_PROMPT.md` | Contexto do agente |
| `01_CONCEITO_VERSATI.md` | Identidade da marca |
| `02_DESIGN_SYSTEM.md` | Tokens e padrões visuais |
| `03_PRD.md` | Requisitos do produto |
| `04_USER_FLOWS.md` | Fluxos de usuário |
| `05_TECHNICAL_ARCHITECTURE.md` | Arquitetura técnica |
| `06_COMPONENT_LIBRARY.md` | Biblioteca de componentes |
| `tasks.md` | Roadmap de implementação |

---

## CONTATOS

| Papel | Contato |
|-------|---------|
| Product Owner | versatiglass@gmail.com |
| WhatsApp | +55 (21) 98253-6229 |

---

**IMPORTANTE:** Sempre consulte o `tasks.md` antes de iniciar qualquer tarefa para verificar o status atual e prioridades.

---

*Versati Glass Dev Brief v1.0 - Dezembro 2024*
