'use client'

import { useSession, signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'
import { useTranslations } from '@/hooks/useTranslations'
import { LanguageToggle } from '@/components/shared/LanguageToggle'

export function AdminHeader() {
  const { data: session } = useSession()
  const t = useTranslations()

  return (
    <header className="neo-border border-t-0 border-l-0 border-r-0 bg-card flex h-16 items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <div className="bg-primary neo-border flex h-8 w-8 items-center justify-center text-sm font-black uppercase text-primary-foreground">
          {session?.user?.name?.charAt(0)?.toUpperCase() || 'A'}
        </div>
        <div>
          <p className="text-sm font-black uppercase tracking-wide">{session?.user?.name || 'Admin'}</p>
          <p className="text-muted-foreground text-xs font-bold uppercase tracking-wide">{session?.user?.email}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <LanguageToggle />
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive neo-border border-transparent hover:border-destructive flex items-center gap-2 px-3 py-2 text-sm font-bold uppercase tracking-wide transition-colors"
          aria-label={t.nav.logout}
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">{t.nav.logout}</span>
        </button>
      </div>
    </header>
  )
}
