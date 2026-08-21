import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/db'
import { SectionAnimation } from '@/components/shared/SectionAnimation'
import { es } from '@/shared'

export async function BlogSection() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    take: 3,
    include: {
      author: { select: { id: true, name: true, image: true } },
    },
  })

  const totalPosts = await prisma.post.count({
    where: { published: true },
  })

  if (posts.length === 0) return null

  return (
    <section id="blog" className="neo-border py-24">
      <div className="container-custom mx-auto px-4">
        <SectionAnimation animation="fadeIn">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="neo-section-title mb-4">{es.blog.title}</h2>
            <p className="text-muted-foreground text-lg font-bold tracking-wide uppercase">
              {es.blog.subtitle}
            </p>
          </div>
        </SectionAnimation>

        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <SectionAnimation key={post.id} animation="fadeIn" delay={0.1 * (index + 1)}>
              <Link href={`/blog/${post.slug}`} className="group block h-full">
                <article className="neo-border bg-card hover:bg-muted/50 flex h-full flex-col transition-colors">
                  {post.imageUrl ? (
                    <div className="relative aspect-video w-full overflow-hidden">
                      <Image
                        src={post.imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="bg-muted flex aspect-video items-center justify-center">
                      <span className="text-4xl">📝</span>
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="group-hover:text-primary mb-2 text-lg font-black tracking-wide uppercase transition-colors">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-muted-foreground mb-4 line-clamp-2 text-sm font-bold tracking-wide uppercase">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="text-muted-foreground mt-auto flex items-center gap-2 text-xs font-bold tracking-wide uppercase">
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

        {totalPosts > 3 && (
          <SectionAnimation animation="fadeIn" delay={0.1 * (posts.length + 1)}>
            <div className="mt-12 text-center">
              <Link
                href="/blog"
                className="neo-button neo-button-secondary neo-shadow-sm inline-flex items-center gap-2 px-8 py-3 text-base font-bold tracking-wide uppercase"
              >
                {es.blog.viewAll}
              </Link>
            </div>
          </SectionAnimation>
        )}
      </div>
    </section>
  )
}
