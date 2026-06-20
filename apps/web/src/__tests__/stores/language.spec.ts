import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'

import { useLanguageStore } from '../../stores/language'

describe('useLanguageStore', () => {
  // Reseteamos el store antes de cada test y silenciamos warnings de persist
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    useLanguageStore.setState({ language: 'es' })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('tiene valor por defecto "es" (RN-07)', () => {
    const { language } = useLanguageStore.getState()
    expect(language).toBe('es')
  })

  it('setLanguage cambia el idioma', () => {
    useLanguageStore.getState().setLanguage('en')
    const { language } = useLanguageStore.getState()
    expect(language).toBe('en')
  })

  it('toggle cambia de es a en', () => {
    useLanguageStore.getState().toggle()
    const { language } = useLanguageStore.getState()
    expect(language).toBe('en')
  })

  it('toggle cambia de en a es', () => {
    useLanguageStore.getState().setLanguage('en')
    useLanguageStore.getState().toggle()
    const { language } = useLanguageStore.getState()
    expect(language).toBe('es')
  })

  it('toggle funciona múltiples veces', () => {
    useLanguageStore.getState().toggle() // es -> en
    useLanguageStore.getState().toggle() // en -> es
    useLanguageStore.getState().toggle() // es -> en
    const { language } = useLanguageStore.getState()
    expect(language).toBe('en')
  })

  it('mantiene el estado entre cambios', () => {
    const store1 = useLanguageStore.getState()
    store1.setLanguage('en')

    const store2 = useLanguageStore.getState()
    expect(store2.language).toBe('en')
  })
})
