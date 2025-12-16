export type ThemeType = 'gold' | 'blue' | 'green' | 'gray'

export interface ThemeConfig {
  id: ThemeType
  name: string
  description: string
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
    description: 'Elegância clássica com tons dourados',
    preview: {
      primary: '#C9A962',
      secondary: '#F2E1B8',
      accent: '#B8956E',
    },
  },
  {
    id: 'blue',
    name: 'Azul',
    description: 'Sofisticação em tons de azul pastel',
    preview: {
      primary: '#4A8ED4',
      secondary: '#BAD9FF',
      accent: '#3D7AB8',
    },
  },
  {
    id: 'green',
    name: 'Verde',
    description: 'Frescor natural em verde pastel',
    preview: {
      primary: '#4ABA7D',
      secondary: '#B8F5CC',
      accent: '#38946A',
    },
  },
  {
    id: 'gray',
    name: 'Cinza',
    description: 'Minimalismo neutro e moderno',
    preview: {
      primary: '#737373',
      secondary: '#D4D4D4',
      accent: '#525252',
    },
  },
]

export function getTheme(id: ThemeType): ThemeConfig | undefined {
  return themes.find((theme) => theme.id === id)
}

export function getStoredTheme(): ThemeType {
  if (typeof window === 'undefined') return 'gold'
  const stored = localStorage.getItem('versati-theme')
  if (stored && ['gold', 'blue', 'green', 'gray'].includes(stored)) {
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
