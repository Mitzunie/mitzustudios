import Image from 'next/image'
import type { ProjectDTO } from '@mitzustudios/shared'
import { TechnologyBadge } from './TechnologyBadge'
import { cn } from '@/lib/utils'

interface ProjectCardProps {
  project: ProjectDTO
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article
      className={cn(
        'border-border/50 bg-card group overflow-hidden rounded-xl border',
        'hover-lift hover:border-primary/30',
        'transition-all duration-300',
      )}
    >
      {/* Image */}
      <div className="bg-muted relative aspect-video overflow-hidden">
        {project.imageUrl ? (
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="text-muted-foreground mb-2 text-4xl">📁</div>
              <p className="text-muted-foreground text-sm">Sin imagen</p>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="group-hover:text-primary mb-2 text-lg font-semibold transition-colors">
          {project.title}
        </h3>
        <p className="text-muted-foreground mb-4 line-clamp-2 text-sm leading-relaxed">
          {project.description}
        </p>

        {/* Technologies */}
        {project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.map((tech) => (
              <TechnologyBadge key={tech.id} technology={tech} />
            ))}
          </div>
        )}
      </div>
    </article>
  )
}
