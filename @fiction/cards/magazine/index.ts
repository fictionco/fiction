import { safeDirname, vue } from '@fiction/core'
import { CardTemplate, createCard } from '@fiction/site'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'

const UserConfigSchema = z.object({
  test: z.any(),
})

export type UserConfig = z.infer<typeof UserConfigSchema>

const templateId = 'magazine'
export const templates = [
  new CardTemplate({
    root: safeDirname(import.meta.url),
    templateId,
    category: ['posts'],
    description: 'A magazine cards for displaying posts in a grid layout.',
    icon: 'i-tabler-box-padding',
    colorTheme: 'blue',
    el: vue.defineAsyncComponent(async () => import('./ElMagazine.vue')),
    userConfig: {
      spacing: { spacingClass: '' },
    },
    isPublic: false,
    options: [
      new InputOption({ key: 'scheme.reverse', label: 'Reverse Color Scheme', input: 'InputCheckbox' }),
    ],
    schema: UserConfigSchema,
    demoPage: () => {
      return [
        { templateId, userConfig: { } },
      ]
    },
  }),
] as const
