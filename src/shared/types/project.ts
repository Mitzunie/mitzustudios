export interface ProjectDTO {
  id: string
  title: string
  slug: string
  description: string
  content: string | null
  imageUrl: string | null
  status: 'PUBLISHED' | 'HIDDEN' | 'DRAFT'
  technologies: TechnologyDTO[]
  createdAt: string
  updatedAt: string
}

export interface TechnologyDTO {
  id: string
  name: string
  icon: string
  url: string | null
}

export interface CreateProjectInput {
  title: string
  description: string
  content?: string
  technologies: { name: string; icon: string; url?: string }[]
  status?: 'PUBLISHED' | 'HIDDEN' | 'DRAFT'
}

export interface UpdateProjectInput extends Partial<CreateProjectInput> {
  imageUrl?: string | null
}
