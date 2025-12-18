import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Termos de Uso | Versati Glass',
  description:
    'Termos de Uso da Versati Glass. Condicoes de uso do site, orcamentos, pedidos e servicos.',
}

export default function TermosPage() {
  return (
    <div className="bg-theme-primary min-h-screen py-16">
      <div className="container mx-auto max-w-4xl px-4">
        <h1 className="mb-8 font-display text-4xl font-bold text-white">Termos de Uso</h1>

        <div className="prose prose-invert prose-gold max-w-none">
          <p className="text-theme-muted text-lg">Ultima atualizacao: 16 de Dezembro de 2024</p>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-white">1. Aceitacao dos Termos</h2>
            <p className="text-theme-muted">
              Ao acessar e usar o site e servicos da Versati Glass, voce concorda com estes Termos
              de Uso. Se voce nao concordar com qualquer parte destes termos, nao devera usar nosso
              site ou servicos.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-white">2. Descricao dos Servicos</h2>
            <p className="text-theme-muted">A Versati Glass oferece:</p>
            <ul className="text-theme-muted list-disc pl-6">
              <li>Venda e instalacao de box para banheiro</li>
              <li>Espelhos sob medida (comum, LED, bisote)</li>
              <li>Vidros temperados para diversos fins</li>
              <li>Portas e janelas de vidro</li>
              <li>Visitas tecnicas para medicao</li>
              <li>Atendimento via WhatsApp e portal online</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-white">3. Orcamentos</h2>
            <p className="text-theme-muted">
              Os orcamentos fornecidos atraves do site sao estimativas baseadas nas informacoes
              fornecidas pelo cliente. O valor final pode variar apos visita tecnica e conferencia
              das medidas no local.
            </p>
            <ul className="text-theme-muted list-disc pl-6">
              <li>Orcamentos tem validade de 15 dias, salvo indicacao contraria</li>
              <li>Precos podem variar conforme especificacoes tecnicas</li>
              <li>A visita tecnica e gratuita e nao gera obrigacao de compra</li>
              <li>O cliente e responsavel pela precisao das informacoes fornecidas</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-white">4. Pedidos e Pagamentos</h2>
            <p className="text-theme-muted">Ao realizar um pedido:</p>
            <ul className="text-theme-muted list-disc pl-6">
              <li>
                <strong>Confirmacao:</strong> O pedido so e confirmado apos aprovacao do orcamento e
                pagamento
              </li>
              <li>
                <strong>Formas de pagamento:</strong> PIX, cartao de credito, boleto
              </li>
              <li>
                <strong>Entrada:</strong> Pode ser exigida entrada de 50% para iniciar producao
              </li>
              <li>
                <strong>Saldo:</strong> Restante pago na entrega/instalacao
              </li>
              <li>
                <strong>Nota fiscal:</strong> Emitida para todos os pedidos
              </li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-white">5. Prazos de Entrega e Instalacao</h2>
            <p className="text-theme-muted">Os prazos sao estimados e podem variar conforme:</p>
            <ul className="text-theme-muted list-disc pl-6">
              <li>Disponibilidade de materiais</li>
              <li>Complexidade do projeto</li>
              <li>Localizacao do imovel</li>
              <li>Condicoes do local para instalacao</li>
            </ul>
            <p className="text-theme-muted mt-4">
              Comunicaremos qualquer alteracao de prazo com antecedencia.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-white">6. Garantia</h2>
            <p className="text-theme-muted">Oferecemos garantia para nossos produtos e servicos:</p>
            <ul className="text-theme-muted list-disc pl-6">
              <li>
                <strong>Vidros temperados:</strong> 5 anos contra defeitos de fabricacao
              </li>
              <li>
                <strong>Ferragens e acessorios:</strong> 1 ano
              </li>
              <li>
                <strong>Instalacao:</strong> 90 dias para servicos de instalacao
              </li>
            </ul>
            <p className="text-theme-muted mt-4">A garantia nao cobre:</p>
            <ul className="text-theme-muted list-disc pl-6">
              <li>Danos causados por mau uso</li>
              <li>Desgaste natural</li>
              <li>Modificacoes realizadas por terceiros</li>
              <li>Danos por acidentes ou forca maior</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-white">7. Cancelamentos e Devolucoes</h2>
            <ul className="text-theme-muted list-disc pl-6">
              <li>
                <strong>Antes da producao:</strong> Reembolso integral menos taxas administrativas
              </li>
              <li>
                <strong>Durante a producao:</strong> Cobranca proporcional ao trabalho realizado
              </li>
              <li>
                <strong>Produtos sob medida:</strong> Nao sao passiveis de devolucao, salvo defeitos
              </li>
              <li>
                <strong>Prazo para reclamacao:</strong> 7 dias apos instalacao para reportar
                problemas
              </li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-white">8. Responsabilidades do Cliente</h2>
            <p className="text-theme-muted">O cliente se compromete a:</p>
            <ul className="text-theme-muted list-disc pl-6">
              <li>Fornecer informacoes verdadeiras e precisas</li>
              <li>Garantir acesso ao local para visita tecnica e instalacao</li>
              <li>Preparar o ambiente conforme orientacoes da equipe</li>
              <li>Estar presente ou designar responsavel no dia da instalacao</li>
              <li>Efetuar pagamentos conforme acordado</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-white">9. Uso do Site</h2>
            <p className="text-theme-muted">Ao usar nosso site, voce concorda em:</p>
            <ul className="text-theme-muted list-disc pl-6">
              <li>Nao usar o site para fins ilegais</li>
              <li>Nao tentar acessar areas restritas</li>
              <li>Nao interferir no funcionamento do site</li>
              <li>Nao coletar dados de outros usuarios</li>
              <li>Manter a confidencialidade de suas credenciais de acesso</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-white">10. Propriedade Intelectual</h2>
            <p className="text-theme-muted">
              Todo o conteudo do site (textos, imagens, logos, design) e propriedade da Versati
              Glass ou de seus licenciadores. E proibida a reproducao sem autorizacao expressa.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-white">11. Limitacao de Responsabilidade</h2>
            <p className="text-theme-muted">A Versati Glass nao se responsabiliza por:</p>
            <ul className="text-theme-muted list-disc pl-6">
              <li>Danos indiretos ou consequenciais</li>
              <li>Falhas de terceiros (processadores de pagamento, etc.)</li>
              <li>Interrupcoes temporarias do site</li>
              <li>Uso inadequado dos produtos pelo cliente</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-white">12. Alteracoes nos Termos</h2>
            <p className="text-theme-muted">
              Reservamo-nos o direito de modificar estes termos a qualquer momento. Alteracoes
              entram em vigor imediatamente apos publicacao no site.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-white">13. Foro</h2>
            <p className="text-theme-muted">
              Estes termos sao regidos pelas leis brasileiras. Qualquer disputa sera resolvida no
              foro da Comarca do Rio de Janeiro, RJ.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-white">14. Contato</h2>
            <p className="text-theme-muted">Para duvidas sobre estes termos:</p>
            <ul className="text-theme-muted list-none">
              <li>
                <strong>E-mail:</strong>{' '}
                <a href="mailto:contato@versatiglass.com.br" className="text-gold-500">
                  contato@versatiglass.com.br
                </a>
              </li>
              <li>
                <strong>WhatsApp:</strong>{' '}
                <a href="https://wa.me/5521982536229" className="text-gold-500">
                  (21) 98253-6229
                </a>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
