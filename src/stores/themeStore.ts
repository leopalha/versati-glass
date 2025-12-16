import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { type ThemeType, applyTheme } from '@/lib/theme'

interface ThemeState {
  theme: ThemeType
  setTheme: (theme: ThemeType) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'gold',
      setTheme: (theme) => {
        applyTheme(theme)
        set({ theme })
      },
    }),
    {
      name: 'versati-theme',
      onRehydrateStorage: () => (state) => {
        // Apply theme on hydration
        if (state?.theme) {
          applyTheme(state.theme)
        }
      },
    }
  )
)
