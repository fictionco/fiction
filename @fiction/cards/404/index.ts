import { vue } from '@fiction/core'
import { CardTemplate } from '@fiction/site'
import { z } from 'zod'
import { standardOption } from '../inputSets'

const UserConfigSchema = z.object({
  superHeading: z.string().optional(),
  heading: z.string().optional(),
  subHeading: z.string().optional(),
  actions: z.array(z.object({ btn: z.string().optional(), href: z.string().optional() })).optional(),
})

export type UserConfig = z.infer<typeof UserConfigSchema>

export const templates = [
  new CardTemplate({
    templateId: '404',
    category: ['special'],
    description: 'Shown when a page is not found',
    icon: 'i-tabler-error-404',
    colorTheme: 'red',
    el: vue.defineAsyncComponent(() => import('./El404.vue')),
    isPublic: false,
    options: [
      standardOption.headers(),
      standardOption.actionItems(),
    ],
    schema: UserConfigSchema,
  }),
] as const
