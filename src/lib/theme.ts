export type ThemeType = 'gold' | 'blue' | 'green' | 'gray' | 'wine' | 'corporate' | 'modern'

export interface ThemeConfig {
  id: ThemeType
  name: string
  description: string
  isDark: boolean
  preview: {
    primary: string
    secondary: string
    accent: string
  }
}

export const themes: ThemeConfig[] = [
  {
    id: 'gold',
    name: 'Ouro',
    description: 'Elegância clássica com fundo cinza cimento',
    isDark: true,
    preview: {
      primary: '#2D2D2D',
      secondary: '#3A3A3A',
      accent: '#C9A962',
    },
  },
  {
    id: 'blue',
    name: 'Azul',
    description: 'Sofisticação em tons azuis com acento dourado',
    isDark: false,
    preview: {
      primary: '#1E3A5F',
      secondary: '#E8F1FA',
      accent: '#C9A962',
    },
  },
  {
    id: 'green',
    name: 'Verde',
    description: 'Frescor natural com acento dourado',
    isDark: false,
    preview: {
      primary: '#1A4D32',
      secondary: '#E8F5EC',
      accent: '#C9A962',
    },
  },
  {
    id: 'gray',
    name: 'Cinza',
    description: 'Minimalismo slate com acento dourado',
    isDark: false,
    preview: {
      primary: '#1E293B',
      secondary: '#F1F5F9',
      accent: '#C9A962',
    },
  },
  {
    id: 'wine',
    name: 'Vinho',
    description: 'Elegância bordô com acento dourado',
    isDark: false,
    preview: {
      primary: '#6B1E2E',
      secondary: '#FBF8F4',
      accent: '#C9A962',
    },
  },
  {
    id: 'corporate',
    name: 'Corporativo',
    description: 'Profissional azul marinho com acento dourado',
    isDark: false,
    preview: {
      primary: '#0F172A',
      secondary: '#F8FAFC',
      accent: '#C9A962',
    },
  },
  {
    id: 'modern',
    name: 'Moderno',
    description: 'Minimalista com acento dourado',
    isDark: false,
    preview: {
      primary: '#18181B',
      secondary: '#FAFAFA',
      accent: '#C9A962',
    },
  },
]

export const validThemes = ['gold', 'blue', 'green', 'gray', 'wine', 'corporate', 'modern'] as const

export function getTheme(id: ThemeType): ThemeConfig | undefined {
  return themes.find((theme) => theme.id === id)
}

export function getStoredTheme(): ThemeType {
  if (typeof window === 'undefined') return 'gold'
  const stored = localStorage.getItem('versati-theme')
  if (stored && validThemes.includes(stored as ThemeType)) {
    return stored as ThemeType
  }
  return 'gold'
}

export function setStoredTheme(theme: ThemeType): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('versati-theme', theme)
}

export function applyTheme(theme: ThemeType): void {
  if (typeof document === 'undefined') return

  // Remove all theme classes
  document.documentElement.removeAttribute('data-theme')

  // Apply new theme (gold is default, so no data-theme needed)
  if (theme !== 'gold') {
    document.documentElement.setAttribute('data-theme', theme)
  }

  setStoredTheme(theme)
}
