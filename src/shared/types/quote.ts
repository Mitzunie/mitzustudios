export type QuoteStatus = 'PENDING' | 'APPROVED' | 'PAID' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'

export interface QuoteSplitDTO {
  id: string
  collaborator: string
  percentage: number
  amount: number
}

export interface QuoteDTO {
  id: string
  clientName: string
  clientEmail: string
  concept: string
  totalAmount: number
  status: QuoteStatus
  splits: QuoteSplitDTO[]
  createdAt: string
  updatedAt: string
}

export interface CreateQuoteInput {
  clientName: string
  clientEmail: string
  concept: string
  totalAmount: number
  status?: QuoteStatus
  splits: { collaborator: string; percentage: number }[]
}

export interface UpdateQuoteInput {
  clientName?: string
  clientEmail?: string
  concept?: string
  totalAmount?: number
  status?: QuoteStatus
  splits?: { collaborator: string; percentage: number }[]
}
