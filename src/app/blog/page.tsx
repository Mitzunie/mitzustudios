import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/db'
import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { SectionAnimation } from '@/components/shared/SectionAnimation'
import Image from 'next/image'
import { es, en, LOCALES } from '@/shared'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Artículos sobre desarrollo web, tecnología y proyectos',
  alternates: {
    canonical: '/blog',
  },
}

interface BlogPageProps {
  searchParams: Promise<{ locale?: string }>
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams
  const activeLocale = params.locale || 'es'
  const dict = activeLocale === 'en' ? en : es

  const where: Record<string, unknown> = { published: true }
  if (LOCALES.includes(activeLocale as typeof LOCALES[number])) {
    where.locale = activeLocale
  }

  const posts = await prisma.post.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      author: { select: { id: true, name: true, image: true } },
    },
  })

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        <section className="neo-border py-24">
          <div className="container-custom mx-auto px-4">
            <div className="mx-auto mb-8 max-w-2xl text-center">
              <SectionAnimation animation="fadeIn">
                <h1 className="neo-section-title mb-4">{dict.blog.title}</h1>
                <p className="text-muted-foreground text-lg font-bold uppercase tracking-wide">
                  {dict.blog.subtitle}
                </p>
              </SectionAnimation>
            </div>

            {/* Locale filter */}
            <div className="mb-12 flex justify-center gap-2">
              {LOCALES.map((loc) => (
                <Link
                  key={loc}
                  href={loc === 'es' ? '/blog' : `/blog?locale=${loc}`}
                  className={`neo-border px-4 py-2 text-sm font-bold uppercase tracking-wide transition-colors ${
                    activeLocale === loc
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card text-foreground hover:bg-muted'
                  }`}
                >
                  {loc === 'es' ? 'Español' : 'English'}
                </Link>
              ))}
            </div>

            {posts.length === 0 ? (
              <div className="text-muted-foreground text-center">
                <p>{dict.blog.noPosts}</p>
              </div>
            ) : (
              <>
                <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {posts.map((post, index) => (
                    <SectionAnimation key={post.id} animation="fadeIn" threshold={0.1 * (index + 1)}>
                      <Link href={`/blog/${post.slug}`} className="group block">
                        <article className="neo-border bg-card h-full transition-colors hover:bg-muted/50">
                          {post.imageUrl && (
                            <div className="relative aspect-video w-full overflow-hidden">
                              <Image
                                src={post.imageUrl}
                                alt={post.title}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                            </div>
                          )}
                          <div className="p-5">
                            <h2 className="mb-2 text-lg font-black uppercase tracking-wide group-hover:text-primary transition-colors">
                              {post.title}
                            </h2>
                            {post.excerpt && (
                              <p className="text-muted-foreground mb-4 text-sm font-bold uppercase tracking-wide line-clamp-2">
                                {post.excerpt}
                              </p>
                            )}
                            <div className="text-muted-foreground flex items-center gap-2 text-xs font-bold uppercase tracking-wide">
                              <span>
                                {dict.blog.by} {post.author.name || '—'}
                              </span>
                              <span>·</span>
                              <span>
                                {new Date(post.createdAt).toLocaleDateString(activeLocale === 'en' ? 'en-US' : 'es-CL', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </span>
                            </div>
                          </div>
                        </article>
                      </Link>
                    </SectionAnimation>
                  ))}
                </div>

                <div className="mt-16 text-center">
                  <Link
                    href="/"
                    className="neo-button neo-button-secondary neo-shadow-sm inline-flex items-center gap-2 px-8 py-3 text-base font-bold uppercase tracking-wide"
                  >
                    {dict.blog.backToBlog}
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
