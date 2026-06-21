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
      className="neo-border flex min-h-screen items-center justify-center border-b-0"
    >
      {/* Decorative block */}
      <div className="bg-primary absolute right-8 top-32 hidden h-24 w-24 md:block" />
      <div className="bg-secondary absolute bottom-32 left-8 hidden h-16 w-16 md:block" />

      <div className="container-custom mx-auto px-4 py-32 text-center">
        <SectionAnimation animation="fadeIn">
          <h1 className="mb-6 text-5xl font-black leading-none tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl uppercase">
            {t.hero.title}{' '}
            <span className="bg-primary text-primary-foreground neo-border inline-block px-4 py-1">
              {t.hero.titleHighlight}
            </span>
          </h1>
        </SectionAnimation>

        <SectionAnimation animation="fadeIn" threshold={0.3}>
          <p className="text-muted-foreground mx-auto mb-10 max-w-2xl text-lg font-bold sm:text-xl uppercase tracking-wide">
            {t.hero.subtitle}
          </p>
        </SectionAnimation>

        <SectionAnimation animation="fadeIn" threshold={0.5}>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              onClick={scrollToContact}
              className="neo-button neo-button-primary neo-shadow-sm inline-flex items-center gap-2 px-8 py-3 text-base"
            >
              {t.hero.cta}
              <ArrowRight className="h-5 w-5" />
            </button>
            <button
              onClick={scrollToProjects}
              className="neo-button neo-button-secondary neo-shadow-sm inline-flex items-center gap-2 px-8 py-3 text-base"
            >
              {t.hero.secondaryCta}
            </button>
          </div>
        </SectionAnimation>
      </div>
    </section>
  )
}
