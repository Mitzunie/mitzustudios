'use client'

import { Code, ShoppingCart, Globe, Server, RefreshCw } from 'lucide-react'
import { useTranslations } from '@/hooks/useTranslations'
import { SectionAnimation } from '@/components/shared/SectionAnimation'
import { cn } from '@/lib/utils'

const serviceIcons = [Globe, ShoppingCart, Code, Server, RefreshCw]

export function ServicesSection() {
  const t = useTranslations()

  return (
    <section id="services" className="neo-border py-24">
      <div className="container-custom mx-auto px-4">
        <SectionAnimation animation="fadeIn">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="neo-section-title mb-4">{t.services.title}</h2>
            <p className="text-muted-foreground text-lg font-bold uppercase tracking-wide">
              {t.services.subtitle}
            </p>
          </div>
        </SectionAnimation>

        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {t.services.items.map((service, index) => {
            const Icon = serviceIcons[index] || Code
            return (
              <SectionAnimation key={service.title} animation="fadeIn" threshold={0.15 * index}>
                <div className="neo-card bg-card p-6">
                  <div className="bg-primary text-primary-foreground neo-border mb-4 inline-flex p-3">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-base font-black uppercase tracking-wide">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-sm font-bold leading-relaxed uppercase tracking-wide">
                    {service.description}
                  </p>
                </div>
              </SectionAnimation>
            )
          })}
        </div>
      </div>
    </section>
  )
}
