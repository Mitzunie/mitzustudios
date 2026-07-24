'use client'

import { MessageCircle, Instagram, Mail, ExternalLink } from 'lucide-react'
import { useTranslations } from '@/hooks/useTranslations'
import { trackEvent } from '@/lib/analytics'

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP || '56921935205'
const INSTAGRAM_HANDLE = process.env.NEXT_PUBLIC_INSTAGRAM || 'mitzustudios.online'

export function Footer() {
  const t = useTranslations()

  return (
    <footer className="neo-border bg-background" role="contentinfo">
      <div className="container-custom mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-primary mb-3 text-lg font-black uppercase tracking-wide">MitzuStudios</h3>
            <p className="text-muted-foreground text-sm font-bold uppercase tracking-wide">{t.footer.description}</p>
          </div>
          <div>
            <h3 className="mb-3 text-base font-black uppercase tracking-wide">{t.nav.services}</h3>
            <ul className="text-muted-foreground space-y-2 text-sm font-bold uppercase tracking-wide">
              {t.services.items.map((item) => (
                <li key={item.title}>{item.title}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-base font-black uppercase tracking-wide">{t.nav.contact}</h3>
            <div className="flex flex-col gap-2">
              <a
                href="mailto:team@mitzustudios.online"
                className="neo-button neo-button-secondary neo-shadow-sm inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wide transition-all hover:-translate-y-0.5"
              >
                <Mail className="h-4 w-4 shrink-0" />
                team@mitzustudios.online
              </a>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('whatsapp_click', { location: 'footer' })}
                className="neo-button neo-button-secondary neo-shadow-sm inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wide transition-all hover:-translate-y-0.5"
              >
                <MessageCircle className="h-4 w-4 shrink-0" />
                WhatsApp
              </a>
              <a
                href={`https://instagram.com/${INSTAGRAM_HANDLE.replace(/^@/, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="neo-button neo-button-secondary neo-shadow-sm inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wide transition-all hover:-translate-y-0.5"
              >
                <Instagram className="h-4 w-4 shrink-0" />
                Instagram
              </a>
            </div>
          </div>
          <div>
            <h3 className="mb-3 text-base font-black uppercase tracking-wide">{t.footer.partners}</h3>
            <ul className="text-muted-foreground space-y-2 text-sm font-bold uppercase tracking-wide">
              <li>
                <a
                  href="/zeew-space"
                  className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
                >
                  <ExternalLink className="h-3 w-3" />
                  Zeew Space
                </a>
              </li>
              <li>
                <a
                  href="/kamerrezz"
                  className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
                >
                  <ExternalLink className="h-3 w-3" />
                  KamerrEzz
                </a>
              </li>
              <li>
                <a
                  href="/nfc"
                  className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
                >
                  <ExternalLink className="h-3 w-3" />
                  Tarjeta NFC
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="neo-border text-muted-foreground mt-8 border-t border-b-0 border-l-0 border-r-0 py-8 text-center text-sm font-bold uppercase tracking-wide">
          <p>{t.footer.copyright}</p>
        </div>
      </div>
    </footer>
  )
}
