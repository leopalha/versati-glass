// Additional email templates for notifications

// Template: Orçamento enviado (para admin enviar ao cliente)
export function generateQuoteSentEmailHtml(data: {
  customerName: string
  quoteNumber: string
  total: string
  validUntil: string
  portalUrl: string
  items: Array<{ description: string; quantity: number; price: string }>
}): string {
  const itemsHtml = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #2a2a2a;">${item.description}</td>
      <td style="padding: 12px; border-bottom: 1px solid #2a2a2a; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #2a2a2a; text-align: right;">${item.price}</td>
    </tr>
  `
    )
    .join('')

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1a1a1a; border-radius: 8px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background-color: #d4af37; padding: 24px; text-align: center;">
              <h1 style="margin: 0; color: #000; font-size: 24px;">Versati Glass</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <h2 style="color: #fff; margin: 0 0 16px;">Ola, ${data.customerName}!</h2>
              <p style="color: #a0a0a0; line-height: 1.6; margin: 0 0 24px;">
                Seu orcamento foi preparado e esta pronto para analise. Confira os detalhes abaixo:
              </p>

              <!-- Quote info -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #252525; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="color: #a0a0a0;">Numero do Orcamento</td>
                        <td style="color: #fff; text-align: right; font-weight: bold;">#${data.quoteNumber}</td>
                      </tr>
                      <tr>
                        <td style="color: #a0a0a0; padding-top: 8px;">Valido ate</td>
                        <td style="color: #fff; text-align: right; padding-top: 8px;">${data.validUntil}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Items -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <thead>
                  <tr style="background-color: #252525;">
                    <th style="padding: 12px; text-align: left; color: #a0a0a0; font-weight: normal;">Item</th>
                    <th style="padding: 12px; text-align: center; color: #a0a0a0; font-weight: normal;">Qtd</th>
                    <th style="padding: 12px; text-align: right; color: #a0a0a0; font-weight: normal;">Valor</th>
                  </tr>
                </thead>
                <tbody style="color: #fff;">
                  ${itemsHtml}
                </tbody>
              </table>

              <!-- Total -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: rgba(212, 175, 55, 0.1); border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="color: #a0a0a0;">Total</td>
                        <td style="color: #d4af37; text-align: right; font-size: 24px; font-weight: bold;">${data.total}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="color: #a0a0a0; line-height: 1.6; margin: 0 0 24px;">
                Voce pode aceitar o orcamento e prosseguir com o pagamento diretamente pelo portal do cliente.
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${data.portalUrl}" style="display: inline-block; background-color: #d4af37; color: #000; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: bold;">
                      Ver Orcamento e Aceitar
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #151515; padding: 24px; text-align: center;">
              <p style="color: #666; margin: 0 0 8px; font-size: 14px;">
                Versati Glass - Transparencia que transforma espacos
              </p>
              <p style="color: #666; margin: 0; font-size: 12px;">
                Rio de Janeiro, RJ | (21) 99999-9999
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

// Template: Pedido aprovado (após pagamento confirmado)
export function generateOrderApprovedEmailHtml(data: {
  customerName: string
  orderNumber: string
  total: string
  estimatedDelivery?: string
  portalUrl: string
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1a1a1a; border-radius: 8px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background-color: #d4af37; padding: 24px; text-align: center;">
              <h1 style="margin: 0; color: #000; font-size: 24px;">Versati Glass</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 32px; text-align: center;">
              <div style="width: 64px; height: 64px; background-color: rgba(34, 197, 94, 0.2); border-radius: 50%; margin: 0 auto 16px; line-height: 64px;">
                <span style="color: #22c55e; font-size: 32px;">✓</span>
              </div>

              <h2 style="color: #fff; margin: 0 0 16px;">Pedido Aprovado!</h2>

              <p style="color: #a0a0a0; line-height: 1.6; margin: 0 0 24px;">
                Ola, ${data.customerName}!<br>
                Seu pedido <strong style="color: #d4af37;">#${data.orderNumber}</strong> foi aprovado e ja esta em producao.
              </p>

              <!-- Order info -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #252525; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px;">
                    <p style="color: #a0a0a0; margin: 0 0 8px;">Valor Total</p>
                    <p style="color: #d4af37; font-size: 32px; font-weight: bold; margin: 0 0 16px;">${data.total}</p>
                    ${
                      data.estimatedDelivery
                        ? `
                    <p style="color: #a0a0a0; margin: 8px 0 0;">Previsao de entrega</p>
                    <p style="color: #fff; font-size: 18px; margin: 4px 0 0;">${data.estimatedDelivery}</p>
                    `
                        : ''
                    }
                  </td>
                </tr>
              </table>

              <p style="color: #a0a0a0; line-height: 1.6; margin: 0 0 24px;">
                Voce pode acompanhar o status do seu pedido em tempo real pelo portal do cliente.<br>
                Entraremos em contato em breve para agendar a instalacao.
              </p>

              <!-- CTA Button -->
              <a href="${data.portalUrl}" style="display: inline-block; background-color: #d4af37; color: #000; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: bold;">
                Acompanhar Pedido
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #151515; padding: 24px; text-align: center;">
              <p style="color: #666; margin: 0 0 8px; font-size: 14px;">
                Versati Glass - Transparencia que transforma espacos
              </p>
              <p style="color: #666; margin: 0; font-size: 12px;">
                Rio de Janeiro, RJ | (21) 99999-9999
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

// Template: Atualização de status genérico (para qualquer mudança de status)
export function generateOrderStatusUpdateEmailHtml(data: {
  customerName: string
  orderNumber: string
  status: string
  message: string
  icon: string
  portalUrl: string
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1a1a1a; border-radius: 8px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background-color: #d4af37; padding: 24px; text-align: center;">
              <h1 style="margin: 0; color: #000; font-size: 24px;">Versati Glass</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 32px; text-align: center;">
              <div style="width: 64px; height: 64px; background-color: rgba(212, 175, 55, 0.2); border-radius: 50%; margin: 0 auto 16px; line-height: 64px;">
                <span style="font-size: 32px;">${data.icon}</span>
              </div>

              <h2 style="color: #fff; margin: 0 0 16px;">${data.status}</h2>

              <p style="color: #a0a0a0; line-height: 1.6; margin: 0 0 24px;">
                Ola, ${data.customerName}!<br>
                Seu pedido <strong style="color: #d4af37;">#${data.orderNumber}</strong> foi atualizado.
              </p>

              <!-- Status info -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #252525; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px;">
                    <p style="color: #fff; line-height: 1.6; margin: 0;">${data.message}</p>
                  </td>
                </tr>
              </table>

              <p style="color: #a0a0a0; line-height: 1.6; margin: 0 0 24px;">
                Voce pode acompanhar o status do seu pedido em tempo real pelo portal do cliente.
              </p>

              <!-- CTA Button -->
              <a href="${data.portalUrl}" style="display: inline-block; background-color: #d4af37; color: #000; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: bold;">
                Ver Detalhes do Pedido
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #151515; padding: 24px; text-align: center;">
              <p style="color: #666; margin: 0 0 8px; font-size: 14px;">
                Versati Glass - Transparencia que transforma espacos
              </p>
              <p style="color: #666; margin: 0; font-size: 12px;">
                Rio de Janeiro, RJ | (21) 99999-9999
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

// Template: Instalação agendada
export function generateInstallationScheduledEmailHtml(data: {
  customerName: string
  orderNumber: string
  date: string
  time: string
  address: string
  estimatedDuration: string
  portalUrl: string
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1a1a1a; border-radius: 8px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background-color: #d4af37; padding: 24px; text-align: center;">
              <h1 style="margin: 0; color: #000; font-size: 24px;">Versati Glass</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <h2 style="color: #fff; margin: 0 0 16px;">Instalacao Agendada!</h2>

              <p style="color: #a0a0a0; line-height: 1.6; margin: 0 0 24px;">
                Ola, ${data.customerName}!<br>
                A instalacao do seu pedido <strong style="color: #d4af37;">#${data.orderNumber}</strong> foi agendada.
              </p>

              <!-- Appointment info -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #252525; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-bottom: 16px;">
                          <span style="color: #d4af37; font-size: 18px;">📅</span>
                          <span style="color: #a0a0a0; margin-left: 8px;">Data</span>
                          <p style="color: #fff; margin: 4px 0 0; font-weight: bold; font-size: 18px;">${data.date}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 16px;">
                          <span style="color: #d4af37; font-size: 18px;">🕐</span>
                          <span style="color: #a0a0a0; margin-left: 8px;">Horario</span>
                          <p style="color: #fff; margin: 4px 0 0; font-weight: bold; font-size: 18px;">${data.time}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 16px;">
                          <span style="color: #d4af37; font-size: 18px;">⏱️</span>
                          <span style="color: #a0a0a0; margin-left: 8px;">Duracao Estimada</span>
                          <p style="color: #fff; margin: 4px 0 0;">${data.estimatedDuration}</p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <span style="color: #d4af37; font-size: 18px;">📍</span>
                          <span style="color: #a0a0a0; margin-left: 8px;">Endereco</span>
                          <p style="color: #fff; margin: 4px 0 0;">${data.address}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Important notice -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: rgba(212, 175, 55, 0.1); border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px;">
                    <p style="color: #d4af37; font-weight: bold; margin: 0 0 8px;">⚠️ Importante:</p>
                    <ul style="color: #a0a0a0; margin: 0; padding-left: 20px; line-height: 1.8;">
                      <li>Certifique-se de que alguem estara presente no local</li>
                      <li>O local deve estar limpo e acessivel</li>
                      <li>Proteja moveis e objetos proximos a area de instalacao</li>
                    </ul>
                  </td>
                </tr>
              </table>

              <p style="color: #a0a0a0; line-height: 1.6; margin: 0 0 24px;">
                Precisa reagendar? Entre em contato conosco pelo WhatsApp (21) 99999-9999 ou pelo portal.
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${data.portalUrl}" style="display: inline-block; background-color: #d4af37; color: #000; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: bold;">
                      Ver Detalhes do Agendamento
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #151515; padding: 24px; text-align: center;">
              <p style="color: #666; margin: 0 0 8px; font-size: 14px;">
                Versati Glass - Transparencia que transforma espacos
              </p>
              <p style="color: #666; margin: 0; font-size: 12px;">
                Rio de Janeiro, RJ | (21) 99999-9999
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

// Template: Lembrete de agendamento (24h antes)
export function generateAppointmentReminderEmailHtml(data: {
  customerName: string
  appointmentDate: string
  appointmentTime: string
  serviceAddress: string
  estimatedDuration: string
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1a1a1a; border-radius: 8px; overflow: hidden;">
          <tr>
            <td style="background-color: #d4af37; padding: 24px; text-align: center;">
              <h1 style="margin: 0; color: #000; font-size: 24px;">Versati Glass</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px;">
              <div style="text-align: center; margin-bottom: 24px;">
                <span style="font-size: 48px;">⏰</span>
              </div>
              <h2 style="color: #fff; margin: 0 0 16px; text-align: center;">Lembrete de Agendamento</h2>
              <p style="color: #a0a0a0; line-height: 1.6; margin: 0 0 24px;">
                Ola, ${data.customerName}!
              </p>
              <p style="color: #a0a0a0; line-height: 1.6; margin: 0 0 24px;">
                Este e um lembrete de que sua visita tecnica/instalacao esta agendada para amanha.
              </p>
              <div style="background-color: #0a0a0a; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
                <table width="100%" cellpadding="8" cellspacing="0">
                  <tr>
                    <td style="color: #666; width: 40%;">Data:</td>
                    <td style="color: #fff; font-weight: bold;">${data.appointmentDate}</td>
                  </tr>
                  <tr>
                    <td style="color: #666;">Horario:</td>
                    <td style="color: #fff; font-weight: bold;">${data.appointmentTime}</td>
                  </tr>
                  <tr>
                    <td style="color: #666;">Duracao:</td>
                    <td style="color: #fff;">${data.estimatedDuration}</td>
                  </tr>
                  <tr>
                    <td style="color: #666;">Endereco:</td>
                    <td style="color: #fff;">${data.serviceAddress}</td>
                  </tr>
                </table>
              </div>
              <p style="color: #a0a0a0; line-height: 1.6; margin: 0;">
                Qualquer duvida, entre em contato conosco.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #0a0a0a; padding: 24px; text-align: center;">
              <p style="color: #666; margin: 0; font-size: 12px;">
                +55 21 98253-6229 | contato@versatiglass.com.br
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

// Template: Instalacao concluida
export function generateInstallationCompletedEmailHtml(data: {
  customerName: string
  orderNumber: string
  completionDate: string
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1a1a1a; border-radius: 8px; overflow: hidden;">
          <tr>
            <td style="background-color: #d4af37; padding: 24px; text-align: center;">
              <h1 style="margin: 0; color: #000; font-size: 24px;">Versati Glass</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px;">
              <div style="text-align: center; margin-bottom: 24px;">
                <span style="font-size: 64px;">✅</span>
              </div>
              <h2 style="color: #fff; margin: 0 0 16px; text-align: center;">Instalacao Concluida!</h2>
              <p style="color: #a0a0a0; line-height: 1.6; margin: 0 0 24px;">
                Ola, ${data.customerName}!
              </p>
              <p style="color: #a0a0a0; line-height: 1.6; margin: 0 0 24px;">
                A instalacao do pedido <strong style="color: #d4af37;">#${data.orderNumber}</strong> foi concluida com sucesso em ${data.completionDate}.
              </p>
              <p style="color: #a0a0a0; line-height: 1.6; margin: 0;">
                Agradecemos pela confianca!
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #0a0a0a; padding: 24px; text-align: center;">
              <p style="color: #666; margin: 0; font-size: 12px;">
                +55 21 98253-6229 | contato@versatiglass.com.br
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}
