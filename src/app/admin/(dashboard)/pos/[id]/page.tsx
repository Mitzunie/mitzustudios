'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Download } from 'lucide-react'
import type { QuoteDTO } from '@/shared'
import { useTranslations } from '@/hooks/useTranslations'
import { QuoteForm } from '@/components/admin/QuoteForm'

export default function AdminEditQuotePage() {
  const params = useParams()
  const router = useRouter()
  const t = useTranslations()
  const [quote, setQuote] = useState<QuoteDTO | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const res = await fetch(`/api/admin/pos/${params.id}`)
        if (!res.ok) throw new Error('Not found')
        const data = await res.json()
        if (data.success) setQuote(data.data)
      } catch (error) {
        console.error('Error fetching quote:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchQuote()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="neo-border border-primary h-8 w-8 animate-spin border-4 border-t-transparent bg-transparent" />
      </div>
    )
  }

  if (!quote) {
    return <div className="text-muted-foreground py-20 text-center font-bold uppercase tracking-wide">Cotización no encontrada</div>
  }

  return (
    <div>
      <button
        onClick={() => router.push('/admin/pos')}
        className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {t.admin.quotes.title}
      </button>

      <h1 className="mb-6 text-2xl font-black uppercase tracking-wide">
        {quote.status === 'COMPLETED' ? `Cotización #${quote.id.slice(0, 8).toUpperCase()}` : t.admin.quotes.editQuote}
      </h1>

      <div className="mb-4 flex items-center gap-3">
        <a
          href={`/api/admin/pos/${quote.id}/pdf`}
          download
          className="neo-border hover:bg-secondary inline-flex items-center gap-2 px-4 py-2 text-sm font-bold uppercase tracking-wide transition-colors"
        >
          <Download className="h-4 w-4" />
          Descargar Comprobante
        </a>
      </div>

      <div className="max-w-2xl">
        <QuoteForm
          initialData={{
            id: quote.id,
            clientName: quote.clientName,
            clientEmail: quote.clientEmail,
            concept: quote.concept,
            totalAmount: quote.totalAmount,
            status: quote.status,
            splits: quote.splits.map((s) => ({
              collaborator: s.collaborator,
              percentage: s.percentage,
            })),
          }}
          readOnly={quote.status === 'COMPLETED'}
        />
      </div>
    </div>
  )
}
