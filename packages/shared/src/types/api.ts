export interface ApiResponse<T = void> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    fieldErrors?: Record<string, string[]>
  }
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}
