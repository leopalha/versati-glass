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

interface QuoteCreatedEmailProps {
  customerName: string
  quoteNumber: string
  items: Array<{
    productName: string
    quantity: number
    width: number
    height: number
  }>
  totalItems: number
  portalUrl: string
}

export const QuoteCreatedEmail = ({
  customerName = 'Cliente',
  quoteNumber = 'ORC-2024-0001',
  items = [],
  totalItems = 0,
  portalUrl = 'https://versatiglass.com.br/portal',
}: QuoteCreatedEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Seu orçamento #{quoteNumber} foi recebido - Versati Glass</Preview>
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
            <Heading style={h1}>Orçamento Recebido! ✅</Heading>

            <Text style={text}>Olá {customerName},</Text>

            <Text style={text}>
              Recebemos sua solicitação de orçamento <strong>#{quoteNumber}</strong> e estamos
              analisando suas necessidades.
            </Text>

            {/* Items Summary */}
            <Section style={itemsBox}>
              <Text style={itemsTitle}>📋 Itens Solicitados ({totalItems})</Text>
              {items.slice(0, 3).map((item, index) => (
                <Text key={index} style={itemText}>
                  • {item.productName} - {item.quantity}x ({item.width}m x {item.height}m)
                </Text>
              ))}
              {items.length > 3 && (
                <Text style={itemText}>... e mais {items.length - 3} itens</Text>
              )}
            </Section>

            <Hr style={divider} />

            {/* Next Steps */}
            <Heading style={h2}>📍 Próximos Passos</Heading>
            <Text style={text}>
              1. Nossa equipe está revisando seu pedido
              <br />
              2. Entraremos em contato em até <strong>24 horas</strong>
              <br />
              3. Agende uma visita técnica gratuita para medição precisa
              <br />
              4. Receba seu orçamento detalhado com valores
            </Text>

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Button style={button} href={portalUrl}>
                Acompanhar Orçamento
              </Button>
            </Section>

            <Text style={smallText}>
              Ou acesse: <Link href={portalUrl}>{portalUrl}</Link>
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
              Tel: +55 (21) 98253-6229
              <br />
              Email: versatiglass@gmail.com
            </Text>
            <Text style={footerSmall}>
              Você está recebendo este email porque solicitou um orçamento em nosso site.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default QuoteCreatedEmail

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

const itemsBox = {
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
}

const itemsTitle = {
  color: '#1a1a1a',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 12px',
}

const itemText = {
  color: '#404040',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '4px 0',
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
