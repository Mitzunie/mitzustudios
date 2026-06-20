import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Language = 'es' | 'en'

interface LanguageState {
  language: Language
  setLanguage: (language: Language) => void
  toggle: () => void
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'es',
      setLanguage: (language) => set({ language }),
      toggle: () =>
        set((state) => ({
          language: state.language === 'es' ? 'en' : 'es',
        })),
    }),
    {
      name: 'mitzustudios-language',
    },
  ),
)
