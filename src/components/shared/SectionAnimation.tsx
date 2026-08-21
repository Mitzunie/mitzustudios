'use client'

import type { ReactNode } from 'react'
import { useInView } from 'motion/react'
import { useRef } from 'react'
import { cn } from '@/lib/utils'

interface SectionAnimationProps {
  children: ReactNode
  className?: string
  animation?: 'fadeIn' | 'fadeInLeft' | 'fadeInRight' | 'scaleIn'
  threshold?: number
  delay?: number
}

export function SectionAnimation({
  children,
  className,
  animation = 'fadeIn',
  threshold = 0.15,
  delay = 0,
}: SectionAnimationProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: threshold })

  const transforms: Record<string, string> = {
    fadeIn: 'translateY(20px)',
    fadeInLeft: 'translateX(-20px)',
    fadeInRight: 'translateX(20px)',
    scaleIn: 'scale(0.97)',
  }

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'none' : transforms[animation],
        transition: `opacity 0.5s ease ${delay}s, transform 0.5s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  )
}
