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

export const PostSchema = z.object({
  title: z.string().optional(),
  subTitle: z.string().optional(),
  content: z.string().optional(),
  status: PostStatusSchema,
  image: MediaSchema,
  slug: z.string().optional(),
})

export type PostObject = z.infer<typeof PostSchema>
