import { Metadata } from 'next'
import Link from 'next/link'
import {
  Instagram,
  Facebook,
  MessageCircle,
  Globe,
  Phone,
  Mail,
  MapPin,
  FileText,
  Package,
  Calendar,
  ExternalLink,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Links | Versati Glass',
  description:
    'Todos os links importantes da Versati Glass - WhatsApp, Instagram, Facebook, Site, Orcamentos e mais.',
}

const socialLinks = [
  {
    name: 'WhatsApp',
    description: 'Fale conosco agora',
    url: 'https://wa.me/5521982536229',
    icon: MessageCircle,
    color: 'bg-green-600 hover:bg-green-700',
    external: true,
  },
  {
    name: 'Instagram',
    description: '@versatiglass',
    url: 'https://instagram.com/versatiglass',
    icon: Instagram,
    color: 'bg-gradient-to-br from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600',
    external: true,
  },
  {
    name: 'Facebook',
    description: '/versatiglass',
    url: 'https://facebook.com/versatiglass',
    icon: Facebook,
    color: 'bg-blue-600 hover:bg-blue-700',
    external: true,
  },
]

const mainLinks = [
  {
    name: 'Solicitar Orcamento',
    description: 'Gratis e sem compromisso',
    url: '/orcamento',
    icon: FileText,
    highlight: true,
  },
  {
    name: 'Ver Produtos',
    description: 'Box, espelhos, vidros temperados',
    url: '/produtos',
    icon: Package,
  },
  {
    name: 'Agendar Visita Tecnica',
    description: 'Medicao gratuita no local',
    url: '/orcamento',
    icon: Calendar,
  },
  {
    name: 'Nosso Site',
    description: 'versatiglass.com.br',
    url: '/',
    icon: Globe,
  },
]

const contactInfo = [
  {
    icon: Phone,
    label: 'Telefone',
    value: '(21) 98253-6229',
    url: 'tel:+5521982536229',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'contato@versatiglass.com.br',
    url: 'mailto:contato@versatiglass.com.br',
  },
  {
    icon: MapPin,
    label: 'Localizacao',
    value: 'Rio de Janeiro - RJ',
    url: 'https://maps.google.com/?q=Rio+de+Janeiro',
  },
]

export default function LinksPage() {
  return (
    <div className="bg-theme-primary min-h-screen py-8">
      <div className="container mx-auto max-w-lg px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          {/* Logo */}
          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-neutral-800">
            <span className="font-display text-3xl font-bold text-gold-500">VG</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-white">Versati Glass</h1>
          <p className="mt-1 text-neutral-400">Vidracaria Premium no Rio de Janeiro</p>
        </div>

        {/* Social Links */}
        <div className="mb-6 space-y-3">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-4 rounded-xl p-4 text-white transition-transform hover:scale-[1.02] ${link.color}`}
            >
              <link.icon className="h-6 w-6" />
              <div className="flex-1">
                <p className="font-medium">{link.name}</p>
                <p className="text-sm opacity-80">{link.description}</p>
              </div>
              <ExternalLink className="h-5 w-5 opacity-60" />
            </a>
          ))}
        </div>

        {/* Divider */}
        <div className="mb-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-neutral-700" />
          <span className="text-sm text-neutral-500">Links Uteis</span>
          <div className="h-px flex-1 bg-neutral-700" />
        </div>

        {/* Main Links */}
        <div className="mb-6 space-y-3">
          {mainLinks.map((link) => (
            <Link
              key={link.name}
              href={link.url}
              className={`flex items-center gap-4 rounded-xl border p-4 transition-all hover:scale-[1.02] ${
                link.highlight
                  ? 'border-gold-500 bg-gold-500/10 text-white hover:bg-gold-500/20'
                  : 'border-neutral-700 bg-neutral-800/50 text-white hover:border-neutral-600 hover:bg-neutral-800'
              }`}
            >
              <div
                className={`rounded-lg p-2 ${link.highlight ? 'bg-gold-500/20' : 'bg-neutral-700'}`}
              >
                <link.icon
                  className={`h-5 w-5 ${link.highlight ? 'text-gold-500' : 'text-neutral-300'}`}
                />
              </div>
              <div className="flex-1">
                <p className="font-medium">{link.name}</p>
                <p className="text-sm text-neutral-400">{link.description}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Contact Info */}
        <div className="rounded-xl border border-neutral-700 bg-neutral-800/50 p-4">
          <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-gold-500">
            Contato
          </h2>
          <div className="space-y-3">
            {contactInfo.map((info) => (
              <a
                key={info.label}
                href={info.url}
                className="flex items-center gap-3 text-neutral-300 hover:text-white"
              >
                <info.icon className="h-4 w-4 text-neutral-500" />
                <span className="text-sm">{info.value}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-neutral-500">
            &copy; {new Date().getFullYear()} Versati Glass. Todos os direitos reservados.
          </p>
          <div className="mt-2 flex justify-center gap-4 text-xs text-neutral-600">
            <Link href="/privacidade" className="hover:text-neutral-400">
              Privacidade
            </Link>
            <Link href="/termos" className="hover:text-neutral-400">
              Termos
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
