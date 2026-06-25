import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import { prisma } from '@/lib/db'
import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { MarkdownRenderer } from '@/components/shared/MarkdownRenderer'
import { es } from '@/shared'

export const dynamic = 'force-dynamic'

interface PostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await prisma.post.findUnique({
    where: { slug, published: true },
  })

  if (!post) return {}

  return {
    title: post.title,
    description: post.excerpt || post.title,
  }
}

export default async function PostDetailPage({ params }: PostPageProps) {
  const { slug } = await params
  const post = await prisma.post.findUnique({
    where: { slug, published: true },
    include: {
      author: { select: { id: true, name: true, image: true } },
    },
  })

  if (!post) {
    notFound()
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        <article className="container-custom mx-auto px-4 py-24">
          <Link
            href="/blog"
            className="text-muted-foreground hover:text-foreground mb-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {es.blog.backToBlog}
          </Link>

          <div className="mx-auto max-w-3xl">
            {/* Header */}
            <header className="mb-12">
              {post.imageUrl && (
                <div className="relative mb-8 aspect-video w-full overflow-hidden neo-border">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              <h1 className="neo-section-title mb-4 text-4xl">{post.title}</h1>

              <div className="text-muted-foreground flex items-center gap-2 text-sm font-bold uppercase tracking-wide">
                <span>
                  {es.blog.by} {post.author.name || '—'}
                </span>
                <span>·</span>
                <span>
                  {es.blog.publishedOn}{' '}
                  {new Date(post.createdAt).toLocaleDateString('es-CL', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>

              {post.excerpt && (
                <p className="text-muted-foreground mt-6 text-lg font-bold uppercase tracking-wide">
                  {post.excerpt}
                </p>
              )}
            </header>

            {/* Content */}
            <div className="prose prose-invert prose-lg max-w-none">
              <MarkdownRenderer content={post.content} />
            </div>

            <div className="mt-16 text-center">
              <Link
                href="/"
                className="neo-button neo-button-secondary neo-shadow-sm inline-flex items-center gap-2 px-8 py-3 text-base font-bold uppercase tracking-wide"
              >
                Volver al inicio
              </Link>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
