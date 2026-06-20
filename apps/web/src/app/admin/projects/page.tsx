'use client'

import Link from 'next/link'
import { Plus } from 'lucide-react'
import { useTranslations } from '@/hooks/useTranslations'
import { ProjectsTable } from '@/components/admin/ProjectsTable'

export default function AdminProjectsPage() {
  const t = useTranslations()

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t.admin.projects.title}</h1>
        <Link
          href="/admin/projects/new"
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors"
        >
          <Plus className="h-4 w-4" />
          {t.admin.projects.newProject}
        </Link>
      </div>
      <ProjectsTable />
    </div>
  )
}
