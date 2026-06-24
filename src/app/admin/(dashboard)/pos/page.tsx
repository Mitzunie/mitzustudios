'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Eye, EyeOff, Download, Search, Pencil } from 'lucide-react'
import Link from 'next/link'
import type { QuoteDTO, PaginatedResponse } from '@/shared'
import { useTranslations } from '@/hooks/useTranslations'
import { cn } from '@/lib/utils'
import { FilterBar } from '@/components/admin/FilterBar'

const filterOptions = [
  { value: '', label: 'Todas' },
  { value: 'PENDING', label: 'Pendientes' },
  { value: 'APPROVED', label: 'Aprobadas' },
  { value: 'PAID', label: 'Pagadas' },
  { value: 'IN_PROGRESS', label: 'En Desarrollo' },
  { value: 'COMPLETED', label: 'Finalizadas' },
  { value: 'CANCELLED', label: 'Canceladas' },
]

export default function AdminPosPage() {
  const router = useRouter()
  const t = useTranslations()
  const [quotes, setQuotes] = useState<QuoteDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [search, setSearch] = useState('')
  const [showSplits, setShowSplits] = useState<Set<string>>(new Set())

  const fetchQuotes = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filter) params.set('status', filter)
      if (search) params.set('search', search)
      params.set('page', '1')

      const res = await fetch(`/api/admin/pos?${params}`)
      if (!res.ok) throw new Error('Error fetching quotes')

      const data: PaginatedResponse<QuoteDTO> = await res.json()
      if (data.success && data.data) {
        setQuotes(data.data)
      }
    } catch (error) {
      console.error('Error fetching quotes:', error)
    } finally {
      setLoading(false)
    }
  }, [filter, search])

  useEffect(() => {
    fetchQuotes()
  }, [fetchQuotes])

  const handleDelete = async (id: string, clientName: string) => {
    if (!window.confirm(`${t.admin.quotes.form.deleteConfirm}\n\n"${clientName}"\n\n${t.admin.quotes.form.deleteDescription}`)) return

    try {
      const res = await fetch(`/api/admin/pos/${id}`, { method: 'DELETE' })
      if (res.ok) fetchQuotes()
    } catch (error) {
      console.error('Error deleting quote:', error)
    }
  }

  const toggleSplits = (id: string) => {
    setShowSplits((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const statusColors: Record<string, string> = {
    PENDING: 'text-yellow-500 bg-yellow-500/10 border-yellow-500',
    APPROVED: 'text-blue-500 bg-blue-500/10 border-blue-500',
    PAID: 'text-green-500 bg-green-500/10 border-green-500',
    IN_PROGRESS: 'text-cyan-500 bg-cyan-500/10 border-cyan-500',
    COMPLETED: 'text-violet-500 bg-violet-500/10 border-violet-500',
    CANCELLED: 'text-muted-foreground bg-muted/30 border-border',
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="neo-border border-primary h-8 w-8 animate-spin border-4 border-t-transparent bg-transparent" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-black uppercase tracking-wide">{t.admin.quotes.title}</h1>
        <Link
          href="/admin/pos/new"
          className="neo-button neo-button-primary neo-shadow-sm inline-flex items-center gap-2 px-4 py-2 text-sm"
        >
          <Plus className="h-4 w-4" />
          {t.admin.quotes.newQuote}
        </Link>
      </div>

      <div className="mb-6 space-y-3">
        <div className="relative">
          <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.admin.quotes.search}
            className="neo-input w-full px-10 py-2.5 text-sm font-bold uppercase tracking-wide"
          />
        </div>
        <FilterBar
          options={filterOptions.map((o) => ({
            ...o,
            label: o.value ? t.admin.quotes.statuses[o.value as keyof typeof t.admin.quotes.statuses] : o.label,
          }))}
          activeFilter={filter}
          onFilterChange={setFilter}
        />
      </div>

      {quotes.length === 0 ? (
        <div className="text-muted-foreground py-20 text-center font-bold uppercase tracking-wide">{t.admin.quotes.noQuotes}</div>
      ) : (
        <div className="neo-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="neo-border border-b-3 border-t-0 border-l-0 border-r-0 bg-muted/50">
                <th className="text-muted-foreground px-4 py-3 text-left font-black uppercase text-xs tracking-wide">{t.admin.quotes.clientName}</th>
                <th className="text-muted-foreground px-4 py-3 text-left font-black uppercase text-xs tracking-wide">{t.admin.quotes.concept}</th>
                <th className="text-muted-foreground px-4 py-3 text-right font-black uppercase text-xs tracking-wide">{t.admin.quotes.totalAmount}</th>
                <th className="text-muted-foreground px-4 py-3 text-center font-black uppercase text-xs tracking-wide">{t.admin.quotes.splits}</th>
                <th className="text-muted-foreground px-4 py-3 text-left font-black uppercase text-xs tracking-wide">{t.admin.quotes.status}</th>
                <th className="text-muted-foreground hidden px-4 py-3 text-left font-black uppercase text-xs tracking-wide sm:table-cell">{t.admin.quotes.date}</th>
                <th className="text-muted-foreground px-4 py-3 text-right font-black uppercase text-xs tracking-wide">{t.admin.quotes.actions}</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((quote) => (
                <tr key={quote.id} className="neo-border border-b-3 border-t-0 border-l-0 border-r-0 last:border-b-0">
                  <td className="px-4 py-3">
                    <button
                      onClick={() => router.push(`/admin/pos/${quote.id}`)}
                      className="font-black uppercase tracking-wide text-sm hover:text-primary transition-colors text-left"
                    >
                      {quote.clientName}
                    </button>
                  </td>
                  <td className="text-muted-foreground px-4 py-3 font-bold uppercase tracking-wide text-xs">{quote.concept}</td>
                  <td className="px-4 py-3 text-right font-black">${quote.totalAmount.toFixed(2)} USD</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleSplits(quote.id)}
                      className="neo-border text-muted-foreground hover:text-foreground p-1.5 transition-colors"
                      title={showSplits.has(quote.id) ? 'Ocultar reparto' : 'Ver reparto'}
                    >
                      {showSplits.has(quote.id) ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn('neo-border inline-block px-2 py-0.5 text-xs font-bold uppercase tracking-wide', statusColors[quote.status])}>
                      {t.admin.quotes.statuses[quote.status as keyof typeof t.admin.quotes.statuses]}
                    </span>
                  </td>
                  <td className="text-muted-foreground hidden px-4 py-3 sm:table-cell font-bold uppercase tracking-wide text-xs">
                    {new Date(quote.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <a
                        href={`/api/admin/pos/${quote.id}/pdf`}
                        download
                        className="text-muted-foreground hover:text-primary neo-border border-transparent hover:border-primary p-2 transition-colors"
                        title="Descargar comprobante"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                      <button
                        onClick={() => router.push(`/admin/pos/${quote.id}`)}
                        disabled={quote.status === 'COMPLETED'}
                        className={cn(
                          'neo-border p-2 transition-colors',
                          quote.status === 'COMPLETED'
                            ? 'text-muted-foreground/30 cursor-not-allowed border-transparent'
                            : 'text-muted-foreground hover:text-primary hover:border-primary',
                        )}
                        title={quote.status === 'COMPLETED' ? 'Cotización finalizada, no se puede editar' : 'Editar cotización'}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(quote.id, quote.clientName)}
                        className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive neo-border border-transparent hover:border-destructive p-2 transition-colors"
                        title={t.admin.common.delete}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Expanded split rows */}
          {quotes.map((quote) => showSplits.has(quote.id) && (
            <div key={`splits-${quote.id}`} className="neo-border border-t-0 border-l-0 border-r-0 bg-muted/20 px-8 py-3">
              <div className="grid grid-cols-3 gap-4 max-w-md">
                {quote.splits.map((split) => (
                  <div key={split.id} className="text-center">
                    <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{split.collaborator}</p>
                    <p className="text-sm font-black">{split.percentage}%</p>
                    <p className="text-xs font-bold">${split.amount.toFixed(2)} USD</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
