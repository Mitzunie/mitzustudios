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
    },
    {
      label: t.admin.dashboard.stats.unreadRequests,
      value: stats.unreadRequests,
      icon: Eye,
      color: 'text-yellow-500',
    },
    {
      label: t.admin.dashboard.stats.totalProjects,
      value: stats.totalProjects,
      icon: FolderKanban,
      color: 'text-purple-500',
    },
    {
      label: t.admin.dashboard.stats.publishedProjects,
      value: stats.publishedProjects,
      icon: FileText,
      color: 'text-green-500',
    },
  ]

  return (
    <div>
      <h1 className="mb-2 text-2xl font-black uppercase tracking-wide">{t.admin.dashboard.title}</h1>
      <p className="text-muted-foreground mb-8 font-bold uppercase tracking-wide">
        {t.admin.dashboard.welcome}, {user.name || user.email}
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="neo-card bg-card p-6">
            <div className="bg-card neo-border mb-4 inline-flex p-3">
              <card.icon className={`h-6 w-6 ${card.color}`} />
            </div>
            <p className="text-2xl font-black">{card.value}</p>
            <p className="text-muted-foreground text-sm font-bold uppercase tracking-wide">{card.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
