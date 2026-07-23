import type { Metadata } from 'next'

interface PageMetadataOptions {
  title: string
  description: string
  path: string
}

export function buildPageMetadata({ title, description, path }: PageMetadataOptions): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url: path,
      type: 'website',
      locale: 'es_CL',
      ...(process.env.NEXT_PUBLIC_SITE_LOGO_URL
        ? { images: [{ url: process.env.NEXT_PUBLIC_SITE_LOGO_URL }] }
        : {}),
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  }
}
