'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from '@/hooks/useTranslations'
import { ProjectForm } from '@/components/admin/ProjectForm'

export default function AdminNewProjectPage() {
  const t = useTranslations()

  return (
    <div>
      <Link
        href="/admin/projects"
        className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-2 text-sm transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {t.admin.projects.title}
      </Link>

      <h1 className="mb-6 text-2xl font-bold">{t.admin.projects.newProject}</h1>

      <div className="max-w-2xl">
        <ProjectForm />
      </div>
    </div>
  )
}
