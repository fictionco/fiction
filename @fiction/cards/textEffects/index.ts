import type { InputOption } from '@fiction/ui'
import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site'
import { z } from 'zod'

const templateId = 'textEffects'

const schema = z.object({ })

export type UserConfig = z.infer<typeof schema>

const options: InputOption[] = [
]

export const templates = [
  cardTemplate({
    templateId,
    category: ['basic'],
    description: 'Text effects',
    icon: 'i-tabler-compass',
    colorTheme: 'green',
    isPublic: false,
    schema,
    el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),
    options,

  }),
] as const
