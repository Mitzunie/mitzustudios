'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useTranslations } from '@/hooks/useTranslations'
import { LanguageToggle } from './LanguageToggle'
import { Shield } from 'lucide-react'

const navItems = [
  { key: 'hero', href: '/' },
  { key: 'about', href: '/about' },
  { key: 'services', href: '/services' },
  { key: 'projects', href: '/projects' },
  { key: 'blog', href: '/blog' },
  { key: 'contact', href: '/contact' },
] as const

export function Navbar() {
  const { data: session } = useSession()
  const t = useTranslations()
  const isAdmin = session?.user?.role === 'admin'

  return (
    <nav
      className="neo-border bg-background fixed left-0 right-0 top-0 z-50 border-b"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container-custom mx-auto flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2"
          aria-label="MitzuStudios Home"
        >
          {process.env.NEXT_PUBLIC_SITE_LOGO_URL ? (
            <Image
              src={process.env.NEXT_PUBLIC_SITE_LOGO_URL}
              alt="MitzuStudios"
              width={28}
              height={28}
              className="h-7 w-auto object-contain"
              priority
            />
          ) : null}
          <span className="text-primary text-xl font-black uppercase tracking-tight">
            MitzuStudios
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center md:flex">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="hover:bg-primary hover:text-primary-foreground neo-border ml-2 px-4 py-1.5 text-sm font-bold uppercase tracking-wide transition-colors"
            >
              {t.nav[item.key]}
            </Link>
          ))}
        </div>

        {/* Admin + Language */}
        <div className="flex items-center gap-2">
          {isAdmin && (
            <Link
              href="/admin/dashboard"
              className="hover:bg-primary hover:text-primary-foreground neo-border flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold uppercase tracking-wide transition-colors"
            >
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">{t.nav.admin}</span>
            </Link>
          )}
          <LanguageToggle />
        </div>
      </div>
    </nav>
  )
}
