'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import type { ProjectDTO } from '@/shared'
import { useTranslations } from '@/hooks/useTranslations'
import { ProjectForm } from '@/components/admin/ProjectForm'

export default function AdminEditProjectPage() {
  const params = useParams()
  const router = useRouter()
  const t = useTranslations()
  const [project, setProject] = useState<ProjectDTO | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/admin/projects/${params.id}`)
        if (!res.ok) throw new Error('Not found')
        const data = await res.json()
        if (data.success) {
          setProject(data.data)
        }
      } catch (error) {
        console.error('Error fetching project:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="neo-border border-primary h-8 w-8 animate-spin border-4 border-t-transparent bg-transparent" />
      </div>
    )
  }

  if (!project) {
    return <div className="text-muted-foreground py-20 text-center font-bold uppercase tracking-wide">Proyecto no encontrado</div>
  }

  return (
    <div>
      <button
        onClick={() => router.push('/admin/projects')}
        className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {t.admin.projects.title}
      </button>

      <h1 className="mb-6 text-2xl font-black uppercase tracking-wide">{t.admin.projects.editProject}</h1>

      <div className="max-w-2xl">
        <ProjectForm
          initialData={{
            id: project.id,
            title: project.title,
            description: project.description,
            status: project.status,
            imageUrl: project.imageUrl,
            technologies: project.technologies.map((t) => ({
              name: t.name,
              icon: t.icon,
              url: t.url || '',
            })),
          }}
        />
      </div>
    </div>
  )
}
