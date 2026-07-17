import type { Metadata } from 'next'
import Link from 'next/link'
import { Code2, Users, BookOpen, MessageSquareText, ExternalLink, ArrowLeft } from 'lucide-react'
import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { SectionAnimation } from '@/components/shared/SectionAnimation'
import { es } from '@/shared'

export const metadata: Metadata = {
  title: 'Zeew Space',
  description: 'Zeew Space — Aprende creando proyectos reales. Cursos prácticos de JavaScript, React, Lua y más. Comunidad activa y aprendizaje basado en proyectos.',
  alternates: {
    canonical: '/zeew-space',
  },
}

const t = es.pages.zeew

const featureIcons = [Code2, Users, BookOpen, MessageSquareText]

export default function ZeewSpacePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        <section className="neo-border py-24">
          <div className="container-custom mx-auto px-4">
            <div className="mx-auto mb-16 max-w-3xl text-center">
              <SectionAnimation animation="fadeIn">
                <h1 className="neo-section-title mb-4">{t.title}</h1>
                <p className="text-muted-foreground text-lg font-bold uppercase tracking-wide">
                  {t.subtitle}
                </p>
              </SectionAnimation>
            </div>

            <SectionAnimation animation="fadeIn" threshold={0.2}>
              <div className="neo-card bg-card mx-auto mb-24 max-w-3xl p-8 text-center">
                <p className="text-foreground text-lg font-bold leading-relaxed uppercase tracking-wide">
                  {t.description}
                </p>
              </div>
            </SectionAnimation>

            <div className="mx-auto mb-24 grid max-w-5xl gap-8 md:grid-cols-2">
              {t.features.map((feature, i) => {
                const Icon = featureIcons[i]
                return (
                  <SectionAnimation key={feature.title} animation="fadeIn" threshold={0.2}>
                    <div className="neo-border bg-card flex flex-col items-start gap-4 p-8 text-left">
                      <div className="bg-primary text-primary-foreground neo-border p-3">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-black uppercase tracking-wide">{feature.title}</h3>
                      <p className="text-muted-foreground font-bold uppercase tracking-wide leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </SectionAnimation>
                )
              })}
            </div>

            <div className="text-center">
              <a
                href="https://zeew.space"
                target="_blank"
                rel="noopener noreferrer"
                className="neo-button neo-button-primary neo-shadow-sm mr-4 inline-flex items-center gap-2 px-8 py-3 text-base font-bold uppercase tracking-wide"
              >
                <ExternalLink className="h-4 w-4" />
                {t.cta}
              </a>
              <Link
                href="/"
                className="neo-button neo-button-secondary neo-shadow-sm mt-4 inline-flex items-center gap-2 px-8 py-3 text-base font-bold uppercase tracking-wide md:mt-0"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver al inicio
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
