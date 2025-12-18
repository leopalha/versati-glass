# 📚 VERSATI GLASS - ÍNDICE MESTRE DE DOCUMENTAÇÃO

**Versão:** 1.0.0
**Data:** 17 Dezembro 2024
**Objetivo:** Navegação centralizada para toda a documentação do projeto

---

## 🎯 NAVEGAÇÃO RÁPIDA

| Ícone | Categoria          | Documentos   | Uso                                      |
| ----- | ------------------ | ------------ | ---------------------------------------- |
| 🏢    | **Empresa**        | 1 documento  | Dados corporativos, contatos, políticas  |
| 🎨    | **Marca & Design** | 2 documentos | Identidade visual, design system         |
| 📋    | **Produto**        | 3 documentos | PRD, fluxos, especificações              |
| 💻    | **Técnico**        | 6 documentos | Arquitetura, APIs, deploy, integrações   |
| 💼    | **Negócio**        | 4 documentos | Modelo de negócio, estratégia, marketing |
| 📦    | **Operacional**    | 3 documentos | Catálogo, fornecedores, admin            |
| 🧪    | **Testes & QA**    | 4 documentos | E2E, relatórios, validação               |
| 🤖    | **IA & Automação** | 2 documentos | Arquitetura IA, resumos                  |

**Total:** 25+ documentos principais

---

## 📖 DOCUMENTAÇÃO POR CATEGORIA

### 🏢 EMPRESA (1)

#### [00_EMPRESA.md](00_EMPRESA.md)

**Dados Centralizados da Empresa**

- Identificação legal e dados corporativos
- Endereços, telefones, e-mails
- Horários de funcionamento
- Estrutura da equipe
- Políticas comerciais e garantias
- Área de cobertura
- Fornecedores e parceiros
- Conformidade e LGPD
- Templates de comunicação

> **Quando usar**: Buscar qualquer informação sobre a empresa, contatos, políticas ou dados operacionais básicos.

---

### 🎨 MARCA & DESIGN (2)

#### [01_CONCEITO_VERSATI.md](01_CONCEITO_VERSATI.md)

**Conceito de Marca**

- Identidade e tagline
- Essência da marca (pilares)
- Tom de voz e personalidade
- Paleta de cores
- Tipografia
- Guia de estilo visual
- Aplicações da marca

> **Quando usar**: Criar conteúdo, design, ou qualquer material que represente a marca.

#### [02_DESIGN_SYSTEM.md](02_DESIGN_SYSTEM.md)

**Sistema de Design (UI/UX)**

- Tokens de design
- Componentes UI
- Padrões de layout
- Responsividade
- Acessibilidade
- Animações e transições
- Guia de implementação

> **Quando usar**: Desenvolver interfaces, criar componentes, ou manter consistência visual.

---

### 📋 PRODUTO (3)

#### [03_PRD.md](03_PRD.md) ⭐ **v1.1.0 (ATUALIZADO)**

**Product Requirements Document**

- Arquitetura do ecossistema
- Módulos do sistema (Landing, Checkout, Portal, Chat IA)
- Modelos de dados (incluindo AiConversation)
- Integrações externas (Groq, OpenAI, Stripe, Twilio)
- API endpoints completos
- Fluxos de usuário
- Features e prioridades

> **Quando usar**: Entender o produto completo, planejar desenvolvimento, ou validar features.

#### [04_USER_FLOWS.md](04_USER_FLOWS.md) **v1.1.0 (ATUALIZADO)**

**Fluxos de Usuário**

- Jornada do cliente (pública)
- Fluxos do portal do cliente
- **Fluxos de IA - Chat Assistido** (novo)
  - Conversa com Ana (bot)
  - Análise de imagem (GPT-4o Vision)
  - Extração de dados
  - Escalação para humano
- Fluxos administrativos
- Diagramas detalhados

> **Quando usar**: Entender jornadas do usuário, mapear interações, ou implementar novos fluxos.

#### [09_MVP_SPEC.md](09_MVP_SPEC.md)

**Especificação do MVP**

- Features do MVP
- Escopo mínimo viável
- Roadmap de lançamento
- Critérios de sucesso
- Backlog priorizado

> **Quando usar**: Focar no essencial, priorizar features, ou planejar sprints.

---

### 💻 TÉCNICO (6)

#### [05_TECHNICAL_ARCHITECTURE.md](05_TECHNICAL_ARCHITECTURE.md)

**Arquitetura Técnica**

- Stack tecnológico
- Estrutura de pastas
- Fluxo de dados
- Padrões de código
- Convenções
- Segurança

> **Quando usar**: Entender a arquitetura, onboarding de devs, ou decisões técnicas.

#### [06_COMPONENT_LIBRARY.md](06_COMPONENT_LIBRARY.md)

**Biblioteca de Componentes**

- Componentes React
- Props e APIs
- Exemplos de uso
- Variantes e composições
- Documentação Storybook

> **Quando usar**: Desenvolver UI, reutilizar componentes, ou manter consistência.

#### [07_DEV_BRIEF.md](07_DEV_BRIEF.md)

**Guia de Desenvolvimento**

- Setup do ambiente
- Comandos úteis
- Workflow de desenvolvimento
- Git flow
- Troubleshooting

> **Quando usar**: Onboarding de desenvolvedores, setup inicial, ou resolver problemas comuns.

#### [17_INTEGRACOES.md](17_INTEGRACOES.md) ⭐ **NOVO**

**Integrações de API**

- **Groq API** (Llama 3.3-70b) - Chat IA - GRÁTIS
- **OpenAI GPT-4o Vision** - Análise de imagens - Pago
- **Stripe** - Pagamentos PIX/Cartão
- **Twilio** - WhatsApp Business
- **Resend** - E-mail transacional
- **Cloudflare R2** - Storage de arquivos
- Setup, autenticação, custos, rate limits
- Exemplos de código para cada integração

> **Quando usar**: Integrar APIs externas, configurar webhooks, ou entender custos.

#### [18_DEPLOY_GUIDE.md](18_DEPLOY_GUIDE.md) ⭐ **NOVO**

**Guia de Deploy**

- Deploy no Vercel (frontend)
- Deploy no Railway (database)
- Variáveis de ambiente
- CI/CD com GitHub Actions
- Monitoramento
- Rollback e troubleshooting
- Checklist pré-produção

> **Quando usar**: Fazer deploy, configurar ambientes, ou resolver problemas de produção.

#### [20_TESTES.md](20_TESTES.md) ⭐ **NOVO**

**Documentação de Testes**

- E2E com Playwright (5 spec files)
- Unit tests com Vitest
- Estratégia de testes
- Coverage targets
- CI/CD integration
- Boas práticas
- Comandos e setup

> **Quando usar**: Escrever testes, rodar suíte de testes, ou configurar CI.

---

### 💼 NEGÓCIO (4)

#### [08_BUSINESS_MODEL.md](08_BUSINESS_MODEL.md)

**Modelo de Negócio**

- Business Model Canvas
- Proposta de valor
- Segmentos de cliente
- Estrutura de custos
- Fontes de receita
- Métricas financeiras

> **Quando usar**: Entender o negócio, pitch para investidores, ou planejamento financeiro.

#### [10_FINANCIAL_MODEL.md](10_FINANCIAL_MODEL.md)

**Modelo Financeiro**

- Projeções financeiras
- Custos operacionais
- Precificação
- Break-even
- ROI

> **Quando usar**: Análise financeira, planejamento orçamentário, ou decisões de investimento.

#### [11_GTM_STRATEGY.md](11_GTM_STRATEGY.md)

**Go-to-Market Strategy**

- Estratégia de lançamento
- Canais de aquisição
- Posicionamento
- Mensagens-chave
- Plano de marketing

> **Quando usar**: Planejar lançamento, definir estratégia de marketing, ou posicionamento.

#### [12_CUSTOMER_ACQUISITION.md](12_CUSTOMER_ACQUISITION.md)

**Aquisição de Clientes**

- Funil de conversão
- Canais de aquisição
- Custo de aquisição (CAC)
- Lifetime value (LTV)
- Estratégias de retenção

> **Quando usar**: Otimizar conversão, planejar campanhas, ou analisar métricas de aquisição.

---

### 📦 OPERACIONAL (3)

#### [13_CONTEUDO_PAGINAS.md](13_CONTEUDO_PAGINAS.md)

**Conteúdo das Páginas**

- Copy de todas as páginas
- Headlines e CTAs
- Descrições de produtos
- Seções do site
- E-mails transacionais
- Mensagens de WhatsApp

> **Quando usar**: Implementar páginas, revisar copy, ou criar conteúdo.

#### [14_ADMIN_GUIDE.md](14_ADMIN_GUIDE.md)

**Guia do Administrador**

- Funcionalidades admin
- Gestão de orçamentos
- Gestão de pedidos
- Gestão de clientes
- Relatórios e analytics
- Configurações

> **Quando usar**: Treinar admins, entender painel admin, ou criar documentação de usuário.

#### [15_CATALOGO_PRODUTOS_SERVICOS.md](15_CATALOGO_PRODUTOS_SERVICOS.md)

**Catálogo de Produtos e Serviços**

- Lista completa de produtos
- Especificações técnicas
- Preços e variações
- Serviços oferecidos
- Garantias

> **Quando usar**: Cadastrar produtos, precificar, ou consultar especificações.

#### [19_FORNECEDORES.md](19_FORNECEDORES.md) ⭐ **NOVO**

**Gestão de Fornecedores**

- Lista de fornecedores por categoria
- Processo de cotação
- Templates de solicitação
- Critérios de qualidade
- Lead times e custos estimados
- KPIs de fornecedores

> **Quando usar**: Gerenciar fornecedores, fazer cotações, ou avaliar qualidade.

---

### 🧪 TESTES & QA (4)

#### [E2E_TESTING_GUIDE.md](E2E_TESTING_GUIDE.md)

**Guia de Testes E2E**

- Setup Playwright
- Estrutura de testes
- Fixtures e helpers
- Boas práticas
- Debug de testes

> **Quando usar**: Escrever ou executar testes E2E.

#### [TEST_RESULTS_E2E_FINAL.md](TEST_RESULTS_E2E_FINAL.md)

**Resultados de Testes E2E**

- Execução completa dos testes
- 5 spec files, 41 testes
- Taxa de sucesso
- Issues encontrados
- Correções aplicadas

> **Quando usar**: Verificar status dos testes, validar funcionalidades.

#### [POST_AUDIT_SPRINTS_SUMMARY.md](POST_AUDIT_SPRINTS_SUMMARY.md)

**Resumo de Sprints Pós-Auditoria**

- Sprints P0, P0+
- Correções aplicadas
- Melhorias implementadas
- Próximos passos

> **Quando usar**: Entender evolução do projeto, sprints concluídos.

#### [TEST_VALIDATION_POST_SPRINTS.md](TEST_VALIDATION_POST_SPRINTS.md)

**Validação Pós-Sprints**

- Validação de correções
- Testes de regressão
- Status final

> **Quando usar**: Validar que sprints foram bem-sucedidos.

---

### 🤖 IA & AUTOMAÇÃO (2)

#### [16_ARQUITETURA_ORCAMENTO_IA.md](16_ARQUITETURA_ORCAMENTO_IA.md)

**Arquitetura do Orçamento com IA**

- Fluxo de chat IA
- Integração Groq + OpenAI
- Análise de imagem (Vision)
- Extração de dados
- Conversão para orçamento
- Personalidade "Ana"
- Fallbacks e escalação

> **Quando usar**: Entender sistema de IA, implementar features de chat, ou configurar prompts.

#### [16B_RESUMO_VISUAL_ORCAMENTO_IA.md](16B_RESUMO_VISUAL_ORCAMENTO_IA.md)

**Resumo Visual - Orçamento IA**

- Diagramas de fluxo
- Arquitetura visual
- Stack tecnológico
- Resumo executivo

> **Quando usar**: Apresentações, onboarding rápido, ou visão geral do sistema IA.

---

## 🔍 GUIAS DE USO POR PERFIL

### Para Desenvolvedores

**Início Rápido:**

1. [07_DEV_BRIEF.md](07_DEV_BRIEF.md) - Setup do ambiente
2. [05_TECHNICAL_ARCHITECTURE.md](05_TECHNICAL_ARCHITECTURE.md) - Entender arquitetura
3. [03_PRD.md](03_PRD.md) - Conhecer o produto
4. [06_COMPONENT_LIBRARY.md](06_COMPONENT_LIBRARY.md) - Componentes disponíveis
5. [20_TESTES.md](20_TESTES.md) - Escrever testes

**Deploy e Produção:**

- [18_DEPLOY_GUIDE.md](18_DEPLOY_GUIDE.md)
- [17_INTEGRACOES.md](17_INTEGRACOES.md)

**Features IA:**

- [16_ARQUITETURA_ORCAMENTO_IA.md](16_ARQUITETURA_ORCAMENTO_IA.md)
- [04_USER_FLOWS.md](04_USER_FLOWS.md) - Seção 2

---

### Para Product Managers

**Planejamento:**

1. [03_PRD.md](03_PRD.md) - Visão completa do produto
2. [09_MVP_SPEC.md](09_MVP_SPEC.md) - Escopo MVP
3. [04_USER_FLOWS.md](04_USER_FLOWS.md) - Jornadas do usuário

**Estratégia:**

- [08_BUSINESS_MODEL.md](08_BUSINESS_MODEL.md)
- [11_GTM_STRATEGY.md](11_GTM_STRATEGY.md)
- [12_CUSTOMER_ACQUISITION.md](12_CUSTOMER_ACQUISITION.md)

**Qualidade:**

- [TEST_RESULTS_E2E_FINAL.md](TEST_RESULTS_E2E_FINAL.md)
- [POST_AUDIT_SPRINTS_SUMMARY.md](POST_AUDIT_SPRINTS_SUMMARY.md)

---

### Para Designers

**Identidade:**

1. [01_CONCEITO_VERSATI.md](01_CONCEITO_VERSATI.md) - Marca
2. [02_DESIGN_SYSTEM.md](02_DESIGN_SYSTEM.md) - Sistema de design
3. [06_COMPONENT_LIBRARY.md](06_COMPONENT_LIBRARY.md) - Componentes

**Conteúdo:**

- [13_CONTEUDO_PAGINAS.md](13_CONTEUDO_PAGINAS.md)
- [04_USER_FLOWS.md](04_USER_FLOWS.md)

---

### Para Gestores/Admin

**Operações:**

1. [00_EMPRESA.md](00_EMPRESA.md) - Dados da empresa
2. [14_ADMIN_GUIDE.md](14_ADMIN_GUIDE.md) - Guia admin
3. [15_CATALOGO_PRODUTOS_SERVICOS.md](15_CATALOGO_PRODUTOS_SERVICOS.md) - Catálogo
4. [19_FORNECEDORES.md](19_FORNECEDORES.md) - Fornecedores

**Negócio:**

- [08_BUSINESS_MODEL.md](08_BUSINESS_MODEL.md)
- [10_FINANCIAL_MODEL.md](10_FINANCIAL_MODEL.md)

---

### Para Marketing

**Estratégia:**

1. [01_CONCEITO_VERSATI.md](01_CONCEITO_VERSATI.md) - Marca e tom de voz
2. [11_GTM_STRATEGY.md](11_GTM_STRATEGY.md) - Go-to-market
3. [12_CUSTOMER_ACQUISITION.md](12_CUSTOMER_ACQUISITION.md) - Aquisição

**Conteúdo:**

- [13_CONTEUDO_PAGINAS.md](13_CONTEUDO_PAGINAS.md)
- [15_CATALOGO_PRODUTOS_SERVICOS.md](15_CATALOGO_PRODUTOS_SERVICOS.md)

---

## 📊 STATUS DOS DOCUMENTOS

| Status               | Significado              | Quantidade |
| -------------------- | ------------------------ | ---------- |
| ✅ **Completo**      | Documentado e atualizado | 15         |
| 🟡 **Em progresso**  | Parcialmente documentado | 5          |
| 🔵 **Planejado**     | A ser criado             | 3          |
| ⚠️ **Desatualizado** | Precisa revisão          | 2          |

### Documentos Recém-Atualizados (v1.1.0)

- ✅ [03_PRD.md](03_PRD.md) - Atualizado com módulo IA (17/12/2024)
- ✅ [04_USER_FLOWS.md](04_USER_FLOWS.md) - Adicionado fluxos IA (17/12/2024)
- ✅ [17_INTEGRACOES.md](17_INTEGRACOES.md) - Novo (17/12/2024)
- ✅ [18_DEPLOY_GUIDE.md](18_DEPLOY_GUIDE.md) - Novo (17/12/2024)
- ✅ [19_FORNECEDORES.md](19_FORNECEDORES.md) - Novo (17/12/2024)
- ✅ [20_TESTES.md](20_TESTES.md) - Novo (17/12/2024)
- ✅ [00_EMPRESA.md](00_EMPRESA.md) - Novo (17/12/2024)
- ✅ [INDEX.md](INDEX.md) - Novo (17/12/2024)

---

## 🔗 DOCUMENTAÇÃO EXTERNA

### Tecnologias Principais

| Tecnologia       | Documentação Oficial         |
| ---------------- | ---------------------------- |
| **Next.js 14**   | https://nextjs.org/docs      |
| **React 18**     | https://react.dev            |
| **Prisma**       | https://www.prisma.io/docs   |
| **Tailwind CSS** | https://tailwindcss.com/docs |
| **shadcn/ui**    | https://ui.shadcn.com        |
| **NextAuth.js**  | https://next-auth.js.org     |

### APIs e Serviços

| Serviço           | Documentação                     |
| ----------------- | -------------------------------- |
| **Groq API**      | https://console.groq.com/docs    |
| **OpenAI GPT-4o** | https://platform.openai.com/docs |
| **Stripe**        | https://stripe.com/docs          |
| **Twilio**        | https://www.twilio.com/docs      |
| **Resend**        | https://resend.com/docs          |
| **Vercel**        | https://vercel.com/docs          |
| **Railway**       | https://docs.railway.app         |

### Ferramentas de Testes

| Ferramenta          | Documentação                |
| ------------------- | --------------------------- |
| **Playwright**      | https://playwright.dev      |
| **Vitest**          | https://vitest.dev          |
| **Testing Library** | https://testing-library.com |

---

## 🆘 TROUBLESHOOTING

### Problema: "Não sei por onde começar"

**Solução:**

1. Se você é **dev**: Comece por [07_DEV_BRIEF.md](07_DEV_BRIEF.md)
2. Se você é **PM**: Comece por [03_PRD.md](03_PRD.md)
3. Se você é **designer**: Comece por [01_CONCEITO_VERSATI.md](01_CONCEITO_VERSATI.md)
4. Se você é **gestor**: Comece por [00_EMPRESA.md](00_EMPRESA.md)

### Problema: "Preciso entender a feature de IA"

**Solução:**

1. Leia [16B_RESUMO_VISUAL_ORCAMENTO_IA.md](16B_RESUMO_VISUAL_ORCAMENTO_IA.md) (visão rápida)
2. Aprofunde em [16_ARQUITETURA_ORCAMENTO_IA.md](16_ARQUITETURA_ORCAMENTO_IA.md)
3. Veja os fluxos em [04_USER_FLOWS.md](04_USER_FLOWS.md) - Seção 2
4. Confira implementação em [03_PRD.md](03_PRD.md) - Seção 2.4

### Problema: "Como faço deploy?"

**Solução:**

1. Leia [18_DEPLOY_GUIDE.md](18_DEPLOY_GUIDE.md) completo
2. Configure [17_INTEGRACOES.md](17_INTEGRACOES.md) - Variáveis de ambiente
3. Siga checklist pré-produção

### Problema: "Onde está a informação X da empresa?"

**Solução:**

- **Tudo** sobre empresa está em [00_EMPRESA.md](00_EMPRESA.md)
- Contatos, endereços, horários, políticas, fornecedores, etc.

---

## 📝 CONVENÇÕES DE NOMENCLATURA

### Numeração de Documentos

```
00-09: Fundação (Empresa, Marca, Produto)
10-15: Negócio e Operações
16-20: Técnico e Desenvolvimento
21+: Especialidades e Expansões (futuro)
```

### Nomenclatura de Arquivos

- **Principais**: `##_NOME_EM_CAPS.md` (ex: `03_PRD.md`)
- **Auxiliares**: `NOME_EM_CAPS.md` (ex: `E2E_TESTING_GUIDE.md`)
- **Relatórios**: `NOME_TIPO_DATA.md` (ex: `TEST_RESULTS_E2E_FINAL.md`)

### Versionamento

```
v1.0.0 - Versão inicial completa
v1.1.0 - Nova feature ou seção significativa (ex: módulo IA)
v1.1.1 - Correções e melhorias menores
```

---

## 🎯 ROADMAP DE DOCUMENTAÇÃO

### Concluído (Dez 2024)

- ✅ Índice mestre (INDEX.md)
- ✅ Dados centralizados da empresa (00_EMPRESA.md)
- ✅ Documentação de integrações (17_INTEGRACOES.md)
- ✅ Guia de deploy (18_DEPLOY_GUIDE.md)
- ✅ Documentação de fornecedores (19_FORNECEDORES.md)
- ✅ Documentação de testes (20_TESTES.md)
- ✅ Atualização PRD com IA (03_PRD.md v1.1.0)
- ✅ Fluxos de IA (04_USER_FLOWS.md v1.1.0)

### Próximos Passos (Q1 2025)

- 🔵 Documentação de API (OpenAPI/Swagger spec)
- 🔵 Guia de contribuição (CONTRIBUTING.md)
- 🔵 Manual do usuário final (cliente)
- 🔵 Runbook de produção (alertas, monitoramento)
- 🔵 Documentação de acessibilidade (WCAG compliance)

---

## 📞 SUPORTE

**Dúvidas sobre documentação:**

- Abra uma issue no repositório
- Consulte o changelog de cada documento
- Verifique data de última atualização

**Contribuições:**

- Mantenha o formato Markdown
- Siga convenções de nomenclatura
- Atualize este índice ao criar novos documentos
- Incremente versões conforme necessidade

---

## 📈 MÉTRICAS DE DOCUMENTAÇÃO

| Métrica                      | Valor            |
| ---------------------------- | ---------------- |
| **Total de Documentos**      | 25+              |
| **Cobertura de Produto**     | 95%              |
| **Cobertura Técnica**        | 90%              |
| **Última Atualização Major** | 17 Dezembro 2024 |
| **Documentos Novos (Dez)**   | 8                |
| **Páginas Totais (Aprox)**   | 500+             |

---

## ⚡ QUICK REFERENCE

### Top 10 Documentos Mais Usados

1. [03_PRD.md](03_PRD.md) - Produto completo
2. [00_EMPRESA.md](00_EMPRESA.md) - Dados da empresa
3. [07_DEV_BRIEF.md](07_DEV_BRIEF.md) - Setup dev
4. [18_DEPLOY_GUIDE.md](18_DEPLOY_GUIDE.md) - Deploy
5. [01_CONCEITO_VERSATI.md](01_CONCEITO_VERSATI.md) - Marca
6. [13_CONTEUDO_PAGINAS.md](13_CONTEUDO_PAGINAS.md) - Copy
7. [17_INTEGRACOES.md](17_INTEGRACOES.md) - APIs
8. [05_TECHNICAL_ARCHITECTURE.md](05_TECHNICAL_ARCHITECTURE.md) - Arquitetura
9. [16_ARQUITETURA_ORCAMENTO_IA.md](16_ARQUITETURA_ORCAMENTO_IA.md) - IA
10. [20_TESTES.md](20_TESTES.md) - Testes

### Comandos de Busca Rápida

```bash
# Buscar termo em todos os documentos
grep -r "termo" docs/

# Listar documentos atualizados recentemente
ls -lt docs/*.md | head -10

# Contar linhas totais de documentação
wc -l docs/*.md
```

---

**Versati Glass - Índice Mestre v1.0.0**
_Atualizado em 17 Dezembro 2024_
_"Transparência que transforma espaços"_
