'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from '@/hooks/useTranslations'
import { PostForm } from '@/components/admin/PostForm'

export default function AdminNewPostPage() {
  const t = useTranslations()

  return (
    <div>
      <Link
        href="/admin/blog"
        className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {t.admin.blog.title}
      </Link>

      <h1 className="mb-6 text-2xl font-black uppercase tracking-wide">{t.admin.blog.newPost}</h1>

      <div className="max-w-3xl">
        <PostForm />
      </div>
    </div>
  )
}
