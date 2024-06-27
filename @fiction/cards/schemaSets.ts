import type { MediaItem, PostItem } from '@fiction/core'
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

export const PostItemSchema = z.object({
  content: z.string().optional(),
  title: z.string().optional(),
  subTitle: z.string().optional(),
}).merge(MediaItemSchema as z.AnyZodObject) as z.Schema<PostItem>
