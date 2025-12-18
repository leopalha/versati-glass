'use client'

import { useEffect, useState } from 'react'
import { useThemeStore } from '@/stores/themeStore'
import { applyTheme } from '@/lib/theme'

interface ThemeProviderProps {
  children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false)
  const theme = useThemeStore((state) => state.theme)

  // Avoid hydration mismatch by only applying theme after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Only apply theme after hydration is complete
    // This handles both initial mount and theme changes
    if (mounted) {
      applyTheme(theme)
    }
  }, [theme, mounted])

  return <>{children}</>
}
