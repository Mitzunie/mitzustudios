import { Resend } from 'resend'
import { env } from './env'

export const resend = new Resend(env.RESEND_API_KEY)

export async function sendNotificationEmail(
  clientName: string,
  clientEmail: string,
  clientPhone: string,
  projectType: string,
  description: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await resend.emails.send({
      from: 'MitzuStudios <notificaciones@mitzustudios.online>',
      to: env.NOTIFICATION_EMAIL,
      subject: `Nueva solicitud de contacto - ${clientName}`,
      html: `
        <h2>Nueva solicitud de contacto</h2>
        <p><strong>Nombre:</strong> ${clientName}</p>
        <p><strong>Email:</strong> ${clientEmail}</p>
        <p><strong>Teléfono:</strong> ${clientPhone}</p>
        <p><strong>Tipo de proyecto:</strong> ${projectType}</p>
        <p><strong>Descripción:</strong></p>
        <p>${description}</p>
        <hr />
        <p>Puedes gestionar esta solicitud en el panel de administración.</p>
      `,
    })
    return { success: true }
  } catch (error) {
    console.error('Error sending notification email:', error)
    return { success: false, error: 'Error al enviar email de notificación' }
  }
}

export async function sendResponseEmail(
  to: string,
  subject: string,
  content: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await resend.emails.send({
      from: 'MitzuStudios <notificaciones@mitzustudios.online>',
      to,
      subject,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #5A189A;">MitzuStudios</h2>
          <hr style="border: 1px solid #e5e7eb;" />
          <p>${content.replace(/\n/g, '<br/>')}</p>
          <hr style="border: 1px solid #e5e7eb;" />
          <p style="color: #6b7280; font-size: 12px;">
            MitzuStudios - Desarrollo Web Profesional
          </p>
        </div>
      `,
    })
    return { success: true }
  } catch (error) {
    console.error('Error sending response email:', error)
    return { success: false, error: 'Error al enviar email de respuesta' }
  }
}

export async function sendQuoteEmail(
  to: string,
  clientName: string,
  quote: {
    concept: string
    totalAmount: number
    status: string
  },
): Promise<{ success: boolean; error?: string }> {
  try {
    await resend.emails.send({
      from: 'MitzuStudios <notificaciones@mitzustudios.online>',
      to,
      subject: `Tu cotización - ${quote.concept}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #5A189A; font-size: 24px; margin: 0;">MitzuStudios</h1>
            <p style="color: #6b7280; font-size: 14px;">Desarrollo Web Profesional</p>
          </div>
          <h2 style="color: #111827;">Hola ${clientName},</h2>
          <p>Gracias por contactarnos. Aquí está tu cotización:</p>
          <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="margin: 0 0 12px; color: #5A189A;">${quote.concept}</h3>
            <p style="font-size: 28px; font-weight: bold; margin: 0; color: #111827;">
              $${quote.totalAmount.toFixed(2)} USD
            </p>
            <p style="color: #6b7280; font-size: 12px; margin-top: 4px;">
              Estado: ${quote.status === 'PENDING' ? 'Pendiente' : quote.status === 'APPROVED' ? 'Aprobada' : quote.status === 'PAID' ? 'Pagada - Pendiente de desarrollo' : quote.status === 'IN_PROGRESS' ? 'En Desarrollo' : quote.status === 'COMPLETED' ? 'Finalizada - Completada' : 'Cancelada'}
            </p>
          </div>
          <hr style="border: 1px solid #e5e7eb; margin: 24px 0;" />
          <p style="color: #6b7280; font-size: 13px;">
            Si tienes alguna duda o quieres modificar algo, responde directamente a este correo o escríbenos a
            <a href="mailto:team@mitzustudios.online" style="color: #5A189A; font-weight: bold;">team@mitzustudios.online</a>.
          </p>
          <p style="color: #6b7280; font-size: 12px; text-align: center; margin-top: 24px;">
            MitzuStudios &mdash; De tu idea a tu próxima web
          </p>
        </div>
      `,
    })
    return { success: true }
  } catch (error) {
    console.error('Error sending quote email:', error)
    return { success: false, error: 'Error al enviar email de cotización' }
  }
}
