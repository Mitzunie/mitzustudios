import type { Metadata } from 'next'
import Link from 'next/link'
import { Cloud, Code2, Server, Shield, ExternalLink, ArrowLeft } from 'lucide-react'
import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { SectionAnimation } from '@/components/shared/SectionAnimation'
import { es } from '@/shared'

export const metadata: Metadata = {
  title: 'Mextyra',
  description:
    'Mextyra — Ecosistema de desarrollo de aplicaciones y software. Cloud empresarial y estudio de desarrollo.',
}

const t = es.pages.mextyra

const featureIcons = [Cloud, Code2, Server, Shield]

export default function MextyraPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        <section className="neo-border py-24">
          <div className="container-custom mx-auto px-4">
            <div className="mx-auto mb-16 max-w-3xl text-center">
              <SectionAnimation animation="fadeIn">
                <h1 className="neo-section-title mb-4">{t.title}</h1>
                <p className="text-muted-foreground text-lg font-bold tracking-wide uppercase">
                  {t.subtitle}
                </p>
              </SectionAnimation>
            </div>

            <SectionAnimation animation="fadeIn" threshold={0.2}>
              <div className="neo-card bg-card mx-auto mb-24 max-w-3xl p-8 text-center">
                <p className="text-foreground text-lg leading-relaxed font-bold tracking-wide uppercase">
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
                      <h3 className="text-xl font-black tracking-wide uppercase">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed font-bold tracking-wide uppercase">
                        {feature.description}
                      </p>
                    </div>
                  </SectionAnimation>
                )
              })}
            </div>

            <div className="text-center">
              <a
                href="https://mextyra.com"
                target="_blank"
                rel="noopener noreferrer"
                className="neo-button neo-button-primary neo-shadow-sm mr-4 inline-flex items-center gap-2 px-8 py-3 text-base font-bold tracking-wide uppercase"
              >
                <ExternalLink className="h-4 w-4" />
                {t.cta}
              </a>
              <Link
                href="/"
                className="neo-button neo-button-secondary neo-shadow-sm mt-4 inline-flex items-center gap-2 px-8 py-3 text-base font-bold tracking-wide uppercase md:mt-0"
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
