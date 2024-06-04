import { colorList, colorTheme, deepMerge, safeDirname, toLabel, vue } from '@fiction/core'
import { CardTemplate, createCard } from '@fiction/site'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'
import { mediaSchema } from '../schemaSets'

const UserConfigSchema = z.object({
  superHeading: z.string().describe('Social proof Metric or KPI for the newsletter, e.g. "22,300+ subscribers"').optional(),
  heading: z.string().describe('Newsletter hook header 5 words or so').optional(),
  subHeading: z.string().describe('Specific benefits of subscribing').optional(),
  media: mediaSchema,
  presentationMode: z.enum(['inline', 'onScroll', 'onLoad']).optional(),
  dismissText: z.string().optional(),
})

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
      superHeading: 'Add social proof (4000+ subscribers)',
      heading: 'Name of Newsletter',
      subHeading: 'Specific benefits of subscribing',
      dismissText: 'No thanks',
    },
    isPublic: false,
    options: [
      new InputOption({ key: 'scheme.reverse', label: 'Flip Color Scheme', description: 'Great for contrast. This will flip the mode to the opposite of the mode for the website (from dark to light or vice versa).', input: 'InputToggle' }),

    ],
    schema: UserConfigSchema,
  }),
] as const

export function demo() {
  const demoUserConfig = {
    superHeading: '4000+ subscribers',
    heading: 'The Fiction Newsletter',
    subHeading: 'Get the latest articles, tools, and resources for creators. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.',
    media: {
      url: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?q=80&w=3090&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      format: 'url',
    },
  } as const

  return createCard({
    slug: `card-${templateId}`,
    cards: [
      createCard({
        templateId,
        templates,
        userConfig: { presentationMode: 'inline', ...demoUserConfig },
      }),
      createCard({ el: vue.defineAsyncComponent(() => import('./DemoProse.vue')) }),
      createCard({
        templateId,
        templates,
        userConfig: { presentationMode: 'onLoad', ...demoUserConfig },
      }),
      createCard({
        templateId,
        templates,
        userConfig: { presentationMode: 'onScroll', ...demoUserConfig },
      }),
    ],
  })
}
