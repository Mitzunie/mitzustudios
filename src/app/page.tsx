import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { HeroSection } from '@/components/landing/HeroSection'
import { AboutSection } from '@/components/landing/AboutSection'
import { ServicesSection } from '@/components/landing/ServicesSection'
import { ProjectsSection } from '@/components/landing/ProjectsSection'
import { ContactSection } from '@/components/landing/ContactSection'

export const dynamic = 'force-dynamic'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <ProjectsSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
