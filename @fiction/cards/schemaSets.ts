import { z } from 'zod'

export const mediaSchema = z.object({
  url: z.string().optional(),
  html: z.string().optional(),
  format: z.enum(['html', 'url']).optional(),
}).optional()
