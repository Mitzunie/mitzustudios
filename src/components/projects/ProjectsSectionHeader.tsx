'use client'

import { useTranslations } from '@/hooks/useTranslations'

export function ProjectsSectionHeader() {
  const t = useTranslations()

  return (
    <div className="mx-auto mb-16 max-w-2xl text-center">
      <h2 className="neo-section-title mb-4">{t.projects.title}</h2>
      <p className="text-muted-foreground text-lg font-bold uppercase tracking-wide">
        {t.projects.subtitle}
      </p>
    </div>
  )
}
