import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Desenvolvimento de Logos - Versati Glass',
  robots: 'noindex, nofollow',
}

const fontStyles = [
  {
    name: 'Uppercase Light (OFICIAL)',
    font: 'font-sans',
    weight: 'font-light uppercase tracking-[0.25em]',
    selected: true,
  },
  { name: 'Display', font: 'font-display', weight: 'font-semibold', selected: false },
  { name: 'Sans Bold', font: 'font-sans', weight: 'font-bold', selected: false },
  { name: 'Sans Light', font: 'font-sans', weight: 'font-light tracking-wider', selected: false },
  { name: 'Sans Medium', font: 'font-sans', weight: 'font-medium tracking-wide', selected: false },
  {
    name: 'Uppercase Bold',
    font: 'font-sans',
    weight: 'font-bold uppercase tracking-widest text-lg',
    selected: false,
  },
]

export default function LogosPage() {
  return (
    <div className="bg-theme-primary min-h-screen px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-theme-primary mb-2 text-4xl font-bold">Desenvolvimento de Logos</h1>
        <p className="text-theme-muted mb-12">
          Página de testes para escolher o melhor design do logo VG
        </p>

        {/* Logo Oficial Selecionado */}
        <div className="bg-accent-500/10 mb-12 rounded-xl border-2 border-accent-500 p-8">
          <h2 className="mb-4 text-lg font-semibold text-accent-500">Logo Oficial Selecionado</h2>
          <p className="text-theme-muted mb-4 text-sm">
            Opção 1 Minimalista + Fonte Uppercase Light
          </p>
          <div className="flex items-center gap-4">
            <svg viewBox="0 0 48 48" fill="none" className="h-16 w-16 text-accent-500">
              <rect
                x="2"
                y="2"
                width="44"
                height="44"
                rx="8"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M8 14L16 34L24 14"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M40 20C40 16 37 14 33 14C29 14 26 17 26 24C26 31 29 34 33 34C37 34 40 32 40 28V24H34"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="font-sans text-2xl font-light uppercase tracking-[0.25em] text-accent-500">
              Versati Glass
            </span>
          </div>
        </div>

        {/* Seção de Estilos de Fonte */}
        <h2 className="text-theme-primary mb-6 text-2xl font-bold">Teste de Estilos de Fonte</h2>
        <div className="mb-16 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {fontStyles.map((style) => (
            <div
              key={style.name}
              className={`bg-theme-card rounded-xl border p-6 ${
                style.selected
                  ? 'ring-accent-500/20 border-accent-500 ring-2'
                  : 'border-theme-default'
              }`}
            >
              {style.selected && (
                <span className="bg-accent-500/10 mb-2 inline-block rounded px-2 py-1 text-xs font-medium text-accent-500">
                  SELECIONADO
                </span>
              )}
              <p className="text-theme-muted mb-3 text-xs">{style.name}</p>
              <div className="flex items-center gap-3 text-accent-500">
                <svg viewBox="0 0 48 48" fill="none" className="h-10 w-10 flex-shrink-0">
                  <rect
                    x="2"
                    y="2"
                    width="44"
                    height="44"
                    rx="8"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M8 14L16 34L24 14"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M40 20C40 16 37 14 33 14C29 14 26 17 26 24C26 31 29 34 33 34C37 34 40 32 40 28V24H34"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className={`${style.font} ${style.weight} text-2xl`}>Versati Glass</span>
              </div>
            </div>
          ))}
        </div>

        {/* Grid de opções de logo */}
        <h2 className="text-theme-primary mb-6 text-2xl font-bold">Outras Opções de Ícone</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Opção 1: Minimalista - OFICIAL */}
          <LogoCard
            title="Opção 1: Minimalista"
            description="V e G separados com traços limpos"
            isSelected
          >
            <svg viewBox="0 0 48 48" fill="none" className="h-24 w-24">
              <rect
                x="2"
                y="2"
                width="44"
                height="44"
                rx="8"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M8 14L16 34L24 14"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M40 20C40 16 37 14 33 14C29 14 26 17 26 24C26 31 29 34 33 34C37 34 40 32 40 28V24H34"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </LogoCard>

          {/* Opção 7: Geométrico - G CORRIGIDO */}
          <LogoCard
            title="Opção 7: Geométrico"
            description="Formas geométricas precisas - G corrigido"
          >
            <svg viewBox="0 0 48 48" fill="none" className="h-24 w-24">
              <rect
                x="2"
                y="2"
                width="44"
                height="44"
                rx="0"
                stroke="currentColor"
                strokeWidth="2"
              />
              {/* V geométrico */}
              <polygon
                points="8,12 16,36 24,12 20,12 16,28 12,12"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
              {/* G geométrico corrigido - formato de G real */}
              <path
                d="M26 14H42V18H30V30H42V34H26V14Z"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
              <path d="M36 24H42V30" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
          </LogoCard>

          {/* Opção 8: Fluido */}
          <LogoCard title="Opção 8: Fluido" description="Estilo mais orgânico e fluido">
            <svg viewBox="0 0 48 48" fill="none" className="h-24 w-24">
              <rect
                x="2"
                y="2"
                width="44"
                height="44"
                rx="12"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M8 12C10 20 14 32 16 36C18 32 22 20 24 12"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M42 16C40 12 36 10 32 12C28 14 26 18 26 24C26 30 28 34 32 36C36 38 40 36 42 32V24C42 24 38 24 36 24"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </LogoCard>

          {/* Opção 2: Conectado */}
          <LogoCard title="Opção 2: Conectado" description="V e G com elementos visuais conectados">
            <svg viewBox="0 0 48 48" fill="none" className="h-24 w-24">
              <rect
                x="2"
                y="2"
                width="44"
                height="44"
                rx="8"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M6 12L14 36L22 12"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M42 16C40 12 36 10 32 12C28 14 26 20 26 24C26 28 28 34 32 36C36 38 40 36 42 32"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path d="M42 24H34" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </LogoCard>

          {/* Opção 5: Bold Moderno */}
          <LogoCard title="Opção 5: Bold Moderno" description="Traços mais grossos e impactantes">
            <svg viewBox="0 0 48 48" fill="none" className="h-24 w-24">
              <rect
                x="2"
                y="2"
                width="44"
                height="44"
                rx="6"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                d="M8 12L16 36L24 12"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M40 18C38 14 35 12 32 12C28 12 25 16 25 24C25 32 28 36 32 36C36 36 40 32 40 28V24H33"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </LogoCard>

          {/* Opção 9: Premium */}
          <LogoCard title="Opção 9: Premium" description="Visual premium e luxuoso">
            <svg viewBox="0 0 48 48" fill="none" className="h-24 w-24">
              <rect
                x="2"
                y="2"
                width="44"
                height="44"
                rx="6"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <rect
                x="5"
                y="5"
                width="38"
                height="38"
                rx="4"
                stroke="currentColor"
                strokeWidth="1"
                opacity="0.5"
              />
              <path
                d="M10 14L17 34L24 14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M41 18C39 14 36 12 33 12C29 12 26 16 26 24C26 32 29 36 33 36C37 36 41 32 41 28V24H34"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </LogoCard>
        </div>

        {/* Seção de comparação com fundos */}
        <h2 className="text-theme-primary mb-6 mt-16 text-2xl font-bold">
          Comparação com Diferentes Fundos
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Fundo escuro */}
          <div className="rounded-xl bg-neutral-900 p-8">
            <p className="mb-4 text-sm text-white/60">Fundo Escuro</p>
            <div className="flex items-center gap-4">
              <svg viewBox="0 0 48 48" fill="none" className="h-16 w-16 text-[#C9A962]">
                <rect
                  x="2"
                  y="2"
                  width="44"
                  height="44"
                  rx="8"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M8 14L16 34L24 14"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M40 20C40 16 37 14 33 14C29 14 26 17 26 24C26 31 29 34 33 34C37 34 40 32 40 28V24H34"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="font-sans text-xl font-light uppercase tracking-[0.25em] text-[#C9A962]">
                Versati Glass
              </span>
            </div>
          </div>

          {/* Fundo claro */}
          <div className="rounded-xl border border-neutral-200 bg-white p-8">
            <p className="mb-4 text-sm text-neutral-400">Fundo Claro</p>
            <div className="flex items-center gap-4">
              <svg viewBox="0 0 48 48" fill="none" className="h-16 w-16 text-[#C9A962]">
                <rect
                  x="2"
                  y="2"
                  width="44"
                  height="44"
                  rx="8"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M8 14L16 34L24 14"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M40 20C40 16 37 14 33 14C29 14 26 17 26 24C26 31 29 34 33 34C37 34 40 32 40 28V24H34"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="font-sans text-xl font-light uppercase tracking-[0.25em] text-[#C9A962]">
                Versati Glass
              </span>
            </div>
          </div>
        </div>

        {/* Seção apenas ícone - Favicon */}
        <h2 className="text-theme-primary mb-6 mt-16 text-2xl font-bold">Favicon / App Icon</h2>
        <p className="text-theme-muted mb-6">A Opção 1 foi selecionada como favicon oficial.</p>

        <div className="flex flex-wrap items-center gap-8">
          {/* Tamanhos diferentes */}
          {[64, 48, 32, 24, 16].map((size) => (
            <div key={size} className="text-center">
              <div
                className="mb-2 flex items-center justify-center rounded-lg bg-neutral-900"
                style={{ width: size + 16, height: size + 16 }}
              >
                <svg
                  viewBox="0 0 48 48"
                  fill="none"
                  className="text-[#C9A962]"
                  style={{ width: size, height: size }}
                >
                  <rect
                    x="2"
                    y="2"
                    width="44"
                    height="44"
                    rx="8"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M8 14L16 34L24 14"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M40 20C40 16 37 14 33 14C29 14 26 17 26 24C26 31 29 34 33 34C37 34 40 32 40 28V24H34"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="text-theme-muted text-xs">{size}px</span>
            </div>
          ))}
        </div>

        {/* Cores do tema */}
        <h2 className="text-theme-primary mb-6 mt-16 text-2xl font-bold">
          Logo nas Cores dos Temas
        </h2>

        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {[
            { name: 'Gold', bg: '#1A1814', color: '#C9A962' },
            { name: 'Blue', bg: '#0F172A', color: '#3B82F6' },
            { name: 'Green', bg: '#0D1912', color: '#22C55E' },
            { name: 'Gray', bg: '#0F172A', color: '#94A3B8' },
            { name: 'Wine', bg: '#1C0A0A', color: '#BE123C' },
            { name: 'Corporate', bg: '#FFFFFF', color: '#1E3A8A' },
            { name: 'Modern', bg: '#FFFFFF', color: '#7C3AED' },
          ].map((theme) => (
            <div
              key={theme.name}
              className="border-theme-default rounded-xl border p-6"
              style={{ backgroundColor: theme.bg }}
            >
              <p className="mb-3 text-xs" style={{ color: theme.color, opacity: 0.7 }}>
                {theme.name}
              </p>
              <div className="flex items-center gap-2">
                <svg
                  viewBox="0 0 48 48"
                  fill="none"
                  className="h-8 w-8"
                  style={{ color: theme.color }}
                >
                  <rect
                    x="2"
                    y="2"
                    width="44"
                    height="44"
                    rx="8"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M8 14L16 34L24 14"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M40 20C40 16 37 14 33 14C29 14 26 17 26 24C26 31 29 34 33 34C37 34 40 32 40 28V24H34"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span
                  className="font-sans text-sm font-light uppercase tracking-[0.2em]"
                  style={{ color: theme.color }}
                >
                  Versati Glass
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function LogoCard({
  title,
  description,
  children,
  isSelected = false,
}: {
  title: string
  description: string
  children: React.ReactNode
  isSelected?: boolean
}) {
  return (
    <div
      className={`bg-theme-card rounded-xl border p-6 transition-colors ${
        isSelected
          ? 'ring-accent-500/20 border-accent-500 ring-2'
          : 'border-theme-default hover:border-accent-500/50'
      }`}
    >
      {isSelected && (
        <span className="bg-accent-500/10 mb-3 inline-block rounded px-2 py-1 text-xs font-medium text-accent-500">
          SELECIONADO
        </span>
      )}
      <div className="mb-4 flex justify-center text-accent-500">{children}</div>
      <h3 className="text-theme-primary mb-1 font-semibold">{title}</h3>
      <p className="text-theme-muted text-sm">{description}</p>

      {/* Preview com texto */}
      <div className="border-theme-default mt-4 border-t pt-4">
        <div className="flex items-center gap-2 text-accent-500">
          <div className="h-8 w-8">{children}</div>
          <span className="font-sans text-base font-light uppercase tracking-[0.2em]">
            Versati Glass
          </span>
        </div>
      </div>
    </div>
  )
}
