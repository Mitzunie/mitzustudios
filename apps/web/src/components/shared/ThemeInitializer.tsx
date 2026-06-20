'use client'

import { useEffect } from 'react'
import { useThemeStore } from '@/stores/theme'

/**
 * Inline script to prevent flash of wrong theme.
 * This runs before React hydrates.
 */
const themeScript = `
  (function() {
    try {
      var theme = JSON.parse(localStorage.getItem('mitzustudios-theme') || '{}');
      var isDark = theme.state ? theme.state.theme === 'dark' : true;
      document.documentElement.classList.toggle('dark', isDark);
      document.documentElement.classList.toggle('light', !isDark);
    } catch(e) {
      document.documentElement.classList.add('dark');
    }
  })();
`

export function ThemeInitializer() {
  const { theme } = useThemeStore()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.classList.toggle('light', theme === 'light')
  }, [theme])

  return <script dangerouslySetInnerHTML={{ __html: themeScript }} />
}
