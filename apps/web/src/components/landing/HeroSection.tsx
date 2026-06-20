'use client'

import { ArrowRight } from 'lucide-react'
import { useTranslations } from '@/hooks/useTranslations'
import { SectionAnimation } from '@/components/shared/SectionAnimation'

export function HeroSection() {
  const t = useTranslations()

  const scrollToContact = () => {
    const element = document.getElementById('contact')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const scrollToProjects = () => {
    const element = document.getElementById('projects')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      {/* Background gradient effect */}
      <div className="from-primary/10 to-background pointer-events-none absolute inset-0 bg-gradient-to-b via-transparent" />

      <div className="container-custom mx-auto px-4 py-32 text-center">
        <SectionAnimation animation="fadeIn">
          <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            {t.hero.title} <span className="gradient-text">{t.hero.titleHighlight}</span>
          </h1>
        </SectionAnimation>

        <SectionAnimation animation="fadeIn" threshold={0.3}>
          <p className="text-muted-foreground mx-auto mb-10 max-w-2xl text-lg sm:text-xl">
            {t.hero.subtitle}
          </p>
        </SectionAnimation>

        <SectionAnimation animation="fadeIn" threshold={0.5}>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              onClick={scrollToContact}
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-primary/25 focus-visible:ring-ring inline-flex items-center gap-2 rounded-lg px-8 py-3 text-base font-semibold transition-all hover:shadow-lg focus-visible:outline-none focus-visible:ring-2"
            >
              {t.hero.cta}
              <ArrowRight className="h-5 w-5" />
            </button>
            <button
              onClick={scrollToProjects}
              className="border-border bg-secondary/50 text-foreground hover:bg-secondary focus-visible:ring-ring inline-flex items-center gap-2 rounded-lg border px-8 py-3 text-base font-semibold transition-all focus-visible:outline-none focus-visible:ring-2"
            >
              {t.hero.secondaryCta}
            </button>
          </div>
        </SectionAnimation>
      </div>
    </section>
  )
}
