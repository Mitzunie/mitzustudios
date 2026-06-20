'use client'

import { Code2, Sparkles } from 'lucide-react'
import { useTranslations } from '@/hooks/useTranslations'
import { SectionAnimation } from '@/components/shared/SectionAnimation'

export function AboutSection() {
  const t = useTranslations()

  return (
    <section id="about" className="border-border/50 border-t py-24">
      <div className="container-custom mx-auto px-4">
        <SectionAnimation animation="fadeIn">
          <div className="mx-auto max-w-3xl text-center">
            <div className="border-primary/20 bg-primary/5 text-primary mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm">
              <Sparkles className="h-4 w-4" />
              <span>{t.about.title}</span>
            </div>
            <h2 className="mb-6 text-3xl font-bold sm:text-4xl">{t.about.title}</h2>
            <div className="flex items-start justify-center gap-4 text-left">
              <Code2 className="text-primary mt-1 h-6 w-6 shrink-0" />
              <p className="text-muted-foreground text-lg leading-relaxed">{t.about.content}</p>
            </div>
          </div>
        </SectionAnimation>
      </div>
    </section>
  )
}
