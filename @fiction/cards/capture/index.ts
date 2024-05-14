import { colorList, colorTheme, deepMerge, safeDirname, toLabel, vue } from '@fiction/core'
import { CardTemplate, createCard } from '@fiction/site'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'

const UserConfigSchema = z.object({})

export type UserConfig = z.infer<typeof UserConfigSchema>

const templateId = 'capture'

export const templates = [
  new CardTemplate({
    root: safeDirname(import.meta.url),
    templateId,
    title: 'Subscriber Email Capture',
    category: ['marketing'],
    description: 'Convert visitors into subscribers with a simple email capture form.',
    icon: 'i-tabler-mail',
    colorTheme: 'blue',
    el: vue.defineAsyncComponent(() => import('./ElCard.vue')),
    userConfig: {
      spacing: { spacingClass: '' },
    },
    isPublic: true,
    options: [
      new InputOption({ key: 'scheme.reverse', label: 'Flip Color Scheme', description: 'Great for contrast. This will flip the mode to the opposite of the mode for the website (from dark to light or vice versa).', input: 'InputToggle' }),

    ],
    schema: UserConfigSchema,
  }),
] as const

export function demo() {
  return createCard({
    slug: `card-${templateId}`,
    cards: [
    ],
  })
}
