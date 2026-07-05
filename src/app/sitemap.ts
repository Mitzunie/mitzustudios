import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/db'

const BASE_URL = 'https://mitzustudios.online'

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
    { url: BASE_URL, changeFrequency: 'monthly' as const, priority: 1.0 },
    { url: `${BASE_URL}/projects`, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${BASE_URL}/blog`, changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${BASE_URL}/services`, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${BASE_URL}/about`, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${BASE_URL}/contact`, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${BASE_URL}/zeew-space`, changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${BASE_URL}/kamerrezz`, changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${BASE_URL}/nfc`, changeFrequency: 'monthly' as const, priority: 0.3 },
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
