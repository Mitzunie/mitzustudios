'use client'

import { Code2, Sparkles } from 'lucide-react'
import { useTranslations } from '@/hooks/useTranslations'
import { SectionAnimation } from '@/components/shared/SectionAnimation'

export function AboutSection() {
  const t = useTranslations()

  return (
    <section id="about" className="neo-border py-24">
      <div className="container-custom mx-auto px-4">
        <SectionAnimation animation="fadeIn">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="neo-section-title mb-8">{t.about.title}</h2>
            <div className="neo-card bg-card flex items-start gap-4 p-6 text-left">
              <Code2 className="text-primary mt-1 h-8 w-8 shrink-0" />
              <p className="text-foreground text-lg font-bold leading-relaxed uppercase tracking-wide">
                {t.about.content}
              </p>
            </div>
          </div>
        </SectionAnimation>
      </div>
    </section>
  )
}
