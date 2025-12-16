'use client'

import { MapPin, Phone, Mail, Clock, Instagram, Facebook } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/toast/use-toast'
import { useState } from 'react'

const contactInfo = [
  {
    icon: Phone,
    title: 'Telefone',
    value: '+55 (21) 98253-6229',
    link: 'tel:+5521982536229',
  },
  {
    icon: Mail,
    title: 'Email',
    value: 'contato@versatiglass.com.br',
    link: 'mailto:contato@versatiglass.com.br',
  },
  {
    icon: MapPin,
    title: 'Endereço',
    value: 'Rua Exemplo, 123 - Barra da Tijuca, Rio de Janeiro - RJ',
    link: 'https://maps.google.com',
  },
  {
    icon: Clock,
    title: 'Horário',
    value: 'Seg - Sex: 8h às 18h | Sáb: 8h às 13h',
    link: null,
  },
]

const socialMedia = [
  {
    icon: Instagram,
    name: 'Instagram',
    link: 'https://instagram.com/versatiglass',
  },
  {
    icon: Facebook,
    name: 'Facebook',
    link: 'https://facebook.com/versatiglass',
  },
]

export default function ContatoPage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast({
      variant: 'success',
      title: 'Mensagem enviada!',
      description: 'Entraremos em contato em breve.',
    })

    setIsSubmitting(false)
    ;(e.target as HTMLFormElement).reset()
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-neutral-900 to-neutral-950 px-6 py-24">
        <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-5" />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h1 className="mb-6 font-display text-5xl font-bold text-white md:text-6xl lg:text-7xl">
            Entre em Contato
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-neutral-300 md:text-xl">
            Estamos prontos para atender você e transformar seu projeto em
            realidade
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {contactInfo.map((info, idx) => (
              <Card key={idx} className="p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gold-500/10">
                  <info.icon className="h-6 w-6 text-gold-400" />
                </div>
                <h3 className="mb-2 font-semibold text-white">{info.title}</h3>
                {info.link ? (
                  <a
                    href={info.link}
                    className="text-sm text-neutral-700 hover:text-gold-400"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {info.value}
                  </a>
                ) : (
                  <p className="text-sm text-neutral-700">{info.value}</p>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Form + Map */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Form */}
            <Card className="p-8">
              <h2 className="mb-6 font-display text-2xl font-bold text-white">
                Envie uma Mensagem
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Input
                    name="name"
                    placeholder="Seu nome"
                    required
                    disabled={isSubmitting}
                  />
                  <Input
                    name="phone"
                    type="tel"
                    placeholder="Telefone"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <Input
                  name="email"
                  type="email"
                  placeholder="Seu email"
                  required
                  disabled={isSubmitting}
                />
                <select
                  name="subject"
                  required
                  disabled={isSubmitting}
                  className="rounded-md border border-neutral-300 bg-neutral-250 px-4 py-2 text-sm text-white focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Assunto</option>
                  <option value="orcamento">Solicitar Orçamento</option>
                  <option value="duvida">Tirar Dúvida</option>
                  <option value="manutencao">Manutenção</option>
                  <option value="reclamacao">Reclamação</option>
                  <option value="elogio">Elogio</option>
                  <option value="outro">Outro</option>
                </select>
                <Textarea
                  name="message"
                  placeholder="Sua mensagem"
                  rows={6}
                  required
                  disabled={isSubmitting}
                />
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
                </Button>
              </form>

              {/* Social Media */}
              <div className="mt-8 border-t border-neutral-800 pt-8">
                <p className="mb-4 text-center text-sm text-neutral-700">
                  Ou nos acompanhe nas redes sociais
                </p>
                <div className="flex justify-center gap-4">
                  {socialMedia.map((social, idx) => (
                    <a
                      key={idx}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-800 text-neutral-400 transition-colors hover:bg-gold-500 hover:text-white"
                    >
                      <social.icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </div>
            </Card>

            {/* Map */}
            <div className="overflow-hidden rounded-2xl bg-neutral-800">
              <div className="aspect-square w-full">
                {/* Replace with actual Google Maps embed */}
                <div className="flex h-full items-center justify-center text-neutral-600">
                  <div className="text-center">
                    <MapPin className="mx-auto mb-4 h-12 w-12" />
                    <p>Mapa em breve</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-4xl rounded-2xl bg-gradient-to-br from-green-900/20 to-neutral-900 p-12 text-center">
          <h2 className="mb-4 font-display text-3xl font-bold text-white md:text-4xl">
            Prefere Falar pelo WhatsApp?
          </h2>
          <p className="mb-8 text-lg text-neutral-300">
            Atendimento rápido e personalizado direto no seu celular
          </p>
          <Button asChild size="lg" className="bg-[#25D366] hover:bg-[#20BA5A]">
            <a
              href="https://wa.me/5521982536229?text=Olá! Gostaria de fazer um orçamento."
              target="_blank"
              rel="noopener noreferrer"
            >
              Falar no WhatsApp
            </a>
          </Button>
        </div>
      </section>
    </div>
  )
}
