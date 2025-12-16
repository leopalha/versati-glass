# 🚀 Pre-Launch Checklist - Versati Glass

**Data:** 16 Dezembro 2024
**Target Launch:** ** / ** / \_\_\_\_
**Status:** Em preparação

---

## 📋 Overview

Este checklist garante que todos os aspectos da plataforma estão prontos para o lançamento em produção.

**Legenda:**

- ✅ = Completo
- 🔄 = Em progresso
- ⬜ = Não iniciado
- ❌ = Bloqueado

---

## 1. 🔧 Infraestrutura e Deploy

### 1.1 Configuração de Domínio

| Item                               | Status | Responsável | Notas                  |
| ---------------------------------- | ------ | ----------- | ---------------------- |
| Registrar domínio principal        | ⬜     | Cliente     | versatiglass.com.br    |
| Configurar DNS                     | ⬜     | DevOps      | Apontar para Vercel    |
| Configurar SSL/TLS                 | ⬜     | Vercel      | Auto com Let's Encrypt |
| Testar HTTPS                       | ⬜     | QA          |                        |
| Configurar redirects (www -> apex) | ⬜     | DevOps      |                        |

### 1.2 Deploy em Produção

| Item                             | Status | Responsável | Notas               |
| -------------------------------- | ------ | ----------- | ------------------- |
| Deploy no Vercel                 | ⬜     | DevOps      |                     |
| Configurar variáveis de ambiente | ⬜     | DevOps      | Ver .env.example    |
| Testar build de produção         | ⬜     | DevOps      | pnpm build          |
| Verificar otimizações            | ⬜     | DevOps      | Bundle size < 150KB |
| Configurar edge functions        | ⬜     | DevOps      | Geolocalização      |

### 1.3 Database (Railway)

| Item                           | Status | Responsável | Notas                    |
| ------------------------------ | ------ | ----------- | ------------------------ |
| Migrar para plano pago         | ⬜     | Cliente     | $20/mês                  |
| Executar migrations            | ⬜     | DevOps      | prisma migrate deploy    |
| Seed de dados iniciais         | ⬜     | DevOps      | Admin user, categorias   |
| Configurar backups automáticos | ⬜     | DevOps      | Diário, retenção 30 dias |
| Configurar monitoramento       | ⬜     | DevOps      | Alertas CPU/Memory       |
| Testar conexão                 | ⬜     | QA          |                          |

### 1.4 Ambientes

| Item                             | Status | Responsável | Notas                    |
| -------------------------------- | ------ | ----------- | ------------------------ |
| Staging environment ativo        | ⬜     | DevOps      | staging.versatiglass.com |
| Production environment ativo     | ✅     | DevOps      |                          |
| Preview deployments configurados | ✅     | Vercel      | Auto em PRs              |

---

## 2. 🔐 Segurança

### 2.1 Autenticação

| Item                        | Status | Responsável | Notas                |
| --------------------------- | ------ | ----------- | -------------------- |
| NextAuth configurado        | ✅     | Dev         |                      |
| NEXTAUTH_SECRET definido    | ⬜     | DevOps      | Gerar novo para prod |
| Google OAuth configurado    | ✅     | Dev         |                      |
| Callbacks URL atualizados   | ⬜     | DevOps      | prod domain          |
| Rate limiting em login      | ⬜     | Dev         | 5 tentativas/min     |
| Session timeout configurado | ✅     | Dev         | 30 dias              |

### 2.2 API Security

| Item                    | Status | Responsável | Notas                |
| ----------------------- | ------ | ----------- | -------------------- |
| CORS configurado        | ✅     | Dev         |                      |
| Rate limiting em APIs   | ⬜     | Dev         | 100 req/min          |
| Input validation        | ✅     | Dev         | Zod schemas          |
| SQL injection prevenção | ✅     | Dev         | Prisma parametrizado |
| XSS prevenção           | ✅     | Dev         | React auto-escape    |
| CSRF protection         | ✅     | Dev         | NextAuth tokens      |

### 2.3 Dados Sensíveis

| Item                         | Status | Responsável | Notas           |
| ---------------------------- | ------ | ----------- | --------------- |
| Passwords com bcrypt         | ✅     | Dev         | Salt rounds: 10 |
| Tokens não expostos no front | ✅     | Dev         |                 |
| Logs não contêm senhas       | ✅     | Dev         |                 |
| PII criptografado            | ⬜     | Dev         | CPF, cartões    |
| Política de privacidade      | ⬜     | Legal       | LGPD compliant  |

---

## 3. 🔌 Integrações de Terceiros

### 3.1 Stripe (Pagamentos)

| Item                         | Status | Responsável | Notas                |
| ---------------------------- | ------ | ----------- | -------------------- |
| Conta Stripe configurada     | ⬜     | Cliente     | Modo produção        |
| Webhook endpoint configurado | ⬜     | DevOps      | /api/webhooks/stripe |
| Webhook secret atualizado    | ⬜     | DevOps      | Prod keys            |
| PIX habilitado               | ⬜     | Cliente     | Requer aprovação     |
| Cartões habilitados          | ⬜     | Cliente     |                      |
| Testar pagamento real        | ⬜     | QA          | R$ 0.50              |
| Refund testado               | ⬜     | QA          |                      |

### 3.2 Twilio (WhatsApp)

| Item                        | Status | Responsável | Notas                |
| --------------------------- | ------ | ----------- | -------------------- |
| Conta Twilio configurada    | ⬜     | Cliente     |                      |
| WhatsApp Business API ativo | ⬜     | Cliente     | Requer aprovação     |
| Sandbox -> Produção         | ⬜     | Cliente     | Pagar $30/mês        |
| Templates aprovados         | ⬜     | Marketing   | 10 templates         |
| Webhook configurado         | ⬜     | DevOps      | /api/webhooks/twilio |
| Número verificado           | ⬜     | Cliente     | +55 21 98253-6229    |
| Testar envio/recebimento    | ⬜     | QA          |                      |

### 3.3 Groq AI

| Item                   | Status | Responsável | Notas           |
| ---------------------- | ------ | ----------- | --------------- |
| API key configurada    | ✅     | Dev         | Gratuita        |
| Rate limits conhecidos | ✅     | Dev         | 30 req/min      |
| Fallback configurado   | ⬜     | Dev         | Mensagem padrão |
| Testar respostas       | ⬜     | QA          |                 |

### 3.4 Resend (Email)

| Item                     | Status | Responsável | Notas                    |
| ------------------------ | ------ | ----------- | ------------------------ |
| Conta Resend configurada | ✅     | Dev         |                          |
| Domínio verificado       | ⬜     | DevOps      | noreply@versatiglass.com |
| SPF/DKIM configurados    | ⬜     | DevOps      | DNS records              |
| DMARC configurado        | ⬜     | DevOps      |                          |
| Templates testados       | ✅     | QA          | 6 templates              |
| Testar deliverability    | ⬜     | QA          | mail-tester.com          |

---

## 4. 📊 Analytics e Monitoring

### 4.1 Google Analytics 4

| Item                       | Status | Responsável | Notas                         |
| -------------------------- | ------ | ----------- | ----------------------------- |
| Propriedade GA4 criada     | ⬜     | Marketing   |                               |
| Measurement ID configurado | ⬜     | Marketing   | NEXT_PUBLIC_GA_MEASUREMENT_ID |
| Events configurados        | ✅     | Dev         | 5 eventos custom              |
| Goals configurados         | ⬜     | Marketing   | Conversões                    |
| E-commerce tracking        | ✅     | Dev         |                               |
| Testar tracking            | ⬜     | QA          | Real-time view                |

### 4.2 Google Tag Manager

| Item                       | Status | Responsável | Notas              |
| -------------------------- | ------ | ----------- | ------------------ |
| Container GTM criado       | ⬜     | Marketing   |                    |
| Container ID configurado   | ⬜     | Marketing   | NEXT_PUBLIC_GTM_ID |
| GA4 tag configurada        | ⬜     | Marketing   |                    |
| Meta Pixel tag configurada | ⬜     | Marketing   |                    |
| Triggers configurados      | ⬜     | Marketing   | Page view, clicks  |
| Testar tags                | ⬜     | QA          | GTM preview mode   |

### 4.3 Meta Pixel (Facebook/Instagram)

| Item                 | Status | Responsável | Notas                     |
| -------------------- | ------ | ----------- | ------------------------- |
| Pixel criado         | ⬜     | Marketing   |                           |
| Pixel ID configurado | ⬜     | Marketing   | NEXT_PUBLIC_META_PIXEL_ID |
| Events configurados  | ✅     | Dev         | PageView, Lead, Purchase  |
| Conversions API      | ⬜     | Marketing   | Opcional                  |
| Testar eventos       | ⬜     | QA          | Events Manager            |

### 4.4 Vercel Analytics

| Item                        | Status | Responsável | Notas       |
| --------------------------- | ------ | ----------- | ----------- |
| Vercel Analytics ativo      | ✅     | Vercel      | Auto em Pro |
| Core Web Vitals monitorados | ✅     | Vercel      |             |
| Real User Monitoring        | ✅     | Vercel      |             |

### 4.5 Error Tracking

| Item                          | Status | Responsável | Notas                |
| ----------------------------- | ------ | ----------- | -------------------- |
| Sentry configurado (opcional) | ⬜     | Dev         | $26/mês ou free tier |
| Source maps enviados          | ⬜     | DevOps      |                      |
| Alertas configurados          | ⬜     | DevOps      | Slack/Email          |
| Testar captura de erros       | ⬜     | QA          |                      |

### 4.6 Uptime Monitoring

| Item                    | Status | Responsável | Notas                |
| ----------------------- | ------ | ----------- | -------------------- |
| UptimeRobot configurado | ⬜     | DevOps      | Gratuito             |
| Monitores criados       | ⬜     | DevOps      | Homepage, API health |
| Intervalo: 5min         | ⬜     | DevOps      |                      |
| Alertas por email       | ⬜     | DevOps      |                      |
| Status page público     | ⬜     | DevOps      | Opcional             |

---

## 5. 🧪 Testes

### 5.1 Testes Automatizados

| Item                         | Status | Responsável | Notas             |
| ---------------------------- | ------ | ----------- | ----------------- |
| Unit tests executados        | ✅     | Dev         | 68 tests passing  |
| Integration tests executados | ✅     | Dev         | 55+ tests passing |
| E2E tests executados         | ✅     | QA          | 80+ tests passing |
| Coverage > 70%               | ✅     | Dev         |                   |
| CI/CD configurado            | ⬜     | DevOps      | GitHub Actions    |

### 5.2 Testes Manuais

| Item                       | Status | Responsável | Notas                    |
| -------------------------- | ------ | ----------- | ------------------------ |
| QA manual completo         | ⬜     | QA          | Ver QA_MANUAL.md         |
| Fluxo de orçamento testado | ⬜     | QA          | End-to-end               |
| Fluxo de pagamento testado | ⬜     | QA          | PIX + Card               |
| Portal cliente testado     | ⬜     | QA          | Todas as páginas         |
| Admin dashboard testado    | ⬜     | QA          | Todas as funcionalidades |
| WhatsApp bot testado       | ⬜     | QA          |                          |
| Emails testados            | ⬜     | QA          | 6 templates              |

### 5.3 Performance

| Item                       | Status | Responsável | Notas                  |
| -------------------------- | ------ | ----------- | ---------------------- |
| Lighthouse audit executado | ⬜     | QA          | Score > 90             |
| LCP < 2.5s                 | ⬜     | QA          |                        |
| FID < 100ms                | ⬜     | QA          |                        |
| CLS < 0.1                  | ⬜     | QA          |                        |
| Teste de carga             | ⬜     | QA          | 100 users concorrentes |

### 5.4 Compatibilidade

| Item                  | Status | Responsável | Notas |
| --------------------- | ------ | ----------- | ----- |
| Chrome testado        | ⬜     | QA          |       |
| Firefox testado       | ⬜     | QA          |       |
| Safari testado        | ⬜     | QA          |       |
| Edge testado          | ⬜     | QA          |       |
| Mobile Chrome testado | ⬜     | QA          |       |
| Mobile Safari testado | ⬜     | QA          |       |
| Tablets testados      | ⬜     | QA          |       |

### 5.5 Acessibilidade

| Item                  | Status | Responsável | Notas           |
| --------------------- | ------ | ----------- | --------------- |
| Navegação por teclado | ⬜     | QA          | Tab, Enter, Esc |
| Screen reader testado | ⬜     | QA          | NVDA/JAWS       |
| Contraste adequado    | ✅     | Design      | 4.5:1           |
| Alt text em imagens   | ✅     | Dev         |                 |
| ARIA labels           | ✅     | Dev         |                 |

---

## 6. 📄 Conteúdo e SEO

### 6.1 Conteúdo

| Item                    | Status | Responsável | Notas             |
| ----------------------- | ------ | ----------- | ----------------- |
| Textos revisados        | ⬜     | Conteúdo    | Português correto |
| Imagens otimizadas      | ✅     | Dev         | WebP, lazy load   |
| Vídeos adicionados      | ⬜     | Marketing   | Opcional          |
| FAQ completo            | ⬜     | Conteúdo    |                   |
| Política de privacidade | ⬜     | Legal       | LGPD              |
| Termos de uso           | ⬜     | Legal       |                   |

### 6.2 SEO

| Item                   | Status | Responsável | Notas              |
| ---------------------- | ------ | ----------- | ------------------ |
| Meta tags configuradas | ✅     | Dev         | Title, description |
| Open Graph tags        | ✅     | Dev         | Social sharing     |
| Sitemap.xml gerado     | ✅     | Next.js     | Auto               |
| Robots.txt configurado | ✅     | Dev         |                    |
| Schema.org markup      | ⬜     | Dev         | LocalBusiness      |
| Google Search Console  | ⬜     | Marketing   | Propriedade criada |
| Submit sitemap         | ⬜     | Marketing   |                    |
| Canonical URLs         | ✅     | Dev         |                    |

---

## 7. 📱 Mobile e PWA

### 7.1 Responsividade

| Item                    | Status | Responsável | Notas                |
| ----------------------- | ------ | ----------- | -------------------- |
| Mobile-first design     | ✅     | Design      |                      |
| Breakpoints testados    | ✅     | QA          | 375, 768, 1024, 1920 |
| Touch targets adequados | ✅     | Design      | Min 44x44px          |
| Gestos funcionam        | ⬜     | QA          | Swipe, pinch         |

### 7.2 PWA (Opcional)

| Item               | Status | Responsável | Notas  |
| ------------------ | ------ | ----------- | ------ |
| Manifest.json      | ⬜     | Dev         |        |
| Service Worker     | ⬜     | Dev         |        |
| Offline fallback   | ⬜     | Dev         |        |
| Add to Home Screen | ⬜     | Dev         |        |
| Push notifications | ⬜     | Dev         | Futuro |

---

## 8. 📧 Comunicação

### 8.1 Email Marketing

| Item                          | Status | Responsável | Notas    |
| ----------------------------- | ------ | ----------- | -------- |
| Lista de espera importada     | ⬜     | Marketing   |          |
| Email de lançamento preparado | ⬜     | Marketing   |          |
| Sequência de onboarding       | ⬜     | Marketing   | 5 emails |

### 8.2 Redes Sociais

| Item                          | Status | Responsável | Notas               |
| ----------------------------- | ------ | ----------- | ------------------- |
| Páginas criadas               | ⬜     | Marketing   | Facebook, Instagram |
| Perfis otimizados             | ⬜     | Marketing   | Bio, links          |
| Posts de lançamento agendados | ⬜     | Marketing   |                     |
| Stories preparados            | ⬜     | Marketing   |                     |
| Hashtags definidas            | ⬜     | Marketing   |                     |

### 8.3 Google Meu Negócio

| Item                  | Status | Responsável | Notas             |
| --------------------- | ------ | ----------- | ----------------- |
| Perfil criado         | ⬜     | Marketing   |                   |
| Informações completas | ⬜     | Marketing   | Horário, endereço |
| Fotos adicionadas     | ⬜     | Marketing   | Mín 10 fotos      |
| Categorias corretas   | ⬜     | Marketing   | Vidraçaria        |
| Verificação concluída | ⬜     | Marketing   |                   |

---

## 9. 💰 Financeiro

### 9.1 Custos Mensais

| Serviço         | Custo       | Status | Notas        |
| --------------- | ----------- | ------ | ------------ |
| Vercel Pro      | $20         | ⬜     | Necessário   |
| Railway         | $20         | ⬜     | Database     |
| Twilio WhatsApp | $30         | ⬜     | 1k mensagens |
| Resend          | $0-10       | ✅     | 10k emails   |
| Domínio         | $30/ano     | ⬜     | .com.br      |
| **TOTAL**       | ~$70-80/mês |        |              |

### 9.2 Configuração Financeira

| Item                             | Status | Responsável | Notas                 |
| -------------------------------- | ------ | ----------- | --------------------- |
| Conta bancária para recebimentos | ⬜     | Cliente     | Stripe                |
| Conta Stripe verificada          | ⬜     | Cliente     |                       |
| Taxas compreendidas              | ⬜     | Cliente     | Stripe 3.99% + R$0,39 |
| Split de pagamentos              | ⬜     | Cliente     | Se aplicável          |

---

## 10. 👥 Equipe e Treinamento

### 10.1 Documentação

| Item                 | Status | Responsável | Notas               |
| -------------------- | ------ | ----------- | ------------------- |
| README.md atualizado | ✅     | Dev         |                     |
| DEPLOY.md disponível | ✅     | Dev         |                     |
| API.md disponível    | ✅     | Dev         |                     |
| Manual do admin      | ⬜     | Dev         | Como usar dashboard |
| FAQ interno          | ⬜     | Dev         | Troubleshooting     |

### 10.2 Treinamento

| Item                      | Status | Responsável | Notas                 |
| ------------------------- | ------ | ----------- | --------------------- |
| Admin treinado            | ⬜     | Dev         | Live demo             |
| Atendentes treinados      | ⬜     | Admin       | WhatsApp bot          |
| Equipe de vendas treinada | ⬜     | Admin       | Como criar orçamentos |
| Runbooks criados          | ⬜     | DevOps      | Incidentes comuns     |

---

## 11. 🚨 Contingência

### 11.1 Plano de Rollback

| Item                           | Status | Responsável | Notas           |
| ------------------------------ | ------ | ----------- | --------------- |
| Backup do banco                | ⬜     | DevOps      | Antes do deploy |
| Rollback procedure documentado | ⬜     | DevOps      | vercel rollback |
| Ambiente anterior preservado   | ⬜     | DevOps      |                 |

### 11.2 Suporte

| Item                      | Status | Responsável | Notas                  |
| ------------------------- | ------ | ----------- | ---------------------- |
| Canal de suporte definido | ⬜     | Admin       | WhatsApp, Email        |
| SLA definido              | ⬜     | Admin       | 24h úteis              |
| Escalation path           | ⬜     | Admin       |                        |
| Plantão de lançamento     | ⬜     | Dev         | Primeiro fim de semana |

---

## 12. ✅ Aprovações Finais

### 12.1 Sign-offs

| Aprovação            | Status | Responsável | Data |
| -------------------- | ------ | ----------- | ---- |
| Testes aprovados     | ⬜     | QA Lead     |      |
| Performance aprovada | ⬜     | Tech Lead   |      |
| Segurança aprovada   | ⬜     | Security    |      |
| Conteúdo aprovado    | ⬜     | Marketing   |      |
| Legal aprovado       | ⬜     | Legal       |      |
| Cliente aprovado     | ⬜     | Cliente     |      |

### 12.2 Go/No-Go Decision

**Data da reunião:** ** / ** / \_\_\_\_

**Participantes:**

- [ ] Tech Lead
- [ ] QA Lead
- [ ] Marketing Lead
- [ ] Cliente

**Decisão:** ⬜ GO ⬜ NO-GO

**Bloqueadores (se houver):**

1.
2.
3.

**Notas:**

---

## 🎉 Launch Day

### Dia do Lançamento

| Hora          | Atividade                  | Responsável | Status |
| ------------- | -------------------------- | ----------- | ------ |
| 08:00         | Último backup do banco     | DevOps      | ⬜     |
| 09:00         | Deploy em produção         | DevOps      | ⬜     |
| 09:30         | Smoke tests                | QA          | ⬜     |
| 10:00         | Ativar domínio             | DevOps      | ⬜     |
| 10:30         | Verificar analytics        | Marketing   | ⬜     |
| 11:00         | Anúncio nas redes sociais  | Marketing   | ⬜     |
| 11:00         | Email para lista de espera | Marketing   | ⬜     |
| 12:00         | Monitorar erros            | DevOps      | ⬜     |
| Durante o dia | Responder questões         | Suporte     | ⬜     |
| 18:00         | Review do dia              | Todos       | ⬜     |

### Primeiras 48h

| Item                  | Responsável |
| --------------------- | ----------- |
| Monitorar uptime      | DevOps      |
| Monitorar performance | DevOps      |
| Responder suporte     | Atendimento |
| Analisar analytics    | Marketing   |
| Coletar feedback      | Todos       |

---

## 📊 Métricas de Sucesso

### KPIs Iniciais (Primeiros 7 dias)

| Métrica                 | Target | Real | Status |
| ----------------------- | ------ | ---- | ------ |
| Uptime                  | > 99%  |      |        |
| Novos cadastros         | > 50   |      |        |
| Orçamentos criados      | > 20   |      |        |
| Taxa de conversão       | > 10%  |      |        |
| Tempo médio de resposta | < 2s   |      |        |
| Erros críticos          | 0      |      |        |

---

## 📞 Contatos de Emergência

| Papel              | Nome    | Telefone | Email               |
| ------------------ | ------- | -------- | ------------------- |
| Tech Lead          |         |          |                     |
| DevOps             |         |          |                     |
| Hosting (Vercel)   | Support |          | support@vercel.com  |
| Database (Railway) | Support |          | support@railway.app |
| Cliente            |         |          |                     |

---

## ✅ Aprovação Final

**Este checklist foi completado em:** ** / ** / \_\_\_\_

**Aprovado por:**

- [ ] Tech Lead: **\*\***\_**\*\***
- [ ] QA Lead: **\*\***\_**\*\***
- [ ] Marketing Lead: **\*\***\_**\*\***
- [ ] Cliente: **\*\***\_**\*\***

**Assinaturas:**

---

---

**🚀 READY TO LAUNCH!**

_Última atualização: 16 Dezembro 2024_
