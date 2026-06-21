'use client'

import { useEffect } from 'react'

export function ThemeInitializer() {
  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

  return null
}
