'use client'

import { useState } from 'react'
import { Send, MessageCircle, Mail } from 'lucide-react'
import { useTranslations } from '@/hooks/useTranslations'
import { cn } from '@/lib/utils'

interface ResponseFormProps {
  requestId: string
  clientPhone: string
  clientEmail: string
  onResponseSent: () => void
}

type Channel = 'WHATSAPP' | 'EMAIL'

export function ResponseForm({
  requestId,
  clientPhone,
  clientEmail,
  onResponseSent,
}: ResponseFormProps) {
  const t = useTranslations()
  const [content, setContent] = useState('')
  const [channel, setChannel] = useState<Channel>('WHATSAPP')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setSending(true)
    setError('')

    try {
      const res = await fetch(`/api/admin/requests/${requestId}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: content.trim(), channel }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error?.message || t.admin.requests.detail.responseError)
        setSending(false)
        return
      }

      // If WhatsApp, open the wa.me link
      if (channel === 'WHATSAPP' && data.data?.waLink) {
        window.open(data.data.waLink, '_blank')
      }

      setContent('')
      setSending(false)
      onResponseSent()
    } catch {
      setError(t.admin.requests.detail.responseError)
      setSending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-border/50 bg-card rounded-xl border p-6">
      <h3 className="mb-4 text-lg font-semibold">{t.admin.requests.detail.respond}</h3>

      {/* Channel selector */}
      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => setChannel('WHATSAPP')}
          className={cn(
            'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
            channel === 'WHATSAPP'
              ? 'border border-green-500/30 bg-green-500/10 text-green-500'
              : 'bg-secondary/50 text-muted-foreground border-border hover:bg-secondary border',
          )}
        >
          <MessageCircle className="h-4 w-4" />
          {t.admin.requests.detail.whatsapp}
        </button>
        <button
          type="button"
          onClick={() => setChannel('EMAIL')}
          className={cn(
            'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
            channel === 'EMAIL'
              ? 'border border-blue-500/30 bg-blue-500/10 text-blue-500'
              : 'bg-secondary/50 text-muted-foreground border-border hover:bg-secondary border',
          )}
        >
          <Mail className="h-4 w-4" />
          {t.admin.requests.detail.email}
        </button>
      </div>

      {/* Response textarea */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={t.admin.requests.detail.responsePlaceholder}
        rows={4}
        className="border-input bg-background placeholder:text-muted-foreground/50 focus:ring-ring mb-4 w-full resize-y rounded-lg border px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2"
      />

      {error && <p className="text-destructive mb-4 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={sending || !content.trim()}
        className={cn(
          'inline-flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold transition-all',
          sending || !content.trim()
            ? 'bg-primary/50 cursor-not-allowed'
            : 'bg-primary text-primary-foreground hover:bg-primary/90',
        )}
      >
        {sending ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            {t.admin.common.loading}
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            {t.admin.requests.detail.sendResponse}
          </>
        )}
      </button>

      <p className="text-muted-foreground mt-3 text-xs">
        {channel === 'WHATSAPP'
          ? `Se abrirá WhatsApp con el número ${clientPhone}`
          : `Se enviará un email a ${clientEmail}`}
      </p>
    </form>
  )
}
