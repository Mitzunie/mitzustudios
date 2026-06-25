'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, X, Save, AlertCircle } from 'lucide-react'
import { useTranslations } from '@/hooks/useTranslations'
import { getTechIcon } from '@/shared'
import { ImageUploadField } from './ImageUploadField'
import { MarkdownEditor } from '@/components/shared/MarkdownEditor'
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
    content: string | null
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
  const [content, setContent] = useState(initialData?.content || '')
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
    if (field === 'name') {
      updated[index].icon = getTechIcon(value)
    }
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
    if (content) formData.append('content', content)
    formData.append('status', status)
    formData.append(
      'technologies',
      JSON.stringify(
        technologies
          .filter((t) => t.name)
          .map((t) => ({
            name: t.name,
            icon: t.icon || getTechIcon(t.name),
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
        <label htmlFor="title" className="mb-2 block text-sm font-black uppercase tracking-wide">
          {t.admin.projects.form.title} <span className="text-destructive">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t.admin.projects.form.titlePlaceholder}
          className={cn(
            'neo-input w-full px-4 py-2.5 text-sm font-bold uppercase tracking-wide',
            fieldErrors.title ? 'border-destructive' : '',
          )}
          required
        />
        {fieldErrors.title && (
          <p className="text-destructive mt-1.5 text-xs font-bold uppercase">{fieldErrors.title[0]}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="mb-2 block text-sm font-black uppercase tracking-wide">
          {t.admin.projects.form.description} <span className="text-destructive">*</span>
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t.admin.projects.form.descriptionPlaceholder}
          rows={5}
          className={cn(
            'neo-input w-full resize-y px-4 py-2.5 text-sm font-bold uppercase tracking-wide',
            fieldErrors.description ? 'border-destructive' : '',
          )}
          required
        />
        {fieldErrors.description && (
          <p className="text-destructive mt-1.5 text-xs font-bold uppercase">{fieldErrors.description[0]}</p>
        )}
      </div>

      {/* Content (Markdown) */}
      <div>
        <MarkdownEditor
          value={content}
          onChange={setContent}
          minHeight={400}
          label={t.admin.projects.form.content}
        />
      </div>

      {/* Technologies */}
      <div>
        <label className="mb-2 block text-sm font-black uppercase tracking-wide">
          {t.admin.projects.form.technologies} <span className="text-destructive">*</span>
        </label>
        <div className="space-y-3">
          {technologies.map((tech, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="grid flex-1 grid-cols-[1fr_1fr] gap-2">
                <div className="relative">
                  <input
                    type="text"
                    value={tech.name}
                    onChange={(e) => handleTechnologyChange(index, 'name', e.target.value)}
                    placeholder={t.admin.projects.form.technologyName}
                    className="neo-input w-full px-3 py-2 pr-8 text-sm font-bold uppercase tracking-wide"
                  />
                  {tech.name && (
                    <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-sm">
                      {tech.icon || getTechIcon(tech.name)}
                    </span>
                  )}
                </div>
                <input
                  type="url"
                  value={tech.url}
                  onChange={(e) => handleTechnologyChange(index, 'url', e.target.value)}
                  placeholder={t.admin.projects.form.technologyUrl}
                  className="neo-input px-3 py-2 text-sm font-bold uppercase tracking-wide"
                />
              </div>
              {technologies.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveTechnology(index)}
                  className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive neo-border border-transparent hover:border-destructive p-2 transition-colors"
                  aria-label={t.admin.projects.form.removeTechnology}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
          {fieldErrors.technologies && (
            <p className="text-destructive text-xs font-bold uppercase">{fieldErrors.technologies[0]}</p>
          )}
        </div>
        <button
          type="button"
          onClick={handleAddTechnology}
          className="text-muted-foreground hover:bg-secondary hover:text-foreground neo-border border-transparent hover:border-border mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold uppercase tracking-wide transition-colors"
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
        <label htmlFor="status" className="mb-2 block text-sm font-black uppercase tracking-wide">
          {t.admin.projects.form.status}
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as 'PUBLISHED' | 'HIDDEN' | 'DRAFT')}
          className="neo-input w-full px-4 py-2.5 text-sm font-bold uppercase tracking-wide"
        >
          <option value="DRAFT">{t.admin.projects.status.draft}</option>
          <option value="PUBLISHED">{t.admin.projects.status.published}</option>
          <option value="HIDDEN">{t.admin.projects.status.hidden}</option>
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="neo-border border-destructive bg-destructive/10 text-destructive flex items-start gap-2 p-3 text-sm font-bold">
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
            'neo-button neo-button-primary neo-shadow-sm inline-flex items-center gap-2 px-6 py-2.5 text-sm',
            saving ? 'cursor-not-allowed opacity-60' : '',
          )}
        >
          {saving ? (
            <>
              <div className="h-4 w-4 animate-spin border-2 border-current border-t-transparent" />
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
          className="neo-border border-border hover:bg-secondary px-6 py-2.5 text-sm font-bold uppercase tracking-wide transition-colors"
        >
          {t.admin.projects.form.cancel}
        </button>
      </div>
    </form>
  )
}
