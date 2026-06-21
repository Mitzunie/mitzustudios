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
        <h1 className="text-2xl font-black uppercase tracking-wide">{t.admin.projects.title}</h1>
        <Link
          href="/admin/projects/new"
          className="neo-button neo-button-primary neo-shadow-sm inline-flex items-center gap-2 px-4 py-2 text-sm"
        >
          <Plus className="h-4 w-4" />
          {t.admin.projects.newProject}
        </Link>
      </div>
      <ProjectsTable />
    </div>
  )
}
