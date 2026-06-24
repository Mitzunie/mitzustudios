import { describe, it, expect } from 'vitest'
import { es } from '../../i18n/es'
import { en } from '../../i18n/en'

type DeepRecord = {
  [key: string]: string | DeepRecord | Array<DeepRecord | string>
}

/**
 * Recorre un objeto y recolecta todas las keys en orden DFS.
 * Ignora arrays (se asume que son arrays de objetos con misma estructura).
 */
function getKeys(obj: DeepRecord, prefix = ''): string[] {
  const keys: string[] = []
  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    const value = obj[key]
    if (Array.isArray(value)) {
      // Asumimos arrays homogéneos; sampleamos el primer elemento si existe
      if (value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
        const sampleKeys = getKeys(value[0] as DeepRecord, `${fullKey}[0]`)
        keys.push(...sampleKeys)
      }
      // También registramos la key del array en sí
      keys.push(fullKey)
    } else if (typeof value === 'object' && value !== null) {
      keys.push(...getKeys(value as DeepRecord, fullKey))
    } else {
      keys.push(fullKey)
    }
  }
  return keys.sort()
}

describe('i18n dictionaries', () => {
  describe('mismas keys entre es y en', () => {
    const esKeys = getKeys(es as unknown as DeepRecord)
    const enKeys = getKeys(en as unknown as DeepRecord)

    it('es y en tienen el mismo número de keys', () => {
      expect(esKeys.length).toBe(enKeys.length)
    })

    it('es tiene todas las keys que en', () => {
      const missingInEn = esKeys.filter((k) => !enKeys.includes(k))
      expect(missingInEn).toEqual([])
    })

    it('en tiene todas las keys que es', () => {
      const missingInEs = enKeys.filter((k) => !esKeys.includes(k))
      expect(missingInEs).toEqual([])
    })
  })

  describe('estructura de diccionarios', () => {
    it('es tiene nav', () => {
      expect(es.nav).toBeDefined()
      expect(es.nav.hero).toBe('Inicio')
    })

    it('en tiene nav', () => {
      expect(en.nav).toBeDefined()
      expect(en.nav.hero).toBe('Home')
    })

    it('es tiene hero con CTA', () => {
      expect(es.hero.title).toBeDefined()
      expect(es.hero.cta).toBe('Cotiza tu Proyecto')
    })

    it('en tiene hero con CTA', () => {
      expect(en.hero.title).toBeDefined()
      expect(en.hero.cta).toBe('Get a Quote')
    })

    it('es tiene contact.form con todos los campos', () => {
      expect(es.contact.form.name).toBeDefined()
      expect(es.contact.form.email).toBeDefined()
      expect(es.contact.form.phone).toBeDefined()
      expect(es.contact.form.projectType).toBeDefined()
      expect(es.contact.form.description).toBeDefined()
      expect(es.contact.form.submit).toBeDefined()
      expect(es.contact.form.success).toBeDefined()
      expect(es.contact.form.error).toBeDefined()
    })

    it('es tiene admin.section con sidebar, login, requests y projects', () => {
      expect(es.admin.sidebar).toBeDefined()
      expect(es.admin.login).toBeDefined()
      expect(es.admin.requests).toBeDefined()
      expect(es.admin.projects).toBeDefined()
    })

    it('es tiene errors con notFound, serverError, dbError', () => {
      expect(es.errors.notFound).toBeDefined()
      expect(es.errors.serverError).toBeDefined()
      expect(es.errors.dbError).toBeDefined()
    })

    it('en tiene errors con notFound, serverError, dbError', () => {
      expect(en.errors.notFound).toBeDefined()
      expect(en.errors.serverError).toBeDefined()
      expect(en.errors.dbError).toBeDefined()
    })
  })

  describe('valores no vacíos', () => {
    function checkNoEmptyValues(obj: Record<string, unknown>, path = ''): void {
      for (const [key, value] of Object.entries(obj)) {
        const currentPath = path ? `${path}.${key}` : key
        if (typeof value === 'string') {
          it(`${currentPath} no está vacío en es`, () => {
            expect(value.trim().length).toBeGreaterThan(0)
          })
        } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          checkNoEmptyValues(value as Record<string, unknown>, currentPath)
        }
      }
    }

    // Solo probamos algunos paths clave para no generar cientos de tests
    it('contact.form no tiene valores vacíos en es', () => {
      const form = es.contact.form as Record<string, unknown>
      for (const [key, value] of Object.entries(form)) {
        if (typeof value === 'string') {
          expect(value.trim().length).toBeGreaterThan(0)
        }
      }
    })

    it('contact.form no tiene valores vacíos en en', () => {
      const form = en.contact.form as Record<string, unknown>
      for (const [key, value] of Object.entries(form)) {
        if (typeof value === 'string') {
          expect(value.trim().length).toBeGreaterThan(0)
        }
      }
    })
  })

  describe('admin section completa', () => {
    const adminSections = ['sidebar', 'login', 'quotes', 'requests', 'projects', 'dashboard', 'common'] as const

    for (const section of adminSections) {
      it(`es.admin.${section} está definido`, () => {
        expect((es.admin as Record<string, unknown>)[section]).toBeDefined()
      })
      it(`en.admin.${section} está definido`, () => {
        expect((en.admin as Record<string, unknown>)[section]).toBeDefined()
      })
    }
  })
})
