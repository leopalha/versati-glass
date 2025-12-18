import { Metadata } from 'next'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

export const metadata: Metadata = {
  title: 'FAQ - Perguntas Frequentes | Versati Glass',
  description:
    'Perguntas frequentes sobre box para banheiro, espelhos, vidros temperados. Tire suas duvidas sobre orcamentos, instalacao e garantia.',
}

const faqs = [
  {
    category: 'Orcamentos e Precos',
    questions: [
      {
        question: 'Como solicitar um orcamento?',
        answer:
          'Voce pode solicitar um orcamento de tres formas: pelo nosso site na pagina de orcamentos, pelo WhatsApp (21) 98253-6229, ou agendando uma visita tecnica gratuita. O orcamento online e uma estimativa, e o valor final e confirmado apos a visita tecnica.',
      },
      {
        question: 'A visita tecnica e cobrada?',
        answer:
          'Nao! A visita tecnica e totalmente gratuita e sem compromisso. Nosso tecnico vai ate o local, realiza as medicoes precisas e apresenta o orcamento final.',
      },
      {
        question: 'Qual o prazo de validade do orcamento?',
        answer:
          'Nossos orcamentos tem validade de 15 dias. Apos esse periodo, os precos podem sofrer alteracoes devido a variacao de custos dos materiais.',
      },
      {
        question: 'Quais as formas de pagamento aceitas?',
        answer:
          'Aceitamos PIX (com desconto), cartao de credito em ate 12x, cartao de debito e boleto bancario. Para pedidos acima de R$ 2.000, oferecemos condicoes especiais de parcelamento.',
      },
    ],
  },
  {
    category: 'Produtos',
    questions: [
      {
        question: 'Qual a diferenca entre os modelos de box?',
        answer:
          'Oferecemos diversos modelos: Box de Correr (mais economico, ideal para espacos pequenos), Box de Abrir (classico, com porta pivotante), Box Elegance (premium, com perfis mais finos e acabamento superior), e Box Flex (para espacos muito compactos). Todos usam vidro temperado de 8mm.',
      },
      {
        question: 'Quais cores de ferragem estao disponiveis?',
        answer:
          'Trabalhamos com ferragens nas cores: Preto (mais procurada), Branco, Inox Escovado, Bronze e Dourado. A escolha da cor influencia no valor final do produto.',
      },
      {
        question: 'Voces fazem espelhos com LED?',
        answer:
          'Sim! Fabricamos espelhos com iluminacao LED integrada, com opcoes de luz quente, fria ou neutra. Tambem oferecemos modelos com funcao touch para ligar/desligar e controle de intensidade.',
      },
      {
        question: 'O vidro temperado e seguro?',
        answer:
          'Sim, muito seguro! O vidro temperado e 5x mais resistente que o vidro comum e, em caso de quebra, fragmenta-se em pequenos pedacos arredondados que minimizam o risco de cortes. Todos nossos vidros possuem certificacao INMETRO.',
      },
    ],
  },
  {
    category: 'Instalacao',
    questions: [
      {
        question: 'Qual o prazo de instalacao?',
        answer:
          'O prazo medio e de 7 a 15 dias uteis apos a confirmacao do pedido, dependendo da complexidade do projeto e disponibilidade de materiais. Produtos sob medida podem ter prazos maiores.',
      },
      {
        question: 'Preciso preparar algo antes da instalacao?',
        answer:
          'Sim, recomendamos que o local esteja limpo, com a area de instalacao livre e com ponto de energia proximo (para ferramentas). Para box de banheiro, e importante que o reboco e azulejos ja estejam finalizados.',
      },
      {
        question: 'Voces atendem qual regiao?',
        answer:
          'Atendemos todo o Rio de Janeiro e Grande Rio: Zona Sul, Zona Norte, Zona Oeste, Centro, Barra da Tijuca, Recreio, Jacarepagua, Niteroi, Sao Goncalo e municpios vizinhos.',
      },
      {
        question: 'A instalacao esta inclusa no preco?',
        answer:
          'Sim! Todos os nossos orcamentos ja incluem a instalacao profissional. Nao cobramos taxas adicionais, exceto em casos de deslocamento para regioes muito distantes.',
      },
    ],
  },
  {
    category: 'Garantia e Suporte',
    questions: [
      {
        question: 'Qual a garantia dos produtos?',
        answer:
          'Oferecemos: 5 anos de garantia para vidros temperados contra defeitos de fabricacao, 1 ano para ferragens e acessorios, e 90 dias para servicos de instalacao. A garantia nao cobre danos por mau uso.',
      },
      {
        question: 'Como acionar a garantia?',
        answer:
          'Entre em contato pelo WhatsApp (21) 98253-6229 ou pelo portal do cliente no site. Envie fotos do problema e nosso suporte analisara o caso. Se confirmado defeito coberto pela garantia, agendaremos a visita tecnica.',
      },
      {
        question: 'Voces fazem manutencao em produtos de outras vidracarias?',
        answer:
          'Sim, realizamos manutencoes e reparos em box, espelhos e vidros de qualquer marca. Solicite um orcamento para avaliacao.',
      },
    ],
  },
  {
    category: 'Portal do Cliente',
    questions: [
      {
        question: 'Como acompanhar meu pedido?',
        answer:
          'Apos realizar um pedido, voce recebe acesso ao Portal do Cliente onde pode acompanhar o status em tempo real, ver documentos, agendar instalacao e entrar em contato conosco.',
      },
      {
        question: 'Esqueci minha senha, o que faco?',
        answer:
          'Na pagina de login, clique em "Esqueci minha senha". Voce recebera um e-mail com link para criar uma nova senha. O link e valido por 1 hora.',
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <div className="bg-theme-primary min-h-screen py-16">
      <div className="container mx-auto max-w-4xl px-4">
        <h1 className="mb-4 font-display text-4xl font-bold text-white">Perguntas Frequentes</h1>
        <p className="text-theme-muted mb-12 text-lg">
          Encontre respostas para as duvidas mais comuns sobre nossos produtos e servicos.
        </p>

        <div className="space-y-12">
          {faqs.map((category) => (
            <section key={category.category}>
              <h2 className="mb-6 font-display text-2xl font-semibold text-gold-500">
                {category.category}
              </h2>

              <div className="space-y-4">
                {category.questions.map((faq, index) => (
                  <details
                    key={index}
                    className="group rounded-lg border border-neutral-800 bg-neutral-900/50"
                  >
                    <summary className="flex cursor-pointer items-center justify-between p-4 text-white">
                      <span className="pr-4 font-medium">{faq.question}</span>
                      <ChevronDown className="h-5 w-5 shrink-0 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="text-theme-muted border-t border-neutral-800 px-4 py-4">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 rounded-lg bg-gold-500/10 p-8 text-center">
          <h3 className="mb-2 font-display text-xl font-semibold text-white">
            Nao encontrou sua resposta?
          </h3>
          <p className="text-theme-muted mb-6">Nossa equipe esta pronta para ajudar voce!</p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="https://wa.me/5521982536229"
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-medium text-white hover:bg-green-700"
            >
              WhatsApp
            </Link>
            <Link
              href="/contato"
              className="inline-flex items-center gap-2 rounded-lg bg-gold-500 px-6 py-3 font-medium text-black hover:bg-gold-400"
            >
              Fale Conosco
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
