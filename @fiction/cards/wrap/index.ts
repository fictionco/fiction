import { vue } from '@fiction/core'
import { CardTemplate } from '@fiction/site'
import { z } from 'zod'

const UserConfigSchema = z.object({
  fixedHeader: z.boolean().optional(),
})

export type UserConfig = z.infer<typeof UserConfigSchema>

export const templates = [
  new CardTemplate({
    templateId: 'wrap',
    el: vue.defineAsyncComponent(async () => import('./CardWrap.vue')),
    schema: UserConfigSchema,
    isPublic: false,
    isPageCard: true,
  }),
]
