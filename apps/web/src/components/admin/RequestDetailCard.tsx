'use client'

import { Check, X } from 'lucide-react'
import type { ServiceRequestDTO } from '@/shared'
import { StatusBadge } from './StatusBadge'
import { useTranslations } from '@/hooks/useTranslations'

interface RequestDetailCardProps {
  request: ServiceRequestDTO
  onToggleStatus: () => void
}

export function RequestDetailCard({ request, onToggleStatus }: RequestDetailCardProps) {
  const t = useTranslations()

  return (
    <div className="space-y-6">
      {/* Client info */}
      <div className="neo-card bg-card p-6">
        <h2 className="mb-4 text-lg font-black uppercase tracking-wide">{t.admin.requests.detail.clientInfo}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-muted-foreground text-sm font-bold uppercase tracking-wide">{t.admin.requests.table.client}</p>
            <p className="font-black uppercase tracking-wide">{request.clientName}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm font-bold uppercase tracking-wide">{t.admin.requests.table.email}</p>
            <p className="font-black uppercase tracking-wide">{request.clientEmail}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm font-bold uppercase tracking-wide">{t.admin.requests.table.phone}</p>
            <p className="font-black uppercase tracking-wide">{request.clientPhone}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm font-bold uppercase tracking-wide">{t.admin.requests.table.status}</p>
            <StatusBadge status={request.status} variant="request" />
          </div>
        </div>
      </div>

      {/* Project info */}
      <div className="neo-card bg-card p-6">
        <h2 className="mb-4 text-lg font-black uppercase tracking-wide">{t.admin.requests.detail.projectInfo}</h2>
        <div className="space-y-4">
          <div>
            <p className="text-muted-foreground text-sm font-bold uppercase tracking-wide">{t.admin.requests.table.projectType}</p>
            <p className="font-black uppercase tracking-wide">{request.projectType}</p>
          </div>
          {request.otherType && (
            <div>
              <p className="text-muted-foreground text-sm font-bold uppercase tracking-wide">{t.contact.form.otherType}</p>
              <p className="font-black uppercase tracking-wide">{request.otherType}</p>
            </div>
          )}
          <div>
            <p className="text-muted-foreground text-sm font-bold uppercase tracking-wide">{t.contact.form.description}</p>
            <p className="whitespace-pre-wrap text-sm font-bold uppercase tracking-wide leading-relaxed">{request.description}</p>
          </div>
        </div>
      </div>

      {/* Status toggle */}
      <div className="flex justify-end">
        <button
          onClick={onToggleStatus}
          className="neo-border border-border hover:bg-secondary inline-flex items-center gap-2 px-4 py-2 text-sm font-bold uppercase tracking-wide transition-colors"
        >
          {request.status === 'UNREAD' ? (
            <>
              <Check className="h-4 w-4 text-green-500" />
              {t.admin.requests.markAsRead}
            </>
          ) : (
            <>
              <X className="h-4 w-4" />
              {t.admin.requests.markAsUnread}
            </>
          )}
        </button>
      </div>
    </div>
  )
}
