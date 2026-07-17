import type { Metadata } from 'next'
import Link from 'next/link'
import { LayoutDashboard, ShoppingCart, Globe, Server, Paintbrush, ArrowLeft } from 'lucide-react'
import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { SectionAnimation } from '@/components/shared/SectionAnimation'
import { es } from '@/shared'

export const metadata: Metadata = {
  title: 'Servicios',
  description: 'Desarrollo web profesional. Landing pages, e-commerce, aplicaciones web, APIs y rediseño. Transformamos tus ideas en software.',
  alternates: {
    canonical: '/services',
  },
}

const servicesList = es.services.items
const processSteps = es.pages.services.process.steps

const serviceIcons = [Globe, ShoppingCart, LayoutDashboard, Server, Paintbrush]

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        <section className="neo-border py-24">
          <div className="container-custom mx-auto px-4">
            <div className="mx-auto mb-16 max-w-3xl text-center">
              <SectionAnimation animation="fadeIn">
                <h1 className="neo-section-title mb-4">{es.pages.services.title}</h1>
                <p className="text-muted-foreground text-lg font-bold uppercase tracking-wide">
                  {es.pages.services.subtitle}
                </p>
              </SectionAnimation>
            </div>

            <SectionAnimation animation="fadeIn" threshold={0.2}>
              <div className="neo-card bg-card mx-auto mb-24 max-w-3xl p-8 text-center">
                <p className="text-foreground text-lg font-bold leading-relaxed uppercase tracking-wide">
                  {es.pages.services.intro}
                </p>
              </div>
            </SectionAnimation>

            <div className="mx-auto mb-24 grid max-w-5xl gap-8 md:grid-cols-2 lg:grid-cols-3">
              {servicesList.map((service, i) => {
                const Icon = serviceIcons[i] || Globe
                return (
                  <SectionAnimation key={service.title} animation="fadeIn" threshold={0.2}>
                    <div className="neo-border bg-card flex h-full flex-col items-start gap-4 p-8 text-left">
                      <div className="bg-primary text-primary-foreground neo-border p-3">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-black uppercase tracking-wide">{service.title}</h3>
                      <p className="text-muted-foreground font-bold uppercase tracking-wide leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </SectionAnimation>
                )
              })}
            </div>

            <SectionAnimation animation="fadeIn" threshold={0.2}>
              <div className="mx-auto max-w-3xl">
                <h2 className="neo-section-title mb-12 text-center">{es.pages.services.process.title}</h2>
                <div className="grid gap-6 md:grid-cols-2">
                  {processSteps.map((step) => (
                    <div key={step.title} className="neo-border bg-card flex flex-col gap-2 p-6">
                      <h3 className="text-primary text-lg font-black uppercase tracking-wide">{step.title}</h3>
                      <p className="text-muted-foreground font-bold uppercase tracking-wide leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </SectionAnimation>

            <div className="mt-24 text-center">
              <Link
                href="/#contact"
                className="neo-button neo-button-primary neo-shadow-sm mr-4 inline-flex items-center gap-2 px-8 py-3 text-base font-bold uppercase tracking-wide"
              >
                {es.pages.services.cta}
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
