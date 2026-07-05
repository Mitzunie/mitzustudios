'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import type { PostDTO } from '@/shared'
import { useTranslations } from '@/hooks/useTranslations'
import { PostForm } from '@/components/admin/PostForm'

export default function AdminEditPostPage() {
  const params = useParams()
  const router = useRouter()
  const t = useTranslations()
  const [post, setPost] = useState<PostDTO | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/admin/posts/${params.id}`)
        if (!res.ok) throw new Error('Not found')
        const data = await res.json()
        if (data.success) {
          setPost(data.data)
        }
      } catch (error) {
        console.error('Error fetching post:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="neo-border border-primary h-8 w-8 animate-spin border-4 border-t-transparent bg-transparent" />
      </div>
    )
  }

  if (!post) {
    return <div className="text-muted-foreground py-20 text-center font-bold uppercase tracking-wide">Artículo no encontrado</div>
  }

  return (
    <div>
      <button
        onClick={() => router.push('/admin/blog')}
        className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {t.admin.blog.title}
      </button>

      <h1 className="mb-6 text-2xl font-black uppercase tracking-wide">{t.admin.blog.editPost}</h1>

      <div className="max-w-3xl">
        <PostForm
          initialData={{
            id: post.id,
            title: post.title,
            excerpt: post.excerpt,
            content: post.content,
            published: post.published,
            imageUrl: post.imageUrl,
            locale: post.locale,
          }}
        />
      </div>
    </div>
  )
}
