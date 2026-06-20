'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, X, Save, AlertCircle } from 'lucide-react'
import { useTranslations } from '@/hooks/useTranslations'
import { ImageUploadField } from './ImageUploadField'
import { cn } from '@/lib/utils'

interface TechnologyInput {
  name: string
  icon: string
  url: string
}

interface ProjectFormProps {
  initialData?: {
    id: string
    title: string
    description: string
    status: 'PUBLISHED' | 'HIDDEN' | 'DRAFT'
    imageUrl: string | null
    technologies: TechnologyInput[]
  }
}

export function ProjectForm({ initialData }: ProjectFormProps) {
  const router = useRouter()
  const t = useTranslations()
  const isEdit = !!initialData

  const [title, setTitle] = useState(initialData?.title || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [status, setStatus] = useState<'PUBLISHED' | 'HIDDEN' | 'DRAFT'>(
    initialData?.status || 'DRAFT',
  )
  const [technologies, setTechnologies] = useState<TechnologyInput[]>(
    initialData?.technologies || [{ name: '', icon: '', url: '' }],
  )
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [removeImage, setRemoveImage] = useState(false)
  const [currentImageUrl] = useState(initialData?.imageUrl || null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})

  const handleAddTechnology = () => {
    setTechnologies([...technologies, { name: '', icon: '', url: '' }])
  }

  const handleRemoveTechnology = (index: number) => {
    setTechnologies(technologies.filter((_, i) => i !== index))
  }

  const handleTechnologyChange = (index: number, field: keyof TechnologyInput, value: string) => {
    const updated = [...technologies]
    updated[index] = { ...updated[index], [field]: value }
    setTechnologies(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setFieldErrors({})

    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('status', status)
    formData.append(
      'technologies',
      JSON.stringify(
        technologies
          .filter((t) => t.name && t.icon)
          .map((t) => ({
            name: t.name,
            icon: t.icon,
            url: t.url || undefined,
          })),
      ),
    )

    if (imageFile) {
      formData.append('image', imageFile)
    }

    if (isEdit && removeImage) {
      formData.append('removeImage', 'true')
    }

    try {
      const url = isEdit ? `/api/admin/projects/${initialData!.id}` : '/api/admin/projects'

      const method = isEdit ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.error?.fieldErrors) {
          setFieldErrors(data.error.fieldErrors)
        }
        setError(data.error?.message || t.admin.projects.form.error)
        setSaving(false)
        return
      }

      router.push('/admin/projects')
      router.refresh()
    } catch {
      setError(t.admin.projects.form.error)
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="title" className="mb-2 block text-sm font-medium">
          {t.admin.projects.form.title} <span className="text-destructive">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t.admin.projects.form.titlePlaceholder}
          className={cn(
            'bg-card w-full rounded-lg border px-4 py-2.5 text-sm transition-colors',
            'focus:ring-ring focus:outline-none focus:ring-2',
            fieldErrors.title ? 'border-destructive' : 'border-input',
          )}
          required
        />
        {fieldErrors.title && (
          <p className="text-destructive mt-1.5 text-xs">{fieldErrors.title[0]}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="mb-2 block text-sm font-medium">
          {t.admin.projects.form.description} <span className="text-destructive">*</span>
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t.admin.projects.form.descriptionPlaceholder}
          rows={5}
          className={cn(
            'bg-card w-full resize-y rounded-lg border px-4 py-2.5 text-sm transition-colors',
            'focus:ring-ring focus:outline-none focus:ring-2',
            fieldErrors.description ? 'border-destructive' : 'border-input',
          )}
          required
        />
        {fieldErrors.description && (
          <p className="text-destructive mt-1.5 text-xs">{fieldErrors.description[0]}</p>
        )}
      </div>

      {/* Technologies */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          {t.admin.projects.form.technologies} <span className="text-destructive">*</span>
        </label>
        <div className="space-y-3">
          {technologies.map((tech, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="grid flex-1 grid-cols-3 gap-2">
                <input
                  type="text"
                  value={tech.name}
                  onChange={(e) => handleTechnologyChange(index, 'name', e.target.value)}
                  placeholder={t.admin.projects.form.technologyName}
                  className="border-input bg-card focus:ring-ring rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                />
                <input
                  type="text"
                  value={tech.icon}
                  onChange={(e) => handleTechnologyChange(index, 'icon', e.target.value)}
                  placeholder={t.admin.projects.form.technologyIcon}
                  className="border-input bg-card focus:ring-ring rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                />
                <input
                  type="url"
                  value={tech.url}
                  onChange={(e) => handleTechnologyChange(index, 'url', e.target.value)}
                  placeholder={t.admin.projects.form.technologyUrl}
                  className="border-input bg-card focus:ring-ring rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                />
              </div>
              {technologies.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveTechnology(index)}
                  className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-lg p-2 transition-colors"
                  aria-label={t.admin.projects.form.removeTechnology}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
          {fieldErrors.technologies && (
            <p className="text-destructive text-xs">{fieldErrors.technologies[0]}</p>
          )}
        </div>
        <button
          type="button"
          onClick={handleAddTechnology}
          className="text-muted-foreground hover:bg-secondary hover:text-foreground mt-2 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors"
        >
          <Plus className="h-4 w-4" />
          {t.admin.projects.form.addTechnology}
        </button>
      </div>

      {/* Image */}
      <ImageUploadField
        currentImageUrl={removeImage ? null : currentImageUrl}
        onImageSelect={(file) => {
          setImageFile(file)
          setRemoveImage(false)
        }}
        onRemoveImage={() => {
          setImageFile(null)
          setRemoveImage(true)
        }}
        error={fieldErrors.imageUrl?.[0]}
      />

      {/* Status */}
      <div>
        <label htmlFor="status" className="mb-2 block text-sm font-medium">
          {t.admin.projects.form.status}
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as 'PUBLISHED' | 'HIDDEN' | 'DRAFT')}
          className="border-input bg-card focus:ring-ring w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
        >
          <option value="DRAFT">{t.admin.projects.status.draft}</option>
          <option value="PUBLISHED">{t.admin.projects.status.published}</option>
          <option value="HIDDEN">{t.admin.projects.status.hidden}</option>
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="border-destructive/50 bg-destructive/10 text-destructive flex items-start gap-2 rounded-lg border p-3 text-sm">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Submit */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className={cn(
            'inline-flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold transition-all',
            saving
              ? 'bg-primary/50 cursor-not-allowed'
              : 'bg-primary text-primary-foreground hover:bg-primary/90',
          )}
        >
          {saving ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              {isEdit ? t.admin.projects.form.updating : t.admin.projects.form.creating}
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {isEdit ? t.admin.projects.form.update : t.admin.projects.form.create}
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/projects')}
          className="border-border hover:bg-secondary rounded-lg border px-6 py-2.5 text-sm font-medium transition-colors"
        >
          {t.admin.projects.form.cancel}
        </button>
      </div>
    </form>
  )
}
