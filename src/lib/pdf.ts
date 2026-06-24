import {
  PDFDocument,
  StandardFonts,
  rgb,
  degrees,
} from 'pdf-lib'

export interface PdfQuoteData {
  id: string
  clientName: string
  clientEmail: string
  concept: string
  totalAmount: number
  status: string
  createdAt: string
  splits: {
    collaborator: string
    percentage: number
    amount: number
  }[]
}

const PURPLE = rgb(0.29, 0.11, 0.53)
const PURPLE_LIGHT = rgb(0.96, 0.94, 0.99)
const DARK = rgb(0.15, 0.15, 0.15)
const MID = rgb(0.45, 0.45, 0.45)
const LIGHT = rgb(0.985, 0.985, 0.985)
const BORDER = rgb(0.88, 0.88, 0.90)
const WHITE = rgb(1, 1, 1)

const GREEN = rgb(0.0, 0.55, 0.22)
const ORANGE = rgb(0.96, 0.60, 0.10)
const RED = rgb(0.75, 0.15, 0.15)

const PAGE_W = 595
const PAGE_H = 842
const MARGIN = 50
const CONTENT_W = PAGE_W - MARGIN * 2

export async function generateQuotePdf(
  quote: PdfQuoteData
): Promise<Uint8Array> {
  const doc = await PDFDocument.create()

  const font = await doc.embedFont(StandardFonts.Helvetica)
  const bold = await doc.embedFont(StandardFonts.HelveticaBold)

  const page = doc.addPage([PAGE_W, PAGE_H])

  let y = PAGE_H - 40

  const t = (
    text: string,
    x: number,
    yPos: number,
    options?: {
      size?: number
      font?: typeof font
      color?: ReturnType<typeof rgb>
      align?: 'left' | 'center' | 'right'
    }
  ) => {
    const f = options?.font || font
    const s = options?.size || 11
    const c = options?.color || DARK

    let xPos = x

    const width = f.widthOfTextAtSize(text, s)

    if (options?.align === 'center') {
      xPos = (PAGE_W - width) / 2
    }

    if (options?.align === 'right') {
      xPos = x - width
    }

    page.drawText(text, {
      x: xPos,
      y: yPos,
      size: s,
      font: f,
      color: c,
    })
  }

  // =====================================================
  // TOP BAR
  // =====================================================

  page.drawRectangle({
    x: 0,
    y: PAGE_H - 8,
    width: PAGE_W,
    height: 8,
    color: PURPLE,
  })

  // =====================================================
  // WATERMARK
  // =====================================================

  page.drawText('MITZUSTUDIOS', {
    x: 90,
    y: 310,
    size: 70,
    font: bold,
    color: rgb(0.93, 0.93, 0.93),
    rotate: degrees(35),
    opacity: 0.08,
  })

  // =====================================================
  // HEADER
  // =====================================================

  page.drawRectangle({
    x: MARGIN,
    y: y - 55,
    width: CONTENT_W,
    height: 60,
    color: PURPLE,
  })

  t('MITZUSTUDIOS', MARGIN + 20, y - 22, {
    font: bold,
    size: 22,
    color: WHITE,
  })

  t('Desarrollo Web Profesional', MARGIN + 20, y - 42, {
    size: 10,
    color: rgb(0.90, 0.90, 0.90),
  })

  y -= 95

  // =====================================================
  // TITLE
  // =====================================================

  t('COTIZACIÓN', PAGE_W / 2, y, {
    font: bold,
    size: 26,
    color: PURPLE,
    align: 'center',
  })

  y -= 24

  t(`#${quote.id.slice(0, 8).toUpperCase()}`, PAGE_W / 2, y, {
    size: 11,
    color: MID,
    align: 'center',
  })

  y -= 40

  // =====================================================
  // CLIENT CARD
  // =====================================================

  page.drawRectangle({
    x: MARGIN,
    y: y - 70,
    width: CONTENT_W,
    height: 80,
    color: LIGHT,
    borderColor: BORDER,
    borderWidth: 1,
  })

  page.drawLine({
    start: { x: PAGE_W / 2, y: y - 70 },
    end: { x: PAGE_W / 2, y: y + 10 },
    thickness: 1,
    color: BORDER,
  })

  t('CLIENTE', MARGIN + 20, y - 15, {
    font: bold,
    size: 10,
    color: PURPLE,
  })

  t(quote.clientName, MARGIN + 20, y - 38, {
    font: bold,
    size: 13,
  })

  t(quote.clientEmail, MARGIN + 20, y - 58, {
    size: 10,
    color: MID,
  })

  const statusLabel =
    quote.status === 'APPROVED'
      ? 'APROBADA'
      : quote.status === 'PAID'
      ? 'PAGADA - PENDIENTE DESARROLLO'
      : quote.status === 'IN_PROGRESS'
      ? 'EN DESARROLLO'
      : quote.status === 'COMPLETED'
      ? 'FINALIZADA - COMPLETADA'
      : quote.status === 'PENDING'
      ? 'PENDIENTE'
      : 'CANCELADA'

  const statusColor =
    quote.status === 'APPROVED'
      ? GREEN
      : quote.status === 'PAID'
      ? GREEN
      : quote.status === 'IN_PROGRESS'
      ? ORANGE
      : quote.status === 'COMPLETED'
      ? PURPLE
      : quote.status === 'PENDING'
      ? ORANGE
      : RED

  t('ESTADO', PAGE_W / 2 + 20, y - 15, {
    font: bold,
    size: 10,
    color: PURPLE,
  })

  t(statusLabel, PAGE_W / 2 + 20, y - 38, {
    font: bold,
    size: 13,
    color: statusColor,
  })

  const dateStr = new Date(quote.createdAt).toLocaleDateString(
    'es-CL',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  )

  t(dateStr, PAGE_W / 2 + 20, y - 58, {
    size: 10,
    color: MID,
  })

  y -= 110

  // =====================================================
  // PROPOSAL
  // =====================================================

  t('PROPUESTA DE SERVICIO', MARGIN, y, {
    font: bold,
    size: 12,
    color: PURPLE,
  })

  y -= 18

  page.drawRectangle({
    x: MARGIN,
    y: y - 55,
    width: CONTENT_W,
    height: 60,
    color: PURPLE_LIGHT,
  })

  t(quote.concept, MARGIN + 15, y - 22, {
    size: 12,
  })

  y -= 85

  // =====================================================
  // TOTAL CARD
  // =====================================================

  page.drawRectangle({
    x: MARGIN,
    y: y - 95,
    width: CONTENT_W,
    height: 100,
    color: PURPLE,
  })

  t('INVERSIÓN TOTAL', MARGIN + 20, y - 25, {
    font: bold,
    size: 11,
    color: WHITE,
  })

  const amount =
    '$' +
    quote.totalAmount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) +
    ' USD'

  t(amount, PAGE_W / 2, y - 65, {
    font: bold,
    size: 34,
    color: WHITE,
    align: 'center',
  })

  y -= 130

  // =====================================================
  // DISTRIBUTION
  // =====================================================

  if (quote.splits.length > 0) {
    t('DISTRIBUCIÓN', MARGIN, y, {
      font: bold,
      size: 12,
      color: PURPLE,
    })

    y -= 20

    page.drawRectangle({
      x: MARGIN,
      y: y - 24,
      width: CONTENT_W,
      height: 24,
      color: PURPLE,
    })

    t('COLABORADOR', MARGIN + 15, y - 16, {
      font: bold,
      size: 9,
      color: WHITE,
    })

    t('%', PAGE_W / 2, y - 16, {
      font: bold,
      size: 9,
      color: WHITE,
      align: 'center',
    })

    t('USD', PAGE_W - MARGIN - 15, y - 16, {
      font: bold,
      size: 9,
      color: WHITE,
      align: 'right',
    })

    y -= 24

    quote.splits.forEach((split, index) => {
      page.drawRectangle({
        x: MARGIN,
        y: y - 24,
        width: CONTENT_W,
        height: 24,
        color: index % 2 === 0 ? WHITE : LIGHT,
      })

      t(split.collaborator, MARGIN + 15, y - 16)

      t(`${split.percentage}%`, PAGE_W / 2, y - 16, {
        align: 'center',
      })

      t(
        `$${split.amount.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        PAGE_W - MARGIN - 15,
        y - 16,
        {
          align: 'right',
        }
      )

      y -= 24
    })

    page.drawRectangle({
      x: MARGIN,
      y: y - 26,
      width: CONTENT_W,
      height: 26,
      color: PURPLE_LIGHT,
    })

    t('TOTAL', MARGIN + 15, y - 18, {
      font: bold,
      color: PURPLE,
    })

    t('100%', PAGE_W / 2, y - 18, {
      font: bold,
      color: PURPLE,
      align: 'center',
    })

    t(
      amount,
      PAGE_W - MARGIN - 15,
      y - 18,
      {
        font: bold,
        color: PURPLE,
        align: 'right',
      }
    )
  }

  // =====================================================
  // FOOTER
  // =====================================================

  const footerY = 55

  page.drawLine({
    start: { x: MARGIN, y: footerY + 35 },
    end: { x: PAGE_W - MARGIN, y: footerY + 35 },
    thickness: 1,
    color: BORDER,
  })

  t('MITZUSTUDIOS', MARGIN, footerY + 15, {
    font: bold,
    size: 10,
    color: PURPLE,
  })

  t('Desarrollo Web Profesional', MARGIN, footerY - 2, {
    size: 9,
    color: MID,
  })

  t(
    'www.mitzustudios.online',
    PAGE_W - MARGIN,
    footerY + 15,
    {
      size: 10,
      color: MID,
      align: 'right',
    }
  )

  t(
    'team@mitzustudios.online',
    PAGE_W - MARGIN,
    footerY - 2,
    {
      size: 9,
      color: MID,
      align: 'right',
    }
  )

  return await doc.save()
}
