import { vue } from '@fiction/core'
import { CardTemplate } from '@fiction/site'
import { z } from 'zod'
import type { InputOption } from '@fiction/ui'

const templateId = 'textEffects'

const schema = z.object({ })

export type UserConfig = z.infer<typeof schema>

const options: InputOption[] = [
]

export const templates = [
  new CardTemplate({
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
