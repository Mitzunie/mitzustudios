import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: string
  variant: 'project' | 'request'
}

const projectStyles: Record<string, string> = {
  PUBLISHED: 'bg-green-500/10 text-green-500 border-green-500',
  HIDDEN: 'bg-yellow-500/10 text-yellow-500 border-yellow-500',
  DRAFT: 'bg-gray-500/10 text-gray-400 border-gray-500',
}

const requestStyles: Record<string, string> = {
  UNREAD: 'bg-blue-500/10 text-blue-500 border-blue-500',
  READ: 'bg-yellow-500/10 text-yellow-500 border-yellow-500',
  ANSWERED: 'bg-green-500/10 text-green-500 border-green-500',
}

const projectLabels: Record<string, string> = {
  PUBLISHED: 'Publicado',
  HIDDEN: 'Oculto',
  DRAFT: 'Borrador',
}

const requestLabels: Record<string, string> = {
  UNREAD: 'No Leída',
  READ: 'Leída',
  ANSWERED: 'Respondida',
}

export function StatusBadge({ status, variant }: StatusBadgeProps) {
  const styles = variant === 'project' ? projectStyles : requestStyles
  const labels = variant === 'project' ? projectLabels : requestLabels

  return (
    <span
      className={cn(
        'neo-border inline-flex items-center border-2 px-2.5 py-0.5 text-xs font-black uppercase tracking-wide',
        styles[status] || '',
      )}
    >
      {labels[status] || status}
    </span>
  )
}
