import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionAnimationProps {
  children: ReactNode
  className?: string
  animation?: 'fadeIn' | 'fadeInLeft' | 'fadeInRight' | 'scaleIn'
  threshold?: number
}

export function SectionAnimation({
  children,
  className,
}: SectionAnimationProps) {
  return (
    <div className={cn(className)}>
      {children}
    </div>
  )
}
