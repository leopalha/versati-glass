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

interface AppointmentConfirmationEmailProps {
  customerName: string
  appointmentType: 'TECHNICAL_VISIT' | 'INSTALLATION'
  scheduledDate: string // Format: "25 de Dezembro de 2024"
  scheduledTime: string // Format: "14:30"
  address: string
  quoteNumber?: string
  orderNumber?: string
  rescheduleUrl: string
  calendarAttachment?: boolean
}

export const AppointmentConfirmationEmail = ({
  customerName = 'Cliente',
  appointmentType = 'TECHNICAL_VISIT',
  scheduledDate = '25 de Dezembro de 2024',
  scheduledTime = '14:30',
  address = 'Rua das Flores, 123 - Copacabana, Rio de Janeiro',
  quoteNumber,
  orderNumber,
  rescheduleUrl = 'https://versatiglass.com.br/portal/agendamentos',
  calendarAttachment = true,
}: AppointmentConfirmationEmailProps) => {
  const typeLabel = appointmentType === 'TECHNICAL_VISIT' ? 'Visita Técnica' : 'Instalação'
  const typeIcon = appointmentType === 'TECHNICAL_VISIT' ? '📏' : '🔧'
  const typeDescription =
    appointmentType === 'TECHNICAL_VISIT'
      ? 'Nossa equipe visitará o local para realizar medições precisas e avaliar as condições de instalação.'
      : 'Nossa equipe realizará a instalação dos produtos conforme especificado no pedido.'

  return (
    <Html>
      <Head />
      <Preview>
        {typeLabel} agendada para {scheduledDate} às {scheduledTime}
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
            <Heading style={h1}>
              {typeIcon} {typeLabel} Confirmada!
            </Heading>

            <Text style={text}>Olá {customerName},</Text>

            <Text style={text}>Sua {typeLabel.toLowerCase()} foi agendada com sucesso!</Text>

            {/* Appointment Details Box */}
            <Section style={detailsBox}>
              <Text style={detailsTitle}>📅 Detalhes do Agendamento</Text>

              <Section style={detailRow}>
                <Text style={detailLabel}>Data:</Text>
                <Text style={detailValue}>{scheduledDate}</Text>
              </Section>

              <Section style={detailRow}>
                <Text style={detailLabel}>Horário:</Text>
                <Text style={detailValue}>{scheduledTime}</Text>
              </Section>

              <Section style={detailRow}>
                <Text style={detailLabel}>Local:</Text>
                <Text style={detailValue}>{address}</Text>
              </Section>

              {quoteNumber && (
                <Section style={detailRow}>
                  <Text style={detailLabel}>Orçamento:</Text>
                  <Text style={detailValue}>#{quoteNumber}</Text>
                </Section>
              )}

              {orderNumber && (
                <Section style={detailRow}>
                  <Text style={detailLabel}>Pedido:</Text>
                  <Text style={detailValue}>#{orderNumber}</Text>
                </Section>
              )}
            </Section>

            <Hr style={divider} />

            {/* What to Expect */}
            <Heading style={h2}>O que esperar?</Heading>
            <Text style={text}>{typeDescription}</Text>

            {appointmentType === 'TECHNICAL_VISIT' && (
              <>
                <Text style={text}>
                  <strong>Duração estimada:</strong> 30-60 minutos
                  <br />
                  <strong>Equipamentos:</strong> Trena laser, câmera, tablet
                  <br />
                  <strong>Resultado:</strong> Orçamento detalhado em até 48 horas
                </Text>
              </>
            )}

            {appointmentType === 'INSTALLATION' && (
              <>
                <Text style={text}>
                  <strong>Duração estimada:</strong> 2-4 horas (conforme tamanho)
                  <br />
                  <strong>Equipe:</strong> 2 técnicos especializados
                  <br />
                  <strong>Resultado:</strong> Instalação completa e limpeza do local
                </Text>
              </>
            )}

            <Hr style={divider} />

            {/* Important Notes */}
            <Section style={notesBox}>
              <Text style={notesTitle}>⚠️ Importante</Text>
              <Text style={noteText}>
                • Certifique-se de que haverá alguém presente no local
                <br />
                • Mantenha o acesso livre ao local de instalação
                <br />• Caso precise reagendar, avise com pelo menos 24h de antecedência
              </Text>
            </Section>

            {/* Calendar Attachment */}
            {calendarAttachment && (
              <Section style={calendarBox}>
                <Text style={calendarText}>
                  📆 <strong>Evento de calendário anexado</strong>
                  <br />
                  Adicione este compromisso ao seu calendário (Google, Outlook, Apple)
                </Text>
              </Section>
            )}

            {/* CTA Buttons */}
            <Section style={buttonContainer}>
              <Button style={button} href={rescheduleUrl}>
                Reagendar ou Cancelar
              </Button>
            </Section>

            <Text style={smallText}>
              Ou acesse: <Link href={rescheduleUrl}>{rescheduleUrl}</Link>
            </Text>

            {/* Contact */}
            <Text style={text}>
              Dúvidas? Entre em contato:
              <br />
              📱 WhatsApp: +55 (21) 98253-6229
              <br />✉ Email: versatiglass@gmail.com
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Hr style={divider} />
            <Text style={footerText}>
              <strong>Versati Glass</strong> - Vidros Premium
              <br />
              Rio de Janeiro, RJ
            </Text>
            <Text style={footerSmall}>
              Você está recebendo este email porque agendou uma {typeLabel.toLowerCase()} conosco.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default AppointmentConfirmationEmail

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

const detailsBox = {
  backgroundColor: '#f0f8ff',
  borderRadius: '8px',
  borderLeft: '4px solid #C9A961',
  padding: '20px',
  margin: '24px 0',
}

const detailsTitle = {
  color: '#1a1a1a',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 16px',
}

const detailRow = {
  margin: '8px 0',
}

const detailLabel = {
  color: '#666666',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0',
  display: 'inline-block',
  width: '100px',
}

const detailValue = {
  color: '#1a1a1a',
  fontSize: '14px',
  margin: '0',
  display: 'inline-block',
}

const notesBox = {
  backgroundColor: '#fff9e6',
  borderRadius: '8px',
  padding: '16px',
  margin: '24px 0',
}

const notesTitle = {
  color: '#1a1a1a',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0 0 8px',
}

const noteText = {
  color: '#666666',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0',
}

const calendarBox = {
  backgroundColor: '#f0fdf4',
  borderRadius: '8px',
  padding: '16px',
  margin: '24px 0',
  textAlign: 'center' as const,
}

const calendarText = {
  color: '#166534',
  fontSize: '14px',
  lineHeight: '22px',
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
