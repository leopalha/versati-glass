import Link from 'next/link'
import { Mail, MapPin, Phone, Instagram, Facebook } from 'lucide-react'
import { Logo } from '@/components/shared/logo'
import { CONTACT } from '@/lib/constants'

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
    <footer
      className="bg-theme-footer border-theme-header border-t"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="container-custom py-12 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Logo e Descrição */}
          <div className="space-y-8">
            <Logo className="h-8 w-auto" variant="white" />
            <p className="text-footer-muted text-sm leading-6">
              Transparência que transforma espaços. Vidraçaria premium no Rio de Janeiro com
              atendimento 24h via WhatsApp.
            </p>
            <div className="flex space-x-6">
              <a
                href="https://instagram.com/versatiglass"
                className="text-footer-muted hover:text-accent-400"
              >
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href="https://facebook.com/versatiglass"
                className="text-footer-muted hover:text-accent-400"
              >
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-footer-primary text-sm font-semibold leading-6">Produtos</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.produtos.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-footer-muted text-sm leading-6 hover:text-accent-400"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-footer-primary text-sm font-semibold leading-6">Empresa</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.empresa.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-footer-muted text-sm leading-6 hover:text-accent-400"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-footer-primary text-sm font-semibold leading-6">Suporte</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.suporte.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-footer-muted text-sm leading-6 hover:text-accent-400"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-footer-primary text-sm font-semibold leading-6">Contato</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li className="flex items-start gap-2">
                    <Phone className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent-400" />
                    <a
                      href={`tel:${CONTACT.phoneRaw}`}
                      className="text-footer-muted text-sm hover:text-accent-400"
                    >
                      {CONTACT.phone}
                    </a>
                  </li>
                  <li className="flex items-start gap-2">
                    <Mail className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent-400" />
                    <span className="text-footer-muted text-sm">versatiglass@gmail.com</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent-400" />
                    <span className="text-footer-muted text-sm">
                      Estrada Três Rios, 1156
                      <br />
                      Freguesia - Rio de Janeiro/RJ
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24">
          <p className="text-footer-muted text-center text-xs leading-5">
            &copy; {new Date().getFullYear()} Versati Glass. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
