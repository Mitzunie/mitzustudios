'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useTranslations } from '@/hooks/useTranslations'
import { ThemeToggle } from './ThemeToggle'
import { LanguageToggle } from './LanguageToggle'
import { cn } from '@/lib/utils'

const navLinks = ['hero', 'about', 'services', 'projects', 'contact'] as const

export function Navbar() {
  const t = useTranslations()
  const [isOpen, setIsOpen] = useState(false)

  const scrollToSection = (section: string) => {
    setIsOpen(false)
    const element = document.getElementById(section)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav
      className="border-border/50 bg-background/80 fixed left-0 right-0 top-0 z-50 border-b backdrop-blur-md"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container-custom mx-auto flex h-16 items-center justify-between">
        <Link
          href="/"
          className="gradient-text text-xl font-bold tracking-tight"
          aria-label="MitzuStudios Home"
        >
          MitzuStudios
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((section) => (
            <button
              key={section}
              onClick={() => scrollToSection(section)}
              className="text-muted-foreground hover:bg-secondary hover:text-foreground rounded-lg px-3 py-2 text-sm font-medium transition-colors"
            >
              {t.nav[section]}
            </button>
          ))}
          <div className="ml-4 flex items-center gap-1">
            <ThemeToggle />
            <LanguageToggle />
          </div>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="hover:bg-secondary rounded-lg p-2 md:hidden"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      <div
        className={cn(
          'border-border/50 overflow-hidden border-t md:hidden',
          'transition-all duration-300 ease-in-out',
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <div className="container-custom mx-auto space-y-1 py-4">
          {navLinks.map((section) => (
            <button
              key={section}
              onClick={() => scrollToSection(section)}
              className="text-muted-foreground hover:bg-secondary hover:text-foreground block w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors"
            >
              {t.nav[section]}
            </button>
          ))}
          <div className="flex items-center gap-2 px-3 pt-2">
            <ThemeToggle />
            <LanguageToggle />
          </div>
        </div>
      </div>
    </nav>
  )
}
