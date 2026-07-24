import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/db'

const BASE_URL = 'https://mitzustudios.online'

// Fixed date for static pages (content that rarely changes) instead of a dynamic
// `new Date()` call, so this route stays cache/build-stable.
const STATIC_PAGES_LAST_MODIFIED = new Date('2026-07-23')

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, posts] = await Promise.all([
    prisma.project.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true, updatedAt: true },
    }),
    prisma.post.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    }),
  ])

  const staticPages = [
    { url: BASE_URL, lastModified: STATIC_PAGES_LAST_MODIFIED, changeFrequency: 'monthly' as const, priority: 1.0 },
    { url: `${BASE_URL}/projects`, lastModified: STATIC_PAGES_LAST_MODIFIED, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${BASE_URL}/blog`, lastModified: STATIC_PAGES_LAST_MODIFIED, changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${BASE_URL}/services`, lastModified: STATIC_PAGES_LAST_MODIFIED, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${BASE_URL}/about`, lastModified: STATIC_PAGES_LAST_MODIFIED, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${BASE_URL}/contact`, lastModified: STATIC_PAGES_LAST_MODIFIED, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${BASE_URL}/zeew-space`, lastModified: STATIC_PAGES_LAST_MODIFIED, changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${BASE_URL}/kamerrezz`, lastModified: STATIC_PAGES_LAST_MODIFIED, changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${BASE_URL}/nfc`, lastModified: STATIC_PAGES_LAST_MODIFIED, changeFrequency: 'monthly' as const, priority: 0.3 },
  ]

  const projectPages = projects.map((project) => ({
    url: `${BASE_URL}/projects/${project.slug}`,
    lastModified: project.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const blogPages = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  return [...staticPages, ...projectPages, ...blogPages]
}
