import { describe, it, expect } from 'vitest'
import {
  generateWameLink,
  generatePymeNotificationLink,
  generateClientResponseLink,
} from '../../lib/whatsapp'

describe('generateWameLink', () => {
  it('genera link wa.me con número limpio y mensaje codificado', () => {
    const result = generateWameLink('+56912345678', 'Hola, prueba')
    expect(result).toBe('https://wa.me/56912345678?text=Hola%2C%20prueba')
  })

  it('limpia caracteres no numéricos del teléfono', () => {
    const result = generateWameLink('+56 (9) 1234-5678', 'Test')
    expect(result).toBe('https://wa.me/56912345678?text=Test')
  })

  it('codifica caracteres especiales en el mensaje', () => {
    const result = generateWameLink('56912345678', '¿Cotización? Sí, gracias!')
    expect(result).toContain('text=')
    // El espacio debe estar codificado como %20
    expect(result).not.toContain('text=Hola')
    // Los caracteres especiales deben estar codificados (%C2%BF para ¿, etc.)
    expect(result).toContain('%C2%BF') // ¿
    expect(result).toContain('%3F')    // ? (codificado)
    expect(result).not.toContain('text=¿')
    // Decodificando debe dar el mensaje original
    expect(decodeURIComponent(result.split('text=')[1])).toBe('¿Cotización? Sí, gracias!')
  })

  it('maneja números sin código de país', () => {
    const result = generateWameLink('912345678', 'Hola')
    expect(result).toBe('https://wa.me/912345678?text=Hola')
  })

  it('maneja mensaje vacío', () => {
    const result = generateWameLink('56912345678', '')
    expect(result).toBe('https://wa.me/56912345678?text=')
  })
})

describe('generatePymeNotificationLink', () => {
  const pymeNumber = '56912345678'
  const clientData = {
    clientName: 'Juan Pérez',
    clientEmail: 'juan@example.com',
    clientPhone: '+56987654321',
    projectType: 'landing',
    description: 'Necesito una landing page para mi negocio de repostería artesanal.',
  }

  it('genera link con datos del cliente en el mensaje', () => {
    const result = generatePymeNotificationLink(
      pymeNumber,
      clientData.clientName,
      clientData.clientEmail,
      clientData.clientPhone,
      clientData.projectType,
      clientData.description,
    )

    expect(result).toContain('wa.me/56912345678')
    const decoded = decodeURIComponent(result)

    expect(decoded).toContain('Nueva solicitud de contacto')
    expect(decoded).toContain('Juan Pérez')
    expect(decoded).toContain('juan@example.com')
    expect(decoded).toContain('+56987654321')
    expect(decoded).toContain('landing')
    expect(decoded).toContain('repostería artesanal')
  })

  it('trunca descripción larga a 200 caracteres', () => {
    const longDesc = 'A'.repeat(300)
    const result = generatePymeNotificationLink(
      pymeNumber,
      'Test',
      'test@test.com',
      '56900000000',
      'webapp',
      longDesc,
    )

    const decoded = decodeURIComponent(result)
    // Debe contener los primeros 200 caracteres
    expect(decoded).toContain('A'.repeat(200))
    // No debe contener más allá
    expect(decoded).toContain('...')
  })

  it('no trunca descripción corta', () => {
    const shortDesc = 'Proyecto corto'
    const result = generatePymeNotificationLink(
      pymeNumber,
      'Test',
      'test@test.com',
      '56900000000',
      'api',
      shortDesc,
    )

    const decoded = decodeURIComponent(result)
    expect(decoded).toContain(shortDesc)
    expect(decoded).not.toContain('...')
  })
})

describe('generateClientResponseLink', () => {
  it('genera link con respuesta de MitzuStudios', () => {
    const result = generateClientResponseLink('56912345678', 'Hola Juan, gracias por contactarnos.')
    const decoded = decodeURIComponent(result)

    expect(decoded).toContain('Respuesta de MitzuStudios:')
    expect(decoded).toContain('Hola Juan, gracias por contactarnos.')
    expect(result).toContain('wa.me/56912345678')
  })

  it('maneja respuesta multilínea', () => {
    const multiline = 'Línea 1\nLínea 2\nLínea 3'
    const result = generateClientResponseLink('56900000000', multiline)
    const decoded = decodeURIComponent(result)

    expect(decoded).toContain('Línea 1')
    expect(decoded).toContain('Línea 2')
    expect(decoded).toContain('Línea 3')
  })
})
