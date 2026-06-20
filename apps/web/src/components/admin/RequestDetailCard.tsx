'use client'

import { Check, X } from 'lucide-react'
import type { ServiceRequestDTO } from '@mitzustudios/shared'
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
      <div className="border-border/50 bg-card rounded-xl border p-6">
        <h2 className="mb-4 text-lg font-semibold">{t.admin.requests.detail.clientInfo}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-muted-foreground text-sm">{t.admin.requests.table.client}</p>
            <p className="font-medium">{request.clientName}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">{t.admin.requests.table.email}</p>
            <p className="font-medium">{request.clientEmail}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">{t.admin.requests.table.phone}</p>
            <p className="font-medium">{request.clientPhone}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">{t.admin.requests.table.status}</p>
            <StatusBadge status={request.status} variant="request" />
          </div>
        </div>
      </div>

      {/* Project info */}
      <div className="border-border/50 bg-card rounded-xl border p-6">
        <h2 className="mb-4 text-lg font-semibold">{t.admin.requests.detail.projectInfo}</h2>
        <div className="space-y-4">
          <div>
            <p className="text-muted-foreground text-sm">{t.admin.requests.table.projectType}</p>
            <p className="font-medium">{request.projectType}</p>
          </div>
          {request.otherType && (
            <div>
              <p className="text-muted-foreground text-sm">{t.contact.form.otherType}</p>
              <p className="font-medium">{request.otherType}</p>
            </div>
          )}
          <div>
            <p className="text-muted-foreground text-sm">{t.contact.form.description}</p>
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{request.description}</p>
          </div>
        </div>
      </div>

      {/* Status toggle */}
      <div className="flex justify-end">
        <button
          onClick={onToggleStatus}
          className="border-border hover:bg-secondary inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
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
