'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2 } from 'lucide-react'
import type { ProjectDTO, PaginatedResponse } from '@/shared'
import { StatusBadge } from './StatusBadge'
import { FilterBar } from './FilterBar'
import { useTranslations } from '@/hooks/useTranslations'

const filterOptions = [
  { value: '', label: 'Todos' },
  { value: 'PUBLISHED', label: 'Publicados' },
  { value: 'HIDDEN', label: 'Ocultos' },
  { value: 'DRAFT', label: 'Borradores' },
]

export function ProjectsTable() {
  const router = useRouter()
  const t = useTranslations()
  const [projects, setProjects] = useState<ProjectDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  const fetchProjects = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filter) params.set('status', filter)
      params.set('page', '1')

      const res = await fetch(`/api/admin/projects?${params}`)
      if (!res.ok) throw new Error('Error fetching projects')

      const data: PaginatedResponse<ProjectDTO> = await res.json()
      if (data.success && data.data) {
        setProjects(data.data)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const handleDelete = async (id: string, title: string) => {
    if (
      !window.confirm(
        `${t.admin.projects.form.deleteConfirm}\n\n"${title}"\n\n${t.admin.projects.form.deleteDescription}`,
      )
    ) {
      return
    }

    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        fetchProjects()
      }
    } catch (error) {
      console.error('Error deleting project:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="neo-border border-primary h-8 w-8 animate-spin border-4 border-t-transparent bg-transparent" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <FilterBar
          options={filterOptions.map((o) => ({
            ...o,
            label:
              t.admin.projects.filters[
                o.value.toLowerCase() as keyof typeof t.admin.projects.filters
              ] || o.label,
          }))}
          activeFilter={filter}
          onFilterChange={setFilter}
        />
      </div>

      {projects.length === 0 ? (
        <div className="text-muted-foreground py-20 text-center font-bold uppercase tracking-wide">
          {t.admin.projects.noProjects}
        </div>
      ) : (
        <div className="neo-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="neo-border border-b-3 border-t-0 border-l-0 border-r-0 bg-muted/50">
                <th className="text-muted-foreground px-4 py-3 text-left font-black uppercase text-xs tracking-wide">
                  {t.admin.projects.table.title}
                </th>
                <th className="text-muted-foreground px-4 py-3 text-left font-black uppercase text-xs tracking-wide">
                  {t.admin.projects.table.status}
                </th>
                <th className="text-muted-foreground hidden px-4 py-3 text-left font-black uppercase text-xs tracking-wide lg:table-cell">
                  {t.admin.projects.table.technologies}
                </th>
                <th className="text-muted-foreground hidden px-4 py-3 text-left font-black uppercase text-xs tracking-wide sm:table-cell">
                  {t.admin.projects.table.date}
                </th>
                <th className="text-muted-foreground px-4 py-3 text-right font-black uppercase text-xs tracking-wide">
                  {t.admin.projects.table.actions}
                </th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr
                  key={project.id}
                  className="neo-border border-b-3 border-t-0 border-l-0 border-r-0 hover:bg-muted/30 transition-colors last:border-b-0"
                >
                  <td className="px-4 py-3 font-black uppercase tracking-wide text-sm">{project.title}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={project.status} variant="project" />
                  </td>
                  <td className="text-muted-foreground hidden px-4 py-3 lg:table-cell">
                    <div className="flex flex-wrap gap-1 font-bold uppercase tracking-wide text-xs">
                      {project.technologies.slice(0, 3).map((t) => (
                        <span key={t.id} className="text-xs">
                          {t.icon} {t.name}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="text-muted-foreground text-xs font-bold">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="text-muted-foreground hidden px-4 py-3 sm:table-cell font-bold uppercase tracking-wide text-xs">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => router.push(`/admin/projects/${project.id}`)}
                        className="text-muted-foreground hover:bg-secondary hover:text-foreground neo-border border-transparent hover:border-border p-2 transition-colors"
                        title={t.admin.projects.form.title}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id, project.title)}
                        className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive neo-border border-transparent hover:border-destructive p-2 transition-colors"
                        title={t.admin.projects.form.delete}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
