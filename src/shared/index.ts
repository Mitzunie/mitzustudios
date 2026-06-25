// Types
export type {
  ProjectDTO,
  TechnologyDTO,
  CreateProjectInput,
  UpdateProjectInput,
  PostDTO,
  CreatePostInput,
  UpdatePostInput,
  ServiceRequestDTO,
  ResponseDTO,
  CreateServiceRequestInput,
  QuoteDTO,
  QuoteSplitDTO,
  CreateQuoteInput,
  UpdateQuoteInput,
  QuoteStatus,
  ApiResponse,
  PaginatedResponse,
} from './types'

// Schemas
export {
  contactSchema,
  loginSchema,
  createProjectSchema,
  updateProjectSchema,
  createPostSchema,
  updatePostSchema,
  technologySchema,
  PROJECT_TYPES,
  PROJECT_TYPE_LABELS,
} from './schemas'
export type {
  ContactFormValues,
  LoginFormValues,
  CreateProjectFormValues,
  UpdateProjectFormValues,
  CreatePostFormValues,
  UpdatePostFormValues,
} from './schemas'

// Constants
export { getTechIcon } from './constants/tech-icons'

// i18n
export { es, en } from './i18n'
export type { Dictionary } from './i18n'
