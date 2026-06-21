'use client'

import { useLanguageStore } from '@/stores/language'
import { es, en, type Dictionary } from '@/shared'

const dictionaries: Record<string, Dictionary> = {
  es: es as unknown as Dictionary,
  en: en as unknown as Dictionary,
}

export function useTranslations(): Dictionary {
  const language = useLanguageStore((s) => s.language)
  return dictionaries[language] || es
}
