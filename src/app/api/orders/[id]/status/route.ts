import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { updateOrderStatusSchema } from '@/lib/validations/order'
import { sendEmail } from '@/services/email'
import {
  generateOrderApprovedEmailHtml,
  generateOrderStatusUpdateEmailHtml,
} from '@/services/email-templates'
import { formatCurrency, formatDate } from '@/lib/utils'
import { z } from 'zod'
import { OrderStatus } from '@prisma/client'
import { logger } from '@/lib/logger'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * PUT /api/orders/:id/status
 * Atualiza o status de uma ordem (apenas ADMIN)
 * Cria automaticamente uma entrada no timeline
 * Atualiza timestamps relevantes (completedAt, installedAt)
 */
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    // Verificar autenticação
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    // Verificar se é admin ou staff
    if (session.user.role !== 'ADMIN' && session.user.role !== 'STAFF') {
      return NextResponse.json(
        { error: 'Permissão negada. Apenas administradores podem atualizar status de pedidos.' },
        { status: 403 }
      )
    }

    const { id } = await params

    // Parsear e validar dados
    const body = await request.json()
    const validatedData = updateOrderStatusSchema.parse(body)

    // Verificar se ordem existe
    const existingOrder = await prisma.order.findUnique({
      where: { id },
      select: {
        id: true,
        number: true,
        status: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!existingOrder) {
      return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 })
    }

    // Preparar dados de atualização
    const updateData: {
      status: OrderStatus
      internalNotes?: string
      completedAt?: Date
      installedAt?: Date
    } = {
      status: validatedData.status,
    }

    // Adicionar notas internas se fornecidas
    if (validatedData.internalNotes) {
      updateData.internalNotes = validatedData.internalNotes
    }

    // Atualizar timestamps específicos baseado no status
    if (validatedData.status === 'CONCLUIDO' && existingOrder.status !== 'CONCLUIDO') {
      updateData.completedAt = new Date()
    }

    if (validatedData.status === 'INSTALANDO' && existingOrder.status !== 'INSTALANDO') {
      updateData.installedAt = new Date()
    }

    // Criar transaction para atualizar ordem + criar timeline entry
    const [updatedOrder, timelineEntry] = await prisma.$transaction([
      // Atualizar ordem
      prisma.order.update({
        where: { id },
        data: updateData,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          items: true,
        },
      }),

      // Criar entrada no timeline
      prisma.orderTimelineEntry.create({
        data: {
          orderId: id,
          status: validatedData.status,
          description: generateStatusDescription(validatedData.status, existingOrder.status),
          createdBy: session.user.id,
        },
      }),
    ])

    // Serializar Decimal para JSON
    const serializedOrder = {
      ...updatedOrder,
      subtotal: Number(updatedOrder.subtotal),
      discount: Number(updatedOrder.discount),
      installationFee: Number(updatedOrder.installationFee),
      total: Number(updatedOrder.total),
      paidAmount: Number(updatedOrder.paidAmount),
      items: updatedOrder.items.map((item) => ({
        ...item,
        width: item.width ? Number(item.width) : null,
        height: item.height ? Number(item.height) : null,
        unitPrice: Number(item.unitPrice),
        totalPrice: Number(item.totalPrice),
      })),
    }

    // Enviar notificação ao cliente via email
    if (validatedData.notifyCustomer && updatedOrder.user.email) {
      try {
        const portalUrl = `${process.env.NEXT_PUBLIC_APP_URL}/portal/pedidos/${updatedOrder.id}`

        // Determinar qual template de email enviar baseado no novo status
        let emailHtml: string | null = null
        let subject = ''

        switch (validatedData.status) {
          case 'APROVADO':
            subject = `Pedido #${updatedOrder.number} - Aprovado e Em Produção! 🎉`
            emailHtml = generateOrderApprovedEmailHtml({
              customerName: updatedOrder.user.name || 'Cliente',
              orderNumber: updatedOrder.number,
              total: formatCurrency(Number(updatedOrder.total)),
              estimatedDelivery: updatedOrder.estimatedDelivery
                ? formatDate(new Date(updatedOrder.estimatedDelivery))
                : undefined,
              portalUrl,
            })
            break

          case 'EM_PRODUCAO':
            subject = `Pedido #${updatedOrder.number} - Em Produção 🔨`
            emailHtml = generateOrderStatusUpdateEmailHtml({
              customerName: updatedOrder.user.name || 'Cliente',
              orderNumber: updatedOrder.number,
              status: 'Em Produção',
              message: 'Seu pedido está sendo fabricado com todo cuidado e atenção aos detalhes.',
              icon: '🔨',
              portalUrl,
            })
            break

          case 'PRONTO_ENTREGA':
            subject = `Pedido #${updatedOrder.number} - Pronto para Instalação! ✅`
            emailHtml = generateOrderStatusUpdateEmailHtml({
              customerName: updatedOrder.user.name || 'Cliente',
              orderNumber: updatedOrder.number,
              status: 'Pronto para Instalação',
              message:
                'Seu pedido está pronto! Em breve entraremos em contato para agendar a instalação.',
              icon: '✅',
              portalUrl,
            })
            break

          case 'INSTALACAO_AGENDADA':
            // Nota: Para este status, idealmente deveria ter uma instalação agendada
            // Por enquanto enviamos um email genérico
            subject = `Pedido #${updatedOrder.number} - Instalação Agendada 📅`
            emailHtml = generateOrderStatusUpdateEmailHtml({
              customerName: updatedOrder.user.name || 'Cliente',
              orderNumber: updatedOrder.number,
              status: 'Instalação Agendada',
              message: 'A instalação do seu pedido foi agendada. Verifique os detalhes no portal.',
              icon: '📅',
              portalUrl,
            })
            break

          case 'INSTALANDO':
            subject = `Pedido #${updatedOrder.number} - Instalação em Andamento 🚀`
            emailHtml = generateOrderStatusUpdateEmailHtml({
              customerName: updatedOrder.user.name || 'Cliente',
              orderNumber: updatedOrder.number,
              status: 'Instalação em Andamento',
              message:
                'Nossa equipe está instalando seu pedido agora. Em breve estará tudo pronto!',
              icon: '🚀',
              portalUrl,
            })
            break

          case 'CONCLUIDO':
            subject = `Pedido #${updatedOrder.number} - Concluído com Sucesso! 🎊`
            emailHtml = generateOrderStatusUpdateEmailHtml({
              customerName: updatedOrder.user.name || 'Cliente',
              orderNumber: updatedOrder.number,
              status: 'Concluído',
              message:
                'Seu pedido foi concluído! Agradecemos pela confiança na Versati Glass. Esperamos que você aproveite seu novo espaço!',
              icon: '🎊',
              portalUrl,
            })
            break

          case 'CANCELADO':
            subject = `Pedido #${updatedOrder.number} - Cancelado`
            emailHtml = generateOrderStatusUpdateEmailHtml({
              customerName: updatedOrder.user.name || 'Cliente',
              orderNumber: updatedOrder.number,
              status: 'Cancelado',
              message: 'Seu pedido foi cancelado. Se você tiver dúvidas, entre em contato conosco.',
              icon: '❌',
              portalUrl,
            })
            break

          case 'AGUARDANDO_CLIENTE':
            subject = `Pedido #${updatedOrder.number} - Aguardando seu Retorno`
            emailHtml = generateOrderStatusUpdateEmailHtml({
              customerName: updatedOrder.user.name || 'Cliente',
              orderNumber: updatedOrder.number,
              status: 'Aguardando Retorno',
              message:
                'Precisamos de algumas informações para continuar com seu pedido. Por favor, entre em contato conosco.',
              icon: '⏳',
              portalUrl,
            })
            break
        }

        // Enviar email apenas se houver template definido para o status
        if (emailHtml) {
          await sendEmail({
            to: updatedOrder.user.email,
            subject,
            html: emailHtml,
          })
        }
      } catch (emailError) {
        // Log erro mas não falha a requisição
        logger.error('Error sending order status notification email:', emailError)
        // Continua sem lançar erro - a atualização do status já foi feita com sucesso
      }
    }

    return NextResponse.json({
      order: serializedOrder,
      timeline: timelineEntry,
      message: 'Status atualizado com sucesso',
    })
  } catch (error) {
    logger.error('Error updating order status:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dados inválidos', details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: 'Erro ao atualizar status do pedido' }, { status: 500 })
  }
}

/**
 * Helper: Gera descrição amigável para entrada no timeline
 */
function generateStatusDescription(newStatus: OrderStatus, oldStatus: OrderStatus): string {
  const statusDescriptions: Record<OrderStatus, string> = {
    ORCAMENTO_ENVIADO: 'Orçamento enviado ao cliente',
    AGUARDANDO_PAGAMENTO: 'Aguardando confirmação de pagamento',
    APROVADO: 'Pedido aprovado e confirmado',
    EM_PRODUCAO: 'Produção iniciada',
    PRONTO_ENTREGA: 'Produto pronto para instalação',
    INSTALACAO_AGENDADA: 'Instalação agendada com o cliente',
    INSTALANDO: 'Instalação em andamento',
    CONCLUIDO: 'Serviço concluído com sucesso',
    CANCELADO: 'Pedido cancelado',
    AGUARDANDO_CLIENTE: 'Aguardando retorno do cliente',
    EM_REVISAO: 'Pedido em revisão',
  }

  return `Status alterado de "${statusDescriptions[oldStatus] || oldStatus}" para "${statusDescriptions[newStatus] || newStatus}"`
}
