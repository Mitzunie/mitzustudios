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

export const revalidate = 60

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = await prisma.project.findUnique({
    where: { slug, status: 'PUBLISHED' },
  })

  if (!project) return {}

  return {
    title: project.title,
    description: project.description,
    alternates: {
      canonical: `/projects/${slug}`,
    },
  }
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = await prisma.project.findUnique({
    where: { slug, status: 'PUBLISHED' },
    include: { technologies: true },
  })

  if (!project) {
    notFound()
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        <article className="container-custom mx-auto px-4 py-24">
          <Link
            href="/projects"
            className="text-muted-foreground hover:text-foreground mb-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {es.projects.backToProjects}
          </Link>

          {/* Header */}
          <header className="mb-12">
            {project.imageUrl && (
              <div className="relative mb-8 aspect-video w-full overflow-hidden neo-border">
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            <h1 className="neo-section-title mb-4 text-4xl">{project.title}</h1>
            <p className="text-muted-foreground mb-6 text-lg font-bold uppercase tracking-wide">
              {project.description}
            </p>

            {/* Technologies */}
            {project.technologies.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {project.technologies.map((tech) => (
                  <span
                    key={tech.id}
                    className="neo-border flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold uppercase tracking-wide"
                  >
                    <span>{tech.icon}</span>
                    <span>{tech.name}</span>
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Detailed content */}
          {project.content && (
            <div className="prose prose-invert prose-lg max-w-none">
              <MarkdownRenderer content={project.content} />
            </div>
          )}

          <div className="mt-16 text-center">
            <Link
              href="/"
              className="neo-button neo-button-secondary neo-shadow-sm inline-flex items-center gap-2 px-8 py-3 text-base font-bold uppercase tracking-wide"
            >
              Volver al inicio
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
