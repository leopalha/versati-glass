import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { logger } from '@/lib/logger'
import { sendEmail } from '@/services/email'

const sendToSuppliersSchema = z.object({
  supplierIds: z.array(z.string()).min(1, 'Selecione pelo menos um fornecedor'),
})

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()

    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'STAFF')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { supplierIds } = sendToSuppliersSchema.parse(body)

    // Buscar orçamento
    const quote = await prisma.quote.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    })

    if (!quote) {
      return NextResponse.json({ error: 'Orçamento não encontrado' }, { status: 404 })
    }

    // Buscar fornecedores
    const suppliers = await prisma.supplier.findMany({
      where: {
        id: { in: supplierIds },
        isActive: true,
      },
    })

    if (suppliers.length === 0) {
      return NextResponse.json({ error: 'Nenhum fornecedor ativo encontrado' }, { status: 400 })
    }

    const results = []

    // Para cada fornecedor
    for (const supplier of suppliers) {
      try {
        // Criar ou buscar SupplierQuote
        const existingQuote = await prisma.supplierQuote.findFirst({
          where: {
            quoteId: quote.id,
            supplierId: supplier.id,
          },
        })

        if (existingQuote) {
          // Atualizar existente
          await prisma.supplierQuote.update({
            where: { id: existingQuote.id },
            data: {
              status: 'PENDING',
              emailSentAt: new Date(),
            },
          })
        } else {
          // Criar novo
          await prisma.supplierQuote.create({
            data: {
              quoteId: quote.id,
              supplierId: supplier.id,
              status: 'PENDING',
              emailSentAt: new Date(),
            },
          })
        }

        // Criar HTML do email
        const itemsHtml = quote.items
          .map(
            (item, index) => `
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">
              <strong>${index + 1}. ${item.description}</strong><br/>
              <span style="color: #666; font-size: 14px;">
                Quantidade: ${item.quantity}
                ${item.width && item.height ? ` | Medidas: ${item.width}m x ${item.height}m` : ''}
              </span>
              ${item.specifications ? `<br/><span style="color: #666; font-size: 14px;">Especificações: ${item.specifications}</span>` : ''}
            </td>
          </tr>
        `
          )
          .join('')

        const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff;">
    <div style="background: #0A0A0A; padding: 24px; text-align: center;">
      <h1 style="margin: 0; color: #C9A962;">Versati Glass</h1>
    </div>

    <div style="padding: 32px;">
      <h2 style="color: #1a1a1a;">Nova Cotação ${quote.number}</h2>

      <p>Olá ${supplier.name},</p>

      <p>Estamos solicitando uma cotação para o orçamento <strong>${quote.number}</strong>.
      Por favor, nos envie sua melhor proposta com prazo e valores detalhados.</p>

      <h3 style="color: #1a1a1a; margin-top: 24px;">📋 Itens Solicitados (${quote.items.length})</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        ${itemsHtml}
      </table>

      <h3 style="color: #1a1a1a; margin-top: 24px;">📍 Local de Instalação</h3>
      <p>${quote.serviceStreet}, ${quote.serviceNumber}<br/>
      ${quote.serviceNeighborhood} - ${quote.serviceCity}/${quote.serviceState}</p>

      <h3 style="color: #1a1a1a; margin-top: 24px;">📨 Como Responder</h3>
      <p>Por favor, responda este email com:</p>
      <ul style="list-style: none; padding-left: 0;">
        <li>✓ <strong>Material:</strong> R$ ___</li>
        <li>✓ <strong>Frete:</strong> R$ ___</li>
        <li>✓ <strong>Instalação:</strong> R$ ___</li>
        <li>✓ <strong>TOTAL:</strong> R$ ___</li>
        <li>✓ <strong>Prazo de Entrega:</strong> ___ dias úteis</li>
      </ul>

      <div style="background: #ffe6e6; padding: 16px; border-radius: 8px; margin-top: 24px;">
        <p style="margin: 0; color: #d32f2f;"><strong>⏰ Prazo:</strong> Aguardamos sua resposta em até 48 horas</p>
        <p style="margin: 8px 0 0; color: #d32f2f;"><strong>📧 Ref:</strong> ${quote.number}</p>
      </div>
    </div>

    <div style="background: #f5f5f5; padding: 24px; text-align: center; font-size: 14px; color: #666;">
      <p><strong>Versati Glass</strong> - Vidros Premium</p>
      <p>Estrada Três Rios, 1156 - Freguesia, Rio de Janeiro - RJ</p>
      <p>Tel: +55 (21) 98253-6229 | Email: versatiglass@gmail.com</p>
    </div>
  </div>
</body>
</html>
        `

        // Enviar email
        await sendEmail({
          to: supplier.email,
          subject: `Nova Cotação: ${quote.number} - Versati Glass`,
          html: emailHtml,
        })

        // Atualizar contador do fornecedor
        await prisma.supplier.update({
          where: { id: supplier.id },
          data: {
            totalQuotes: { increment: 1 },
          },
        })

        results.push({
          supplierId: supplier.id,
          supplierName: supplier.name,
          success: true,
        })

        logger.info(`Cotação enviada para fornecedor: ${supplier.name}`, {
          quoteId: quote.id,
          supplierId: supplier.id,
        })
      } catch (error) {
        logger.error(`Erro ao enviar cotação para ${supplier.name}:`, error)
        results.push({
          supplierId: supplier.id,
          supplierName: supplier.name,
          success: false,
          error: 'Erro ao enviar email',
        })
      }
    }

    // Atualizar status do quote se necessário
    if (quote.status === 'DRAFT') {
      await prisma.quote.update({
        where: { id: quote.id },
        data: {
          status: 'SENT', // Status indicando que foi enviado (pode criar novo status PENDING_SUPPLIERS)
        },
      })
    }

    const successCount = results.filter((r) => r.success).length

    return NextResponse.json({
      message: `Cotação enviada para ${successCount} de ${suppliers.length} fornecedores`,
      results,
    })
  } catch (error) {
    logger.error('Erro ao enviar cotação para fornecedores:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dados inválidos', details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: 'Erro ao enviar cotação' }, { status: 500 })
  }
}
