export interface ServiceRequestDTO {
  id: string
  clientName: string
  clientEmail: string
  clientPhone: string
  projectType: string
  otherType: string | null
  description: string
  status: 'UNREAD' | 'READ' | 'ANSWERED'
  responses: ResponseDTO[]
  createdAt: string
  updatedAt: string
}

export interface ResponseDTO {
  id: string
  content: string
  channel: 'WHATSAPP' | 'EMAIL'
  createdAt: string
}

export interface CreateServiceRequestInput {
  clientName: string
  clientEmail: string
  clientPhone: string
  projectType: string
  otherType?: string
  description: string
}
