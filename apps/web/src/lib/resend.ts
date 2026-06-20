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
      from: 'MitzuStudios <notifications@mitzustudios.com>',
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
      from: 'MitzuStudios <notifications@mitzustudios.com>',
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
