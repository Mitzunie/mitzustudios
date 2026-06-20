export function generateWameLink(phone: string, message: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '')
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`
}

export function generatePymeNotificationLink(
  pymeNumber: string,
  clientName: string,
  clientEmail: string,
  clientPhone: string,
  projectType: string,
  description: string,
): string {
  const message = [
    `Nueva solicitud de contacto - MitzuStudios`,
    ``,
    `Cliente: ${clientName}`,
    `Email: ${clientEmail}`,
    `Teléfono: ${clientPhone}`,
    `Tipo de proyecto: ${projectType}`,
    `Descripción: ${description.substring(0, 200)}${description.length > 200 ? '...' : ''}`,
  ].join('\n')

  return generateWameLink(pymeNumber, message)
}

export function generateClientResponseLink(clientPhone: string, response: string): string {
  const message = [`Respuesta de MitzuStudios:`, ``, response].join('\n')

  return generateWameLink(clientPhone, message)
}
