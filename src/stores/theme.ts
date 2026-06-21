import { create } from 'zustand'

interface ThemeState {
  theme: 'dark'
  setTheme: () => void
  toggle: () => void
}

export const useThemeStore = create<ThemeState>()(() => ({
  theme: 'dark',
  setTheme: () => {},
  toggle: () => {},
}))
