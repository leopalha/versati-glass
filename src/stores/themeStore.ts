import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { type ThemeType } from '@/lib/theme'

interface ThemeState {
  theme: ThemeType
  setTheme: (theme: ThemeType) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'gold',
      setTheme: (theme) => {
        // Theme application is handled by ThemeProvider to avoid hydration mismatch
        set({ theme })
      },
    }),
    {
      name: 'versati-theme',
      // Theme is applied via ThemeProvider useEffect after mount
    }
  )
)
