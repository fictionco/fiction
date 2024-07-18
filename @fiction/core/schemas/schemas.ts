import { optional, z } from 'zod'
import type { MediaDisplayObject } from '../types'

export const PostStatusSchema = z.enum(['draft', 'scheduled', 'published', 'hidden', 'protected', 'deleted', 'archived', 'trashed', 'spam'])
export const ProgressStatusSchema = z.enum(['pending', 'requested', 'processing', 'ready', 'error', 'cancelled'])
export const SyndicateStatusSchema = z.enum(['active', 'unsubscribed', 'pending', 'cancelled', 'bounced', 'complained'])

export const ThemeUiSizeSchema = z.enum(['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'])

export const MediaSchema = z.object({
  url: z.string().optional(),
  html: z.string().optional(),
  format: z.enum(['url', 'video', 'iframe', 'html', 'audio', 'text']).optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  caption: z.string().optional(),
  blurhash: z.string().optional(),
  alt: z.string().optional(),
  thumbUrl: z.string().optional(),
  mime: z.string().optional(),
}).optional() as z.Schema<MediaDisplayObject>

export type MediaObject = z.infer<typeof MediaSchema>

export const TaxonomySchema = z.object({
  title: z.string().optional(),
  slug: z.string().optional(),
  type: z.enum(['category', 'tag']).optional(),
})

export const UserSchema = z.object({
  fullName: z.string().optional(),
  email: z.string().optional(),
  avatar: MediaSchema.optional(),
})

export const PostSchema = z.object({
  title: z.string().optional(),
  subTitle: z.string().optional(),
  content: z.string().optional(),
  status: PostStatusSchema.optional(),
  image: MediaSchema.optional(),
  slug: z.string().optional(),
  taxonomy: z.array(TaxonomySchema).optional(),
  tags: z.array(TaxonomySchema).optional(),
  categories: z.array(TaxonomySchema).optional(),
  authors: z.array(UserSchema).optional(),
})

export const PostHandlingSchema = z.object({
  mode: z.enum(['global', 'inline']).optional(),
  limit: z.number().optional(),
  items: z.array(PostSchema).optional(),
})

export type PostObject = z.infer<typeof PostSchema>
