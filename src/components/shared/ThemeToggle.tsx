'use client'

import { Moon } from 'lucide-react'

export function ThemeToggle() {
  return (
    <span className="text-muted-foreground flex items-center gap-2 px-3 py-2 text-sm">
      <Moon className="h-4 w-4" />
      <span className="hidden sm:inline">Oscuro</span>
    </span>
  )
}
