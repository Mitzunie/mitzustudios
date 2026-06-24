'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, MessageSquare, FolderKanban, Receipt, X } from 'lucide-react'
import { useTranslations } from '@/hooks/useTranslations'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const sidebarLinks = [
  { href: '/admin/dashboard', label: 'dashboard', icon: LayoutDashboard },
  { href: '/admin/requests', label: 'requests', icon: MessageSquare },
  { href: '/admin/projects', label: 'projects', icon: FolderKanban },
  { href: '/admin/pos', label: 'pos', icon: Receipt },
] as const

export function AdminSidebar() {
  const pathname = usePathname()
  const t = useTranslations()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="neo-border flex items-center justify-between border-t-0 border-l-0 border-r-0 p-4">
        <Link href="/admin/dashboard" className="text-primary text-lg font-black uppercase tracking-wide">
          MitzuStudios
        </Link>
        <button
          onClick={() => setIsMobileOpen(false)}
          className="neo-border hover:bg-secondary p-1 md:hidden"
          aria-label="Cerrar sidebar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 p-4" aria-label="Admin navigation">
        {sidebarLinks.map((link) => {
          const Icon = link.icon
          const isActive = pathname.startsWith(link.href)
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 text-sm font-bold uppercase tracking-wide transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground neo-border'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground neo-border border-transparent hover:border-border',
              )}
            >
              <Icon className="h-4 w-4" />
              {t.admin.sidebar[link.label]}
            </Link>
          )
        })}
      </nav>

      <div className="neo-border border-b-0 border-l-0 border-r-0 p-4">
        <Link
          href="/"
          className="text-muted-foreground hover:bg-secondary hover:text-foreground neo-border border-transparent hover:border-border flex items-center gap-2 px-3 py-2 text-sm font-bold uppercase tracking-wide transition-colors"
        >
          ← {t.nav.hero}
        </Link>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="neo-border border-t-0 border-b-0 border-l-0 bg-card hidden w-64 shrink-0 md:block">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMobileOpen(false)}
          />
          <aside className="bg-card relative h-full w-64">{sidebarContent}</aside>
        </div>
      )}

      {/* Mobile toggle */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="bg-primary text-primary-foreground neo-border neo-shadow-sm fixed bottom-4 right-4 z-40 p-3 md:hidden"
        aria-label="Abrir menú"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
    </>
  )
}
