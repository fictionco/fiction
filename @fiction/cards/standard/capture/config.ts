import { SuperTitleSchema } from '@fiction/core'
import { z } from 'zod/v4'

const schema = z.object({
  superTitle: SuperTitleSchema.optional(),
  title: z.string().optional(),
  subTitle: z.string().optional(),
})

export type UserConfig = z.infer<typeof schema>

export async function getConfig() {
  return { schema }
}
