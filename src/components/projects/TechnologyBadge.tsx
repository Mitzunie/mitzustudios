'use client'

import type { TechnologyDTO } from '@/shared'
import { getTechIcon } from '@/shared'
import { cn } from '@/lib/utils'

interface TechnologyBadgeProps {
  technology: TechnologyDTO
}

export function TechnologyBadge({ technology }: TechnologyBadgeProps) {
  const icon = technology.icon || getTechIcon(technology.name)

  const content = (
    <span className="neo-badge bg-secondary inline-flex items-center gap-1.5">
      {icon && (
        <span className="text-sm" aria-hidden="true">
          {icon}
        </span>
      )}
      {technology.name}
    </span>
  )

  if (technology.url) {
    return (
      <a
        href={technology.url}
        target="_blank"
        rel="noopener noreferrer"
        className="transition-opacity hover:opacity-80"
        aria-label={`${technology.name} - ${technology.url}`}
      >
        {content}
      </a>
    )
  }

  return content
}