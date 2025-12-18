import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Button,
  Hr,
} from '@react-email/components'
import * as React from 'react'

interface OrderStatusUpdateEmailProps {
  customerName: string
  orderNumber: string
  status:
    | 'PENDING_PAYMENT'
    | 'PAID'
    | 'IN_PRODUCTION'
    | 'READY_FOR_INSTALLATION'
    | 'INSTALLING'
    | 'COMPLETED'
    | 'CANCELLED'
  statusMessage: string
  estimatedDate?: string
  orderUrl: string
}

export const OrderStatusUpdateEmail = ({
  customerName = 'Cliente',
  orderNumber = 'PED-2024-0001',
  status = 'IN_PRODUCTION',
  statusMessage = 'Seu pedido está em produção',
  estimatedDate,
  orderUrl = 'https://versatiglass.com.br/portal/pedidos',
}: OrderStatusUpdateEmailProps) => {
  const getStatusConfig = (status: string) => {
    const configs = {
      PENDING_PAYMENT: {
        icon: '💳',
        color: '#f59e0b',
        bg: '#fffbeb',
        title: 'Aguardando Pagamento',
        description:
          'Seu pedido foi criado! Assim que recebermos a confirmação do pagamento, iniciaremos a produção.',
      },
      PAID: {
        icon: '✅',
        color: '#10b981',
        bg: '#f0fdf4',
        title: 'Pagamento Confirmado',
        description: 'Pagamento recebido com sucesso! Seu pedido entrará em produção em breve.',
      },
      IN_PRODUCTION: {
        icon: '🏭',
        color: '#3b82f6',
        bg: '#eff6ff',
        title: 'Em Produção',
        description:
          'Sua peça está sendo fabricada por nossa equipe especializada com os mais altos padrões de qualidade.',
      },
      READY_FOR_INSTALLATION: {
        icon: '📦',
        color: '#8b5cf6',
        bg: '#f5f3ff',
        title: 'Pronto para Instalação',
        description: 'Seu pedido está pronto! Entre em contato para agendar a instalação.',
      },
      INSTALLING: {
        icon: '🔧',
        color: '#06b6d4',
        bg: '#ecfeff',
        title: 'Instalação em Andamento',
        description: 'Nossa equipe está realizando a instalação no local.',
      },
      COMPLETED: {
        icon: '🎉',
        color: '#10b981',
        bg: '#f0fdf4',
        title: 'Concluído',
        description:
          'Seu pedido foi finalizado com sucesso! Obrigado por escolher a Versati Glass.',
      },
      CANCELLED: {
        icon: '❌',
        color: '#ef4444',
        bg: '#fef2f2',
        title: 'Cancelado',
        description: 'Seu pedido foi cancelado. Entre em contato para mais informações.',
      },
    }

    return configs[status as keyof typeof configs] || configs.IN_PRODUCTION
  }

  const config = getStatusConfig(status)

  return (
    <Html>
      <Head />
      <Preview>
        Atualização do Pedido #{orderNumber} - {config.title}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo */}
          <Section style={header}>
            <Img
              src="https://versatiglass.com.br/logo.png"
              width="150"
              height="50"
              alt="Versati Glass"
              style={logo}
            />
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Heading style={h1}>{config.icon} Atualização do Pedido</Heading>

            <Text style={text}>Olá {customerName},</Text>

            {/* Status Badge */}
            <Section
              style={{
                ...statusBox,
                backgroundColor: config.bg,
                borderLeftColor: config.color,
              }}
            >
              <Text
                style={{
                  ...statusTitle,
                  color: config.color,
                }}
              >
                {config.title}
              </Text>
              <Text style={statusText}>Pedido #{orderNumber}</Text>
            </Section>

            <Text style={text}>{statusMessage || config.description}</Text>

            {estimatedDate && (
              <Section style={infoBox}>
                <Text style={infoText}>
                  📅 <strong>Previsão:</strong> {estimatedDate}
                </Text>
              </Section>
            )}

            <Hr style={divider} />

            {/* Status-specific actions */}
            {status === 'PENDING_PAYMENT' && (
              <>
                <Heading style={h2}>Como pagar?</Heading>
                <Text style={text}>
                  • PIX: Copie o código QR ou chave PIX
                  <br />
                  • Boleto: Baixe e pague até o vencimento
                  <br />• Cartão: Parcelamento em até 12x sem juros
                </Text>
              </>
            )}

            {status === 'IN_PRODUCTION' && (
              <>
                <Heading style={h2}>O que está acontecendo?</Heading>
                <Text style={text}>
                  1. ✅ Corte e preparação do vidro
                  <br />
                  2. 🔄 Aplicação de tratamentos e acabamentos
                  <br />
                  3. ⏳ Controle de qualidade final
                  <br />
                  4. 📦 Embalagem para transporte seguro
                </Text>
              </>
            )}

            {status === 'READY_FOR_INSTALLATION' && (
              <>
                <Heading style={h2}>Próximo Passo</Heading>
                <Text style={text}>
                  Agende a instalação pelo portal ou entre em contato conosco:
                  <br />
                  📱 WhatsApp: +55 21 99999-9999
                  <br />✉ Email: contato@versatiglass.com.br
                </Text>
              </>
            )}

            {status === 'COMPLETED' && (
              <>
                <Heading style={h2}>Nos ajude a melhorar!</Heading>
                <Text style={text}>
                  Sua opinião é muito importante. Avalie nossa instalação e atendimento.
                </Text>
                <Section style={buttonContainer}>
                  <Button style={button} href={`${orderUrl}/${orderNumber}/avaliar`}>
                    Avaliar Atendimento
                  </Button>
                </Section>
              </>
            )}

            {/* CTA Button */}
            {status !== 'COMPLETED' && (
              <Section style={buttonContainer}>
                <Button style={button} href={orderUrl}>
                  Ver Detalhes do Pedido
                </Button>
              </Section>
            )}

            <Text style={smallText}>
              Ou acesse: <Link href={orderUrl}>{orderUrl}</Link>
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Hr style={divider} />
            <Text style={footerText}>
              <strong>Versati Glass</strong> - Vidros Premium
              <br />
              Rio de Janeiro, RJ
              <br />
              Tel: +55 21 99999-9999
              <br />
              Email: contato@versatiglass.com.br
            </Text>
            <Text style={footerSmall}>
              Você está recebendo este email como atualização sobre seu pedido.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default OrderStatusUpdateEmail

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
}

const header = {
  padding: '32px 48px',
  textAlign: 'center' as const,
}

const logo = {
  margin: '0 auto',
}

const content = {
  padding: '0 48px',
}

const h1 = {
  color: '#1a1a1a',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '32px 0',
  padding: '0',
  textAlign: 'center' as const,
}

const h2 = {
  color: '#1a1a1a',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '24px 0 16px',
}

const text = {
  color: '#404040',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
}

const statusBox = {
  borderRadius: '8px',
  borderLeft: '4px solid',
  padding: '20px',
  margin: '24px 0',
  textAlign: 'center' as const,
}

const statusTitle = {
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 8px',
}

const statusText = {
  color: '#666666',
  fontSize: '14px',
  margin: '0',
}

const infoBox = {
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  padding: '16px',
  margin: '24px 0',
  textAlign: 'center' as const,
}

const infoText = {
  color: '#1a1a1a',
  fontSize: '16px',
  margin: '0',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#C9A961',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 32px',
}

const smallText = {
  color: '#666666',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '16px 0',
  textAlign: 'center' as const,
}

const divider = {
  borderColor: '#e6e6e6',
  margin: '32px 0',
}

const footer = {
  padding: '0 48px',
}

const footerText = {
  color: '#666666',
  fontSize: '14px',
  lineHeight: '22px',
  textAlign: 'center' as const,
  margin: '16px 0',
}

const footerSmall = {
  color: '#999999',
  fontSize: '12px',
  lineHeight: '18px',
  textAlign: 'center' as const,
  margin: '16px 0',
}
