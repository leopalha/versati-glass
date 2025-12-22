import { Metadata } from 'next'
import { AdminHeader } from '@/components/admin/admin-header'
import {
  LayoutDashboard,
  FileText,
  Users,
  Package,
  ShoppingCart,
  MessageCircle,
  Settings,
  Bell,
  Shield,
  HelpCircle,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  Info,
  Mail,
  Plug,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Manual do Administrador | Versati Glass',
  description: 'Guia completo para administradores do sistema Versati Glass',
}

const sections = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: LayoutDashboard,
    content: `
O Dashboard e a tela inicial do painel administrativo, oferecendo uma visao geral do negocio em tempo real.

**Metricas Principais:**
- **Orcamentos Pendentes**: Numero de orcamentos aguardando resposta
- **Pedidos em Andamento**: Pedidos que ainda nao foram finalizados
- **Faturamento do Mes**: Total de vendas realizadas no mes atual
- **Novos Clientes**: Clientes cadastrados no periodo

**Graficos:**
- Evolucao de vendas (ultimos 12 meses)
- Distribuicao por categoria de produto
- Taxa de conversao de orcamentos

**Alertas:**
- Orcamentos proximos do vencimento (15 dias)
- Pedidos com instalacao agendada para hoje
- Mensagens nao lidas no WhatsApp
    `,
  },
  {
    id: 'orcamentos',
    title: 'Orcamentos',
    icon: FileText,
    content: `
O modulo de orcamentos permite gerenciar todas as solicitacoes de preco dos clientes.

**Status dos Orcamentos:**
- 🟡 **Pendente**: Aguardando analise
- 🔵 **Enviado**: Orcamento enviado ao cliente
- 🟢 **Aceito**: Cliente aceitou o orcamento
- 🔴 **Recusado**: Cliente recusou o orcamento
- ⚫ **Expirado**: Prazo de validade ultrapassado

**Acoes Disponiveis:**
1. **Visualizar**: Ver detalhes completos do orcamento
2. **Editar**: Alterar valores e condicoes
3. **Enviar**: Enviar orcamento por email/WhatsApp
4. **Converter**: Transformar em pedido apos aceitacao
5. **Duplicar**: Criar novo orcamento baseado em existente

**Dicas:**
- Orcamentos tem validade padrao de 15 dias
- Sempre verifique as medidas antes de enviar
- Use a funcao de duplicar para clientes recorrentes
    `,
  },
  {
    id: 'pedidos',
    title: 'Pedidos',
    icon: ShoppingCart,
    content: `
Gerencie todo o ciclo de vida dos pedidos, desde a confirmacao ate a finalizacao.

**Fluxo do Pedido:**
1. **Confirmado**: Pagamento confirmado ou entrada recebida
2. **Em Producao**: Vidros sendo cortados/temperados
3. **Pronto**: Produto finalizado, aguardando instalacao
4. **Agendado**: Data de instalacao marcada
5. **Instalado**: Servico concluido
6. **Finalizado**: Cliente confirmou satisfacao

**Informacoes do Pedido:**
- Dados do cliente
- Produtos e especificacoes
- Valores e pagamentos
- Historico de atualizacoes
- Documentos anexados

**Acoes Importantes:**
- Atualizar status conforme progresso
- Registrar todas as interacoes
- Anexar fotos da instalacao
- Solicitar avaliacao ao cliente
    `,
  },
  {
    id: 'clientes',
    title: 'Clientes',
    icon: Users,
    content: `
Base de dados completa de todos os clientes da Versati Glass.

**Informacoes do Cliente:**
- Nome completo e CPF/CNPJ
- Telefone e email
- Endereco de instalacao
- Historico de compras
- Orcamentos solicitados
- Preferencias de contato

**Filtros Disponiveis:**
- Por data de cadastro
- Por valor total gasto
- Por status (ativo/inativo)
- Por regiao de atendimento

**Acoes:**
- Editar dados cadastrais
- Ver historico completo
- Enviar mensagem direta
- Exportar para Excel

**LGPD:**
- Respeite o direito de exclusao de dados
- Nao compartilhe informacoes com terceiros
- Mantenha dados atualizados
    `,
  },
  {
    id: 'produtos',
    title: 'Produtos',
    icon: Package,
    content: `
Catalogo completo de produtos e servicos oferecidos.

**Categorias:**
- Box para Banheiro
- Espelhos
- Fechamentos de Pia
- Tampos de Mesa
- Prateleiras
- Guarda-corpo
- Portas de Vidro

**Cadastro de Produto:**
- Nome e descricao detalhada
- Categoria principal
- Precos base (por m², metro linear ou unidade)
- Variantes (cores, espessuras, acabamentos)
- Imagens de referencia
- Disponibilidade

**Tabela de Precos:**
- Fator de multiplicacao por ferragem
- Adicional por acabamentos especiais
- Tabela de frete por regiao
- Descontos por volume
    `,
  },
  {
    id: 'whatsapp',
    title: 'WhatsApp',
    icon: MessageCircle,
    content: `
Central de atendimento via WhatsApp com assistente de IA.

**Funcionalidades:**
- Visualizacao de todas as conversas
- Respostas automaticas por IA
- Intervencao manual quando necessario
- Historico completo de mensagens
- Transferencia para orcamento

**Chatbot de IA:**
O assistente virtual responde automaticamente sobre:
- Precos e orcamentos
- Tipos de produtos
- Prazo de entrega
- Formas de pagamento
- Horario de funcionamento

**Quando Intervir:**
- Reclamacoes de clientes
- Negociacoes especiais
- Problemas tecnicos
- Solicitacoes complexas

**Dicas:**
- Responda mensagens em ate 15 minutos no horario comercial
- Use mensagens pre-definidas para agilizar
- Sempre finalize com proximo passo claro
    `,
  },
  {
    id: 'configuracoes',
    title: 'Configuracoes',
    icon: Settings,
    content: `
Ajustes gerais do sistema e preferencias.

**Empresa:**
- Dados cadastrais
- Logo e identidade visual
- Horario de funcionamento
- Regioes de atendimento

**Financeiro:**
- Taxas de cartao
- Desconto PIX
- Parcelas maximas
- Integracao Stripe

**Notificacoes:**
- Alertas por email
- Notificacoes push
- Webhooks

**Integracao:**
- API WhatsApp (Twilio)
- Email (Resend)
- Pagamentos (Stripe)
- Analytics (Google)

**Usuarios:**
- Criar novos administradores
- Definir permissoes
- Resetar senhas
- Desativar acessos
    `,
  },
  {
    id: 'email',
    title: 'Email Profissional',
    icon: Mail,
    content: `
Configure um email profissional para sua empresa (contato@versatiglass.com.br).

**Opcoes Recomendadas:**

1. **Google Workspace (Recomendado)**
- Custo: ~R$28/mes por usuario
- Acesso via Gmail, app no celular, Outlook
- Integra com Google Calendar, Drive
- Muito facil de usar
- Link: workspace.google.com

2. **Microsoft 365**
- Custo: ~R$45/mes por usuario
- Acesso via Outlook
- Integra com Word, Excel, Teams
- Link: microsoft.com/microsoft-365

3. **Zoho Mail**
- Custo: ~R$15/mes por usuario
- Mais barato, funcional
- Menos intuitivo
- Link: zoho.com/mail

**Como Configurar (Google Workspace):**
1. Acesse workspace.google.com
2. Informe seu dominio (versatiglass.com.br)
3. Siga o passo a passo para verificar propriedade
4. Configure os registros MX no seu dominio
5. Crie usuarios (contato@, vendas@, etc)

**Dica:**
Apos configurar, voce pode usar o Gmail no navegador, app do Gmail no celular, ou configurar no Outlook do computador.
    `,
  },
  {
    id: 'integracoes',
    title: 'Integracoes do Sistema',
    icon: Plug,
    content: `
O sistema Versati Glass utiliza diversas integracoes para funcionar.

**WhatsApp (Twilio):**
- Envia/recebe mensagens automaticamente
- NAO e WhatsApp Web (nao requer QR code)
- Usa numero dedicado da Twilio
- Permite multiplos atendentes
- IA pode responder automaticamente
- Creditos Twilio: ~$0.005 por mensagem

**Como funciona:**
1. Cliente envia mensagem para numero Twilio
2. Twilio recebe e envia para nosso sistema
3. Sistema processa e responde (IA ou manual)
4. Resposta vai de volta pelo Twilio

**Email (Resend):**
- Envia emails transacionais
- Confirmacao de orcamentos
- Notificacoes de status
- Creditos: 3.000 emails/mes gratis

**Pagamentos (Stripe):**
- Recebe pagamentos online
- Cartao de credito/debito
- PIX (em breve)
- Taxa: ~2.9% + R$0.39 por transacao

**Google Calendar:**
- Agenda visitas tecnicas
- Agenda instalacoes
- Sincroniza com calendario do celular
    `,
  },
]

const tips = [
  {
    type: 'success',
    icon: CheckCircle,
    title: 'Boas Praticas',
    items: [
      'Atualize o status dos pedidos diariamente',
      'Responda orcamentos em ate 2 horas uteis',
      'Faca backup dos documentos importantes',
      'Verifique as metricas do dashboard toda manha',
    ],
  },
  {
    type: 'warning',
    icon: AlertTriangle,
    title: 'Atencao',
    items: [
      'Nunca compartilhe sua senha de acesso',
      'Verifique medidas antes de confirmar pedidos',
      'Nao altere orcamentos ja enviados sem avisar cliente',
      'Mantenha fotos de instalacao para registro',
    ],
  },
  {
    type: 'info',
    icon: Info,
    title: 'Dicas Uteis',
    items: [
      'Use filtros para encontrar informacoes rapidamente',
      'O chatbot aprende com as interacoes',
      'Exporte relatorios mensais para controle',
      'Clientes podem acompanhar pedidos pelo portal',
    ],
  },
]

export default function AdminManualPage() {
  return (
    <div>
      <AdminHeader
        title="Manual do Administrador"
        subtitle="Guia completo para utilizar o painel administrativo da Versati Glass"
      />

      <div className="space-y-8 p-6">
        {/* Quick Tips */}
        <div className="grid gap-4 md:grid-cols-3">
          {tips.map((tip) => (
            <div
              key={tip.title}
              className={`rounded-lg border p-4 ${
                tip.type === 'success'
                  ? 'border-green-500/30 bg-green-500/10'
                  : tip.type === 'warning'
                    ? 'border-yellow-500/30 bg-yellow-500/10'
                    : 'border-blue-500/30 bg-blue-500/10'
              }`}
            >
              <div className="mb-3 flex items-center gap-2">
                <tip.icon
                  className={`h-5 w-5 ${
                    tip.type === 'success'
                      ? 'text-green-500'
                      : tip.type === 'warning'
                        ? 'text-yellow-500'
                        : 'text-blue-500'
                  }`}
                />
                <h3 className="font-medium text-white">{tip.title}</h3>
              </div>
              <ul className="space-y-2">
                {tip.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-neutral-300">
                    <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-4">
          <h2 className="mb-4 font-display text-lg font-semibold text-white">Indice</h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center gap-2 rounded-lg border border-neutral-700 bg-neutral-800 p-3 text-neutral-300 transition-colors hover:border-gold-500 hover:text-white"
              >
                <section.icon className="h-5 w-5 text-gold-500" />
                <span className="text-sm font-medium">{section.title}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-4 rounded-lg border border-neutral-800 bg-neutral-900"
            >
              <div className="flex items-center gap-3 border-b border-neutral-800 p-4">
                <div className="rounded-lg bg-gold-500/10 p-2">
                  <section.icon className="h-6 w-6 text-gold-500" />
                </div>
                <h2 className="font-display text-xl font-semibold text-white">{section.title}</h2>
              </div>
              <div className="p-4">
                <div className="prose prose-invert max-w-none">
                  {section.content.split('\n\n').map((paragraph, idx) => {
                    if (paragraph.startsWith('**') && paragraph.includes(':**')) {
                      // Section header
                      const [title, ...rest] = paragraph.split(':')
                      return (
                        <div key={idx} className="mb-4">
                          <h3 className="mb-2 text-lg font-semibold text-gold-400">
                            {title.replace(/\*\*/g, '')}
                          </h3>
                          {rest.join(':').trim() && (
                            <p className="text-neutral-300">{rest.join(':').trim()}</p>
                          )}
                        </div>
                      )
                    }
                    if (paragraph.startsWith('-')) {
                      // List
                      const items = paragraph.split('\n').filter(Boolean)
                      return (
                        <ul key={idx} className="mb-4 space-y-1">
                          {items.map((item, itemIdx) => (
                            <li key={itemIdx} className="flex items-start gap-2 text-neutral-300">
                              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: item
                                    .replace(/^- /, '')
                                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
                                }}
                              />
                            </li>
                          ))}
                        </ul>
                      )
                    }
                    if (paragraph.match(/^\d+\./)) {
                      // Numbered list
                      const items = paragraph.split('\n').filter(Boolean)
                      return (
                        <ol key={idx} className="mb-4 space-y-1">
                          {items.map((item, itemIdx) => (
                            <li key={itemIdx} className="flex items-start gap-2 text-neutral-300">
                              <span className="shrink-0 font-semibold text-gold-500">
                                {itemIdx + 1}.
                              </span>
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: item
                                    .replace(/^\d+\.\s*/, '')
                                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
                                }}
                              />
                            </li>
                          ))}
                        </ol>
                      )
                    }
                    // Regular paragraph
                    return (
                      <p
                        key={idx}
                        className="mb-4 text-neutral-300"
                        dangerouslySetInnerHTML={{
                          __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
                        }}
                      />
                    )
                  })}
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* Security Section */}
        <section className="rounded-lg border border-red-500/30 bg-red-500/10 p-6">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-red-500" />
            <div>
              <h2 className="font-display text-xl font-semibold text-white">Seguranca</h2>
              <p className="text-neutral-400">Informacoes importantes sobre seguranca</p>
            </div>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="mb-2 font-semibold text-white">Acesso ao Sistema</h3>
              <ul className="space-y-1 text-sm text-neutral-300">
                <li>• Use senhas fortes (minimo 8 caracteres)</li>
                <li>• Nao compartilhe credenciais de acesso</li>
                <li>• Faca logout ao sair do computador</li>
                <li>• Reporte acessos suspeitos imediatamente</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-white">Dados dos Clientes</h3>
              <ul className="space-y-1 text-sm text-neutral-300">
                <li>• Proteja informacoes pessoais (LGPD)</li>
                <li>• Nao exporte dados sem autorizacao</li>
                <li>• Atenda solicitacoes de exclusao</li>
                <li>• Use apenas para fins comerciais</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Help */}
        <section className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
          <div className="flex items-center gap-3">
            <HelpCircle className="h-8 w-8 text-gold-500" />
            <div>
              <h2 className="font-display text-xl font-semibold text-white">Precisa de Ajuda?</h2>
              <p className="text-neutral-400">Entre em contato com o suporte tecnico</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-4">
            <a
              href="mailto:suporte@versatiglass.com.br"
              className="rounded-lg bg-neutral-800 px-4 py-2 text-sm text-white hover:bg-neutral-700"
            >
              suporte@versatiglass.com.br
            </a>
            <a
              href="https://wa.me/5521982536229"
              className="rounded-lg bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
            >
              WhatsApp Suporte
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
