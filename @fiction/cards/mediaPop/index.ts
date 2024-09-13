import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'

const templateId = 'mediaPop'

const schema = z.object({ })

export type UserConfig = z.infer<typeof schema>

const options: InputOption[] = [
  new InputOption({ key: 'items', label: 'Tour Items', input: 'InputList', options: [] }),
]

export const templates = [
  cardTemplate({
    templateId,
    category: ['basic'],
    description: 'Popup modal with media items based on links',
    icon: 'i-tabler-compass',
    colorTheme: 'green',
    isPublic: false,
    schema,
    el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),
    options,

  }),
] as const
