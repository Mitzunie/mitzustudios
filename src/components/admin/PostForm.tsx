'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, AlertCircle } from 'lucide-react'
import { useTranslations } from '@/hooks/useTranslations'
import { ImageUploadField } from './ImageUploadField'
import { MarkdownEditor } from '@/components/shared/MarkdownEditor'
import { cn } from '@/lib/utils'

interface PostFormProps {
  initialData?: {
    id: string
    title: string
    excerpt: string | null
    content: string
    published: boolean
    imageUrl: string | null
  }
}

export function PostForm({ initialData }: PostFormProps) {
  const router = useRouter()
  const t = useTranslations()
  const isEdit = !!initialData

  const [title, setTitle] = useState(initialData?.title || '')
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '')
  const [content, setContent] = useState(initialData?.content || '')
  const [published, setPublished] = useState(initialData?.published ?? true)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [removeImage, setRemoveImage] = useState(false)
  const [currentImageUrl] = useState(initialData?.imageUrl || null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setFieldErrors({})

    const formData = new FormData()
    formData.append('title', title)
    if (excerpt) formData.append('excerpt', excerpt)
    formData.append('content', content)
    formData.append('published', String(published))

    if (imageFile) {
      formData.append('image', imageFile)
    }

    if (isEdit && removeImage) {
      formData.append('removeImage', 'true')
    }

    try {
      const url = isEdit ? `/api/admin/posts/${initialData!.id}` : '/api/admin/posts'
      const method = isEdit ? 'PATCH' : 'POST'

      const res = await fetch(url, { method, body: formData })
      const data = await res.json()

      if (!res.ok) {
        if (data.error?.fieldErrors) {
          setFieldErrors(data.error.fieldErrors)
        }
        setError(data.error?.message || t.admin.blog.form.error)
        setSaving(false)
        return
      }

      router.push('/admin/blog')
      router.refresh()
    } catch {
      setError(t.admin.blog.form.error)
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="title" className="mb-2 block text-sm font-black uppercase tracking-wide">
          {t.admin.blog.form.title} <span className="text-destructive">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t.admin.blog.form.titlePlaceholder}
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

      {/* Excerpt */}
      <div>
        <label htmlFor="excerpt" className="mb-2 block text-sm font-black uppercase tracking-wide">
          {t.admin.blog.form.excerpt}
        </label>
        <textarea
          id="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder={t.admin.blog.form.excerptPlaceholder}
          rows={3}
          className={cn(
            'neo-input w-full resize-y px-4 py-2.5 text-sm font-bold uppercase tracking-wide',
            fieldErrors.excerpt ? 'border-destructive' : '',
          )}
        />
        {fieldErrors.excerpt && (
          <p className="text-destructive mt-1.5 text-xs font-bold uppercase">{fieldErrors.excerpt[0]}</p>
        )}
      </div>

      {/* Content (Markdown) */}
      <div>
        <MarkdownEditor
          value={content}
          onChange={(val) => setContent(val)}
          minHeight={500}
          label={t.admin.blog.form.content}
        />
        {fieldErrors.content && (
          <p className="text-destructive mt-1.5 text-xs font-bold uppercase">{fieldErrors.content[0]}</p>
        )}
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

      {/* Published toggle */}
      <div>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="neo-border h-5 w-5 accent-primary"
          />
          <span className="text-sm font-black uppercase tracking-wide">
            {t.admin.blog.form.published}
          </span>
        </label>
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
              {isEdit ? t.admin.blog.form.updating : t.admin.blog.form.creating}
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {isEdit ? t.admin.blog.form.update : t.admin.blog.form.create}
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/blog')}
          className="neo-border border-border hover:bg-secondary px-6 py-2.5 text-sm font-bold uppercase tracking-wide transition-colors"
        >
          {t.admin.blog.form.cancel}
        </button>
      </div>
    </form>
  )
}
