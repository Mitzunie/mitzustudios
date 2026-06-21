import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { DashboardClient } from './dashboard-client'

export const dynamic = 'force-dynamic'

async function getStats() {
  const [totalRequests, unreadRequests, totalProjects, publishedProjects] = await Promise.all([
    prisma.serviceRequest.count(),
    prisma.serviceRequest.count({ where: { status: 'UNREAD' } }),
    prisma.project.count(),
    prisma.project.count({ where: { status: 'PUBLISHED' } }),
  ])

  return { totalRequests, unreadRequests, totalProjects, publishedProjects }
}

export default async function AdminDashboardPage() {
  const session = await auth()
  if (!session?.user) {
    redirect('/admin/login')
  }

  const stats = await getStats()

  return <DashboardClient user={session.user} stats={stats} />
}
