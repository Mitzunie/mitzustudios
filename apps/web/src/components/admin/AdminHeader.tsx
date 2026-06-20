'use client'

import { useSession, signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'
import { useTranslations } from '@/hooks/useTranslations'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { LanguageToggle } from '@/components/shared/LanguageToggle'

export function AdminHeader() {
  const { data: session } = useSession()
  const t = useTranslations()

  return (
    <header className="border-border/50 bg-card flex h-16 items-center justify-between border-b px-6">
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold">
          {session?.user?.name?.charAt(0)?.toUpperCase() || 'A'}
        </div>
        <div>
          <p className="text-sm font-medium">{session?.user?.name || 'Admin'}</p>
          <p className="text-muted-foreground text-xs">{session?.user?.email}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <LanguageToggle />
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
          aria-label={t.nav.logout}
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">{t.nav.logout}</span>
        </button>
      </div>
    </header>
  )
}
