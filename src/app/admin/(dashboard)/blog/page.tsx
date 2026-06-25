'use client'

import Link from 'next/link'
import { Plus } from 'lucide-react'
import { useTranslations } from '@/hooks/useTranslations'
import { PostsTable } from '@/components/admin/PostsTable'

export default function AdminBlogPage() {
  const t = useTranslations()

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-black uppercase tracking-wide">{t.admin.blog.title}</h1>
        <Link
          href="/admin/blog/new"
          className="neo-button neo-button-primary neo-shadow-sm inline-flex items-center gap-2 px-4 py-2 text-sm"
        >
          <Plus className="h-4 w-4" />
          {t.admin.blog.newPost}
        </Link>
      </div>
      <PostsTable />
    </div>
  )
}
