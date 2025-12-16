'use client'

import { useEffect, useState } from 'react'
import { useThemeStore } from '@/stores/themeStore'
import { themes } from '@/lib/theme'
import { Check, Palette, Sun, Moon } from 'lucide-react'

interface ThemeSwitcherProps {
  variant?: 'dropdown' | 'inline' | 'compact'
  showLabel?: boolean
}

export function ThemeSwitcher({ variant = 'dropdown', showLabel = true }: ThemeSwitcherProps) {
  const { theme, setTheme } = useThemeStore()
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const currentTheme = themes.find((t) => t.id === theme)

  if (variant === 'compact') {
    return (
      <div className="flex flex-wrap items-center gap-1.5">
        {themes.map((t) => (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={`flex h-7 w-7 items-center justify-center rounded-full border-2 transition-all ${
              theme === t.id
                ? 'scale-110 border-white shadow-lg'
                : 'border-transparent hover:scale-105 hover:border-white/30'
            }`}
            style={{ backgroundColor: t.preview.primary }}
            title={t.name}
          >
            {t.isDark ? (
              <Moon className="h-3 w-3 text-white/80" />
            ) : (
              <Sun className="h-3 w-3 text-white/80" />
            )}
          </button>
        ))}
      </div>
    )
  }

  if (variant === 'inline') {
    return (
      <div className="space-y-3">
        {showLabel && <p className="text-theme-secondary text-sm font-medium">Tema</p>}
        <div className="grid grid-cols-2 gap-3">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`relative rounded-lg border-2 p-3 transition-all ${
                theme === t.id
                  ? 'bg-theme-elevated border-accent-500'
                  : 'border-theme-default hover:border-accent-500/50 bg-theme-card'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex -space-x-1">
                  <div
                    className="border-theme-default h-5 w-5 rounded-full border"
                    style={{ backgroundColor: t.preview.primary }}
                  />
                  <div
                    className="border-theme-default h-5 w-5 rounded-full border"
                    style={{ backgroundColor: t.preview.secondary }}
                  />
                  <div
                    className="border-theme-default h-5 w-5 rounded-full border"
                    style={{ backgroundColor: t.preview.accent }}
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-theme-primary text-sm">{t.name}</span>
                  {t.isDark ? (
                    <Moon className="text-theme-muted h-3 w-3" />
                  ) : (
                    <Sun className="text-theme-muted h-3 w-3" />
                  )}
                </div>
              </div>
              {theme === t.id && (
                <Check className="absolute right-2 top-2 h-4 w-4 text-accent-500" />
              )}
            </button>
          ))}
        </div>
      </div>
    )
  }

  // Dropdown variant
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-theme-elevated hover:bg-theme-hover border-theme-default flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors"
      >
        <Palette className="h-4 w-4 text-accent-500" />
        {showLabel && <span className="text-theme-primary text-sm">{currentTheme?.name}</span>}
        {currentTheme?.isDark ? (
          <Moon className="text-theme-muted h-3 w-3" />
        ) : (
          <Sun className="text-theme-muted h-3 w-3" />
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="bg-theme-card border-theme-default absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-lg border shadow-lg">
            <div className="max-h-96 overflow-y-auto p-2">
              {/* Tema escuro */}
              <div className="mb-2">
                <p className="text-theme-muted flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium">
                  <Moon className="h-3 w-3" /> Tema Escuro
                </p>
                {themes
                  .filter((t) => t.isDark)
                  .map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setTheme(t.id)
                        setIsOpen(false)
                      }}
                      className={`flex w-full items-center gap-3 rounded-lg p-3 transition-colors ${
                        theme === t.id ? 'bg-accent-500/10' : 'hover:bg-theme-hover'
                      }`}
                    >
                      <div className="flex -space-x-1">
                        <div
                          className="border-theme-default h-5 w-5 rounded-full border"
                          style={{ backgroundColor: t.preview.primary }}
                        />
                        <div
                          className="border-theme-default h-5 w-5 rounded-full border"
                          style={{ backgroundColor: t.preview.secondary }}
                        />
                        <div
                          className="border-theme-default h-5 w-5 rounded-full border"
                          style={{ backgroundColor: t.preview.accent }}
                        />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-theme-primary text-sm font-medium">{t.name}</p>
                        <p className="text-theme-muted text-xs">{t.description}</p>
                      </div>
                      {theme === t.id && <Check className="h-4 w-4 text-accent-500" />}
                    </button>
                  ))}
              </div>

              {/* Temas claros */}
              <div>
                <p className="text-theme-muted flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium">
                  <Sun className="h-3 w-3" /> Temas Claros
                </p>
                {themes
                  .filter((t) => !t.isDark)
                  .map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setTheme(t.id)
                        setIsOpen(false)
                      }}
                      className={`flex w-full items-center gap-3 rounded-lg p-3 transition-colors ${
                        theme === t.id ? 'bg-accent-500/10' : 'hover:bg-theme-hover'
                      }`}
                    >
                      <div className="flex -space-x-1">
                        <div
                          className="border-theme-default h-5 w-5 rounded-full border"
                          style={{ backgroundColor: t.preview.primary }}
                        />
                        <div
                          className="border-theme-default h-5 w-5 rounded-full border"
                          style={{ backgroundColor: t.preview.secondary }}
                        />
                        <div
                          className="border-theme-default h-5 w-5 rounded-full border"
                          style={{ backgroundColor: t.preview.accent }}
                        />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-theme-primary text-sm font-medium">{t.name}</p>
                        <p className="text-theme-muted text-xs">{t.description}</p>
                      </div>
                      {theme === t.id && <Check className="h-4 w-4 text-accent-500" />}
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
