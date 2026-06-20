import { prisma } from '@mitzustudios/db'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { SectionAnimation } from '@/components/shared/SectionAnimation'

export async function ProjectsSection() {
  const projects = await prisma.project.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { createdAt: 'desc' },
    include: { technologies: true },
  })

  return (
    <section id="projects" className="border-border/50 border-t py-24">
      <div className="container-custom mx-auto px-4">
        <SectionAnimation animation="fadeIn">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Proyectos</h2>
            <p className="text-muted-foreground text-lg">
              Algunos de los proyectos en los que he trabajado
            </p>
          </div>
        </SectionAnimation>

        {projects.length === 0 ? (
          <div className="text-muted-foreground text-center">
            <p>No hay proyectos publicados todavía.</p>
          </div>
        ) : (
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
        )}
      </div>
    </section>
  )
}
