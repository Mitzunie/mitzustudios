'use client'

import { Languages } from 'lucide-react'
import { useLanguageStore } from '@/stores/language'
import { useTranslations } from '@/hooks/useTranslations'
import { cn } from '@/lib/utils'

export function LanguageToggle() {
  const { language, toggle } = useLanguageStore()
  const t = useTranslations()

  return (
    <button
      onClick={toggle}
      className={cn(
        'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
        'hover:bg-secondary focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2',
      )}
      aria-label={language === 'es' ? t.language.en : t.language.es}
    >
      <Languages className="h-4 w-4" />
      <span className="hidden sm:inline">{language.toUpperCase()}</span>
    </button>
  )
}
