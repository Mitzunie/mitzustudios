'use client'

import Image from 'next/image'
import type { ProjectDTO } from '@/shared'
import { useTranslations } from '@/hooks/useTranslations'
import { TechnologyBadge } from './TechnologyBadge'
import { cn } from '@/lib/utils'

interface ProjectCardProps {
  project: ProjectDTO
}

export function ProjectCard({ project }: ProjectCardProps) {
  const t = useTranslations()

  return (
    <article className="neo-card bg-card group">
      <div className="bg-muted relative aspect-video">
        {project.imageUrl ? (
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="text-muted-foreground mb-2 text-4xl">📁</div>
              <p className="text-muted-foreground text-sm font-bold uppercase">{t.projects.noImage}</p>
            </div>
          </div>
        )}
      </div>

      <div className="neo-border border-t-3 border-b-0 border-l-0 border-r-0 p-5">
        <h3 className="mb-2 text-lg font-black uppercase tracking-wide">{project.title}</h3>
        <p className="text-muted-foreground mb-4 line-clamp-2 text-sm font-bold uppercase leading-relaxed tracking-wide">
          {project.description}
        </p>

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