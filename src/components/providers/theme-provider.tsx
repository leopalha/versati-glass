'use client'

import { useEffect } from 'react'
import { useThemeStore } from '@/stores/themeStore'
import { applyTheme } from '@/lib/theme'

interface ThemeProviderProps {
  children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const theme = useThemeStore((state) => state.theme)

  useEffect(() => {
    // Apply theme on mount and when theme changes
    applyTheme(theme)
  }, [theme])

  return <>{children}</>
}
