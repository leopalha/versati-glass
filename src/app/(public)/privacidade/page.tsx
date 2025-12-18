import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Politica de Privacidade | Versati Glass',
  description:
    'Politica de Privacidade da Versati Glass. Saiba como coletamos, usamos e protegemos seus dados pessoais de acordo com a LGPD.',
}

export default function PrivacidadePage() {
  return (
    <div className="bg-theme-primary min-h-screen py-16">
      <div className="container mx-auto max-w-4xl px-4">
        <h1 className="mb-8 font-display text-4xl font-bold text-white">Politica de Privacidade</h1>

        <div className="prose prose-invert prose-gold max-w-none">
          <p className="text-theme-muted text-lg">Ultima atualizacao: 16 de Dezembro de 2024</p>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-white">1. Introducao</h2>
            <p className="text-theme-muted">
              A Versati Glass (&quot;nos&quot;, &quot;nosso&quot; ou &quot;empresa&quot;) esta
              comprometida em proteger sua privacidade. Esta Politica de Privacidade explica como
              coletamos, usamos, divulgamos e protegemos suas informacoes pessoais em conformidade
              com a Lei Geral de Protecao de Dados (LGPD - Lei 13.709/2018).
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-white">2. Dados que Coletamos</h2>
            <p className="text-theme-muted">Podemos coletar os seguintes tipos de informacoes:</p>
            <ul className="text-theme-muted list-disc pl-6">
              <li>
                <strong>Dados de identificacao:</strong> Nome completo, CPF, RG
              </li>
              <li>
                <strong>Dados de contato:</strong> E-mail, telefone, endereco
              </li>
              <li>
                <strong>Dados de navegacao:</strong> IP, cookies, paginas visitadas
              </li>
              <li>
                <strong>Dados de transacao:</strong> Historico de pedidos, orcamentos, pagamentos
              </li>
              <li>
                <strong>Dados de comunicacao:</strong> Mensagens via WhatsApp, chat, e-mail
              </li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-white">3. Como Usamos seus Dados</h2>
            <p className="text-theme-muted">Utilizamos suas informacoes para:</p>
            <ul className="text-theme-muted list-disc pl-6">
              <li>Processar orcamentos e pedidos</li>
              <li>Agendar visitas tecnicas e instalacoes</li>
              <li>Enviar notificacoes sobre status de pedidos</li>
              <li>Prestar suporte ao cliente via WhatsApp e chat</li>
              <li>Melhorar nossos produtos e servicos</li>
              <li>Cumprir obrigacoes legais</li>
              <li>Enviar comunicacoes de marketing (com seu consentimento)</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-white">4. Base Legal para Tratamento</h2>
            <p className="text-theme-muted">
              Tratamos seus dados pessoais com base nas seguintes hipoteses legais da LGPD:
            </p>
            <ul className="text-theme-muted list-disc pl-6">
              <li>
                <strong>Execucao de contrato:</strong> Para processar seus pedidos e prestar
                servicos
              </li>
              <li>
                <strong>Consentimento:</strong> Para envio de comunicacoes de marketing
              </li>
              <li>
                <strong>Legitimo interesse:</strong> Para melhorar nossos servicos e prevenir
                fraudes
              </li>
              <li>
                <strong>Cumprimento de obrigacao legal:</strong> Para atender exigencias fiscais e
                regulatorias
              </li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-white">5. Compartilhamento de Dados</h2>
            <p className="text-theme-muted">
              Podemos compartilhar seus dados com terceiros nas seguintes situacoes:
            </p>
            <ul className="text-theme-muted list-disc pl-6">
              <li>
                <strong>Processadores de pagamento:</strong> Stripe para transacoes financeiras
              </li>
              <li>
                <strong>Servicos de comunicacao:</strong> Twilio para WhatsApp, Resend para e-mails
              </li>
              <li>
                <strong>Analise:</strong> Google Analytics para melhorar a experiencia do site
              </li>
              <li>
                <strong>Autoridades:</strong> Quando exigido por lei ou ordem judicial
              </li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-white">6. Seus Direitos (LGPD)</h2>
            <p className="text-theme-muted">
              Voce tem os seguintes direitos em relacao aos seus dados pessoais:
            </p>
            <ul className="text-theme-muted list-disc pl-6">
              <li>Confirmar a existencia de tratamento</li>
              <li>Acessar seus dados</li>
              <li>Corrigir dados incompletos ou desatualizados</li>
              <li>Solicitar anonimizacao, bloqueio ou eliminacao</li>
              <li>Solicitar portabilidade dos dados</li>
              <li>Revogar consentimento a qualquer momento</li>
              <li>Obter informacoes sobre compartilhamento</li>
            </ul>
            <p className="text-theme-muted mt-4">
              Para exercer seus direitos, entre em contato conosco atraves do e-mail:{' '}
              <a href="mailto:privacidade@versatiglass.com.br" className="text-gold-500">
                privacidade@versatiglass.com.br
              </a>
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-white">7. Seguranca dos Dados</h2>
            <p className="text-theme-muted">
              Implementamos medidas tecnicas e organizacionais para proteger seus dados, incluindo:
            </p>
            <ul className="text-theme-muted list-disc pl-6">
              <li>Criptografia de dados em transito (HTTPS/TLS)</li>
              <li>Armazenamento seguro com controle de acesso</li>
              <li>Autenticacao de dois fatores para funcionarios</li>
              <li>Monitoramento continuo de seguranca</li>
              <li>Backups regulares e plano de recuperacao</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-white">8. Retencao de Dados</h2>
            <p className="text-theme-muted">
              Mantemos seus dados pelo tempo necessario para cumprir as finalidades descritas nesta
              politica, exceto quando a lei exigir retencao por periodo maior. Dados de transacoes
              comerciais sao mantidos por 5 anos para fins fiscais.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-white">9. Cookies</h2>
            <p className="text-theme-muted">
              Utilizamos cookies para melhorar sua experiencia. Voce pode gerenciar suas
              preferencias de cookies atraves do banner exibido ao acessar o site ou nas
              configuracoes do seu navegador.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-white">10. Contato</h2>
            <p className="text-theme-muted">
              Para duvidas sobre esta politica ou sobre o tratamento de seus dados:
            </p>
            <ul className="text-theme-muted list-none">
              <li>
                <strong>E-mail:</strong>{' '}
                <a href="mailto:privacidade@versatiglass.com.br" className="text-gold-500">
                  privacidade@versatiglass.com.br
                </a>
              </li>
              <li>
                <strong>WhatsApp:</strong>{' '}
                <a href="https://wa.me/5521982536229" className="text-gold-500">
                  (21) 98253-6229
                </a>
              </li>
              <li>
                <strong>Endereco:</strong> Rio de Janeiro, RJ
              </li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-white">11. Alteracoes nesta Politica</h2>
            <p className="text-theme-muted">
              Podemos atualizar esta Politica de Privacidade periodicamente. Notificaremos sobre
              alteracoes significativas atraves do site ou por e-mail.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
