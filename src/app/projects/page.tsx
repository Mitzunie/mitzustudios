import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { prisma } from '@/lib/db'
import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { SectionAnimation } from '@/components/shared/SectionAnimation'
import { buildPageMetadata } from '@/lib/metadata'
export const dynamic = 'force-dynamic'

const PROJECTS_PER_PAGE = 9

export const metadata: Metadata = buildPageMetadata({
  title: 'Todos los Proyectos',
  description:
    'Explora los proyectos web que he desarrollado: landing pages, tiendas online y apps a medida con Next.js y React. Cotiza tu proyecto y hagámoslo realidad.',
  path: '/projects',
})

interface ProjectsPageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const params = await searchParams
  const currentPage = Math.max(1, Number(params.page) || 1)

  const [projects, totalProjects] = await Promise.all([
    prisma.project.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' },
      skip: (currentPage - 1) * PROJECTS_PER_PAGE,
      take: PROJECTS_PER_PAGE,
      include: { technologies: true },
    }),
    prisma.project.count({
      where: { status: 'PUBLISHED' },
    }),
  ])

  const totalPages = Math.ceil(totalProjects / PROJECTS_PER_PAGE)

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        <section className="neo-border py-24">
          <div className="container-custom mx-auto px-4">
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <SectionAnimation animation="fadeIn">
                <h1 className="neo-section-title mb-4">Todos los Proyectos</h1>
                <p className="text-muted-foreground text-lg font-bold uppercase tracking-wide">
                  Explora todos los proyectos en los que he trabajado
                </p>
              </SectionAnimation>
            </div>

            {projects.length === 0 ? (
              <div className="text-muted-foreground text-center">
                <p>No hay proyectos publicados todavía.</p>
              </div>
            ) : (
              <>
                <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {projects.map((project, index) => (
                    <SectionAnimation key={project.id} animation="fadeIn" threshold={0.1 * (index + 1)}>
                      <ProjectCard
                        project={{
                          ...project,
                          status: project.status as 'PUBLISHED' | 'HIDDEN' | 'DRAFT',
                          technologies: project.technologies.map((t) => ({
                            ...t,
                            url: t.url,
                          })),
                          createdAt: project.createdAt.toISOString(),
                          updatedAt: project.updatedAt.toISOString(),
                        }}
                      />
                    </SectionAnimation>
                  ))}
                </div>

                {totalPages > 1 && (
                  <nav className="mt-16 flex items-center justify-center gap-2" aria-label="Paginación de proyectos">
                    {currentPage > 1 && (
                      <Link
                        href={`/projects?page=${currentPage - 1}`}
                        className="neo-button neo-button-secondary neo-shadow-sm inline-flex items-center gap-1 px-4 py-2 text-sm font-bold uppercase tracking-wide"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Anterior
                      </Link>
                    )}

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Link
                          key={page}
                          href={`/projects?page=${page}`}
                          className={`neo-border flex h-10 w-10 items-center justify-center text-sm font-bold uppercase tracking-wide transition-colors ${
                            page === currentPage
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-card text-foreground hover:bg-muted'
                          }`}
                        >
                          {page}
                        </Link>
                      ))}
                    </div>

                    {currentPage < totalPages && (
                      <Link
                        href={`/projects?page=${currentPage + 1}`}
                        className="neo-button neo-button-secondary neo-shadow-sm inline-flex items-center gap-1 px-4 py-2 text-sm font-bold uppercase tracking-wide"
                      >
                        Siguiente
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    )}
                  </nav>
                )}
              </>
            )}

            <div className="mt-16 text-center">
              <Link
                href="/"
                className="neo-button neo-button-secondary neo-shadow-sm inline-flex items-center gap-2 px-8 py-3 text-base font-bold uppercase tracking-wide"
              >
                Volver al inicio
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
