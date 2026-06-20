'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import type { ServiceRequestDTO, PaginatedResponse } from '@mitzustudios/shared'
import { StatusBadge } from './StatusBadge'
import { FilterBar } from './FilterBar'
import { useTranslations } from '@/hooks/useTranslations'
import { cn } from '@/lib/utils'

const filterOptions = [
  { value: '', label: 'Todas' },
  { value: 'UNREAD', label: 'No Leídas' },
  { value: 'READ', label: 'Leídas' },
  { value: 'ANSWERED', label: 'Respondidas' },
]

export function RequestsList() {
  const router = useRouter()
  const t = useTranslations()
  const [requests, setRequests] = useState<ServiceRequestDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  const fetchRequests = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filter) params.set('status', filter)
      params.set('page', '1')

      const res = await fetch(`/api/admin/requests?${params}`)
      if (!res.ok) throw new Error('Error fetching requests')

      const data: PaginatedResponse<ServiceRequestDTO> = await res.json()
      if (data.success && data.data) {
        setRequests(data.data)
      }
    } catch (error) {
      console.error('Error fetching requests:', error)
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'UNREAD' ? 'READ' : 'UNREAD'
      const res = await fetch(`/api/admin/requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (res.ok) {
        fetchRequests()
      }
    } catch (error) {
      console.error('Error toggling status:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <FilterBar
          options={filterOptions.map((o) => ({
            ...o,
            label:
              t.admin.requests.filters[
                o.value.toLowerCase() as keyof typeof t.admin.requests.filters
              ] || o.label,
          }))}
          activeFilter={filter}
          onFilterChange={setFilter}
        />
      </div>

      {requests.length === 0 ? (
        <div className="text-muted-foreground py-20 text-center">{t.admin.requests.noRequests}</div>
      ) : (
        <div className="border-border/50 overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-border/50 bg-muted/50 border-b">
                <th className="text-muted-foreground px-4 py-3 text-left font-medium">
                  {t.admin.requests.table.client}
                </th>
                <th className="text-muted-foreground px-4 py-3 text-left font-medium">
                  {t.admin.requests.table.email}
                </th>
                <th className="text-muted-foreground hidden px-4 py-3 text-left font-medium md:table-cell">
                  {t.admin.requests.table.phone}
                </th>
                <th className="text-muted-foreground hidden px-4 py-3 text-left font-medium lg:table-cell">
                  {t.admin.requests.table.projectType}
                </th>
                <th className="text-muted-foreground px-4 py-3 text-left font-medium">
                  {t.admin.requests.table.status}
                </th>
                <th className="text-muted-foreground hidden px-4 py-3 text-left font-medium sm:table-cell">
                  {t.admin.requests.table.date}
                </th>
                <th className="text-muted-foreground px-4 py-3 text-right font-medium">
                  {t.admin.requests.table.actions}
                </th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr
                  key={req.id}
                  className="border-border/25 hover:bg-muted/30 cursor-pointer border-b transition-colors"
                  onClick={() => router.push(`/admin/requests/${req.id}`)}
                >
                  <td className="px-4 py-3 font-medium">{req.clientName}</td>
                  <td className="text-muted-foreground px-4 py-3">{req.clientEmail}</td>
                  <td className="text-muted-foreground hidden px-4 py-3 md:table-cell">
                    {req.clientPhone}
                  </td>
                  <td className="text-muted-foreground hidden px-4 py-3 lg:table-cell">
                    {req.projectType}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={req.status} variant="request" />
                  </td>
                  <td className="text-muted-foreground hidden px-4 py-3 sm:table-cell">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleToggleStatus(req.id, req.status)
                      }}
                      className={cn(
                        'rounded-lg p-2 transition-colors',
                        req.status === 'UNREAD'
                          ? 'text-blue-500 hover:bg-blue-500/10'
                          : 'text-muted-foreground hover:bg-secondary',
                      )}
                      title={
                        req.status === 'UNREAD'
                          ? t.admin.requests.markAsRead
                          : t.admin.requests.markAsUnread
                      }
                    >
                      {req.status === 'UNREAD' ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
