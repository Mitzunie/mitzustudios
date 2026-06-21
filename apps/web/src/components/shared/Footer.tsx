'use client'

import { useTranslations } from '@/hooks/useTranslations'

export function Footer() {
  const t = useTranslations()
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL

  return (
    <footer className="neo-border bg-background" role="contentinfo">
      <div className="container-custom mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
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
            {contactEmail && (
              <ul className="text-muted-foreground space-y-2 text-sm font-bold uppercase tracking-wide">
                <li>
                  <a
                    href={`mailto:${contactEmail}`}
                    className="hover:text-primary transition-colors"
                  >
                    {contactEmail}
                  </a>
                </li>
              </ul>
            )}
          </div>
        </div>
        <div className="neo-border text-muted-foreground mt-8 border-t border-b-0 border-l-0 border-r-0 pt-8 text-center text-sm font-bold uppercase tracking-wide">
          <p>{t.footer.copyright}</p>
        </div>
      </div>
    </footer>
  )
}
