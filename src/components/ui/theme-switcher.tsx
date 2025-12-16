'use client'

import { useEffect, useState } from 'react'
import { useThemeStore } from '@/stores/themeStore'
import { themes } from '@/lib/theme'
import { Check, Palette } from 'lucide-react'

interface ThemeSwitcherProps {
  variant?: 'dropdown' | 'inline' | 'compact'
  showLabel?: boolean
}

export function ThemeSwitcher({
  variant = 'dropdown',
  showLabel = true,
}: ThemeSwitcherProps) {
  const { theme, setTheme } = useThemeStore()
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-1">
        {themes.map((t) => (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={`w-6 h-6 rounded-full border-2 transition-all ${
              theme === t.id
                ? 'border-white scale-110'
                : 'border-transparent hover:scale-105'
            }`}
            style={{ backgroundColor: t.preview.primary }}
            title={t.name}
          />
        ))}
      </div>
    )
  }

  if (variant === 'inline') {
    return (
      <div className="space-y-3">
        {showLabel && (
          <p className="text-sm font-medium text-neutral-800">Tema</p>
        )}
        <div className="grid grid-cols-2 gap-3">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`relative p-3 rounded-lg border-2 transition-all ${
                theme === t.id
                  ? 'border-accent-500 bg-neutral-200'
                  : 'border-neutral-300 hover:border-neutral-400 bg-neutral-150'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex -space-x-1">
                  <div
                    className="w-5 h-5 rounded-full border border-neutral-400"
                    style={{ backgroundColor: t.preview.primary }}
                  />
                  <div
                    className="w-5 h-5 rounded-full border border-neutral-400"
                    style={{ backgroundColor: t.preview.secondary }}
                  />
                  <div
                    className="w-5 h-5 rounded-full border border-neutral-400"
                    style={{ backgroundColor: t.preview.accent }}
                  />
                </div>
                <span className="text-sm text-neutral-800">{t.name}</span>
              </div>
              {theme === t.id && (
                <Check className="absolute top-2 right-2 w-4 h-4 text-accent-500" />
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
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-200 hover:bg-neutral-250 transition-colors"
      >
        <Palette className="w-4 h-4 text-accent-500" />
        {showLabel && (
          <span className="text-sm text-neutral-800">
            {themes.find((t) => t.id === theme)?.name}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 z-50 w-64 bg-neutral-150 border border-neutral-300 rounded-lg shadow-card-elevated overflow-hidden">
            <div className="p-2">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id)
                    setIsOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    theme === t.id
                      ? 'bg-accent-500/10'
                      : 'hover:bg-neutral-200'
                  }`}
                >
                  <div className="flex -space-x-1">
                    <div
                      className="w-5 h-5 rounded-full border border-neutral-400"
                      style={{ backgroundColor: t.preview.primary }}
                    />
                    <div
                      className="w-5 h-5 rounded-full border border-neutral-400"
                      style={{ backgroundColor: t.preview.secondary }}
                    />
                    <div
                      className="w-5 h-5 rounded-full border border-neutral-400"
                      style={{ backgroundColor: t.preview.accent }}
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-neutral-900">
                      {t.name}
                    </p>
                    <p className="text-xs text-neutral-600">{t.description}</p>
                  </div>
                  {theme === t.id && (
                    <Check className="w-4 h-4 text-accent-500" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
