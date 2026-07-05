'use client'

import { useCallback } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import type { ProjectDTO } from '@/shared'
import { useTranslations } from '@/hooks/useTranslations'
import { TechnologyBadge } from './TechnologyBadge'

interface ProjectCardProps {
  project: ProjectDTO
}

export function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter()
  const t = useTranslations()

  const handleClick = useCallback(() => {
    router.push(`/projects/${project.slug}`)
  }, [router, project.slug])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        router.push(`/projects/${project.slug}`)
      }
    },
    [router, project.slug],
  )

  return (
    <div
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="link"
      tabIndex={0}
      className="neo-card bg-card group h-full cursor-pointer transition-colors hover:bg-muted/50"
    >
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
        <h3 className="group-hover:text-primary mb-2 text-lg font-black uppercase tracking-wide transition-colors">
          {project.title}
        </h3>
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
    </div>
  )
}
