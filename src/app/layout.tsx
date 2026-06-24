import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata } from 'next'
import { GoogleAnalytics } from '@/components/shared/GoogleAnalytics'
import { SessionProvider } from '@/components/shared/SessionProvider'
import { OrganizationJsonLd, WebSiteJsonLd } from '@/components/landing/JsonLd'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'MitzuStudios | Desarrollo Web Profesional',
    template: '%s | MitzuStudios',
  },
  description:
    'Desarrollo web a medida. Transformamos tus ideas en software profesional. Landing pages, e-commerce, aplicaciones web y más.',
  keywords: [
    'desarrollo web',
    'landing page',
    'e-commerce',
    'aplicaciones web',
    'MitzuStudios',
    'programador freelance',
  ],
  authors: [{ name: 'MitzuStudios' }],
  metadataBase: new URL('https://mitzustudios.online'),
  openGraph: {
    title: 'MitzuStudios | Desarrollo Web Profesional',
    description: 'Desarrollo web a medida. Transformamos tus ideas en software profesional.',
    type: 'website',
    locale: 'es_CL',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <body className="bg-background text-foreground min-h-screen antialiased">
        <SessionProvider>{children}</SessionProvider>
        {process.env.NODE_ENV === 'production' && <GoogleAnalytics />}
        {process.env.NODE_ENV === 'production' && <SpeedInsights />}
        <OrganizationJsonLd />
        <WebSiteJsonLd />
      </body>
    </html>
  )
}
