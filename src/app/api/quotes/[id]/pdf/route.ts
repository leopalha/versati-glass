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
 * Gera HTML formatado para impressao/PDF do orcamento
 * Query params:
 *   - type=supplier (default) - PDF para fornecedor (sem valores)
 *   - type=customer - PDF para cliente (com valores)
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
    const { searchParams } = new URL(request.url)
    const pdfType = searchParams.get('type') || 'supplier'

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

    // Gerar HTML baseado no tipo
    const html =
      pdfType === 'customer' ? generateCustomerQuoteHtml(quote) : generateSupplierQuoteHtml(quote)

    const filename =
      pdfType === 'customer'
        ? `orcamento-${quote.number}-cliente.html`
        : `orcamento-${quote.number}-fornecedor.html`

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `inline; filename="${filename}"`,
      },
    })
  } catch (error) {
    logger.error('Error generating quote PDF:', error)
    return NextResponse.json({ error: 'Erro ao gerar PDF' }, { status: 500 })
  }
}

function generateCustomerQuoteHtml(quote: any): string {
  const items = quote.items
    .map(
      (item: any, index: number) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #333; text-align: center; color: #ccc;">${index + 1}</td>
      <td style="padding: 12px; border-bottom: 1px solid #333;">
        <strong style="color: #fff;">${item.product?.name || item.description}</strong>
        ${item.specifications ? `<br><small style="color: #888;">${item.specifications}</small>` : ''}
        ${item.color ? `<br><small style="color: #888;">Cor: ${item.color}</small>` : ''}
        ${item.finish ? `<br><small style="color: #888;">Acabamento: ${item.finish}</small>` : ''}
        ${item.thickness ? `<br><small style="color: #888;">Espessura: ${item.thickness}</small>` : ''}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #333; text-align: center; color: #ccc;">
        ${item.width && item.height ? `${Number(item.width).toFixed(2)}m x ${Number(item.height).toFixed(2)}m` : '-'}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #333; text-align: center; color: #ccc;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #333; text-align: right; color: #ccc;">${formatCurrency(Number(item.unitPrice))}</td>
      <td style="padding: 12px; border-bottom: 1px solid #333; text-align: right; color: #d4af37; font-weight: bold;">${formatCurrency(Number(item.totalPrice))}</td>
    </tr>
  `
    )
    .join('')

  const subtotal = Number(quote.subtotal)
  const discount = Number(quote.discount) || 0
  const discountValue = subtotal * (discount / 100)
  const shippingFee = Number(quote.shippingFee) || 0
  const laborFee = Number(quote.laborFee) || 0
  const materialFee = Number(quote.materialFee) || 0
  const total = Number(quote.total)

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Orcamento #${quote.number} - Versati Glass</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      font-size: 12px;
      line-height: 1.6;
      color: #e0e0e0;
      background: #1a1a1a;
      padding: 20px;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: #1f1f1f;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    }
    .header {
      background: linear-gradient(135deg, #d4af37 0%, #b8962e 100%);
      padding: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo-section h1 {
      font-size: 32px;
      color: #1a1a1a;
      font-weight: bold;
      letter-spacing: 2px;
    }
    .logo-section p {
      color: #333;
      font-size: 12px;
      margin-top: 4px;
    }
    .quote-info {
      text-align: right;
      color: #1a1a1a;
    }
    .quote-info h2 {
      font-size: 14px;
      font-weight: normal;
      opacity: 0.8;
    }
    .quote-info .number {
      font-size: 28px;
      font-weight: bold;
    }
    .quote-info .date {
      font-size: 11px;
      opacity: 0.8;
    }
    .content { padding: 30px; }
    .section { margin-bottom: 28px; }
    .section-title {
      font-size: 14px;
      font-weight: bold;
      color: #d4af37;
      border-bottom: 1px solid #333;
      padding-bottom: 8px;
      margin-bottom: 16px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .info-item { font-size: 12px; }
    .info-item label {
      color: #888;
      display: block;
      margin-bottom: 4px;
      font-size: 10px;
      text-transform: uppercase;
    }
    .info-item span {
      color: #fff;
      font-weight: 500;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
    }
    th {
      background: #2a2a2a;
      padding: 14px 12px;
      text-align: left;
      font-size: 11px;
      font-weight: 600;
      color: #d4af37;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    th:first-child { text-align: center; width: 40px; }
    .totals-box {
      background: #2a2a2a;
      border-radius: 8px;
      padding: 20px;
      margin-top: 20px;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 13px;
    }
    .total-row.subtotal { border-bottom: 1px solid #333; }
    .total-row.discount { color: #4ade80; }
    .total-row.final {
      border-top: 2px solid #d4af37;
      margin-top: 12px;
      padding-top: 16px;
      font-size: 18px;
      font-weight: bold;
    }
    .total-row.final .value { color: #d4af37; }
    .validity-box {
      background: rgba(212, 175, 55, 0.1);
      border: 1px solid rgba(212, 175, 55, 0.3);
      border-radius: 8px;
      padding: 16px;
      text-align: center;
      margin-top: 24px;
    }
    .validity-box p { color: #d4af37; font-size: 13px; }
    .validity-box .date { font-size: 18px; font-weight: bold; margin-top: 4px; }
    .notes-box {
      background: #2a2a2a;
      border-radius: 8px;
      padding: 16px;
      font-size: 12px;
      color: #ccc;
    }
    .notes-box h4 {
      color: #d4af37;
      margin-bottom: 8px;
      font-size: 12px;
    }
    .footer {
      background: #151515;
      padding: 24px 30px;
      text-align: center;
      font-size: 11px;
      color: #666;
    }
    .footer p { margin-bottom: 4px; }
    .cta-box {
      background: linear-gradient(135deg, #d4af37 0%, #b8962e 100%);
      border-radius: 8px;
      padding: 20px;
      text-align: center;
      margin: 24px 0;
    }
    .cta-box h3 {
      color: #1a1a1a;
      font-size: 16px;
      margin-bottom: 8px;
    }
    .cta-box p {
      color: #333;
      font-size: 12px;
    }
    @media print {
      body { background: #fff; padding: 0; color: #333; }
      .container { box-shadow: none; }
      .header { background: #d4af37 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      th { background: #f0f0f0 !important; color: #333 !important; }
      td { color: #333 !important; border-bottom-color: #ddd !important; }
      .section-title { color: #b8962e !important; border-bottom-color: #ddd !important; }
      .info-item label { color: #666 !important; }
      .info-item span { color: #333 !important; }
      .totals-box { background: #f5f5f5 !important; }
      .total-row.final .value { color: #b8962e !important; }
      .notes-box { background: #f5f5f5 !important; }
      .validity-box { background: rgba(212, 175, 55, 0.1) !important; }
      .cta-box { background: #d4af37 !important; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo-section">
        <h1>VERSATI GLASS</h1>
        <p>Transparencia que transforma espacos</p>
      </div>
      <div class="quote-info">
        <h2>Orcamento</h2>
        <div class="number">#${quote.number}</div>
        <div class="date">Emitido em ${formatDate(quote.createdAt)}</div>
      </div>
    </div>

    <div class="content">
      <div class="section">
        <div class="section-title">Dados do Cliente</div>
        <div class="info-grid">
          <div class="info-item">
            <label>Nome</label>
            <span>${quote.customerName}</span>
          </div>
          <div class="info-item">
            <label>Email</label>
            <span>${quote.customerEmail}</span>
          </div>
          <div class="info-item">
            <label>Telefone</label>
            <span>${quote.customerPhone || 'Nao informado'}</span>
          </div>
          <div class="info-item">
            <label>Local do Servico</label>
            <span>
              ${quote.serviceStreet}, ${quote.serviceNumber}${quote.serviceComplement ? ` - ${quote.serviceComplement}` : ''}<br>
              ${quote.serviceNeighborhood}, ${quote.serviceCity}/${quote.serviceState} - ${quote.serviceZipCode}
            </span>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Itens do Orcamento</div>
        <table>
          <thead>
            <tr>
              <th style="text-align: center;">#</th>
              <th>Produto / Especificacoes</th>
              <th style="text-align: center;">Medidas</th>
              <th style="text-align: center;">Qtd</th>
              <th style="text-align: right;">Preco Unit.</th>
              <th style="text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${items}
          </tbody>
        </table>

        <div class="totals-box">
          <div class="total-row subtotal">
            <span>Subtotal</span>
            <span>${formatCurrency(subtotal)}</span>
          </div>
          ${
            shippingFee > 0
              ? `
          <div class="total-row">
            <span>Frete</span>
            <span>${formatCurrency(shippingFee)}</span>
          </div>
          `
              : ''
          }
          ${
            laborFee > 0
              ? `
          <div class="total-row">
            <span>Mao de Obra</span>
            <span>${formatCurrency(laborFee)}</span>
          </div>
          `
              : ''
          }
          ${
            materialFee > 0
              ? `
          <div class="total-row">
            <span>Material Adicional</span>
            <span>${formatCurrency(materialFee)}</span>
          </div>
          `
              : ''
          }
          ${
            discount > 0
              ? `
          <div class="total-row discount">
            <span>Desconto (${discount}%)</span>
            <span>-${formatCurrency(discountValue)}</span>
          </div>
          `
              : ''
          }
          <div class="total-row final">
            <span>Total</span>
            <span class="value">${formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      ${
        quote.customerNotes
          ? `
      <div class="section">
        <div class="section-title">Observacoes</div>
        <div class="notes-box">
          <p>${quote.customerNotes}</p>
        </div>
      </div>
      `
          : ''
      }

      <div class="validity-box">
        <p>Este orcamento e valido ate</p>
        <div class="date">${formatDate(quote.validUntil)}</div>
      </div>

      <div class="cta-box">
        <h3>Pronto para aprovar?</h3>
        <p>Acesse seu portal em versatiglass.com.br/portal para aceitar este orcamento online.</p>
      </div>
    </div>

    <div class="footer">
      <p><strong>VERSATI GLASS</strong></p>
      <p>Rio de Janeiro, RJ | Tel: (21) 98253-6229 | contato@versatiglass.com.br</p>
      <p style="margin-top: 8px; color: #888;">Documento gerado em ${new Date().toLocaleString('pt-BR')}</p>
    </div>
  </div>
</body>
</html>
`
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
        ${item.finish ? `<br><small style="color: #666;">Acabamento: ${item.finish}</small>` : ''}
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
    * { margin: 0; padding: 0; box-sizing: border-box; }
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
    .quote-info { text-align: right; }
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
    .section { margin-bottom: 24px; }
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
    .info-item { font-size: 11px; }
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
    th:first-child { text-align: center; width: 40px; }
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
      body { padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .no-print { display: none; }
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
</body>
</html>
`
}
