import type { Metadata } from 'next'
import Link from 'next/link'
import { Code2, Cog, Lightbulb, MessageSquareMore, ArrowLeft } from 'lucide-react'
import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { SectionAnimation } from '@/components/shared/SectionAnimation'
import { es } from '@/shared'

export const metadata: Metadata = {
  title: 'Sobre Mí',
  description: 'Conoce más sobre Vicente Valdés y MitzuStudios. Desarrollador full-stack apasionado por crear soluciones digitales de calidad.',
}

const t = es.pages.about

const focusIcons = [Lightbulb, Cog, MessageSquareMore, Code2]

export default function AboutPage() {
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

            <div className="mx-auto max-w-4xl space-y-24">
              <SectionAnimation animation="fadeIn" threshold={0.2}>
                <div className="neo-card bg-card flex flex-col items-start gap-6 p-8 md:flex-row md:items-center">
                  <Code2 className="text-primary h-16 w-16 shrink-0" />
                  <p className="text-foreground text-lg font-bold leading-relaxed uppercase tracking-wide">
                    {t.intro}
                  </p>
                </div>
              </SectionAnimation>

              <SectionAnimation animation="fadeIn" threshold={0.2}>
                <div>
                  <h2 className="neo-section-title mb-8 text-center">{t.focus.title}</h2>
                  <div className="grid gap-6 md:grid-cols-2">
                    {t.focus.items.map((item, i) => {
                      const Icon = focusIcons[i]
                      return (
                        <div key={item} className="neo-border bg-card flex items-start gap-4 p-6">
                          <div className="bg-primary text-primary-foreground neo-border shrink-0 p-3">
                            <Icon className="h-6 w-6" />
                          </div>
                          <p className="text-foreground pt-1 font-bold uppercase tracking-wide">
                            {item}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </SectionAnimation>

              <SectionAnimation animation="fadeIn" threshold={0.2}>
                <div>
                  <h2 className="neo-section-title mb-8 text-center">{t.tech.title}</h2>
                  <div className="flex flex-wrap justify-center gap-4">
                    {t.tech.items.map((tech) => (
                      <span
                        key={tech}
                        className="neo-border bg-card text-foreground px-5 py-3 font-bold uppercase tracking-wide"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </SectionAnimation>
            </div>

            <div className="mt-24 text-center">
              <Link
                href="/#contact"
                className="neo-button neo-button-primary neo-shadow-sm mr-4 inline-flex items-center gap-2 px-8 py-3 text-base font-bold uppercase tracking-wide"
              >
                {t.cta}
              </Link>
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
