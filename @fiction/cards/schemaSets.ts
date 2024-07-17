import type { MediaItem } from '@fiction/core'
import { z } from 'zod'

export const mediaSchema = z.object({
  url: z.string().optional(),
  html: z.string().optional(),
  format: z.enum(['html', 'url']).optional(),
}).optional()

export const MediaItemSchema = z.object({
  name: z.string().optional(),
  desc: z.string().optional(),
  media: z.object({
    format: z.enum(['url', 'html']).optional(),
    url: z.string().optional(),
    html: z.string().optional(),
  }),
}) as z.Schema<MediaItem>

export const PostSchema = z.object({
  title: z.string().optional(),
  subTitle: z.string().optional(),
  content: z.string().optional(),
  image: mediaSchema,
  slug: z.string().optional(),
  actions: z.array(z.object({
    name: z.string().optional(),
    href: z.string().optional(),
  })).optional(),
})
