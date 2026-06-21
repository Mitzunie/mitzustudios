'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from '@/hooks/useTranslations'
import { LanguageToggle } from './LanguageToggle'

const navLinks = ['hero', 'about', 'services', 'projects', 'contact'] as const

export function Navbar() {
  const t = useTranslations()

  const scrollToSection = (section: string) => {
    const element = document.getElementById(section)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

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
          {navLinks.map((section) => (
            <button
              key={section}
              onClick={() => scrollToSection(section)}
              className="hover:bg-primary hover:text-primary-foreground neo-border ml-2 px-4 py-1.5 text-sm font-bold uppercase tracking-wide transition-colors"
            >
              {t.nav[section]}
            </button>
          ))}
        </div>

        {/* Language toggle */}
        <div className="flex items-center">
          <LanguageToggle />
        </div>
      </div>
    </nav>
  )
}
