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
  contactFormSchema,
  loginSchema,
  createProjectSchema,
  updateProjectSchema,
  createPostSchema,
  updatePostSchema,
  technologySchema,
  PROJECT_TYPES,
  PROJECT_TYPE_LABELS,
  LOCALES,
} from './schemas'
export type {
  ContactFormValues,
  ContactPayload,
  LoginFormValues,
  CreateProjectFormValues,
  UpdateProjectFormValues,
  CreatePostFormValues,
  UpdatePostFormValues,
  Locale,
} from './schemas'

// Constants
export { getTechIcon } from './constants/tech-icons'

// i18n
export { es, en } from './i18n'
export type { Dictionary } from './i18n'
