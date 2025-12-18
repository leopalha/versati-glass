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
    <div className="px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-theme-primary mb-2 text-4xl font-bold">Desenvolvimento de Logos</h1>
        <p className="text-theme-muted mb-12">
          Página de testes para escolher o melhor design do logo VG
        </p>

        {/* Logo Oficial Selecionado */}
        <div className="bg-accent-500/10 mb-12 rounded-xl border-2 border-accent-500 p-8">
          <h2 className="mb-4 text-lg font-semibold text-accent-500">Logo Oficial Selecionado</h2>
          <p className="text-theme-muted mb-4 text-sm">
            Logo Original Gold + Fonte Uppercase Light
          </p>
          <div className="flex items-center gap-4">
            <img
              src="/logo-symbol.png"
              alt="Versati Glass Logo"
              className="h-16 w-auto"
              style={{
                filter:
                  'brightness(0) saturate(100%) invert(69%) sepia(35%) saturate(556%) hue-rotate(6deg) brightness(91%) contrast(86%)',
              }}
            />
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
                <img
                  src="/logo-symbol.png"
                  alt="Versati Glass Logo"
                  className="h-10 w-10 flex-shrink-0"
                  style={{
                    filter:
                      'brightness(0) saturate(100%) invert(69%) sepia(35%) saturate(556%) hue-rotate(6deg) brightness(91%) contrast(86%)',
                  }}
                />
                <span className={`${style.font} ${style.weight} text-2xl`}>Versati Glass</span>
              </div>
            </div>
          ))}
        </div>

        {/* Grid de opções de logo */}
        <h2 className="text-theme-primary mb-6 text-2xl font-bold">Logo Oficial</h2>
        <div className="grid gap-8 md:grid-cols-1">
          {/* Logo Oficial */}
          <LogoCard title="Logo Original" description="V + C + folha - Design oficial" isSelected>
            <img
              src="/logo-symbol.png"
              alt="Versati Glass Logo"
              className="h-24 w-24"
              style={{
                filter:
                  'brightness(0) saturate(100%) invert(69%) sepia(35%) saturate(556%) hue-rotate(6deg) brightness(91%) contrast(86%)',
              }}
            />
          </LogoCard>
        </div>

        {/* Logo Original PNG - Apenas Símbolo */}
        <h2 className="text-theme-primary mb-6 mt-16 text-2xl font-bold">
          Logo Original - Símbolo
        </h2>
        <p className="text-theme-muted mb-6">
          Logo original em PNG apenas com o símbolo (V + C + folha), sem texto
        </p>

        <div className="bg-theme-card border-theme-default mb-6 rounded-xl border p-8">
          <h3 className="text-theme-primary mb-4 text-lg font-semibold">Versão Preta (Original)</h3>
          <div className="grid gap-6 md:grid-cols-3">
            {/* Fundo escuro */}
            <div className="rounded-lg bg-neutral-900 p-6">
              <p className="mb-4 text-xs text-white/60">Fundo Escuro</p>
              <div className="flex justify-center">
                <img
                  src="/logo-symbol.png"
                  alt="Versati Glass Logo Symbol"
                  className="h-32 w-auto"
                />
              </div>
            </div>

            {/* Fundo claro */}
            <div className="rounded-lg border border-neutral-200 bg-white p-6">
              <p className="mb-4 text-xs text-neutral-400">Fundo Claro</p>
              <div className="flex justify-center">
                <img
                  src="/logo-symbol.png"
                  alt="Versati Glass Logo Symbol"
                  className="h-32 w-auto"
                />
              </div>
            </div>

            {/* Fundo dourado */}
            <div className="rounded-lg bg-[#C9A962] p-6">
              <p className="mb-4 text-xs text-neutral-900/60">Fundo Gold</p>
              <div className="flex justify-center">
                <img
                  src="/logo-symbol.png"
                  alt="Versati Glass Logo Symbol"
                  className="h-32 w-auto invert"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-theme-card border-theme-default mb-12 rounded-xl border p-8">
          <h3 className="text-theme-primary mb-4 text-lg font-semibold">Versão Gold (#C9A962)</h3>
          <div className="grid gap-6 md:grid-cols-3">
            {/* Fundo escuro */}
            <div className="rounded-lg bg-neutral-900 p-6">
              <p className="mb-4 text-xs text-white/60">Fundo Escuro</p>
              <div className="flex justify-center">
                <img
                  src="/logo-symbol.png"
                  alt="Versati Glass Logo Symbol Gold"
                  className="h-32 w-auto"
                  style={{
                    filter:
                      'brightness(0) saturate(100%) invert(69%) sepia(35%) saturate(556%) hue-rotate(6deg) brightness(91%) contrast(86%)',
                  }}
                />
              </div>
            </div>

            {/* Fundo claro */}
            <div className="rounded-lg border border-neutral-200 bg-white p-6">
              <p className="mb-4 text-xs text-neutral-400">Fundo Claro</p>
              <div className="flex justify-center">
                <img
                  src="/logo-symbol.png"
                  alt="Versati Glass Logo Symbol Gold"
                  className="h-32 w-auto"
                  style={{
                    filter:
                      'brightness(0) saturate(100%) invert(69%) sepia(35%) saturate(556%) hue-rotate(6deg) brightness(91%) contrast(86%)',
                  }}
                />
              </div>
            </div>

            {/* Fundo neutro */}
            <div className="rounded-lg bg-neutral-800 p-6">
              <p className="mb-4 text-xs text-white/60">Fundo Cinza</p>
              <div className="flex justify-center">
                <img
                  src="/logo-symbol.png"
                  alt="Versati Glass Logo Symbol Gold"
                  className="h-32 w-auto"
                  style={{
                    filter:
                      'brightness(0) saturate(100%) invert(69%) sepia(35%) saturate(556%) hue-rotate(6deg) brightness(91%) contrast(86%)',
                  }}
                />
              </div>
            </div>
          </div>

          <div className="border-theme-default mt-6 border-t pt-4">
            <p className="text-theme-muted text-sm">
              ℹ️ Esta é a mesma imagem PNG preta original, colorida para dourado usando filtros CSS
            </p>
          </div>
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
              <img
                src="/logo-symbol.png"
                alt="Versati Glass Logo"
                className="h-16 w-auto"
                style={{
                  filter:
                    'brightness(0) saturate(100%) invert(69%) sepia(35%) saturate(556%) hue-rotate(6deg) brightness(91%) contrast(86%)',
                }}
              />
              <span className="font-sans text-xl font-light uppercase tracking-[0.25em] text-[#C9A962]">
                Versati Glass
              </span>
            </div>
          </div>

          {/* Fundo claro */}
          <div className="rounded-xl border border-neutral-200 bg-white p-8">
            <p className="mb-4 text-sm text-neutral-400">Fundo Claro</p>
            <div className="flex items-center gap-4">
              <img
                src="/logo-symbol.png"
                alt="Versati Glass Logo"
                className="h-16 w-auto"
                style={{
                  filter:
                    'brightness(0) saturate(100%) invert(69%) sepia(35%) saturate(556%) hue-rotate(6deg) brightness(91%) contrast(86%)',
                }}
              />
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
                <img
                  src="/logo-symbol.png"
                  alt="Versati Glass Logo"
                  style={{
                    width: size,
                    height: size,
                    filter:
                      'brightness(0) saturate(100%) invert(69%) sepia(35%) saturate(556%) hue-rotate(6deg) brightness(91%) contrast(86%)',
                  }}
                />
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
            {
              name: 'Gold',
              bg: '#1A1814',
              color: '#C9A962',
              filter:
                'brightness(0) saturate(100%) invert(69%) sepia(35%) saturate(556%) hue-rotate(6deg) brightness(91%) contrast(86%)',
            },
            {
              name: 'Blue',
              bg: '#0F172A',
              color: '#3B82F6',
              filter:
                'brightness(0) saturate(100%) invert(47%) sepia(96%) saturate(2401%) hue-rotate(200deg) brightness(102%) contrast(93%)',
            },
            {
              name: 'Green',
              bg: '#0D1912',
              color: '#22C55E',
              filter:
                'brightness(0) saturate(100%) invert(65%) sepia(57%) saturate(511%) hue-rotate(81deg) brightness(95%) contrast(91%)',
            },
            {
              name: 'Gray',
              bg: '#0F172A',
              color: '#94A3B8',
              filter:
                'brightness(0) saturate(100%) invert(71%) sepia(8%) saturate(698%) hue-rotate(179deg) brightness(92%) contrast(87%)',
            },
            {
              name: 'Wine',
              bg: '#1C0A0A',
              color: '#BE123C',
              filter:
                'brightness(0) saturate(100%) invert(13%) sepia(97%) saturate(4154%) hue-rotate(337deg) brightness(86%) contrast(95%)',
            },
            {
              name: 'Corporate',
              bg: '#FFFFFF',
              color: '#1E3A8A',
              filter:
                'brightness(0) saturate(100%) invert(16%) sepia(78%) saturate(2660%) hue-rotate(214deg) brightness(94%) contrast(98%)',
            },
            {
              name: 'Modern',
              bg: '#FFFFFF',
              color: '#7C3AED',
              filter:
                'brightness(0) saturate(100%) invert(34%) sepia(87%) saturate(3309%) hue-rotate(253deg) brightness(94%) contrast(94%)',
            },
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
                <img
                  src="/logo-symbol.png"
                  alt="Versati Glass Logo"
                  className="h-8 w-auto"
                  style={{ filter: theme.filter }}
                />
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
          {isSelected ? (
            <img
              src="/logo-symbol.png"
              alt="Versati Glass Logo"
              className="h-8 w-auto"
              style={{
                filter:
                  'brightness(0) saturate(100%) invert(69%) sepia(35%) saturate(556%) hue-rotate(6deg) brightness(91%) contrast(86%)',
              }}
            />
          ) : (
            <div className="h-8 w-8">{children}</div>
          )}
          <span className="font-sans text-base font-light uppercase tracking-[0.2em]">
            Versati Glass
          </span>
        </div>
      </div>
    </div>
  )
}
