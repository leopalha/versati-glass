'use client'

import Link from 'next/link'
import { Mail, MapPin, Phone, Instagram, Facebook } from 'lucide-react'
import { Logo } from '@/components/shared/logo'
import { ThemeSwitcher } from '@/components/ui/theme-switcher'

const navigation = {
  produtos: [
    { name: 'Box para Banheiro', href: '/produtos/box' },
    { name: 'Espelhos', href: '/produtos/espelhos' },
    { name: 'Vidros Temperados', href: '/produtos/vidros' },
    { name: 'Portas e Janelas', href: '/produtos/portas-janelas' },
  ],
  empresa: [
    { name: 'Sobre Nós', href: '/sobre' },
    { name: 'Portfólio', href: '/portfolio' },
    { name: 'Contato', href: '/contato' },
  ],
  suporte: [
    { name: 'FAQ', href: '/faq' },
    { name: 'Garantia', href: '/garantia' },
    { name: 'Política de Privacidade', href: '/privacidade' },
    { name: 'Termos de Uso', href: '/termos' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-neutral-100 border-t border-neutral-300" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="container-custom py-12 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Logo e Descrição */}
          <div className="space-y-8">
            <Logo className="h-8 w-auto" />
            <p className="text-sm leading-6 text-neutral-700">
              Transparência que transforma espaços. Vidraçaria premium no Rio de Janeiro com atendimento 24h via WhatsApp.
            </p>
            <div className="flex space-x-6">
              <a href="https://instagram.com/versatiglass" className="text-neutral-700 hover:text-gold-500">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </a>
              <a href="https://facebook.com/versatiglass" className="text-neutral-700 hover:text-gold-500">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">Produtos</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.produtos.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-sm leading-6 text-neutral-700 hover:text-gold-500">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white">Empresa</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.empresa.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-sm leading-6 text-neutral-700 hover:text-gold-500">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">Suporte</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.suporte.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-sm leading-6 text-neutral-700 hover:text-gold-500">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white">Contato</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li className="flex items-start gap-2">
                    <Phone className="h-5 w-5 text-gold-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-neutral-700">(21) 98253-6229</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Mail className="h-5 w-5 text-gold-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-neutral-700">versatiglass@gmail.com</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-gold-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-neutral-700">
                      Estrada Três Rios, 1156<br />
                      Freguesia - Rio de Janeiro/RJ
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 border-t border-neutral-300 pt-8 sm:mt-20 lg:mt-24">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs leading-5 text-neutral-600 text-center">
              &copy; {new Date().getFullYear()} Versati Glass. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-600">Tema:</span>
              <ThemeSwitcher variant="compact" showLabel={false} />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
