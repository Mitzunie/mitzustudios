'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from '@/hooks/useTranslations'
import { QuoteForm } from '@/components/admin/QuoteForm'

export default function AdminNewQuotePage() {
  const t = useTranslations()

  return (
    <div>
      <Link
        href="/admin/pos"
        className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {t.admin.quotes.title}
      </Link>

      <h1 className="mb-6 text-2xl font-black uppercase tracking-wide">{t.admin.quotes.newQuote}</h1>

      <div className="max-w-2xl">
        <QuoteForm />
      </div>
    </div>
  )
}
