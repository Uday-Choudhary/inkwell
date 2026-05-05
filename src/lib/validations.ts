import { z } from 'zod'

export const ArticleCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().max(300).optional(),
  coverImage: z.string().url().optional().or(z.literal('')),
  coverImageAlt: z.string().max(200).optional(),
  published: z.boolean().default(false),
  metaTitle: z.string().max(60).optional(),
  metaDescription: z.string().max(160).optional(),
  ogImage: z.string().url().optional().or(z.literal('')),
  authorId: z.string().min(1, 'Author is required'),
  categoryId: z.string().optional(),
  readingTimeMinutes: z.number().int().positive().optional(),
})

export const ArticleUpdateSchema = ArticleCreateSchema.partial().omit({ authorId: true })

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const AIMetaSchema = z.object({
  title: z.string().min(1),
  excerpt: z.string().optional(),
})

export const AILinksSchema = z.object({
  content: z.string().min(1),
  articleId: z.string().optional(),
})

export type ArticleCreate = z.infer<typeof ArticleCreateSchema>
export type ArticleUpdate = z.infer<typeof ArticleUpdateSchema>
export type LoginInput = z.infer<typeof LoginSchema>
