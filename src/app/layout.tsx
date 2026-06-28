import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata } from 'next'
import Script from 'next/script'
import { GoogleAnalytics } from '@/components/shared/GoogleAnalytics'
import { SessionProvider } from '@/components/shared/SessionProvider'
import { OrganizationJsonLd, WebSiteJsonLd } from '@/components/landing/JsonLd'
import './globals.css'

const GTM_ID = 'GTM-TWTZBHR3'

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
      <head>
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      </head>
      <body className="bg-background text-foreground min-h-screen antialiased">
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <SessionProvider>{children}</SessionProvider>
        {process.env.NODE_ENV === 'production' && <GoogleAnalytics />}
        {process.env.NODE_ENV === 'production' && <SpeedInsights />}
        <OrganizationJsonLd />
        <WebSiteJsonLd />
      </body>
    </html>
  )
}
