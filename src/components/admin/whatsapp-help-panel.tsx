'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  HelpCircle,
  MessageCircle,
  Smartphone,
  Globe,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Info,
} from 'lucide-react'

export function WhatsAppHelpPanel() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className="mb-6 border-neutral-700 bg-neutral-800">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-green-500/10 p-2">
            <HelpCircle className="h-5 w-5 text-green-500" />
          </div>
          <div>
            <h3 className="font-medium text-white">Como funciona o WhatsApp aqui?</h3>
            <p className="text-sm text-neutral-400">
              Clique para entender a integracao e como usar
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-neutral-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-neutral-400" />
        )}
      </button>

      {isExpanded && (
        <div className="border-t border-neutral-700 p-4">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Como Funciona */}
            <div>
              <h4 className="mb-3 flex items-center gap-2 font-semibold text-white">
                <Info className="h-4 w-4 text-blue-400" />
                Como Funciona
              </h4>
              <div className="space-y-3 text-sm text-neutral-300">
                <p>
                  Esta pagina usa a <strong>API do WhatsApp Business via Twilio</strong> para
                  receber e enviar mensagens automaticamente.
                </p>
                <p>
                  <strong>NAO</strong> funciona como o WhatsApp Web (que requer escanear QR Code do
                  seu celular pessoal).
                </p>
                <div className="rounded-lg bg-neutral-900 p-3">
                  <p className="mb-2 font-medium text-gold-400">Fluxo de Mensagens:</p>
                  <ol className="space-y-1 text-xs">
                    <li>1. Cliente envia mensagem para numero do Twilio</li>
                    <li>2. Twilio recebe e envia para nosso sistema</li>
                    <li>3. Mensagem aparece aqui em tempo real</li>
                    <li>4. Voce responde pelo sistema ou IA responde automaticamente</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Vantagens e Limitacoes */}
            <div>
              <h4 className="mb-3 flex items-center gap-2 font-semibold text-white">
                <MessageCircle className="h-4 w-4 text-green-400" />
                Vantagens vs WhatsApp Web
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2 text-green-400">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>Funciona 24/7 sem precisar celular ligado</span>
                </div>
                <div className="flex items-start gap-2 text-green-400">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>Multiplos atendentes podem usar ao mesmo tempo</span>
                </div>
                <div className="flex items-start gap-2 text-green-400">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>IA pode responder automaticamente</span>
                </div>
                <div className="flex items-start gap-2 text-green-400">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>Historico salvo no banco de dados</span>
                </div>
                <div className="flex items-start gap-2 text-yellow-400">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>Numero diferente do seu pessoal (numero Twilio)</span>
                </div>
                <div className="flex items-start gap-2 text-yellow-400">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>Precisa de creditos Twilio para enviar mensagens</span>
                </div>
              </div>
            </div>

            {/* Status Atual */}
            <div>
              <h4 className="mb-3 flex items-center gap-2 font-semibold text-white">
                <Smartphone className="h-4 w-4 text-purple-400" />
                Configuracao Atual
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between rounded-lg bg-neutral-900 p-2">
                  <span className="text-neutral-400">Numero WhatsApp Business:</span>
                  <span className="font-mono text-white">
                    {process.env.NEXT_PUBLIC_COMPANY_WHATSAPP || '+55 21 98253-6229'}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-neutral-900 p-2">
                  <span className="text-neutral-400">Provedor:</span>
                  <span className="text-white">Twilio</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-neutral-900 p-2">
                  <span className="text-neutral-400">Status:</span>
                  <span className="flex items-center gap-1 text-green-400">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
                    Ativo
                  </span>
                </div>
              </div>
            </div>

            {/* Alternativas */}
            <div>
              <h4 className="mb-3 flex items-center gap-2 font-semibold text-white">
                <Globe className="h-4 w-4 text-orange-400" />
                Quer usar WhatsApp Web?
              </h4>
              <div className="space-y-3 text-sm text-neutral-300">
                <p>
                  Se preferir usar o WhatsApp Web tradicional (com QR Code), voce pode acessar
                  diretamente:
                </p>
                <a
                  href="https://web.whatsapp.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                >
                  <ExternalLink className="h-4 w-4" />
                  Abrir WhatsApp Web
                </a>
                <p className="text-xs text-neutral-500">
                  Nota: O WhatsApp Web usa seu numero pessoal e requer que o celular esteja
                  conectado a internet.
                </p>
              </div>
            </div>
          </div>

          {/* Dica de Email */}
          <div className="mt-6 rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
            <h4 className="mb-2 flex items-center gap-2 font-semibold text-blue-400">
              <Info className="h-4 w-4" />
              Dica: Email Profissional
            </h4>
            <p className="text-sm text-neutral-300">
              Para usar o email <strong>contato@versatiglass.com.br</strong>, recomendamos o{' '}
              <strong>Google Workspace</strong> (~R$28/mes). Ele permite acessar pelo Gmail, Outlook
              no computador, ou app no celular. E muito mais profissional que usar Gmail pessoal!
            </p>
            <a
              href="https://workspace.google.com/intl/pt-BR/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-sm text-blue-400 hover:underline"
            >
              Saiba mais sobre Google Workspace
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      )}
    </Card>
  )
}
