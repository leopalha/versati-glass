'use client'

import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Loader2, Star } from 'lucide-react'
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
    value: 'Estrada Três Rios, 1156 - Freguesia, Rio de Janeiro - RJ',
    link: 'https://maps.google.com/?q=Estrada+Três+Rios+1156+Freguesia+Rio+de+Janeiro',
  },
  {
    icon: Clock,
    title: 'Horário',
    value: 'Seg - Sex: 8h30 às 18h | Sáb: 8h30 às 12h30',
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

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao enviar mensagem')
      }

      toast({
        variant: 'success',
        title: 'Mensagem enviada!',
        description: 'Entraremos em contato em breve. Verifique seu email para confirmação.',
      })
      ;(e.target as HTMLFormElement).reset()
    } catch (error) {
      toast({
        variant: 'error',
        title: 'Erro ao enviar',
        description: error instanceof Error ? error.message : 'Tente novamente mais tarde.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-theme-primary min-h-screen">
      {/* Hero */}
      <section className="from-theme-secondary to-theme-primary relative overflow-hidden bg-gradient-to-b px-6 py-24">
        <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-5" />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h1 className="text-theme-primary mb-6 font-display text-5xl font-bold md:text-6xl lg:text-7xl">
            Entre em Contato
          </h1>
          <p className="text-theme-muted mx-auto max-w-2xl text-lg md:text-xl">
            Estamos prontos para atender você e transformar seu projeto em realidade
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {contactInfo.map((info, idx) => (
              <Card key={idx} className="p-6 text-center">
                <div className="bg-accent-500/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                  <info.icon className="h-6 w-6 text-accent-400" />
                </div>
                <h3 className="text-theme-primary mb-2 font-semibold">{info.title}</h3>
                {info.link ? (
                  <a
                    href={info.link}
                    className="text-theme-muted text-sm hover:text-accent-500"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {info.value}
                  </a>
                ) : (
                  <p className="text-theme-muted text-sm">{info.value}</p>
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
              <h2 className="text-theme-primary mb-6 font-display text-2xl font-bold">
                Envie uma Mensagem
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Input name="name" placeholder="Seu nome" required disabled={isSubmitting} />
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
                  className="border-theme-default bg-theme-elevated text-theme-primary focus:ring-accent-500/20 w-full rounded-md border px-4 py-2 text-sm focus:border-accent-500 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    'Enviar Mensagem'
                  )}
                </Button>
              </form>

              {/* Social Media */}
              <div className="border-theme-default mt-8 border-t pt-8">
                <p className="text-theme-muted mb-4 text-center text-sm">
                  Ou nos acompanhe nas redes sociais
                </p>
                <div className="flex justify-center gap-4">
                  {socialMedia.map((social, idx) => (
                    <a
                      key={idx}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-theme-elevated text-theme-muted hover:text-theme-primary flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-accent-500"
                    >
                      <social.icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </div>
            </Card>

            {/* Map */}
            <div className="bg-theme-elevated overflow-hidden rounded-2xl shadow-lg">
              <div className="aspect-square w-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3674.0165837839374!2d-43.348012324184455!3d-22.943172839203787!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9bd9f7c7f0f0f1%3A0x1234567890abcdef!2sVidra%C3%A7aria%20Versati%20Glass%20-%20Freguesia!5e0!3m2!1spt-BR!2sbr!4v1703090000000!5m2!1spt-BR!2sbr"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localização Versati Glass - Estrada dos Três Rios, 1156 - Freguesia, Rio de Janeiro"
                  className="h-full w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="px-6 pb-20">
        <div className="to-theme-secondary mx-auto max-w-4xl rounded-2xl bg-gradient-to-br from-green-900/20 p-12 text-center">
          <h2 className="text-theme-primary mb-4 font-display text-3xl font-bold md:text-4xl">
            Prefere Falar pelo WhatsApp?
          </h2>
          <p className="text-theme-secondary mb-8 text-lg">
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

      {/* Google Review CTA */}
      <section className="px-6 pb-20">
        <div className="to-theme-secondary from-accent-900/10 mx-auto max-w-4xl rounded-2xl bg-gradient-to-br p-12 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-6 w-6 ${i < 4 ? 'fill-accent-400 text-accent-400' : 'fill-accent-400/30 text-accent-400/30'}`}
                />
              ))}
            </div>
            <span className="text-theme-primary text-2xl font-bold">4.7 / 5.0</span>
          </div>
          <h2 className="text-theme-primary mb-4 font-display text-3xl font-bold md:text-4xl">
            Já é Nosso Cliente?
          </h2>
          <p className="text-theme-secondary mb-8 text-lg">
            Compartilhe sua experiência e ajude outros clientes a conhecerem nosso trabalho
          </p>
          <Button asChild size="lg" className="bg-accent-500 hover:bg-accent-600">
            <a
              href="https://search.google.com/local/writereview?placeid=ChIJAa_w8Mf_mQARYxg0fAHj-i8"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Star className="mr-2 h-5 w-5" />
              Avaliar no Google
            </a>
          </Button>
        </div>
      </section>
    </div>
  )
}
