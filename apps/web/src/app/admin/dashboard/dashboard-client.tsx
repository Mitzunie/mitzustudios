'use client'

import { useTranslations } from '@/hooks/useTranslations'
import { MessageSquare, FolderKanban, Eye, FileText } from 'lucide-react'

interface DashboardClientProps {
  user: {
    name?: string | null
    email?: string | null
  }
  stats: {
    totalRequests: number
    unreadRequests: number
    totalProjects: number
    publishedProjects: number
  }
}

export function DashboardClient({ user, stats }: DashboardClientProps) {
  const t = useTranslations()

  const cards = [
    {
      label: t.admin.dashboard.stats.totalRequests,
      value: stats.totalRequests,
      icon: MessageSquare,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      label: t.admin.dashboard.stats.unreadRequests,
      value: stats.unreadRequests,
      icon: Eye,
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10',
    },
    {
      label: t.admin.dashboard.stats.totalProjects,
      value: stats.totalProjects,
      icon: FolderKanban,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
    },
    {
      label: t.admin.dashboard.stats.publishedProjects,
      value: stats.publishedProjects,
      icon: FileText,
      color: 'text-green-500',
      bg: 'bg-green-500/10',
    },
  ]

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">{t.admin.dashboard.title}</h1>
      <p className="text-muted-foreground mb-8">
        {t.admin.dashboard.welcome}, {user.name || user.email}
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="border-border/50 bg-card rounded-xl border p-6">
            <div className={`mb-4 inline-flex rounded-lg p-3 ${card.bg}`}>
              <card.icon className={`h-6 w-6 ${card.color}`} />
            </div>
            <p className="text-2xl font-bold">{card.value}</p>
            <p className="text-muted-foreground text-sm">{card.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
