import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'dark' | 'light'

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggle: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'dark',
      setTheme: (theme) => {
        set({ theme })
        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', theme === 'dark')
          document.documentElement.classList.toggle('light', theme === 'light')
        }
      },
      toggle: () =>
        set((state) => {
          const next = state.theme === 'dark' ? 'light' : 'dark'
          if (typeof document !== 'undefined') {
            document.documentElement.classList.toggle('dark', next === 'dark')
            document.documentElement.classList.toggle('light', next === 'light')
          }
          return { theme: next }
        }),
    }),
    {
      name: 'mitzustudios-theme',
    },
  ),
)
