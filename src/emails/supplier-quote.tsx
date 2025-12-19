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
  Hr,
} from '@react-email/components'
import * as React from 'react'

interface SupplierQuoteEmailProps {
  supplierName: string
  quoteNumber: string
  items: Array<{
    description: string
    quantity: number
    width?: number
    height?: number
    specifications?: string
  }>
  serviceAddress: {
    street: string
    number: string
    neighborhood: string
    city: string
    state: string
  }
  deadline: string
}

export const SupplierQuoteEmail = ({
  supplierName = 'Fornecedor',
  quoteNumber = 'ORC-2024-0001',
  items = [],
  serviceAddress = {
    street: 'Rua Exemplo',
    number: '123',
    neighborhood: 'Bairro',
    city: 'Rio de Janeiro',
    state: 'RJ',
  },
  deadline = '48 horas',
}: SupplierQuoteEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Nova Solicitação de Cotação #{quoteNumber} - Versati Glass</Preview>
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
            <Heading style={h1}>Nova Cotação #{quoteNumber}</Heading>

            <Text style={text}>Olá {supplierName},</Text>

            <Text style={text}>
              Estamos solicitando uma cotação para o orçamento <strong>{quoteNumber}</strong>.
              Por favor, nos envie sua melhor proposta com prazo e valores detalhados.
            </Text>

            {/* Items */}
            <Section style={itemsBox}>
              <Text style={itemsTitle}>📋 Itens Solicitados ({items.length})</Text>
              {items.map((item, index) => (
                <Section key={index} style={itemContainer}>
                  <Text style={itemText}>
                    <strong>{index + 1}. {item.description}</strong>
                  </Text>
                  <Text style={itemDetail}>
                    Quantidade: {item.quantity}
                    {item.width && item.height && (
                      <> | Medidas: {item.width}m x {item.height}m</>
                    )}
                  </Text>
                  {item.specifications && (
                    <Text style={itemDetail}>Especificações: {item.specifications}</Text>
                  )}
                </Section>
              ))}
            </Section>

            <Hr style={divider} />

            {/* Address */}
            <Heading style={h2}>📍 Local de Instalação</Heading>
            <Text style={text}>
              {serviceAddress.street}, {serviceAddress.number}
              <br />
              {serviceAddress.neighborhood} - {serviceAddress.city}/{serviceAddress.state}
            </Text>

            <Hr style={divider} />

            {/* Instructions */}
            <Heading style={h2}>📨 Como Responder</Heading>
            <Text style={text}>
              Por favor, responda este email com as seguintes informações:
            </Text>

            <Section style={instructionsBox}>
              <Text style={instructionItem}>
                ✓ <strong>Material:</strong> R$ ___
              </Text>
              <Text style={instructionItem}>
                ✓ <strong>Frete:</strong> R$ ___
              </Text>
              <Text style={instructionItem}>
                ✓ <strong>Instalação:</strong> R$ ___
              </Text>
              <Text style={instructionItem}>
                ✓ <strong>TOTAL:</strong> R$ ___
              </Text>
              <Text style={instructionItem}>
                ✓ <strong>Prazo de Entrega:</strong> ___ dias úteis
              </Text>
              <Text style={instructionItem}>
                ✓ <strong>Observações:</strong> ___
              </Text>
            </Section>

            <Section style={alertBox}>
              <Text style={alertText}>
                ⏰ <strong>Prazo:</strong> Aguardamos sua resposta em até {deadline}
              </Text>
              <Text style={alertText}>
                📧 <strong>Ref:</strong> {quoteNumber}
              </Text>
            </Section>

            <Text style={text}>
              Caso tenha dúvidas, entre em contato conosco através dos canais abaixo.
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Hr style={divider} />
            <Text style={footerText}>
              <strong>Versati Glass</strong> - Vidros Premium
              <br />
              Estrada Três Rios, 1156 - Freguesia, Rio de Janeiro - RJ
              <br />
              Tel: +55 (21) 98253-6229
              <br />
              Email: versatiglass@gmail.com
              <br />
              Site: <Link href="https://versatiglass.com.br">www.versatiglass.com.br</Link>
            </Text>
            <Text style={footerSmall}>
              Esta é uma solicitação de cotação da Versati Glass.
              Por favor, inclua o número de referência ({quoteNumber}) em sua resposta.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default SupplierQuoteEmail

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
  backgroundColor: '#0A0A0A',
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
  margin: '0 0 16px',
}

const itemContainer = {
  marginBottom: '16px',
  paddingBottom: '12px',
  borderBottom: '1px solid #e0e0e0',
}

const itemText = {
  color: '#1a1a1a',
  fontSize: '15px',
  margin: '4px 0',
}

const itemDetail = {
  color: '#666666',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '4px 0',
}

const instructionsBox = {
  backgroundColor: '#fff9e6',
  borderLeft: '4px solid #C9A961',
  borderRadius: '4px',
  padding: '20px',
  margin: '24px 0',
}

const instructionItem = {
  color: '#404040',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '8px 0',
}

const alertBox = {
  backgroundColor: '#ffe6e6',
  borderRadius: '8px',
  padding: '16px',
  margin: '24px 0',
}

const alertText = {
  color: '#d32f2f',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '4px 0',
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
