/**
 * @vitest-environment node
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock the language store
vi.mock('../../stores/language', () => ({
  useLanguageStore: vi.fn(),
}))

import { useLanguageStore } from '../../stores/language'
import { useTranslations } from '../../hooks/useTranslations'
import { es, en } from '@/shared'

describe('useTranslations', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('devuelve diccionario español por defecto', () => {
    vi.mocked(useLanguageStore).mockImplementation((selector: any) => {
      const state = { language: 'es' }
      return selector ? selector(state) : state
    })

    const t = useTranslations()
    expect(t.nav.hero).toBe('Inicio')
    expect(t.hero.cta).toBe('Cotiza tu Proyecto')
  })

  it('devuelve diccionario inglés cuando language es "en"', () => {
    vi.mocked(useLanguageStore).mockImplementation((selector: any) => {
      const state = { language: 'en' }
      return selector ? selector(state) : state
    })

    const t = useTranslations()
    expect(t.nav.hero).toBe('Home')
    expect(t.hero.cta).toBe('Get a Quote')
  })

  it('fallback a español si el idioma no existe', () => {
    vi.mocked(useLanguageStore).mockImplementation((selector: any) => {
      const state = { language: 'fr' }
      return selector ? selector(state) : state
    })

    const t = useTranslations()
    // Debe fallback a español
    expect(t.nav.hero).toBe('Inicio')
  })

  it('todas las keys del diccionario son strings traducibles', () => {
    vi.mocked(useLanguageStore).mockImplementation((selector: any) => {
      const state = { language: 'en' }
      return selector ? selector(state) : state
    })

    const t = useTranslations()
    expect(typeof t.hero.title).toBe('string')
    expect(typeof t.hero.subtitle).toBe('string')
    expect(typeof t.contact.form.submit).toBe('string')
    expect(typeof t.admin.dashboard.title).toBe('string')
  })
})
