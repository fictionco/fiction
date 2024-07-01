import type { ActionItem } from '@fiction/core'
import { vue } from '@fiction/core'
import { CardTemplate, createCard } from '@fiction/site'
import { z } from 'zod'
import { standardOption } from '../inputSets'

const templateId = 'hero'

const defaultContent: UserConfig = {
  heading: 'Short Catchy Heading',
  subHeading: 'Description of the heading. Typically a sentence or two.',
  superHeading: 'Category or Tagline',
  actions: [{ name: 'Primary', href: '/', btn: 'primary' }, { name: 'Secondary', href: '/learn-more', btn: 'default' }],
}

const UserConfigSchema = z.object({
  heading: z.string().optional().describe('Primary hero headline, 3 to 13 words'),
  subHeading: z.string().optional().describe('Secondary hero headline, 10 to 30 words'),
  superHeading: z.string().optional().describe('Shorter badge above headline, 2 to 5 words'),
  layout: z.enum(['justify', 'center', 'left', 'right']).optional().describe('Alignment style of text and images'),
  splash: z.object({ url: z.string(), format: z.enum(['url', 'html']).optional() }).optional().describe('Splash picture for hero;time:40000').refine(_ => true, { params: { time: 40 } }),
  actions: z.array(z.object({
    name: z.string().optional(),
    href: z.string().optional(),
    btn: z.enum(['primary', 'default', 'theme', 'danger', 'caution', 'success', 'naked']).optional(),
    size: z.enum(['default', '2xl', 'xl', 'lg', 'md', 'sm', 'xs']).optional(),
    target: z.enum(['_self', '_blank']).optional(),
  })).optional().describe('List of link buttons') as z.Schema<ActionItem[] | undefined>,
})

export type UserConfig = z.infer<typeof UserConfigSchema>

export const templates = [
  new CardTemplate({
    templateId,
    category: ['basic'],
    isPublic: true,
    description: 'standard hero section',
    icon: 'i-tabler-layout-bottombar-collapse-filled',
    colorTheme: 'orange',
    el: vue.defineAsyncComponent(async () => import('./ElHero.vue')),
    options: [
      standardOption.ai(),
      standardOption.headers({}),
      standardOption.layout(),
      standardOption.media({ key: 'splash', label: 'Splash Image' }),
      standardOption.actionItems(),
    ],
    userConfig: defaultContent,
    schema: UserConfigSchema,
    demoPage: () => {
      const splash = { url: 'https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?q=80&w=3864&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }
      const subHeading = 'lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'

      return [
        { templateId, userConfig: { } },
        { templateId, userConfig: { ...defaultContent, layout: 'justify' as const, splash } },
        { templateId, userConfig: { ...defaultContent, layout: 'right' as const, splash, subHeading } },
        { templateId, userConfig: { ...defaultContent, layout: 'left' as const, splash, subHeading } },
      ]
    },
  }),
] as const

// export function demo() {
//   return createCard({
//     slug: 'card-hero',
//     cards: [
//       createCard({ templateId, templates, userConfig: { } }),
//       createCard({ templateId, templates, userConfig: { ...defaultContent, layout: 'justify', splash } }),
//       createCard({ templateId, templates, userConfig: { ...defaultContent, layout: 'right', splash, subHeading } }),
//       createCard({ templateId, templates, userConfig: { ...defaultContent, layout: 'left', splash, subHeading } }),
//     ],
//   })
// }
