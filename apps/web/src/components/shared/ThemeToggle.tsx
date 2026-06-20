'use client'

import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/hooks/useTranslations'
import { cn } from '@/lib/utils'

export function ThemeToggle() {
  const { isDark, toggle } = useTheme()
  const t = useTranslations()

  return (
    <button
      onClick={toggle}
      className={cn(
        'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
        'hover:bg-secondary focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2',
      )}
      aria-label={isDark ? t.theme.light : t.theme.dark}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      <span className="hidden sm:inline">{isDark ? t.theme.light : t.theme.dark}</span>
    </button>
  )
}
