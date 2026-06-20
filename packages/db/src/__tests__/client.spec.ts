import { describe, it, expect } from 'vitest'

describe('@mitzustudios/db', () => {
  it('el paquete se importa correctamente (DB-01)', async () => {
    // Verificamos que el módulo principal exporta lo esperado sin errores
    const mod = await import('../index')
    expect(mod).toBeDefined()
    expect(mod.prisma).toBeDefined()
  })
})
