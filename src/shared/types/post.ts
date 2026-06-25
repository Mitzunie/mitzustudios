export interface PostDTO {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  imageUrl: string | null
  published: boolean
  authorId: string
  author: { id: string; name: string | null; image: string | null }
  createdAt: string
  updatedAt: string
}

export interface CreatePostInput {
  title: string
  excerpt?: string
  content: string
  imageUrl?: string
  published?: boolean
}

export interface UpdatePostInput extends Partial<Omit<CreatePostInput, 'imageUrl'>> {
  imageUrl?: string | null
}
