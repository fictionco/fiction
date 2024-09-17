import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'

const UserConfigSchema = z.object({
  fixedHeader: z.boolean().optional(),
})

export type UserConfig = z.infer<typeof UserConfigSchema>

const options = [
  new InputOption({ key: 'fixedHeader', label: 'Fixed Header', input: 'InputToggle' }),
] as InputOption[]

export const templates = [
  cardTemplate({
    templateId: 'wrap',
    el: vue.defineAsyncComponent(async () => import('./CardWrap.vue')),
    schema: UserConfigSchema,
    options,
    isPublic: false,
    isPageCard: true,
    getBaseConfig: () => {
      return {
        standard: { spacing: { verticalSpacing: 'none' }, handling: { showOnSingle: true } },
      }
    },
  }),
]
