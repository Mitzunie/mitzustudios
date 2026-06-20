import type { TechnologyDTO } from '@mitzustudios/shared'
import { cn } from '@/lib/utils'

interface TechnologyBadgeProps {
  technology: TechnologyDTO
}

export function TechnologyBadge({ technology }: TechnologyBadgeProps) {
  const content = (
    <span
      className={cn(
        'border-border/50 bg-secondary/50 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium',
        'hover:bg-secondary transition-colors',
      )}
    >
      {technology.icon && (
        <span className="text-sm" aria-hidden="true">
          {technology.icon}
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
