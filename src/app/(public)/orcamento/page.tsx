import { Metadata } from 'next'
import { QuoteWizard } from '@/components/quote'

export const metadata: Metadata = {
  title: 'Solicitar Orcamento | Versati Glass',
  description:
    'Solicite um orcamento online para box, espelhos, vidros temperados e muito mais. Atendemos Rio de Janeiro e regiao.',
  openGraph: {
    title: 'Solicitar Orcamento | Versati Glass',
    description:
      'Solicite um orcamento online para box, espelhos, vidros temperados e muito mais.',
    type: 'website',
  },
}

export default function OrcamentoPage() {
  return <QuoteWizard />
}
