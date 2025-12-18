import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { formatCurrency, formatDate } from '@/lib/utils'
import { logger } from '@/lib/logger'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/quotes/:id/pdf
 * Gera HTML formatado para impressao/PDF do orcamento (para fornecedores)
 */
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Nao autenticado' }, { status: 401 })
    }

    if (session.user.role !== 'ADMIN' && session.user.role !== 'STAFF') {
      return NextResponse.json({ error: 'Permissao negada' }, { status: 403 })
    }

    const { id } = await params

    const quote = await prisma.quote.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                name: true,
                category: true,
              },
            },
          },
        },
      },
    })

    if (!quote) {
      return NextResponse.json({ error: 'Orcamento nao encontrado' }, { status: 404 })
    }

    // Gerar HTML para PDF (formato para fornecedor - sem valores finais)
    const html = generateSupplierQuoteHtml(quote)

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `inline; filename="orcamento-${quote.number}-fornecedor.html"`,
      },
    })
  } catch (error) {
    logger.error('Error generating quote PDF:', error)
    return NextResponse.json({ error: 'Erro ao gerar PDF' }, { status: 500 })
  }
}

function generateSupplierQuoteHtml(quote: any): string {
  const items = quote.items
    .map(
      (item: any, index: number) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: center;">${index + 1}</td>
      <td style="padding: 12px; border-bottom: 1px solid #ddd;">
        <strong>${item.product?.name || item.description}</strong>
        ${item.specifications ? `<br><small style="color: #666;">${item.specifications}</small>` : ''}
        ${item.color ? `<br><small style="color: #666;">Cor: ${item.color}</small>` : ''}
        ${item.thickness ? `<br><small style="color: #666;">Espessura: ${item.thickness}</small>` : ''}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: center;">
        ${item.width && item.height ? `${Number(item.width).toFixed(2)}m x ${Number(item.height).toFixed(2)}m` : '-'}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: center;">
        ${item.width && item.height ? (Number(item.width) * Number(item.height) * item.quantity).toFixed(2) + ' m2' : '-'}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
    </tr>
  `
    )
    .join('')

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Solicitacao de Orcamento #${quote.number} - Versati Glass</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: Arial, sans-serif;
      font-size: 12px;
      line-height: 1.5;
      color: #333;
      background: #fff;
      padding: 20px;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: #fff;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #d4af37;
      padding-bottom: 20px;
      margin-bottom: 20px;
    }
    .logo-section h1 {
      font-size: 28px;
      color: #1a1a1a;
      margin-bottom: 4px;
    }
    .logo-section p {
      color: #666;
      font-size: 11px;
    }
    .quote-info {
      text-align: right;
    }
    .quote-info h2 {
      font-size: 14px;
      color: #666;
      font-weight: normal;
    }
    .quote-info .number {
      font-size: 24px;
      font-weight: bold;
      color: #d4af37;
    }
    .quote-info .date {
      font-size: 11px;
      color: #666;
    }
    .section {
      margin-bottom: 24px;
    }
    .section-title {
      font-size: 14px;
      font-weight: bold;
      color: #1a1a1a;
      border-bottom: 1px solid #ddd;
      padding-bottom: 8px;
      margin-bottom: 12px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .info-item {
      font-size: 11px;
    }
    .info-item label {
      color: #666;
      display: block;
      margin-bottom: 2px;
    }
    .info-item span {
      color: #1a1a1a;
      font-weight: 500;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
    }
    th {
      background: #f5f5f5;
      padding: 12px;
      text-align: left;
      font-size: 11px;
      font-weight: 600;
      color: #333;
      border-bottom: 2px solid #ddd;
    }
    th:first-child {
      text-align: center;
      width: 40px;
    }
    .notes-box {
      background: #fffef0;
      border: 1px solid #e6dfa8;
      border-radius: 4px;
      padding: 12px;
      font-size: 11px;
    }
    .notes-box h4 {
      font-size: 12px;
      margin-bottom: 8px;
      color: #8b7d2f;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      text-align: center;
      font-size: 10px;
      color: #666;
    }
    .stamp-area {
      margin-top: 40px;
      display: flex;
      justify-content: space-between;
    }
    .stamp-box {
      border: 1px dashed #ccc;
      padding: 40px 20px;
      text-align: center;
      width: 45%;
    }
    .stamp-box p {
      font-size: 10px;
      color: #999;
    }
    .warning {
      background: #fff3cd;
      border: 1px solid #ffc107;
      border-radius: 4px;
      padding: 10px;
      font-size: 11px;
      color: #856404;
      margin-bottom: 20px;
    }
    @media print {
      body {
        padding: 0;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .no-print {
        display: none;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo-section">
        <h1>VERSATI GLASS</h1>
        <p>Solicitacao de Orcamento para Fornecedor</p>
      </div>
      <div class="quote-info">
        <h2>Referencia Interna</h2>
        <div class="number">#${quote.number}</div>
        <div class="date">Data: ${formatDate(quote.createdAt)}</div>
      </div>
    </div>

    <div class="warning">
      <strong>DOCUMENTO INTERNO - NAO ENVIAR AO CLIENTE</strong><br>
      Este documento e destinado exclusivamente para solicitacao de precos a fornecedores.
    </div>

    <div class="section">
      <div class="section-title">LOCAL DA INSTALACAO</div>
      <div class="info-grid">
        <div class="info-item">
          <label>Endereco</label>
          <span>
            ${quote.serviceStreet}, ${quote.serviceNumber}
            ${quote.serviceComplement ? ` - ${quote.serviceComplement}` : ''}
          </span>
        </div>
        <div class="info-item">
          <label>Bairro / Cidade</label>
          <span>${quote.serviceNeighborhood}, ${quote.serviceCity}/${quote.serviceState}</span>
        </div>
        <div class="info-item">
          <label>CEP</label>
          <span>${quote.serviceZipCode}</span>
        </div>
        <div class="info-item">
          <label>Contato no Local</label>
          <span>${quote.customerName} - ${quote.customerPhone || 'Sem telefone'}</span>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">ITENS SOLICITADOS</div>
      <table>
        <thead>
          <tr>
            <th style="text-align: center;">#</th>
            <th>Descricao / Especificacoes</th>
            <th style="text-align: center;">Medidas (L x A)</th>
            <th style="text-align: center;">Area Total</th>
            <th style="text-align: center;">Qtd</th>
          </tr>
        </thead>
        <tbody>
          ${items}
        </tbody>
      </table>
    </div>

    ${
      quote.customerNotes || quote.internalNotes
        ? `
    <div class="section">
      <div class="section-title">OBSERVACOES</div>
      <div class="notes-box">
        ${quote.customerNotes ? `<h4>Observacoes do Cliente:</h4><p>${quote.customerNotes}</p>` : ''}
        ${quote.internalNotes ? `<h4>Notas Internas:</h4><p>${quote.internalNotes}</p>` : ''}
      </div>
    </div>
    `
        : ''
    }

    <div class="stamp-area">
      <div class="stamp-box">
        <p>Carimbo / Assinatura Fornecedor</p>
      </div>
      <div class="stamp-box">
        <p>Data de Resposta / Validade</p>
      </div>
    </div>

    <div class="footer">
      <p>VERSATI GLASS - CNPJ: XX.XXX.XXX/0001-XX</p>
      <p>Rio de Janeiro, RJ | Tel: (21) 98253-6229 | contato@versatiglass.com.br</p>
      <p style="margin-top: 10px;">Documento gerado em ${new Date().toLocaleString('pt-BR')}</p>
    </div>
  </div>

  <script class="no-print">
    // Auto-print quando abrir
    // window.onload = function() { window.print(); }
  </script>
</body>
</html>
`
}
