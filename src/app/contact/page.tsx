import type { Metadata } from 'next'
import { ContactForm } from './contact-form'
import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Contáctame para cotizar tu proyecto. Te responderé en menos de 48 horas con una propuesta personalizada.',
}

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        <section className="neo-border py-24">
          <div className="container-custom mx-auto px-4">
            <ContactForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
