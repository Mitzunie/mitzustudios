import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/db'
import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { SectionAnimation } from '@/components/shared/SectionAnimation'
import Image from 'next/image'
import { es } from '@/shared'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Artículos sobre desarrollo web, tecnología y proyectos',
}

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
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
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <SectionAnimation animation="fadeIn">
                <h1 className="neo-section-title mb-4">{es.blog.title}</h1>
                <p className="text-muted-foreground text-lg font-bold uppercase tracking-wide">
                  {es.blog.subtitle}
                </p>
              </SectionAnimation>
            </div>

            {posts.length === 0 ? (
              <div className="text-muted-foreground text-center">
                <p>{es.blog.noPosts}</p>
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
                                {es.blog.by} {post.author.name || '—'}
                              </span>
                              <span>·</span>
                              <span>
                                {new Date(post.createdAt).toLocaleDateString('es-CL', {
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
                    Volver al inicio
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
