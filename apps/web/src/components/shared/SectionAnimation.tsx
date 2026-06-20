'use client'

import type { ReactNode } from 'react'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
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
  animation = 'fadeIn',
  threshold = 0.1,
}: SectionAnimationProps) {
  const { ref, isVisible } = useIntersectionObserver<HTMLDivElement>({ threshold })

  const animationClass = {
    fadeIn: 'animate-in',
    fadeInLeft: 'animate-in-left',
    fadeInRight: 'animate-in-right',
    scaleIn: 'animate-in-scale',
  }[animation]

  return (
    <div
      ref={ref}
      className={cn(
        'section-hidden',
        isVisible && 'section-visible',
        isVisible && animationClass,
        className,
      )}
    >
      {children}
    </div>
  )
}
