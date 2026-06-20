'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, X, AlertCircle } from 'lucide-react'
import { useTranslations } from '@/hooks/useTranslations'
import { cn } from '@/lib/utils'

interface ImageUploadFieldProps {
  currentImageUrl?: string | null
  onImageSelect: (file: File | null) => void
  onRemoveImage: () => void
  error?: string
}

export function ImageUploadField({
  currentImageUrl,
  onImageSelect,
  onRemoveImage,
  error,
}: ImageUploadFieldProps) {
  const t = useTranslations()
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [selected, setSelected] = useState<boolean>(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      alert('La imagen supera el tamaño máximo de 10MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      setPreview(event.target?.result as string)
    }
    reader.readAsDataURL(file)
    setSelected(true)
    onImageSelect(file)
  }

  const handleRemove = () => {
    setPreview(null)
    setSelected(false)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
    onRemoveImage()
  }

  const displayImage = preview || currentImageUrl

  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{t.admin.projects.form.image}</label>

      {displayImage && !error ? (
        <div className="border-border/50 relative mb-4 overflow-hidden rounded-lg border">
          <div className="relative aspect-video w-full max-w-md">
            <Image
              src={displayImage}
              alt={t.admin.projects.form.currentImage}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="bg-destructive/80 hover:bg-destructive absolute right-2 top-2 rounded-full p-1.5 text-white transition-colors"
            aria-label={t.admin.projects.form.removeImage}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className={cn(
            'mb-4 flex aspect-video w-full max-w-md cursor-pointer items-center justify-center rounded-lg border-2 border-dashed transition-colors',
            error
              ? 'border-destructive/50 bg-destructive/5'
              : 'border-border/50 hover:border-primary/50 hover:bg-primary/5',
          )}
        >
          <div className="text-center">
            <Upload className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
            <p className="text-muted-foreground text-sm">
              {t.admin.projects.form.imagePlaceholder}
            </p>
            <p className="text-muted-foreground/50 text-xs">Máximo 10MB</p>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        onChange={handleFileChange}
        className="hidden"
        aria-label={t.admin.projects.form.imagePlaceholder}
      />

      {!displayImage && !selected && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="border-border hover:bg-secondary rounded-lg border px-4 py-2 text-sm transition-colors"
        >
          {t.admin.projects.form.imagePlaceholder}
        </button>
      )}

      {error && (
        <p className="text-destructive mt-1.5 flex items-center gap-1.5 text-xs">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  )
}
