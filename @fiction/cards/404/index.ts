import { ActionButtonSchema, vue } from '@fiction/core/index.js'
import { cardTemplate } from '@fiction/site/index.js'
import { z } from 'zod'
import { standardOption } from '../inputSets.js'

const UserConfigSchema = z.object({
  superHeading: z.string().optional(),
  heading: z.string().optional(),
  subHeading: z.string().optional(),
  actions: z.array(ActionButtonSchema).optional(),
})

export type UserConfig = z.infer<typeof UserConfigSchema>

export const templates = [
  cardTemplate({
    templateId: '404',
    category: ['special'],
    description: 'Shown when a page is not found',
    icon: 'i-tabler-error-404',
    colorTheme: 'red',
    el: vue.defineAsyncComponent(async () => import('./El404.vue')),
    isPublic: false,
    options: [
      standardOption.headers(),
      standardOption.buttons(),
    ],
    schema: UserConfigSchema,
  }),
] as const
