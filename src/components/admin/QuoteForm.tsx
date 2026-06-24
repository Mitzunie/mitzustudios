'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, X, AlertCircle, Users, UserPlus } from 'lucide-react'
import { useTranslations } from '@/hooks/useTranslations'
import { cn } from '@/lib/utils'
import type { QuoteStatus } from '@/shared'

interface SplitRow {
  collaborator: string
  percentage: number
}

interface ClientOption {
  name: string
  email: string
}

interface QuoteFormProps {
  initialData?: {
    id: string
    clientName: string
    clientEmail: string
    concept: string
    totalAmount: number
    status: QuoteStatus
    splits: SplitRow[]
  }
  readOnly?: boolean
}

export function QuoteForm({ initialData, readOnly }: QuoteFormProps) {
  const router = useRouter()
  const t = useTranslations()
  const isEditing = !!initialData

  const [clientMode, setClientMode] = useState<'existing' | 'new'>(initialData ? 'new' : 'existing')
  const [clientName, setClientName] = useState(initialData?.clientName || '')
  const [clientEmail, setClientEmail] = useState(initialData?.clientEmail || '')
  const [selectedClientId, setSelectedClientId] = useState('')
  const [concept, setConcept] = useState(initialData?.concept || '')
  const [totalAmount, setTotalAmount] = useState(initialData?.totalAmount?.toString() || '')
  const [status, setStatus] = useState<QuoteStatus>(initialData?.status || 'PENDING')
  const [splits, setSplits] = useState<SplitRow[]>(
    initialData?.splits || [{ collaborator: '', percentage: 0 }],
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)
  const completedConfirmed = useRef(false)
  const [clients, setClients] = useState<ClientOption[]>([])
  const [fetchingClients, setFetchingClients] = useState(true)

  useEffect(() => {
    if (isEditing) return
    const fetchClients = async () => {
      try {
        const res = await fetch('/api/admin/requests?limit=1000')
        const json = await res.json()
        if (json.success) {
          const unique = new Map<string, ClientOption>()
          for (const r of json.data) {
            if (r.clientName && r.clientEmail) {
              unique.set(r.clientEmail, { name: r.clientName, email: r.clientEmail })
            }
          }
          setClients(Array.from(unique.values()))
        }
      } catch {
        // silently fail, user can type manually
      } finally {
        setFetchingClients(false)
      }
    }
    fetchClients()
  }, [isEditing])

  const handleClientSelect = (email: string) => {
    const client = clients.find((c) => c.email === email)
    if (client) {
      setClientName(client.name)
      setClientEmail(client.email)
      setSelectedClientId(email)
    }
  }

  const handleModeChange = (mode: 'existing' | 'new') => {
    setClientMode(mode)
    setSelectedClientId('')
    if (mode === 'new') {
      setClientName('')
      setClientEmail('')
    }
  }

  const totalPct = splits.reduce((sum, s) => sum + Number(s.percentage || 0), 0)
  const remaining = 100 - totalPct
  const totalAmountNum = Number(totalAmount) || 0

  const addSplit = () => {
    setSplits([...splits, { collaborator: '', percentage: 0 }])
  }

  const removeSplit = (index: number) => {
    setSplits(splits.filter((_, i) => i !== index))
  }

  const updateSplit = (index: number, field: keyof SplitRow, value: string) => {
    const updated = [...splits]
    if (field === 'percentage') {
      updated[index] = { ...updated[index], [field]: Number(value) || 0 }
    } else {
      updated[index] = { ...updated[index], [field]: value }
    }
    setSplits(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!clientName || !clientEmail || !concept || !totalAmount) {
      setError('Completa todos los campos requeridos')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail)) {
      setError('Email inválido')
      return
    }

    if (Math.abs(totalPct - 100) > 0.01) {
      setError(t.admin.quotes.mustTotal100)
      return
    }

    if (status === 'COMPLETED' && !completedConfirmed.current) {
      setShowConfirm(true)
      return
    }

    setShowConfirm(false)
    completedConfirmed.current = false
    setLoading(true)

    try {
      const url = isEditing ? `/api/admin/pos/${initialData.id}` : '/api/admin/pos'
      const method = isEditing ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName,
          clientEmail,
          concept,
          totalAmount: Number(totalAmount),
          status,
          splits: splits.map((s) => ({
            collaborator: s.collaborator,
            percentage: Number(s.percentage),
          })),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error?.message || t.admin.quotes.form.error)
        setLoading(false)
        return
      }

      router.push('/admin/pos')
      router.refresh()
    } catch {
      setError(t.admin.quotes.form.error)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="neo-border border-destructive bg-destructive/10 text-destructive flex items-start gap-2 p-3 text-sm font-bold">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {showConfirm && (
        <div className="neo-border border-primary bg-primary/5 p-4">
          <p className="mb-3 text-sm font-bold uppercase tracking-wide">{t.admin.quotes.form.completeConfirm}</p>
          <p className="text-muted-foreground mb-4 text-xs">{t.admin.quotes.form.completeDescription}</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                completedConfirmed.current = true
                setShowConfirm(false)
                const form = document.querySelector('form')
                form?.requestSubmit()
              }}
              className="neo-button neo-button-primary neo-shadow-sm px-4 py-2 text-sm"
            >
              Sí, finalizar
            </button>
            <button
              type="button"
              onClick={() => { setShowConfirm(false); completedConfirmed.current = false }}
              className="neo-border px-4 py-2 text-sm font-bold uppercase tracking-wide hover:bg-secondary transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {readOnly && (
        <div className="neo-border border-violet-500 bg-violet-500/10 flex items-center gap-2 p-3 text-sm font-bold">
          <AlertCircle className="h-4 w-4 shrink-0 text-violet-500" />
          <p>Cotización finalizada — solo lectura, no se puede modificar</p>
        </div>
      )}

      <div className="neo-card bg-card p-6">
        {!isEditing && (
          <div className="mb-4">
            <label className="mb-2 block text-sm font-bold uppercase tracking-wide">{t.admin.quotes.selectClient}</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleModeChange('existing')}
                className={cn(
                  'neo-border flex items-center gap-2 px-4 py-2 text-sm font-bold uppercase tracking-wide transition-colors',
                  clientMode === 'existing'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'hover:bg-secondary text-muted-foreground',
                )}
              >
                <Users className="h-4 w-4" />
                {t.admin.quotes.existingClient}
              </button>
              <button
                type="button"
                onClick={() => handleModeChange('new')}
                className={cn(
                  'neo-border flex items-center gap-2 px-4 py-2 text-sm font-bold uppercase tracking-wide transition-colors',
                  clientMode === 'new'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'hover:bg-secondary text-muted-foreground',
                )}
              >
                <UserPlus className="h-4 w-4" />
                {t.admin.quotes.newClient}
              </button>
            </div>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          {!isEditing && clientMode === 'existing' ? (
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-bold uppercase tracking-wide">{t.admin.quotes.selectClient}</label>
              <select
                value={selectedClientId}
                onChange={(e) => handleClientSelect(e.target.value)}
                className="neo-input w-full px-4 py-2.5 text-sm font-bold uppercase tracking-wide"
                disabled={fetchingClients}
              >
                <option value="">
                  {fetchingClients ? 'Cargando...' : t.admin.quotes.selectPlaceholder}
                </option>
                {clients.map((c) => (
                  <option key={c.email} value={c.email}>
                    {c.name} - {c.email}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
          <div>
            <label className="mb-2 block text-sm font-bold uppercase tracking-wide">{t.admin.quotes.clientName} *</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="neo-input w-full px-4 py-2.5 text-sm font-bold uppercase tracking-wide"
              placeholder="Nombre del cliente"
              readOnly={readOnly || (!isEditing && clientMode === 'existing' && !!selectedClientId)}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-bold uppercase tracking-wide">{t.admin.quotes.clientEmail} *</label>
            <input
              type="email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              className="neo-input w-full px-4 py-2.5 text-sm font-bold uppercase tracking-wide"
              placeholder="cliente@ejemplo.com"
              readOnly={readOnly || (!isEditing && clientMode === 'existing' && !!selectedClientId)}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-bold uppercase tracking-wide">{t.admin.quotes.status}</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as QuoteStatus)}
              className="neo-input w-full px-4 py-2.5 text-sm font-bold uppercase tracking-wide"
              disabled={readOnly}
            >
              <option value="PENDING">{t.admin.quotes.statuses.PENDING}</option>
              <option value="APPROVED">{t.admin.quotes.statuses.APPROVED}</option>
              <option value="PAID">{t.admin.quotes.statuses.PAID}</option>
              <option value="IN_PROGRESS">{t.admin.quotes.statuses.IN_PROGRESS}</option>
              <option value="COMPLETED">{t.admin.quotes.statuses.COMPLETED}</option>
              <option value="CANCELLED">{t.admin.quotes.statuses.CANCELLED}</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-bold uppercase tracking-wide">{t.admin.quotes.concept} *</label>
            <input
              type="text"
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              className="neo-input w-full px-4 py-2.5 text-sm font-bold uppercase tracking-wide"
              placeholder="Ej: Landing page para Cliente X"
              readOnly={readOnly}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-bold uppercase tracking-wide">{t.admin.quotes.totalAmount} *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              className="neo-input w-full px-4 py-2.5 text-sm font-bold uppercase tracking-wide"
              placeholder="0.00"
              readOnly={readOnly}
            />
          </div>
        </div>
      </div>

      <div className="neo-card bg-card p-6">
        <h2 className="mb-4 text-lg font-black uppercase tracking-wide">{t.admin.quotes.splits}</h2>

        <div className="mb-2 grid grid-cols-12 gap-2 px-1">
          <div className="col-span-6 text-xs font-bold uppercase tracking-wide text-muted-foreground">
            {t.admin.quotes.collaborator}
          </div>
          <div className="col-span-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">
            {t.admin.quotes.percentage}
          </div>
          <div className="col-span-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
            {t.admin.quotes.amount}
          </div>
          <div className="col-span-1" />
        </div>

        <div className="space-y-2">
          {splits.map((split, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-6">
                <input
                  type="text"
                  value={split.collaborator}
                  onChange={(e) => updateSplit(index, 'collaborator', e.target.value)}
                  className="neo-input w-full px-3 py-2 text-sm font-bold uppercase tracking-wide"
                  placeholder="Ej: Neenbyss"
                  readOnly={readOnly}
                />
              </div>
              <div className="col-span-3">
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={split.percentage || ''}
                    onChange={(e) => updateSplit(index, 'percentage', e.target.value)}
                    className="neo-input w-full px-3 py-2 pr-7 text-sm font-bold uppercase tracking-wide"
                    placeholder="0"
                    readOnly={readOnly}
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">%</span>
                </div>
              </div>
              <div className="col-span-2 text-sm font-black uppercase tracking-wide text-right">
                ${((totalAmountNum * (split.percentage || 0)) / 100).toFixed(2)}
              </div>
              <div className="col-span-1 flex justify-end">
                {splits.length > 1 && !readOnly && (
                  <button
                    type="button"
                    onClick={() => removeSplit(index)}
                    className="text-muted-foreground hover:text-destructive p-1 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <div className="mb-1 flex justify-between text-xs font-bold uppercase tracking-wide">
            <span className={cn(totalPct > 100 ? 'text-destructive' : 'text-muted-foreground')}>
              {t.admin.quotes.totalAllocated}: {totalPct.toFixed(1)}%
            </span>
            <span className="text-muted-foreground">
              {t.admin.quotes.remaining}: {remaining.toFixed(1)}%
            </span>
          </div>
          <div className="neo-border bg-background h-3 w-full overflow-hidden">
            <div
              className={cn(
                'h-full transition-all',
                totalPct > 100 ? 'bg-destructive' : totalPct >= 100 ? 'bg-green-500' : 'bg-primary',
              )}
              style={{ width: `${Math.min(totalPct, 100)}%` }}
            />
          </div>
        </div>

        {!readOnly && (
          <button
            type="button"
            onClick={addSplit}
            className="neo-border border-border hover:bg-secondary mt-3 inline-flex items-center gap-2 px-3 py-2 text-sm font-bold uppercase tracking-wide transition-colors"
          >
            <Plus className="h-4 w-4" />
            {t.admin.quotes.addSplit}
          </button>
        )}
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push('/admin/pos')}
          className="text-muted-foreground hover:text-foreground px-4 py-2 text-sm font-bold uppercase tracking-wide transition-colors"
        >
          {t.admin.common.cancel}
        </button>
        {!readOnly && (
          <button
            type="submit"
            disabled={loading}
            className={cn(
              'neo-button neo-button-primary neo-shadow-sm px-6 py-3 text-sm',
              loading ? 'cursor-not-allowed opacity-60' : '',
            )}
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                {isEditing ? t.admin.quotes.form.updating : t.admin.quotes.form.creating}
              </span>
            ) : (
              isEditing ? t.admin.quotes.form.update : t.admin.quotes.form.create
            )}
          </button>
        )}
      </div>
    </form>
  )
}
