// Types
export type {
  ProjectDTO,
  TechnologyDTO,
  CreateProjectInput,
  UpdateProjectInput,
  ServiceRequestDTO,
  ResponseDTO,
  CreateServiceRequestInput,
  ApiResponse,
  PaginatedResponse,
} from './types'

// Schemas
export {
  contactSchema,
  loginSchema,
  registerSchema,
  createProjectSchema,
  updateProjectSchema,
  technologySchema,
  PROJECT_TYPES,
  PROJECT_TYPE_LABELS,
} from './schemas'
export type {
  ContactFormValues,
  LoginFormValues,
  RegisterFormValues,
  CreateProjectFormValues,
  UpdateProjectFormValues,
} from './schemas'

// i18n
export { es, en } from './i18n'
export type { Dictionary } from './i18n'
