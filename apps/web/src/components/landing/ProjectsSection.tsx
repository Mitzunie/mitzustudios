import Link from 'next/link'
import { prisma } from '@/lib/db'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { ProjectsSectionHeader } from '@/components/projects/ProjectsSectionHeader'
import { SectionAnimation } from '@/components/shared/SectionAnimation'

export async function ProjectsSection() {
  const projects = await prisma.project.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { createdAt: 'desc' },
    take: 3,
    include: { technologies: true },
  })

  const totalProjects = await prisma.project.count({
    where: { status: 'PUBLISHED' },
  })

  return (
    <section id="projects" className="neo-border py-24">
      <div className="container-custom mx-auto px-4">
        <SectionAnimation animation="fadeIn">
          <ProjectsSectionHeader />
        </SectionAnimation>

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

            {totalProjects > 3 && (
              <SectionAnimation animation="fadeIn" threshold={0.1 * (projects.length + 1)}>
                <div className="mt-12 text-center">
                  <Link
                    href="/projects"
                    className="neo-button neo-button-secondary neo-shadow-sm inline-flex items-center gap-2 px-8 py-3 text-base font-bold uppercase tracking-wide"
                  >
                    Ver todos los proyectos
                  </Link>
                </div>
              </SectionAnimation>
            )}
          </>
        )}
      </div>
    </section>
  )
}
