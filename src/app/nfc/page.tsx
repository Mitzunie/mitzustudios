import type { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { NfcClient } from '@/components/nfc/NfcClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'MitzuStudios | NFC',
  description:
    'Desarrollo web profesional. Transformamos tus ideas en software profesional.',
  openGraph: {
    title: 'MitzuStudios',
    description: 'Desarrollo web profesional. De tu idea a tu próxima web.',
  },
}

export default async function NfcPage() {
  const projects = await prisma.project.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { createdAt: 'desc' },
    take: 3,
    include: { technologies: true },
  })

  const serialized = projects.map((p) => ({
    ...p,
    status: p.status as 'PUBLISHED' | 'HIDDEN' | 'DRAFT',
    technologies: p.technologies.map((t) => ({ ...t, url: t.url })),
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }))

  return <NfcClient projects={serialized} />
}
