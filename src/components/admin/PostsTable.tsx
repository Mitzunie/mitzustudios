'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2 } from 'lucide-react'
import type { PostDTO, PaginatedResponse } from '@/shared'
import { FilterBar } from './FilterBar'
import { useTranslations } from '@/hooks/useTranslations'

const filterOptions = [
  { value: '', label: 'Todos' },
  { value: 'true', label: 'Publicados' },
  { value: 'false', label: 'Borradores' },
]

export function PostsTable() {
  const router = useRouter()
  const t = useTranslations()
  const [posts, setPosts] = useState<PostDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filter) params.set('published', filter)
      params.set('page', '1')

      const res = await fetch(`/api/admin/posts?${params}`)
      if (!res.ok) throw new Error('Error fetching posts')

      const data: PaginatedResponse<PostDTO> = await res.json()
      if (data.success && data.data) {
        setPosts(data.data)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const handleDelete = async (id: string, title: string) => {
    if (
      !window.confirm(
        `${t.admin.blog.form.deleteConfirm}\n\n"${title}"\n\n${t.admin.blog.form.deleteDescription}`,
      )
    ) {
      return
    }

    try {
      const res = await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchPosts()
      }
    } catch (error) {
      console.error('Error deleting post:', error)
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
              t.admin.blog.filters[
                o.value === 'true'
                  ? 'published'
                  : o.value === 'false'
                    ? 'draft'
                    : ('all' as keyof typeof t.admin.blog.filters)
              ] || o.label,
          }))}
          activeFilter={filter}
          onFilterChange={setFilter}
        />
      </div>

      {posts.length === 0 ? (
        <div className="text-muted-foreground py-20 text-center font-bold uppercase tracking-wide">
          {t.admin.blog.noPosts}
        </div>
      ) : (
        <div className="neo-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="neo-border border-b-3 border-t-0 border-l-0 border-r-0 bg-muted/50">
                <th className="text-muted-foreground px-4 py-3 text-left font-black uppercase text-xs tracking-wide">
                  {t.admin.blog.table.title}
                </th>
                <th className="text-muted-foreground hidden px-4 py-3 text-left font-black uppercase text-xs tracking-wide sm:table-cell">
                  {t.admin.blog.table.author}
                </th>
                <th className="text-muted-foreground px-4 py-3 text-left font-black uppercase text-xs tracking-wide">
                  {t.admin.blog.table.status}
                </th>
                <th className="text-muted-foreground hidden px-4 py-3 text-left font-black uppercase text-xs tracking-wide sm:table-cell">
                  {t.admin.blog.table.date}
                </th>
                <th className="text-muted-foreground px-4 py-3 text-right font-black uppercase text-xs tracking-wide">
                  {t.admin.blog.table.actions}
                </th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr
                  key={post.id}
                  className="neo-border border-b-3 border-t-0 border-l-0 border-r-0 hover:bg-muted/30 transition-colors last:border-b-0"
                >
                  <td className="px-4 py-3 font-black uppercase tracking-wide text-sm">{post.title}</td>
                  <td className="text-muted-foreground hidden px-4 py-3 sm:table-cell font-bold uppercase tracking-wide text-xs">
                    {post.author.name || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 text-xs font-black uppercase tracking-wide ${
                        post.published
                          ? 'bg-green-900/30 text-green-400 border border-green-500/30'
                          : 'bg-yellow-900/30 text-yellow-400 border border-yellow-500/30'
                      }`}
                    >
                      {post.published
                        ? t.admin.blog.status.published
                        : t.admin.blog.status.draft}
                    </span>
                  </td>
                  <td className="text-muted-foreground hidden px-4 py-3 sm:table-cell font-bold uppercase tracking-wide text-xs">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => router.push(`/admin/blog/${post.id}`)}
                        className="text-muted-foreground hover:bg-secondary hover:text-foreground neo-border border-transparent hover:border-border p-2 transition-colors"
                        title={t.admin.common.edit}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive neo-border border-transparent hover:border-destructive p-2 transition-colors"
                        title={t.admin.common.delete}
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
