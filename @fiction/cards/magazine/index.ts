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
    iconTheme: 'blue',
    el: vue.defineAsyncComponent(() => import('./ElMagazine.vue')),
    userConfig: {
      spacing: { spacingClass: '' },
    },
    isPublic: false,
    options: [
      new InputOption({ key: 'scheme.reverse', label: 'Reverse Color Scheme', input: 'InputCheckbox' }),
    ],
    schema: UserConfigSchema,
  }),
] as const

export function demo() {
  const base = {
  } as const
  return createCard({
    slug: `card-${templateId}`,
    cards: [
      createCard({ templateId, templates, userConfig: base }),
    ],
  })
}
