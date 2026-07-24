'use client'

import { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Globe,
  ShoppingCart,
  Code,
  Server,
  RefreshCw,
  MessageCircle,
  Instagram,
  Send,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import { useTranslations } from '@/hooks/useTranslations'
import { cn } from '@/lib/utils'
import { trackEvent } from '@/lib/analytics'
import type { ProjectDTO } from '@/shared'

const serviceIcons = [Globe, ShoppingCart, Code, Server, RefreshCw]

interface NfcClientProps {
  projects: ProjectDTO[]
}

function useScrollIn(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, isVisible }
}

function AnimatedSection({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const { ref, isVisible } = useScrollIn(0.05)

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700 ease-out',
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
        className,
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

export function NfcClient({ projects }: NfcClientProps) {
  const t = useTranslations()
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP || '56921935205'
  const instagram = process.env.NEXT_PUBLIC_INSTAGRAM || 'mitzustudios.online'
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL
  const logo = process.env.NEXT_PUBLIC_SITE_LOGO_URL

  return (
    <div className="bg-background min-h-screen">
      <main className="mx-auto max-w-lg px-5 py-12">
        {/* Decorative accent */}
        <div className="bg-primary/20 absolute right-0 top-0 h-32 w-32 blur-3xl" />
        <div className="bg-secondary/20 absolute bottom-1/2 left-0 h-24 w-24 blur-3xl" />

        {/* Logo + Name + Role + Brand */}
        <AnimatedSection className="relative mb-14 text-center">
          <div className="mb-5 flex justify-center">
            {logo ? (
              <Image
                src={logo}
                alt="MitzuStudios"
                width={56}
                height={56}
                className="h-14 w-auto object-contain"
                priority
              />
            ) : (
              <div className="neo-border bg-card flex h-14 w-14 items-center justify-center">
                <Sparkles className="text-primary h-6 w-6" />
              </div>
            )}
          </div>
          <h1 className="text-foreground mb-1 text-3xl font-black uppercase tracking-tight">
            {t.nfc.name}
          </h1>
          <p className="text-primary mb-4 text-sm font-bold uppercase tracking-[0.15em]">
            {t.nfc.role}
          </p>
          <div className="bg-border mx-auto mb-3 h-px w-12" />
          <p className="text-foreground/70 mb-1 text-xs font-black uppercase tracking-[0.15em]">
            MitzuStudios
          </p>
          <p className="text-muted-foreground mx-auto max-w-xs text-xs font-bold uppercase leading-relaxed tracking-wide">
            {t.nfc.tagline}
          </p>
        </AnimatedSection>

        {/* Services */}
        <AnimatedSection delay={100} className="mb-14">
          <div className="mb-5 flex items-center gap-3">
            <div className="bg-primary h-px flex-1" />
            <span className="text-muted-foreground text-xs font-black uppercase tracking-[0.2em]">
              {t.nfc.servicesTitle}
            </span>
            <div className="bg-primary h-px flex-1" />
          </div>

          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
            {t.services.items.map((service, index) => {
              const Icon = serviceIcons[index] || Code
              return (
                <div
                  key={service.title}
                  className="neo-card bg-card group flex flex-col items-center gap-2 p-3 text-center transition-all hover:-translate-y-1"
                >
                  <div className="bg-primary text-primary-foreground neo-border flex h-10 w-10 items-center justify-center shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-muted-foreground text-[10px] font-bold uppercase leading-tight tracking-wide">
                    {service.title}
                  </span>
                </div>
              )
            })}
          </div>
        </AnimatedSection>

        {/* Projects */}
        {projects.length > 0 && (
          <AnimatedSection delay={200} className="mb-14">
            <div className="mb-5 flex items-center gap-3">
              <div className="bg-primary h-px flex-1" />
              <span className="text-muted-foreground text-xs font-black uppercase tracking-[0.2em]">
                {t.nfc.projectsTitle}
              </span>
              <div className="bg-primary h-px flex-1" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {projects.map((project) => (
                <Link key={project.id} href={`/projects/${project.slug}`}>
                  <article className="neo-card bg-card group h-full overflow-hidden transition-all hover:-translate-y-1">
                    <div className="bg-muted relative aspect-video">
                      {project.imageUrl ? (
                        <Image
                          src={project.imageUrl}
                          alt={project.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, 50vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Code className="text-muted-foreground h-6 w-6" />
                        </div>
                      )}
                    </div>
                    <div className="neo-border border-t-3 border-b-0 border-l-0 border-r-0 p-3">
                      <h3 className="group-hover:text-primary truncate text-sm font-black uppercase tracking-wide transition-colors">
                        {project.title}
                      </h3>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            <div className="mt-4 text-center">
              <Link
                href="/projects"
                className="neo-button neo-button-secondary neo-shadow-sm inline-flex items-center gap-1 px-5 py-2 text-xs font-bold uppercase tracking-wide"
              >
                {t.projects.viewAll}
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </AnimatedSection>
        )}

        {/* CTA Buttons */}
        <AnimatedSection delay={300} className="mb-10 space-y-3">
          {whatsapp && (
            <a
              href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('whatsapp_click', { location: 'nfc' })}
              className="neo-button neo-button-secondary neo-shadow-sm flex w-full items-center justify-center gap-3 px-6 py-4 text-sm font-bold uppercase tracking-wide transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              <MessageCircle className="h-5 w-5" />
              {t.nfc.whatsapp}
            </a>
          )}

          {instagram && (
            <a
              href={`https://instagram.com/${instagram.replace(/^@/, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="neo-button neo-button-secondary neo-shadow-sm flex w-full items-center justify-center gap-3 px-6 py-4 text-sm font-bold uppercase tracking-wide transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              <Instagram className="h-5 w-5" />
              {t.nfc.instagram}
            </a>
          )}

          <Link
            href="/"
            className="neo-button neo-button-secondary neo-shadow-sm flex w-full items-center justify-center gap-3 px-6 py-4 text-sm font-bold uppercase tracking-wide transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            <Globe className="h-5 w-5" />
            {t.nfc.website}
          </Link>

          <Link
            href="/#contact"
            className="neo-button neo-button-primary neo-shadow-sm flex w-full items-center justify-center gap-3 px-6 py-4 text-sm font-bold uppercase tracking-wide transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            <Send className="h-5 w-5" />
            {t.nfc.quote}
          </Link>
        </AnimatedSection>

        {/* Footer */}
        <AnimatedSection delay={400}>
          <div className="border-border/30 text-muted-foreground flex flex-col items-center gap-2 border-t pt-6 text-center text-xs font-bold uppercase tracking-wide">
            {email && (
              <a
                href={`mailto:${email}`}
                className="hover:text-primary inline-flex items-center gap-1.5 transition-colors"
              >
                {t.nfc.contactEmail}: {email}
              </a>
            )}
            <p className="text-muted-foreground/50 text-[10px]">
              {t.footer.copyright}
            </p>
          </div>
        </AnimatedSection>
      </main>
    </div>
  )
}
