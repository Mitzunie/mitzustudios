'use client'

import { useTranslations } from '@/hooks/useTranslations'

export function Footer() {
  const t = useTranslations()
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL

  return (
    <footer className="border-border/50 bg-background border-t" role="contentinfo">
      <div className="container-custom mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="gradient-text mb-3 text-lg font-bold">MitzuStudios</h3>
            <p className="text-muted-foreground text-sm">{t.footer.description}</p>
          </div>
          <div>
            <h3 className="mb-3 text-lg font-semibold">{t.nav.services}</h3>
            <ul className="text-muted-foreground space-y-2 text-sm">
              {t.services.items.map((item) => (
                <li key={item.title}>{item.title}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-lg font-semibold">{t.nav.contact}</h3>
            {contactEmail && (
              <ul className="text-muted-foreground space-y-2 text-sm">
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
        <div className="border-border/50 text-muted-foreground mt-8 border-t pt-8 text-center text-sm">
          <p>{t.footer.copyright}</p>
        </div>
      </div>
    </footer>
  )
}
